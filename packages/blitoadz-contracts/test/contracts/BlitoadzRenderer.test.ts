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
        // Adding only two palette orders to test that it actually brings changes but don't want to much
        // complexity in the test
        // 27 = 00 01 10 11 = 0, 1, 2, 3 and 108 = 01 10 11 00 = 1, 2, 3, 0
        [27, 108].map((paletteOrder) => {
          it(`Toadz #${toadzId} and Blitmap #${blitmapId} with palette ${paletteOrder} should match snapshot`, async function () {
            await deployments.fixture(TAGS.BLITOADZ_PALETTES);
            const BlitoadzRenderer = await ethers.getContract(
              "BlitoadzRenderer"
            );
            const res = await BlitoadzRenderer.tokenURI({
              toadzId,
              blitmapId,
              paletteOrder,
            });
            const fileName = `toadz_${toadzId}_blitmap_${blitmapId}_palette_${paletteOrder}`;
            let outputFile = `./test/contracts/__snapshots__/TOKENS/${fileName}.json`;
            fs.mkdirSync(path.dirname(outputFile), { recursive: true });
            fs.writeFileSync(outputFile, res.split(",").slice(1).join(","));
            outputFile = `./test/contracts/__snapshots__/TOKENS/${fileName}.svg`;
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
});
