import { task } from "hardhat/config";
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client";
import fs from "fs";
import fetch from "node-fetch";

task("fetch-blitmap", "Fetch the lost toadz metadata").setAction(
  async ({}, { getNamedAccounts, ethers }) => {
    const { deployer } = await getNamedAccounts();
    const sdk = getMainnetSdk(await ethers.getSigner(deployer));
    const tokenIds = [...Array(100).keys()];
    const tokenURIs = await Promise.all(
      tokenIds.map(async (tokenId) => await sdk.blitmap.tokenURI(tokenId))
    );
    const tokenMetadata = await Promise.all(
      tokenURIs.map(
        async (tokenURI) => await fetch(tokenURI).then((res) => res.json())
      )
    );

    const tokenColors = await Promise.all(
      tokenIds.map(
        async (tokenId) => await sdk.blitmap.tokenRGBColorsOf(tokenId)
      )
    );

    const tokenData = await Promise.all(
      tokenIds.map(async (tokenId) => await sdk.blitmap.tokenDataOf(tokenId))
    );

    const tokenCreator = await Promise.all(
      tokenIds.map(async (tokenId) => await sdk.blitmap.tokenCreatorOf(tokenId))
    );

    await Promise.all(
      tokenMetadata.map(async (tokenMetadata, index) => {
        await fetch(tokenMetadata.image).then((res) =>
          res.body.pipe(fs.createWriteStream(`./data/blitmap/${index}.png`))
        );
      })
    );

    await Promise.all(
      tokenIds.map(async (tokenId) => {
        await sdk.blitmap.tokenSvgDataOf(tokenId).then((svgData) => {
          fs.writeFileSync(`./data/blitmap/${tokenId}.svg`, svgData);
        });
      })
    );

    fs.writeFileSync(
      "data/blitmap.json",
      JSON.stringify(
        tokenMetadata.map((data, index) => ({
          ...data,
          colors: tokenColors[index],
          data: tokenData[index],
          creator: tokenCreator[index],
        })),
        null,
        2
      )
    );
  }
);
