export type TraitType =
  | "skin"
  | "eyeball"
  | "eyeliner"
  | "eyebrow"
  | "hair"
  | "ear"
  | "head"
  | "face"
  | "clothes"
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
  type: TraitType;
  tribe?: string;
  imageUrl: string;
}

export interface SelectedTraits {
  skin?: string;
  eyeball?: string;
  eyeliner?: string;
  eyebrow?: string;
  hair?: string;
  ear?: string;
  head?: string;
  face?: string;
  clothes?: string;
  eyeliner_for_skin_2?: string;
  eyeliner_for_skin_3?: string;
  eyebrow_for_skin_3?: string;
  mouth_for_skin_3?: string;
}

export interface TraitImageMap {
  [type: string]: {
    [id: string]: {
      path: string;
      hasFrontBack?: boolean;
    };
  };
}
