import { Card, CardContent } from "@/components/ui/Card";
import type { TraitsAnalytics } from "@/utils/traitsAnalytics";

interface StatsCardsProps {
  analytics: TraitsAnalytics;
  totalTraits: number;
}

export function StatsCards({ analytics, totalTraits }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      <Card className="bg-card dark:bg-gradient-to-br dark:from-blue-500/10 dark:to-purple-500/10 border border-border dark:border-white/10">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                Total NFTs
              </p>
              <p className="text-lg sm:text-2xl font-bold text-foreground mt-0.5 sm:mt-1">
                {analytics.totalNFTs.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400"
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
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                Categories
              </p>
              <p className="text-lg sm:text-2xl font-bold text-foreground mt-0.5 sm:mt-1">
                {analytics.categories.length}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400"
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
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                Total Traits
              </p>
              <p className="text-lg sm:text-2xl font-bold text-foreground mt-0.5 sm:mt-1">
                {totalTraits}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400"
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
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                Optional Items
              </p>
              <p className="text-lg sm:text-2xl font-bold text-foreground mt-0.5 sm:mt-1">
                {
                  analytics.categories.filter((cat) => cat.isOptionalItem)
                    .length
                }
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 hidden sm:block">
                Ear, Face, Head
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400"
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
  );
}
