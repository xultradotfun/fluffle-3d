import type { TraitCategory, TraitMetadata } from "@/utils/traitsAnalytics";

export interface ExtendedTraitMetadata extends TraitMetadata {
  clothesVariants?: number;
  totalClothesVariants?: number;
  outfits?: Record<number, number>;
  uniqueOutfits?: number;
  outfitDistribution?: Array<{
    outfit: number;
    count: number;
    percentage: number;
  }>;
}

export interface ExtendedTraitCategory extends TraitCategory {
  clothesVariants?: number;
  clothesDistribution?: Record<string, number>;
  outfitDistribution?: Record<string, Record<number, number>>;
  uniqueOutfitsPerTribe?: Record<string, number>;
}
