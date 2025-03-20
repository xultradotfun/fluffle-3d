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
