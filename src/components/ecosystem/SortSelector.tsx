import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useState } from "react";

interface SortSelectorProps {
  sortMethod: {
    type: "alphabetical" | "score" | "latest";
    direction: "asc" | "desc";
  };
  onSortChange: (method: {
    type: "alphabetical" | "score" | "latest";
    direction: "asc" | "desc";
  }) => void;
}

export function SortSelector({ sortMethod, onSortChange }: SortSelectorProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleSortClick = (type: "alphabetical" | "score" | "latest") => {
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
        direction: type === "alphabetical" ? "asc" : "desc", // "latest" defaults to "desc" (newest first)
      });
    }
  };

  return (
    <Tooltip.Provider delayDuration={300} skipDelayDuration={0}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Sort by:
        </span>
        <div className="flex rounded-lg border border-gray-200/80 dark:border-white/[0.06] bg-white/80 dark:bg-white/[0.03] p-0.5">
          <button
            onClick={() => handleSortClick("score")}
            className={`relative px-2.5 py-1 rounded text-sm font-medium transition-all ${
              sortMethod.type === "score"
                ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center gap-1.5">
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
            </div>
          </button>

          <button
            onClick={() => handleSortClick("alphabetical")}
            className={`relative px-2.5 py-1 rounded text-sm font-medium transition-all ${
              sortMethod.type === "alphabetical"
                ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center gap-1.5">
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
            </div>
          </button>

          <button
            onClick={() => handleSortClick("latest")}
            className={`relative px-2.5 py-1 rounded text-sm font-medium transition-all ${
              sortMethod.type === "latest"
                ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <svg
                className={cn(
                  "w-4 h-4 transition-transform",
                  sortMethod.type === "latest" &&
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Latest</span>
            </div>
          </button>
        </div>

        <Tooltip.Root open={tooltipOpen} onOpenChange={setTooltipOpen}>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.08] rounded transition-all touch-manipulation"
              aria-label="Learn more about score sorting"
              onClick={() => setTooltipOpen(true)}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16V12"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8H12.01"
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
              className="z-50 max-w-[320px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-4 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-300 shadow-lg border border-gray-200/50 dark:border-white/[0.08] select-none touch-none"
              avoidCollisions={true}
              collisionPadding={16}
              sticky="partial"
              onPointerDownOutside={() => setTooltipOpen(false)}
              onEscapeKeyDown={() => setTooltipOpen(false)}
            >
              <div className="space-y-2">
                <p className="leading-relaxed">
                  <strong>Score:</strong> All votes are shown in counts, but
                  MiniETH votes are excluded from sorting to prioritize
                  higher-tier roles.
                </p>
                <p className="leading-relaxed">
                  <strong>A-Z:</strong> Alphabetical sorting by project name.
                </p>
                <p className="leading-relaxed">
                  <strong>Latest:</strong> Shows most recently added projects
                  first.
                </p>
              </div>
              <Tooltip.Arrow className="fill-white/95 dark:fill-gray-900/95" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
    </Tooltip.Provider>
  );
}
