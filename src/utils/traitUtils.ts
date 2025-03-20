import {
  TraitMapping,
  TraitOption,
  TraitType,
  SelectedTraits,
} from "@/types/traits";
import traitMappings from "@/data/number2display_mapping.json";
import {
  getTraitImageUrl as getImageUrl,
  isValidTrait,
  getAvailableTraitIds,
} from "./traitImageMap";

const CDN_URL = "https://fluffle-traits.b-cdn.net/traits";

export const TRAIT_CATEGORIES: TraitType[] = [
  "skin",
  "eyeball",
  "eyeliner",
  "eyebrow",
  "hair",
  "ear",
  "head",
  "face",
  "clothes",
];

export function getTraitOptions(type: TraitType): TraitOption[] {
  const availableIds = getAvailableTraitIds(type);

  return traitMappings
    .filter((m) => {
      const mappingType = m.Type.toLowerCase() as TraitType;
      return mappingType === type && isValidTrait(type, m["Backend Name"]);
    })
    .map((m) => ({
      id: m["Backend Name"],
      displayName: m["Display Name"],
      imageUrl: getTraitImageUrl(type, m["Backend Name"]),
      tribe: m.Tribe,
    }))
    .filter((option) => availableIds.includes(option.id));
}

export function getRandomTraitId(type: TraitType): string | null {
  const availableIds = getAvailableTraitIds(type);
  if (availableIds.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availableIds.length);
  return availableIds[randomIndex];
}

export function getRandomTraits(): SelectedTraits {
  return TRAIT_CATEGORIES.reduce((acc, type) => {
    acc[type] = getRandomTraitId(type);
    return acc;
  }, {} as SelectedTraits);
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
  const mapping = traitMappings.find(
    (m) => m.Type.toLowerCase() === type && m["Backend Name"] === id
  );
  return mapping?.["Display Name"] || `${type} ${id}`;
}
