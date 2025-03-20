import {
  TraitMapping,
  TraitOption,
  TraitType,
  SelectedTraits,
} from "@/types/traits";
import traitMappings from "@/data/number2display_mapping.json";
import {
  getTraitImageUrl,
  isValidTrait,
  getAvailableTraitIds,
} from "./traitImageMap";

export { getTraitImageUrl };

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
  "eyelid",
  "eyewhite",
  "mouth",
  "eyeliner_for_skin_2",
  "eyeliner_for_skin_3",
  "eyebrow_for_skin_3",
  "mouth_for_skin_3",
];

export function getTraitOptions(type: TraitType): TraitOption[] {
  const availableIds = getAvailableTraitIds(type);

  // Get mappings from JSON file
  const jsonMappings = traitMappings
    .filter((m) => {
      const mappingType = m.Type.toLowerCase() as TraitType;
      return mappingType === type && isValidTrait(type, m["Backend Name"]);
    })
    .map((m) => ({
      id: m["Backend Name"],
      displayName: m["Display Name"],
      imageUrl: getTraitImageUrl(type, m["Backend Name"]),
      tribe: m.Tribe,
    }));

  // If we have JSON mappings, filter by available IDs
  if (jsonMappings.length > 0) {
    return jsonMappings.filter((option) => availableIds.includes(option.id));
  }

  // For traits without JSON mappings, create options from available IDs
  return availableIds.map((id) => ({
    id,
    displayName: `Style ${id}`,
    imageUrl: getTraitImageUrl(type, id),
  }));
}

export function getRandomTraitId(type: TraitType): string | undefined {
  const availableIds = getAvailableTraitIds(type);
  if (availableIds.length === 0) return undefined;

  const randomIndex = Math.floor(Math.random() * availableIds.length);
  return availableIds[randomIndex];
}

export function getRandomTraits(): SelectedTraits {
  return TRAIT_CATEGORIES.reduce((acc, type) => {
    acc[type] = getRandomTraitId(type);
    return acc;
  }, {} as SelectedTraits);
}

export function getTraitDisplayName(type: TraitType, id: string): string {
  const mapping = traitMappings.find(
    (m) => m.Type.toLowerCase() === type && m["Backend Name"] === id
  );
  return mapping?.["Display Name"] || `${type} ${id}`;
}
