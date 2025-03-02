import { cn } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";
import * as Tooltip from "@radix-ui/react-tooltip";

interface SortSelectorProps {
  sortMethod: {
    type: "alphabetical" | "score";
    direction: "asc" | "desc";
  };
  onSortChange: (method: {
    type: "alphabetical" | "score";
    direction: "asc" | "desc";
  }) => void;
}

export function SortSelector({ sortMethod, onSortChange }: SortSelectorProps) {
  const handleSortClick = (type: "alphabetical" | "score") => {
    if (sortMethod.type === type) {
      // Toggle direction if same type
      onSortChange({
        type,
        direction: sortMethod.direction === "asc" ? "desc" : "asc",
      });
    } else {
      // Set default direction for new type
      onSortChange({
        type,
        direction: type === "alphabetical" ? "asc" : "desc",
      });
    }
  };

  return (
    <Tooltip.Provider delayDuration={300} skipDelayDuration={0}>
      <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
        <button
          onClick={() => handleSortClick("alphabetical")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
            sortMethod.type === "alphabetical"
              ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/10 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
          )}
        >
          <svg
            className={cn(
              "w-4 h-4 transition-transform",
              sortMethod.type === "alphabetical" &&
                sortMethod.direction === "desc" &&
                "rotate-180"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          <span>A-Z</span>
        </button>

        <button
          onClick={() => handleSortClick("score")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
            sortMethod.type === "score"
              ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/10 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
          )}
        >
          <svg
            className={cn(
              "w-4 h-4 transition-transform",
              sortMethod.type === "score" &&
                sortMethod.direction === "asc" &&
                "rotate-180"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <span>Score</span>
        </button>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 touch-manipulation p-1"
              aria-label="Learn more about score sorting"
              onClick={(e) => e.preventDefault()}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16V12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8H12.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="top"
              align="center"
              sideOffset={5}
              className="z-50 max-w-[320px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-5 py-4 rounded-xl text-sm text-gray-900 dark:text-gray-100 shadow-xl border border-gray-200/50 dark:border-white/[0.08] select-none touch-manipulation"
              avoidCollisions={true}
              collisionPadding={16}
              sticky="partial"
              onPointerDownOutside={(e) => e.preventDefault()}
            >
              <p className="font-medium text-base text-gray-900 dark:text-white">
                Score Sorting
              </p>
              <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">
                All votes are shown in counts, but MiniETH votes are excluded
                from sorting to prioritize higher-tier roles.
              </p>
              <Tooltip.Arrow className="fill-white/95 dark:fill-gray-900/95" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
    </Tooltip.Provider>
  );
}
