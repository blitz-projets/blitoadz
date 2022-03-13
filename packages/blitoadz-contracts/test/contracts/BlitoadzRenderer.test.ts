import chai from "chai";
import { solidity } from "ethereum-waffle";
import { deployments, ethers } from "hardhat";

import { jestSnapshotPlugin } from "mocha-chai-jest-snapshot";
import * as path from "path";
import fs from "fs";
import { TAGS } from "../../utils/constants";

chai.use(jestSnapshotPlugin());
chai.use(solidity);
const { expect } = chai;

describe("BlitoadzRenderer", async function () {
  describe("tokenURI", () => {
    [...Array(100).keys()].map((blitmapId) => {
      [...Array(56).keys()].map((toadzId) => {
        it(`Toadz #${toadzId} and Blitmap #${blitmapId} should match snapshot`, async function () {
          await deployments.fixture(TAGS.BLITOADZ_PALETTES);
          const BlitoadzRenderer = await ethers.getContract("BlitoadzRenderer");
          const res = await BlitoadzRenderer.tokenURI(toadzId, blitmapId);
          let outputFile = `./test/contracts/__snapshots__/TOKENS/toadz_${toadzId}_blitmap_${blitmapId}.json`;
          fs.mkdirSync(path.dirname(outputFile), { recursive: true });
          fs.writeFileSync(outputFile, res.split(",").slice(1).join(","));
          outputFile = `./test/contracts/__snapshots__/TOKENS/toadz_${toadzId}_blitmap_${blitmapId}.svg`;
          fs.writeFileSync(
            outputFile,
            decodeURI(
              JSON.parse(res.split(",").slice(1).join(","))
                ["image_data"].split(",")[1]
                .replace(/%23/g, "#")
            )
          );
          expect(res).to.matchSnapshot();
        });
      });
    });
  });
});
