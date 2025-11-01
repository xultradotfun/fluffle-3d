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
    <Tooltip.Provider delayDuration={100} skipDelayDuration={0}>
      {/* Outer wrapper with clip-path */}
      <div
        style={{
          clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
        }}
      >
        {/* Middle layer - border */}
        <div
          style={{
            backgroundColor: "#19191a",
            padding: "2px",
          }}
        >
          {/* Inner content layer */}
          <div
            className="flex items-center gap-3 px-4 py-3 bg-card-foreground"
            style={{
              clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            }}
          >
            <span className="text-sm font-black uppercase" style={{ color: "#dfd9d9" }}>SORT:</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleSortClick("score")}
                className={`px-3 py-1.5 border-2 font-black uppercase text-xs transition-colors ${
                  sortMethod.type === "score"
                    ? "bg-pink text-foreground border-foreground"
                    : "bg-transparent border-background hover:bg-muted"
                }`}
                style={sortMethod.type === "score" ? {} : { color: "#dfd9d9" }}
              >
                SCORE
                {sortMethod.type === "score" && (
                  <span className="ml-1">{sortMethod.direction === "desc" ? "↓" : "↑"}</span>
                )}
              </button>

              <button
                onClick={() => handleSortClick("alphabetical")}
                className={`px-3 py-1.5 border-2 font-black uppercase text-xs transition-colors ${
                  sortMethod.type === "alphabetical"
                    ? "bg-pink text-foreground border-foreground"
                    : "bg-transparent border-background hover:bg-muted"
                }`}
                style={sortMethod.type === "alphabetical" ? {} : { color: "#dfd9d9" }}
              >
                A-Z
                {sortMethod.type === "alphabetical" && (
                  <span className="ml-1">{sortMethod.direction === "asc" ? "↓" : "↑"}</span>
                )}
              </button>

              <button
                onClick={() => handleSortClick("latest")}
                className={`px-3 py-1.5 border-2 font-black uppercase text-xs transition-colors ${
                  sortMethod.type === "latest"
                    ? "bg-pink text-foreground border-foreground"
                    : "bg-transparent border-background hover:bg-muted"
                }`}
                style={sortMethod.type === "latest" ? {} : { color: "#dfd9d9" }}
              >
                LATEST
                {sortMethod.type === "latest" && (
                  <span className="ml-1">{sortMethod.direction === "desc" ? "↓" : "↑"}</span>
                )}
              </button>
            </div>

            <Tooltip.Root open={tooltipOpen} onOpenChange={setTooltipOpen}>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  className="p-1.5 border-2 border-background bg-transparent hover:bg-muted transition-colors"
                  style={{ color: "#dfd9d9" }}
                  onClick={() => setTooltipOpen(true)}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="top"
                  align="center"
                  sideOffset={8}
                  className="z-50"
                  onPointerDownOutside={() => setTooltipOpen(false)}
                  onEscapeKeyDown={() => setTooltipOpen(false)}
                  style={{
                    clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#19191a",
                      padding: "2px",
                    }}
                  >
                    <div
                      className="max-w-[320px] bg-[#e0e0e0] p-4"
                      style={{
                        clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                      }}
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
                    </div>
                  </div>
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
