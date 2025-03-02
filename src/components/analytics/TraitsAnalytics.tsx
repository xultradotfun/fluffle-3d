"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  fetchTraitsAnalytics,
  type TraitsAnalytics,
} from "@/utils/traitsAnalytics";
import { StatsCards } from "./StatsCards";
import { CategorySelector } from "./CategorySelector";
import { TraitDistribution } from "./TraitDistribution";
import { RarityBreakdown } from "./RarityBreakdown";
import type { ExtendedTraitCategory } from "./types";

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

  const getTotalTraits = () => {
    return analytics.categories.reduce(
      (acc, cat) => acc + cat.traits.length,
      0
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-border dark:border-white/10 p-6 sm:p-8">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Rarity Analytics
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Explore trait distributions, rarity scores, and unique combinations
            across the entire MegaETH collection. Discover what makes each NFT
            special.
          </p>
        </div>
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)] dark:[mask-image:linear-gradient(0deg,transparent,white)]" />
      </div>

      {/* Stats Grid */}
      <StatsCards analytics={analytics} totalTraits={getTotalTraits()} />

      {/* Category Selection */}
      <CategorySelector
        categories={analytics.categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Selected Category Analysis */}
      {selectedCategoryData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TraitDistribution category={selectedCategoryData} />
          {selectedCategoryData.name !== "Merch" && (
            <RarityBreakdown category={selectedCategoryData} />
          )}
        </div>
      )}
    </div>
  );
}
