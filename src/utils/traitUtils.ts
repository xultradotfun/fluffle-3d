import {
  TraitMapping,
  TraitOption,
  TraitType,
  SelectedTraits,
} from "@/types/traits";
import number2display_mapping from "@/data/number2display_mapping.json";
import {
  getTraitImageUrl as getImageUrl,
  isValidTrait,
  getAvailableTraitIds,
} from "./traitImageMap";

const CDN_URL = "https://fluffle-traits.b-cdn.net/traits";

const traitMappings: Record<string, TraitMapping> = number2display_mapping;

export function getTraitOptions(type: TraitType): TraitOption[] {
  return Object.entries(traitMappings)
    .filter(([_, mapping]) => mapping.Type === type)
    .map(([id, mapping]) => ({
      id,
      displayName: mapping["Display Name"],
      type,
      tribe: mapping.Tribe,
      imageUrl: getImageUrl(type, id),
    }))
    .filter((option) => isValidTrait(option.type, option.id));
}

export function getTraitImageUrl(type: string, id: string) {
  // Special cases for clothes that have front/back parts
  if (type === "clothes") {
    if (["3", "35"].includes(id)) {
      return `${CDN_URL}/traits/${type}/${id}_front.png`;
    }
  }

  // Handle hair front/back parts
  if (type === "hair") {
    const hasBackPart = [
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
    ].includes(id);

    if (hasBackPart) {
      return `${CDN_URL}/traits/${type}/${id}_front.png`;
    }
  }

  // Default case - no padding needed
  return `${CDN_URL}/traits/${type}/${id}.png`;
}

export function getTraitDisplayName(type: TraitType, id: string): string {
  const mapping = traitMappings[id];
  return mapping && mapping.Type === type ? mapping["Display Name"] : id;
}

export const TRAIT_CATEGORIES: { id: TraitType; label: string }[] = [
  { id: "skin", label: "Skin" },
  { id: "eyeball", label: "Eyes" },
  { id: "eyeliner", label: "Eyeliner" },
  { id: "eyebrow", label: "Eyebrows" },
  { id: "hair", label: "Hair" },
  { id: "ear", label: "Ears" },
  { id: "head", label: "Head" },
  { id: "face", label: "Face" },
  { id: "clothes", label: "Clothes" },
];

// Helper function to get a random item from an array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to generate a random combination of traits
export function getRandomTraits(): SelectedTraits {
  const traits: SelectedTraits = {};

  // Always include skin
  const skinOptions = getTraitOptions("skin");
  if (skinOptions.length > 0) {
    traits.skin = getRandomItem(skinOptions).id;
  }

  // For each trait type, 80% chance to include it
  const traitTypes: TraitType[] = [
    "eyeball",
    "eyeliner",
    "eyebrow",
    "hair",
    "ear",
    "head",
    "face",
    "clothes",
  ];

  // Special traits based on skin type
  if (traits.skin === "2") {
    traitTypes.push("eyeliner_for_skin_2");
  } else if (traits.skin === "3") {
    traitTypes.push(
      "eyeliner_for_skin_3",
      "eyebrow_for_skin_3",
      "mouth_for_skin_3"
    );
  }

  for (const type of traitTypes) {
    if (Math.random() < 0.8) {
      const options = getTraitOptions(type);
      if (options.length > 0) {
        traits[type] = getRandomItem(options).id;
      }
    }
  }

  return traits;
}
