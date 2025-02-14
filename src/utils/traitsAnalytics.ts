import type { NFTTrait } from "./nftLoader";

export interface TraitMetadata {
  trait_type: string;
  value: string;
  rarity: number;
  count: number;
  trait_number?: number;
}

export interface TraitCategory {
  name: string;
  traits: TraitMetadata[];
  totalNFTs: number;
  isOptionalItem?: boolean;
}

export interface TraitsAnalytics {
  categories: TraitCategory[];
  totalNFTs: number;
}

// Define which categories are optional items
const OPTIONAL_ITEMS = new Set(["ear", "face", "head", "tribe"]);

export async function fetchTraitsAnalytics(): Promise<TraitsAnalytics> {
  const TRAITS_METADATA_URL =
    "https://gist.githubusercontent.com/0x-ultra/73ecc2e5e0f553ea3deb6be6aae46a33/raw/megaeth-metadata.json";

  try {
    const response = await fetch(TRAITS_METADATA_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch traits metadata");
    }

    const data = await response.json();
    const totalNFTs = Object.keys(data).length;

    // Initialize trait counters
    const traitCounters: Record<string, Record<string, number>> = {};
    const tribeOutfitCounters: Record<string, Record<number, number>> = {};
    const tribeOutfitSets: Record<string, Set<number>> = {};
    const traitNumbers: Record<string, Record<string, number>> = {};

    // Process each NFT's display name fields
    Object.values(data).forEach((nft: any) => {
      Object.entries(nft).forEach(([key, value]) => {
        if (key.endsWith("_display_name")) {
          const category = key.replace("_display_name", "");
          const originalValue = nft[category];

          if (!traitCounters[category]) {
            traitCounters[category] = {};
            traitNumbers[category] = {};
          }

          // For optional items, we want to count -1 values separately
          if (OPTIONAL_ITEMS.has(category)) {
            const displayValue = value === -1 ? "No Item" : String(value);
            traitCounters[category][displayValue] =
              (traitCounters[category][displayValue] || 0) + 1;

            // Store the trait number if it's not "No Item"
            if (value !== -1) {
              traitNumbers[category][displayValue] = originalValue;
            }

            // Special handling for tribe outfits
            if (category === "tribe" && value !== -1) {
              const tribeName = String(value);
              const outfitVariation = (nft as any).tribe;

              // Initialize counters for this tribe if needed
              if (!tribeOutfitCounters[tribeName]) {
                tribeOutfitCounters[tribeName] = {};
                tribeOutfitSets[tribeName] = new Set();
              }

              // Count this outfit variation
              tribeOutfitCounters[tribeName][outfitVariation] =
                (tribeOutfitCounters[tribeName][outfitVariation] || 0) + 1;

              // Track unique outfit variations
              tribeOutfitSets[tribeName].add(outfitVariation);
            }
          } else {
            // For regular traits, skip -1 values
            if (value !== -1) {
              traitCounters[category][String(value)] =
                (traitCounters[category][String(value)] || 0) + 1;
              traitNumbers[category][String(value)] = originalValue;
            }
          }
        }
      });
    });

    // Debug log tribe outfit distribution
    console.log("Tribe Outfit Distribution:", tribeOutfitCounters);
    console.log(
      "Unique outfits per tribe:",
      Object.fromEntries(
        Object.entries(tribeOutfitSets).map(([tribe, outfits]) => [
          tribe,
          outfits.size,
        ])
      )
    );

    // Convert counters to categories array
    const categories: TraitCategory[] = Object.entries(traitCounters).map(
      ([category, traits]) => {
        const isOptionalItem = OPTIONAL_ITEMS.has(category);

        let processedTraits = Object.entries(traits)
          .map(([value, count]) => {
            const baseTrait = {
              trait_type: category,
              value,
              count,
              rarity: (count / totalNFTs) * 100,
              trait_number: traitNumbers[category][value],
            };

            // Add outfit information for tribes
            if (category === "tribe" && value !== "No Item") {
              const outfits = tribeOutfitCounters[value] || {};
              const uniqueOutfits = tribeOutfitSets[value]?.size || 0;
              return {
                ...baseTrait,
                outfits,
                uniqueOutfits,
                outfitDistribution: Object.entries(outfits)
                  .map(([outfit, count]) => ({
                    outfit: Number(outfit),
                    count,
                    percentage: (count / baseTrait.count) * 100,
                  }))
                  .sort((a, b) => b.count - a.count),
              };
            }

            return baseTrait;
          })
          .sort((a, b) => a.rarity - b.rarity);

        return {
          name: category.charAt(0).toUpperCase() + category.slice(1),
          traits: processedTraits,
          totalNFTs,
          ...(isOptionalItem && { isOptionalItem: true }),
          ...(category === "tribe" && {
            outfitDistribution: tribeOutfitCounters,
            uniqueOutfitsPerTribe: Object.fromEntries(
              Object.entries(tribeOutfitSets).map(([tribe, outfits]) => [
                tribe,
                outfits.size,
              ])
            ),
          }),
        };
      }
    );

    return {
      categories: categories
        .filter((cat) => {
          if (OPTIONAL_ITEMS.has(cat.name.toLowerCase())) return true;
          return cat.traits.some((t) => t.value !== "No Item");
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
      totalNFTs,
    };
  } catch (error) {
    console.error("Error fetching traits analytics:", error);
    throw error;
  }
}

export function calculateTraitRarity(trait: TraitMetadata): string {
  if (trait.rarity < 1) return "Legendary";
  if (trait.rarity < 5) return "Epic";
  if (trait.rarity < 15) return "Rare";
  if (trait.rarity < 30) return "Uncommon";
  return "Common";
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case "Legendary":
      return "text-yellow-400";
    case "Epic":
      return "text-purple-400";
    case "Rare":
      return "text-blue-400";
    case "Uncommon":
      return "text-green-400";
    default:
      return "text-gray-400";
  }
}
