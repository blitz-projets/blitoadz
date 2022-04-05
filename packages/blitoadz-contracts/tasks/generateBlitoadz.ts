import { task } from "hardhat/config";
import fs from "fs";
import path from "path";
import { MultiBar } from "cli-progress";

task("generate-blitoadz", "Open public sale")
  .addOptionalParam("start", "Slice start index for toadz", "0")
  .addOptionalParam("end", "Slice end index for toadz", "56")
  .setAction(async ({ start, end }, { deployments }) => {
    const { read } = deployments;
    const bar = new MultiBar({});
    const blitmapBar = bar.create(100, 0);
    const toadzBar = bar.create(end - start, 0);

    for (const blitmapId of [...Array(100).keys()]) {
      toadzBar.update(0, { blitmapId });
      for (const toadzId of [...Array(56).keys()].slice(
        parseInt(start),
        parseInt(end)
      )) {
        // Adding only two palette orders to test that it actually brings changes but don't want to much
        // complexity in the test
        // 27 = 00 01 10 11 = 0, 1, 2, 3 and 108 = 01 10 11 00 = 1, 2, 3, 0
        await Promise.all(
          [27, 108].map(async (paletteOrder) => {
            const tokenURI = await read(
              "BlitoadzRenderer",
              "tokenURI",
              blitmapId,
              toadzId,
              paletteOrder
            );
            const fileName = `toadz_${toadzId}_blitmap_${blitmapId}_palette_${paletteOrder}`;
            let outputFile = `./data/blitoadz/${fileName}.json`;
            fs.mkdirSync(path.dirname(outputFile), { recursive: true });
            fs.writeFileSync(
              outputFile,
              tokenURI.split(",").slice(1).join(",")
            );
            outputFile = `./data/blitoadz/${fileName}.svg`;
            fs.writeFileSync(
              outputFile,
              decodeURI(
                JSON.parse(tokenURI.split(",").slice(1).join(","))
                  ["image"].split(",")[1]
                  .replace(/%23/g, "#")
              )
            );
          })
        );
        toadzBar.increment();
      }
      blitmapBar.increment();
    }
    bar.stop();
  });
