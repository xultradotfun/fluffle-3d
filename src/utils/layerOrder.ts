import { TraitType } from "@/types/traits";

// Layer order from bottom to top
export const LAYER_ORDER = {
  // Background layer
  BACKGROUND: ["background"] as const,

  // Base character layers
  BASE: ["skin", "eyewhite", "eyeball", "eyelid"] as const,

  // Face features
  FACE_FEATURES: ["mouth", "eyebrow"] as const,

  // Eye details and variations
  EYE_DETAILS: [
    "eyeliner",
    "eyeliner_for_skin_2",
    "eyeliner_for_skin_3",
    "eyebrow_for_skin_3",
    "mouth_for_skin_3",
    "face",
    "ear", 
  ] as const,

  // Hair back part is rendered separately

  // Accessories
  ACCESSORIES: ["head"] as const,

  // Clothes
  CLOTHES: ["clothes"] as const,

  // Hair front part is rendered separately
} as const;

// Hair styles that have back parts
export const HAIR_WITH_BACK = [
  "4",
  "11",
  "12",
  "17",
  "18",
  "22",
  "27",
  "30",
  "31",
  "43",
  "50",
  "62",
  "63",
] as const;

// Type for layer groups
export type LayerGroup = keyof typeof LAYER_ORDER;

// Helper type to get array of trait types from a layer group
export type LayerTraits<T extends LayerGroup> = (typeof LAYER_ORDER)[T][number];

// Helper type to get all trait types from all layers
export type AllLayerTraits = {
  [K in LayerGroup]: LayerTraits<K>;
}[LayerGroup];
