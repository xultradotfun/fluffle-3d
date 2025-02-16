import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { calculateTraitRarity, getRarityColor } from "@/utils/traitsAnalytics";
import type { ExtendedTraitCategory, ExtendedTraitMetadata } from "./types";

interface TraitDistributionProps {
  category: ExtendedTraitCategory;
}

export function TraitDistribution({ category }: TraitDistributionProps) {
  // Helper function to check if a category should show image previews
  const shouldShowImagePreview = (categoryName: string) => {
    return ["Ear", "Face", "Head"].includes(categoryName);
  };

  return (
    <Card className="lg:col-span-2 bg-card dark:bg-transparent border border-border dark:border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {category.name} Distribution
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {category.name === "Tribe"
                ? `Optional item with 2 clothing variations per tribe`
                : category.isOptionalItem
                ? "Optional item with variations"
                : "Required trait with variants"}
            </p>
          </div>
          <Badge variant="secondary">
            {category.traits.length}{" "}
            {category.isOptionalItem ? "variations" : "traits"}
          </Badge>
        </div>

        <div className="space-y-4">
          {(category.traits as ExtendedTraitMetadata[]).map((trait) => {
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
                    shouldShowImagePreview(category.name) &&
                    trait.trait_number !== undefined && (
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-white dark:from-black/40 dark:to-black/60 ring-1 ring-border dark:ring-white/10 group-hover:ring-blue-500/20 transition-all flex-shrink-0">
                        <img
                          src={`https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/${category.name.toLowerCase()}/${
                            trait.trait_number
                          }.png`}
                          alt={`${trait.value} preview`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-2 left-2">
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
                          isNoItem ? "text-muted-foreground" : "text-foreground"
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

                    {/* Tribe Outfit Variations */}
                    {category.name === "Tribe" &&
                      !isNoItem &&
                      trait.outfits && (
                        <div className="mt-4 pt-4 border-t border-border/50 dark:border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">
                              Outfit Variations
                            </span>
                            <Badge variant="secondary" size="sm">
                              {Object.keys(trait.outfits).length} variants
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(trait.outfits).map(
                              ([outfitNumber, count]) => {
                                const percentage = (
                                  (count / trait.count) *
                                  100
                                ).toFixed(1);
                                return (
                                  <div
                                    key={outfitNumber}
                                    className="group/outfit relative p-2 rounded-lg bg-accent/50 dark:bg-white/5 hover:bg-accent dark:hover:bg-white/[0.08] transition-all"
                                  >
                                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-white dark:from-black/40 dark:to-black/60 ring-1 ring-border dark:ring-white/10 group-hover/outfit:ring-blue-500/20 transition-all flex-shrink-0">
                                        <img
                                          src={`https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/clothes/${outfitNumber}.png`}
                                          alt={`${trait.value} outfit ${outfitNumber}`}
                                          className="w-full h-full object-cover transition-transform duration-500 group-hover/outfit:scale-110"
                                          onError={(e) => {
                                            (
                                              e.target as HTMLImageElement
                                            ).style.display = "none";
                                          }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                                      </div>
                                      <div className="flex-1 min-w-0 text-center sm:text-left">
                                        <span className="text-sm text-muted-foreground">
                                          Outfit #{outfitNumber}
                                        </span>
                                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-0.5">
                                          <span className="text-sm font-medium text-foreground">
                                            {count.toLocaleString()} NFTs
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            {percentage}%
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
