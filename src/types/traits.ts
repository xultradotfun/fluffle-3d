export type TraitType =
  | "clothes"
  | "hair"
  | "skin"
  | "ear"
  | "eyeball"
  | "eyeliner"
  | "eyebrow"
  | "head"
  | "face"
  | "eyelid"
  | "eyewhite"
  | "mouth"
  | "eyeliner_for_skin_2"
  | "eyeliner_for_skin_3"
  | "eyebrow_for_skin_3"
  | "mouth_for_skin_3";

export interface TraitMapping {
  Type: string;
  "Display Name": string;
  "Backend Name": string;
  Tribe?: string;
}

export interface TraitOption {
  id: string;
  displayName: string;
  imageUrl: string;
  tribe?: string;
}

export type SelectedTraits = {
  [K in TraitType]?: string;
};

export interface TraitImageInfo {
  path: string;
  hasBack?: boolean;
}

export type TraitImageMap = {
  [K in TraitType]: {
    [id: string]: TraitImageInfo;
  };
};
