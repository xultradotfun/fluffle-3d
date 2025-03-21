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
  "background",
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

export function getInitialTraits(): SelectedTraits {
  // Only include these specific traits for initial load
  const INITIAL_TRAITS: TraitType[] = [
    "skin",
    "eyeball",
    "eyebrow",
    "hair",
    "eyelid",
    "mouth",
    "eyeliner",
    "background",
  ];

  return INITIAL_TRAITS.reduce((acc, type) => {
    // For background, 50% chance to be "Mega"
    if (type === "background") {
      acc[type] = Math.random() < 0.5 ? "Mega" : undefined;
    } else {
      acc[type] = getRandomTraitId(type);
    }
    return acc;
  }, {} as SelectedTraits);
}

export function getRandomTraits(): SelectedTraits {
  // Required traits that must have a value
  const REQUIRED_TRAITS: TraitType[] = [
    "skin",
    "eyeball",
    "eyebrow",
    "hair",
    "eyelid",
    "mouth",
    "eyeliner",
    "clothes",
    "eyewhite",
  ];

  // Optional traits that can be "none"
  const OPTIONAL_TRAITS: TraitType[] = [
    "ear",
    "head",
    "face",
    "eyeliner_for_skin_2",
    "eyeliner_for_skin_3",
    "eyebrow_for_skin_3",
    "mouth_for_skin_3",
    "background",
  ];

  // First, handle required traits
  const requiredTraits = REQUIRED_TRAITS.reduce((acc, type) => {
    acc[type] = getRandomTraitId(type);
    return acc;
  }, {} as SelectedTraits);

  // Then, handle optional traits with equal chance between none and each trait
  const optionalTraits = OPTIONAL_TRAITS.reduce((acc, type) => {
    const availableIds = getAvailableTraitIds(type);
    // Random number between 0 and number of options (including none)
    const randomIndex = Math.floor(Math.random() * (availableIds.length + 1));
    // If randomIndex is 0, it's none. Otherwise, it's a trait
    if (randomIndex > 0) {
      acc[type] = availableIds[randomIndex - 1];
    }
    return acc;
  }, {} as SelectedTraits);

  return {
    ...requiredTraits,
    ...optionalTraits,
  };
}
