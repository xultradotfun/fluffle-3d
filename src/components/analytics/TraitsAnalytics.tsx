"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  fetchTraitsAnalytics,
  calculateTraitRarity,
  getRarityColor,
  type TraitsAnalytics,
  type TraitCategory,
  type TraitMetadata,
  calculateCategoryRarityDistribution,
  getRarityGradient,
} from "@/utils/traitsAnalytics";

interface ExtendedTraitMetadata extends TraitMetadata {
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

interface ExtendedTraitCategory extends TraitCategory {
  clothesVariants?: number;
  clothesDistribution?: Record<string, number>;
  outfitDistribution?: Record<string, Record<number, number>>;
  uniqueOutfitsPerTribe?: Record<string, number>;
}

export function TraitsAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<TraitsAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await fetchTraitsAnalytics();
        setAnalytics(data);
        if (data.categories.length > 0) {
          setSelectedCategory(data.categories[0].name);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4">
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-500 mb-2">
          Failed to Load Analytics
        </h3>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  if (!analytics) return null;

  const selectedCategoryData = analytics.categories.find(
    (cat) => cat.name === selectedCategory
  ) as ExtendedTraitCategory | undefined;

  const getRarityDistribution = (category: TraitCategory) => {
    const distribution = {
      Legendary: 0,
      Epic: 0,
      Rare: 0,
      Uncommon: 0,
      Common: 0,
    };

    const categoryDistribution = calculateCategoryRarityDistribution(
      category.traits
    );
    return { ...distribution, ...categoryDistribution };
  };

  const getTotalTraits = () => {
    return analytics.categories.reduce(
      (acc, cat) => acc + cat.traits.length,
      0
    );
  };

  const getAverageTraitsPerCategory = () => {
    return (getTotalTraits() / analytics.categories.length).toFixed(1);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <h2 className="text-2xl font-bold text-foreground">Trait Analytics</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card dark:bg-gradient-to-br dark:from-blue-500/10 dark:to-purple-500/10 border border-border dark:border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total NFTs
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {analytics.totalNFTs.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card dark:bg-gradient-to-br dark:from-purple-500/10 dark:to-pink-500/10 border border-border dark:border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Categories
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {analytics.categories.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-purple-600 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card dark:bg-gradient-to-br dark:from-green-500/10 dark:to-blue-500/10 border border-border dark:border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Traits
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {getTotalTraits()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card dark:bg-gradient-to-br dark:from-yellow-500/10 dark:to-orange-500/10 border border-border dark:border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Optional Items
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {
                    analytics.categories.filter((cat) => cat.isOptionalItem)
                      .length
                  }
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ear, Face, Head
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Selection */}
      <div className="flex flex-wrap gap-2">
        {analytics.categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === category.name
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-card dark:bg-white/5 text-muted-foreground hover:bg-accent dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white border border-border dark:border-white/10"
            }`}
          >
            <div className="flex items-center gap-2">
              {category.name}
              <Badge variant="secondary" size="sm">
                {category.traits.length}
              </Badge>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Category Analysis */}
      {selectedCategoryData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Distribution Card */}
          <Card className="lg:col-span-2 bg-card dark:bg-transparent border border-border dark:border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {selectedCategoryData.name} Distribution
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedCategoryData.name === "Tribe"
                      ? `Optional item with ${selectedCategoryData.clothesVariants} clothing variations`
                      : selectedCategoryData.isOptionalItem
                      ? "Optional item with variations"
                      : "Required trait with variants"}
                  </p>
                </div>
                <Badge variant="secondary">
                  {selectedCategoryData.traits.length}{" "}
                  {selectedCategoryData.isOptionalItem
                    ? "variations"
                    : "traits"}
                </Badge>
              </div>

              <div className="space-y-4">
                {selectedCategoryData.traits.map((trait) => {
                  const extendedTrait = trait as ExtendedTraitMetadata;
                  const isNoItem = trait.value === "No Item";
                  const rarity = calculateTraitRarity(trait);
                  const rarityColor = getRarityColor(rarity);

                  return (
                    <div
                      key={trait.value}
                      className="group relative p-4 rounded-xl bg-accent/50 dark:bg-white/[0.02] hover:bg-accent dark:hover:bg-white/[0.04] border border-border dark:border-white/5 hover:border-blue-500/20 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        {/* Image Preview - Only for Ear, Face, Head */}
                        {!isNoItem &&
                          selectedCategoryData.name !== "Tribe" &&
                          trait.trait_number !== undefined && (
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/20 ring-1 ring-border dark:ring-white/10 group-hover:ring-blue-500/20 transition-all flex-shrink-0">
                              <img
                                src={`https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/${selectedCategoryData.name.toLowerCase()}/${
                                  trait.trait_number
                                }.png`}
                                alt={`${trait.value} preview`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                              <div className="absolute bottom-1 left-1">
                                <Badge
                                  variant="default"
                                  size="sm"
                                  className="shadow-lg text-xs"
                                >
                                  #{trait.trait_number}
                                </Badge>
                              </div>
                            </div>
                          )}

                        {/* Trait Information */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-sm font-medium truncate ${
                                isNoItem
                                  ? "text-muted-foreground"
                                  : "text-foreground"
                              }`}
                            >
                              {trait.value}
                            </span>
                            <Badge
                              variant="secondary"
                              className={`${
                                isNoItem ? "text-muted-foreground" : rarityColor
                              } transition-colors shrink-0`}
                            >
                              {isNoItem ? "Base" : rarity}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm text-muted-foreground">
                              {trait.count.toLocaleString()} NFTs
                            </span>
                            <span className="text-sm font-medium text-muted-foreground">
                              {trait.rarity.toFixed(2)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isNoItem
                                  ? "bg-muted-foreground/50"
                                  : "bg-gradient-to-r from-blue-500 to-blue-400"
                              }`}
                              style={{ width: `${trait.rarity}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Outfit Distribution - Special handling for tribe traits */}
                      {!isNoItem && extendedTrait.outfitDistribution && (
                        <div className="mt-4 pt-4 border-t border-border dark:border-white/10">
                          <div className="flex items-center gap-2 mb-3">
                            <svg
                              className="w-4 h-4 text-blue-600 dark:text-blue-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                              />
                            </svg>
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              Outfit Variations (
                              {extendedTrait.outfitDistribution.length})
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {extendedTrait.outfitDistribution.map(
                              ({ outfit, count, percentage }) => (
                                <div
                                  key={outfit}
                                  className="group relative p-3 rounded-xl bg-accent/50 dark:bg-white/[0.02] hover:bg-accent dark:hover:bg-white/[0.04] border border-border dark:border-white/5 hover:border-blue-500/20 transition-all duration-200"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/20 ring-1 ring-border dark:ring-white/10 group-hover:ring-blue-500/20 transition-all flex-shrink-0">
                                      <img
                                        src={`https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/clothes/${outfit}.png`}
                                        alt={`Outfit ${outfit}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                          (
                                            e.target as HTMLImageElement
                                          ).style.display = "none";
                                        }}
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-2">
                                        <Badge variant="default" size="sm">
                                          #{outfit}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                          {percentage.toFixed(1)}%
                                        </span>
                                      </div>
                                      <div className="text-xs text-muted-foreground mb-1.5">
                                        {count.toLocaleString()} NFTs
                                      </div>
                                      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                                          style={{ width: `${percentage}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Tribe Clothes Distribution */}
              {selectedCategoryData.name === "Tribe" &&
                selectedCategoryData.clothesDistribution && (
                  <div className="mt-8 pt-8 border-t border-border dark:border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-semibold text-foreground">
                        Clothing Variations
                      </h4>
                      <Badge variant="secondary">
                        {
                          Object.keys(selectedCategoryData.clothesDistribution)
                            .length
                        }{" "}
                        variants
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedCategoryData.clothesDistribution)
                        .sort((a, b) => b[1] - a[1])
                        .map(([variant, count]) => (
                          <div
                            key={variant}
                            className="flex items-center justify-between p-2 rounded-lg bg-accent/50 dark:bg-white/5"
                          >
                            <span className="text-sm text-muted-foreground">
                              Variant {variant}
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              {count.toLocaleString()} NFTs
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Rarity Distribution Card */}
          <Card className="h-fit bg-card dark:bg-transparent border border-border dark:border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Rarity Breakdown
              </h3>

              {selectedCategoryData && (
                <div className="space-y-3">
                  {Object.entries(getRarityDistribution(selectedCategoryData))
                    .filter(([_, count]) => count > 0)
                    .map(([rarity, count]) => (
                      <div key={rarity} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-medium ${getRarityColor(
                                rarity
                              )}`}
                            >
                              {rarity}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {(
                                (count / selectedCategoryData.traits.length) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {count} trait{count !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getRarityGradient(
                              rarity
                            )}`}
                            style={{
                              width: `${
                                (count / selectedCategoryData.traits.length) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-border dark:border-white/10">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Average Rarity
                    </span>
                    <span className="text-foreground font-medium">
                      {(
                        selectedCategoryData.traits.reduce(
                          (acc, trait) => acc + trait.rarity,
                          0
                        ) / selectedCategoryData.traits.length
                      ).toFixed(2)}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rarest Trait</span>
                    <span className="text-foreground font-medium">
                      {selectedCategoryData.traits[0].value} (
                      {selectedCategoryData.traits[0].rarity.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
