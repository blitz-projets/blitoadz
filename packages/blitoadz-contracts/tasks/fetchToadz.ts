import { task } from "hardhat/config";
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client";
import fs from "fs";
import fetch from "node-fetch";

task("fetch-toadz", "Fetch the lost toadz metadata").setAction(
  async ({}, { getNamedAccounts, ethers }) => {
    const { deployer } = await getNamedAccounts();
    const sdk = getMainnetSdk(await ethers.getSigner(deployer));
    const tokenIds = await Promise.all(
      [...Array(56).keys()].map(
        async (i) => await sdk.cryptoadz.tokenByIndex(i)
      )
    );
    const tokenURIs = await Promise.all(
      tokenIds.map(async (tokenId) =>
        (
          await sdk.cryptoadz.tokenURI(tokenId)
        ).replace("ipfs://", "https://ipfs.io/ipfs/")
      )
    );
    const tokenMetadata = await Promise.all(
      tokenURIs.map(
        async (tokenURI) =>
          await fetch(tokenURI)
            .then((res) => res.json())
            .then((tokenMetadata) => ({
              ...tokenMetadata,
              image: tokenMetadata.image.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
              ),
            }))
      )
    );

    await Promise.all(
      tokenMetadata.map(async (tokenMetadata) => {
        await fetch(tokenMetadata.image).then((res) =>
          res.body.pipe(
            fs.createWriteStream(
              `./data/toadz/${tokenMetadata.name.replace(
                "CrypToadz #",
                ""
              )}.png`
            )
          )
        );
      })
    );
    fs.writeFileSync("data/toadz.json", JSON.stringify(tokenMetadata, null, 2));
  }
);
