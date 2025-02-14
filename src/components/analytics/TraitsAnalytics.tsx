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

    category.traits.forEach((trait) => {
      const rarity = calculateTraitRarity(trait);
      distribution[rarity as keyof typeof distribution]++;
    });

    return distribution;
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
      <h2 className="text-2xl font-bold text-white">Trait Analytics</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total NFTs</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {analytics.totalNFTs.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-400"
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

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {analytics.categories.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-purple-400"
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

        <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Traits
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {getTotalTraits()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  ~{getAverageTraitsPerCategory()} per category
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-400"
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

        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Optional Items
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {
                    analytics.categories.filter((cat) => cat.isOptionalItem)
                      .length
                  }
                </p>
                <p className="text-xs text-gray-400 mt-1">Ear, Face, Head</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-yellow-400"
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
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
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
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedCategoryData.name} Distribution
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
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
                      className="group relative space-y-2 p-3 rounded-xl transition-all hover:bg-white/5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {selectedCategoryData.isOptionalItem &&
                            !isNoItem &&
                            trait.trait_number !== undefined && (
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/20 ring-1 ring-white/10 group-hover:ring-blue-500/20 transition-all">
                                <img
                                  src={`https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/${selectedCategoryData.name.toLowerCase()}/${
                                    trait.trait_number
                                  }.png`}
                                  alt={`${trait.value} preview`}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                  onError={(e) => {
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                          <div className="flex flex-col">
                            <span
                              className={`text-sm font-medium ${
                                isNoItem ? "text-gray-400" : "text-white"
                              }`}
                            >
                              {trait.value}
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className={`${
                                  isNoItem ? "text-gray-400" : rarityColor
                                } transition-colors`}
                              >
                                {isNoItem ? "Base" : rarity}
                              </Badge>
                              {!isNoItem && extendedTrait.uniqueOutfits && (
                                <Badge variant="secondary" size="sm">
                                  {extendedTrait.uniqueOutfits} outfits
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-400">
                            {trait.count.toLocaleString()} NFTs
                          </span>
                          <span className="text-sm font-medium text-gray-400">
                            {trait.rarity.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isNoItem
                              ? "bg-gray-500/50"
                              : "bg-gradient-to-r from-blue-500 to-blue-400"
                          }`}
                          style={{ width: `${trait.rarity}%` }}
                        />
                      </div>

                      {/* Outfit Distribution */}
                      {!isNoItem && extendedTrait.outfitDistribution && (
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                            <span className="text-sm font-medium text-gray-400">
                              Outfit Variations
                            </span>
                            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {extendedTrait.outfitDistribution.map(
                              ({ outfit, count, percentage }) => (
                                <div
                                  key={outfit}
                                  className="group relative p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-blue-500/20 transition-all duration-200"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-black/20 ring-1 ring-white/10">
                                      <img
                                        src={`https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/clothes/${outfit}.png`}
                                        alt={`Outfit ${outfit} preview`}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        onError={(e) => {
                                          (
                                            e.target as HTMLImageElement
                                          ).style.display = "none";
                                        }}
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-white">
                                          #{outfit}
                                        </span>
                                        <Badge
                                          variant="secondary"
                                          size="sm"
                                          className="font-mono"
                                        >
                                          {percentage.toFixed(1)}%
                                        </Badge>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                          <div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300"
                                            style={{ width: `${percentage}%` }}
                                          />
                                        </div>
                                        <span className="text-xs text-gray-400">
                                          {count.toLocaleString()} NFTs
                                        </span>
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
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-semibold text-white">
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
                            className="flex items-center justify-between p-2 rounded-lg bg-white/5"
                          >
                            <span className="text-sm text-gray-400">
                              Variant {variant}
                            </span>
                            <span className="text-sm font-medium text-white">
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
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Rarity Breakdown
              </h3>

              {selectedCategoryData && (
                <div className="space-y-4">
                  {Object.entries(
                    getRarityDistribution(selectedCategoryData)
                  ).map(([rarity, count]) => (
                    <div key={rarity} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-medium ${getRarityColor(
                            rarity
                          )}`}
                        >
                          {rarity}
                        </span>
                        <span className="text-sm text-gray-400">
                          {count} traits
                        </span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            rarity === "Legendary"
                              ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                              : rarity === "Epic"
                              ? "bg-gradient-to-r from-purple-500 to-purple-400"
                              : rarity === "Rare"
                              ? "bg-gradient-to-r from-blue-500 to-blue-400"
                              : rarity === "Uncommon"
                              ? "bg-gradient-to-r from-green-500 to-green-400"
                              : "bg-gradient-to-r from-gray-500 to-gray-400"
                          }`}
                          style={{
                            width: `${
                              (count / selectedCategoryData.traits.length) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Average Rarity</span>
                    <span className="text-white font-medium">
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
                    <span className="text-gray-400">Rarest Trait</span>
                    <span className="text-white font-medium">
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
