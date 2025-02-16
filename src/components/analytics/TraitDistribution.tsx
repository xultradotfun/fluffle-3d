import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { calculateTraitRarity, getRarityColor } from "@/utils/traitsAnalytics";
import type { ExtendedTraitCategory } from "./types";

interface TraitDistributionProps {
  category: ExtendedTraitCategory;
}

export function TraitDistribution({ category }: TraitDistributionProps) {
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
                ? `Optional item with ${category.clothesVariants} clothing variations`
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
          {category.traits.map((trait) => {
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
                    category.name !== "Tribe" &&
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tribe Clothes Distribution */}
        {category.name === "Tribe" && category.clothesDistribution && (
          <div className="mt-8 pt-8 border-t border-border dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-foreground">
                Clothing Variations
              </h4>
              <Badge variant="secondary">
                {Object.keys(category.clothesDistribution).length} variants
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(category.clothesDistribution)
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
  );
}
