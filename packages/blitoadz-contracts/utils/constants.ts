import fs from "fs";
import { Palettes, PalettesStorage } from "./types";

export const MAX_CONTRACT_SIZE = 24_000;
export const PALETTES_FILE =
  "../../packages/blitoadz-image-processing/data/palettes.json";
export const PALETTES_ENCODED_FILE = "data/palettes-encoded.json";
export const BITS_PER_INDEX = 2;

export const loadPalettes = (): Palettes => {
  try {
    return JSON.parse(fs.readFileSync(PALETTES_FILE, "utf8"));
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const loadPalettesEncoded = (): PalettesStorage => {
  try {
    return JSON.parse(fs.readFileSync(PALETTES_ENCODED_FILE, "utf8"));
  } catch (e) {
    console.error(e);
    return {
      toadz: "",
    };
  }
};

// Deploy constants
export const TAGS = {
  BLITOADZ: "Blitoadz",
  BLITOADZ_PALETTES: "BlitoadzPalettes",
};
