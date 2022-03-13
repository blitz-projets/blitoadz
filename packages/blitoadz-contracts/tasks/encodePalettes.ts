import { task } from "hardhat/config";
import fs from "fs";
import { Palettes } from "../utils/types";
import {
  BITS_PER_INDEX,
  MAX_CONTRACT_SIZE,
  PALETTES_ENCODED_FILE,
  PALETTES_FILE,
} from "../utils/constants";
import { toBits } from "../utils/encoding";

task(
  "encode-palettes",
  "Take the rect and fill palettes and turns them into bytes for storage"
)
  .addOptionalParam("input", "The output file", PALETTES_FILE)
  .addOptionalParam("output", "The output file", PALETTES_ENCODED_FILE)
  .setAction(async ({ input, output }, { ethers }) => {
    const {
      utils: { hexDataLength },
    } = ethers;

    const palettes: Palettes = JSON.parse(
      fs.readFileSync(input, { encoding: "utf-8" })
    );

    const indexes = palettes.map((toadz) =>
      (
        toadz.indexes
          .map(toBits(BITS_PER_INDEX))
          .join("")
          .match(/.{1,8}/g) || []
      )
        .map((byte) =>
          parseInt(byte.padEnd(8, "0"), 2).toString(16).padStart(2, "0")
        )
        .join("")
    );
    let toadz = "0x";
    const toadzIndexes = [];
    for (let i = 0; i < indexes.length; i++) {
      toadzIndexes.push(hexDataLength(toadz).toString(16).padStart(4, "0"));
      toadz += indexes[i];
    }
    toadzIndexes.push(hexDataLength(toadz).toString(16).padStart(4, "0"));
    toadz = "0x" + toadzIndexes.join("") + toadz.slice(2);

    if (hexDataLength(toadz) > MAX_CONTRACT_SIZE) {
      throw new Error(
        `Toadz data is ${hexDataLength(
          toadz
        )} bytes, which is greater than the maximum of ${MAX_CONTRACT_SIZE} bytes.`
      );
    }

    const paletteBytes = {
      toadz,
    };

    fs.writeFileSync(output, JSON.stringify(paletteBytes, null, 2));
  });
