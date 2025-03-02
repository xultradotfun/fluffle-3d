import type { NFTTrait } from "./nftLoader";

export interface TraitMetadata {
  trait_type: string;
  value: string;
  rarity: number;
  count: number;
  trait_number?: number;
  image?: string;
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

// Add merch items data
const MERCH_ITEMS = [
  {
    name: "Cropped Tee",
    category: "tops",
    image:
      "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/merch/megaeth_t_cropped.png",
  },
  {
    name: "Tee",
    category: "tops",
    image:
      "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/merch/megaeth_t.png",
  },
  {
    name: "Measure Then Build Tee",
    category: "tops",
    image:
      "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/merch/mesure_then_build_t.png",
  },
  {
    name: "Pans And Shoes",
    category: "bottoms",
    image:
      "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/merch/pants_and_shoes.png",
  },
  {
    name: "World Computer Day Necklace",
    category: "necklaces",
    image:
      "https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/merch/world_computer_day_necklace.png",
  },
];

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

    // Add merch category
    const merchCategory: TraitCategory = {
      name: "Merch",
      traits: MERCH_ITEMS.map((item) => ({
        trait_type: "merch",
        value: item.name,
        count: 0, // Merch items don't have rarity
        rarity: 0,
        image: item.image,
      })),
      totalNFTs,
      isOptionalItem: true,
    };

    return {
      categories: [...categories, merchCategory]
        .filter((cat) => {
          if (cat.name === "Merch") return true;
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
  // Calculate rarity based on percentile ranges
  if (trait.rarity <= 2) return "Legendary"; // Bottom 2%
  if (trait.rarity <= 8) return "Epic"; // Next 6%
  if (trait.rarity <= 20) return "Rare"; // Next 12%
  if (trait.rarity <= 40) return "Uncommon"; // Next 20%
  return "Common"; // Remaining 60%
}

// Helper function to calculate rarity distribution for a category
export function calculateCategoryRarityDistribution(
  traits: TraitMetadata[]
): Record<string, number> {
  const totalTraits = traits.length;
  const sortedRarities = traits.map((t) => t.rarity).sort((a, b) => a - b);

  // Calculate percentile thresholds
  const thresholds = {
    legendary: sortedRarities[Math.floor(totalTraits * 0.02)], // 2nd percentile
    epic: sortedRarities[Math.floor(totalTraits * 0.08)], // 8th percentile
    rare: sortedRarities[Math.floor(totalTraits * 0.2)], // 20th percentile
    uncommon: sortedRarities[Math.floor(totalTraits * 0.4)], // 40th percentile
  };

  // Count traits in each rarity category
  return traits.reduce((acc, trait) => {
    const rarity = calculateTraitRarity(trait);
    acc[rarity] = (acc[rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
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

export function getRarityGradient(rarity: string): string {
  switch (rarity) {
    case "Legendary":
      return "bg-gradient-to-r from-yellow-500 to-yellow-400";
    case "Epic":
      return "bg-gradient-to-r from-purple-500 to-purple-400";
    case "Rare":
      return "bg-gradient-to-r from-blue-500 to-blue-400";
    case "Uncommon":
      return "bg-gradient-to-r from-green-500 to-green-400";
    default:
      return "bg-gradient-to-r from-gray-500 to-gray-400";
  }
}
