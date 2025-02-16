import { Card, CardContent } from "@/components/ui/Card";
import {
  calculateCategoryRarityDistribution,
  getRarityColor,
  getRarityGradient,
  type TraitCategory,
} from "@/utils/traitsAnalytics";

interface RarityBreakdownProps {
  category: TraitCategory;
}

export function RarityBreakdown({ category }: RarityBreakdownProps) {
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

  return (
    <Card className="h-fit bg-card dark:bg-transparent border border-border dark:border-white/10">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Rarity Breakdown
        </h3>

        <div className="space-y-3">
          {Object.entries(getRarityDistribution(category))
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
                      {((count / category.traits.length) * 100).toFixed(1)}%
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
                      width: `${(count / category.traits.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border dark:border-white/10">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Average Rarity</span>
              <span className="text-foreground font-medium">
                {(
                  category.traits.reduce(
                    (acc, trait) => acc + trait.rarity,
                    0
                  ) / category.traits.length
                ).toFixed(2)}
                %
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rarest Trait</span>
              <span className="text-foreground font-medium">
                {category.traits[0].value} (
                {category.traits[0].rarity.toFixed(2)}
                %)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
