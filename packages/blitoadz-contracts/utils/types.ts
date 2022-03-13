export type Toadz = {
  colors: string[];
  name: string;
  indexes: number[];
};

export type Palettes = Toadz[];

export type PalettesStorage = {
  toadz: string;
};

export type Blitmap = {
  image: string;
  name: string;
  description: string;
  attributes: Map<string, string>[];
  colors: Map<string, string>[][];
  data: string;
};
