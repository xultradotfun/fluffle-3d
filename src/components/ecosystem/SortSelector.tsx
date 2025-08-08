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
      <div className="flex items-center gap-4">
        <span className="font-medium uppercase tracking-wide text-sm">
          Sort:
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => handleSortClick("score")}
            className={`px-4 py-2 font-bold uppercase tracking-wide text-sm transition-all border-2 ${
              sortMethod.type === "score"
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            Score {sortMethod.type === "score" && (sortMethod.direction === "desc" ? "↓" : "↑")}
          </button>

          <button
            onClick={() => handleSortClick("alphabetical")}
            className={`px-4 py-2 font-bold uppercase tracking-wide text-sm transition-all border-2 ${
              sortMethod.type === "alphabetical"
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            A-Z {sortMethod.type === "alphabetical" && (sortMethod.direction === "asc" ? "↓" : "↑")}
          </button>

          <button
            onClick={() => handleSortClick("latest")}
            className={`px-4 py-2 font-bold uppercase tracking-wide text-sm transition-all border-2 ${
              sortMethod.type === "latest"
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            Latest {sortMethod.type === "latest" && (sortMethod.direction === "desc" ? "↓" : "↑")}
          </button>
        </div>

        <Tooltip.Root open={tooltipOpen} onOpenChange={setTooltipOpen}>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              className="p-2 bg-background border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-all touch-manipulation"
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
              className="z-50 max-w-[320px] bg-background border-2 border-foreground px-4 py-3 text-sm text-foreground select-none touch-none"
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
              <Tooltip.Arrow className="fill-background" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
    </Tooltip.Provider>
  );
}
