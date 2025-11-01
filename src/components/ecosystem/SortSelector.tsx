import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useState } from "react";
import type { SortMethod, SortType } from "@/types/ecosystem";

interface SortSelectorProps {
  sortMethod: SortMethod;
  onSortChange: (method: SortMethod) => void;
}

export function SortSelector({ sortMethod, onSortChange }: SortSelectorProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleSortClick = (type: SortType) => {
    if (sortMethod.type === type) {
      // Toggle direction
      onSortChange({
        type,
        direction: sortMethod.direction === "asc" ? "desc" : "asc",
      });
    } else {
      // Set default direction
      onSortChange({
        type,
        direction: type === "alphabetical" ? "asc" : "desc",
      });
    }
  };

  return (
    <Tooltip.Provider delayDuration={300} skipDelayDuration={0}>
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold uppercase">SORT:</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleSortClick("score")}
            className={`px-4 py-2 border-3 border-foreground font-bold uppercase text-xs ${
              sortMethod.type === "score"
                ? "bg-pink text-foreground"
                : "bg-[#e0e0e0] hover:bg-pink hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <svg
                className={cn(
                  "w-4 h-4",
                  sortMethod.type === "score" &&
                    sortMethod.direction === "asc" &&
                    "rotate-180"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <span>SCORE</span>
            </div>
          </button>

          <button
            onClick={() => handleSortClick("alphabetical")}
            className={`px-4 py-2 border-3 border-foreground font-bold uppercase text-xs ${
              sortMethod.type === "alphabetical"
                ? "bg-pink text-foreground"
                : "bg-[#e0e0e0] hover:bg-pink hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <svg
                className={cn(
                  "w-4 h-4",
                  sortMethod.type === "alphabetical" &&
                    sortMethod.direction === "desc" &&
                    "rotate-180"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              <span>A-Z</span>
            </div>
          </button>

          <button
            onClick={() => handleSortClick("latest")}
            className={`px-4 py-2 border-3 border-foreground font-bold uppercase text-xs ${
              sortMethod.type === "latest"
                ? "bg-pink text-foreground"
                : "bg-[#e0e0e0] hover:bg-pink hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <svg
                className={cn(
                  "w-4 h-4",
                  sortMethod.type === "latest" &&
                    sortMethod.direction === "asc" &&
                    "rotate-180"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>LATEST</span>
            </div>
          </button>
        </div>

        <Tooltip.Root open={tooltipOpen} onOpenChange={setTooltipOpen}>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              className="p-2 border-3 border-foreground bg-[#e0e0e0] hover:bg-pink"
              onClick={() => setTooltipOpen(true)}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="top"
              align="center"
              sideOffset={8}
              className="z-50 max-w-[320px] bg-[#e0e0e0] border-3 border-foreground p-4"
              onPointerDownOutside={() => setTooltipOpen(false)}
              onEscapeKeyDown={() => setTooltipOpen(false)}
            >
              <div className="space-y-3">
                <div className="border-b-2 border-foreground pb-2">
                  <strong className="font-black uppercase text-xs">SCORE:</strong>
                  <p className="mt-1 text-xs font-bold">
                    ALL VOTES SHOWN, MINIETH EXCLUDED FROM SORTING
                  </p>
                </div>
                <div className="border-b-2 border-foreground pb-2">
                  <strong className="font-black uppercase text-xs">A-Z:</strong>
                  <p className="mt-1 text-xs font-bold">
                    ALPHABETICAL BY PROJECT NAME
                  </p>
                </div>
                <div>
                  <strong className="font-black uppercase text-xs">LATEST:</strong>
                  <p className="mt-1 text-xs font-bold">
                    MOST RECENTLY ADDED FIRST
                  </p>
                </div>
              </div>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
    </Tooltip.Provider>
  );
}
