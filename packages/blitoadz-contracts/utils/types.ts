export type ToadzImage = {
  colors: string[];
  name: string;
  indexes: number[];
};

export type Palettes = ToadzImage[];

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
  creator: string;
};

export type Toadz = {
  description: string;
  external_url: string;
  image: string;
  name: string;
  attributes: Record<string, string>[];
};
