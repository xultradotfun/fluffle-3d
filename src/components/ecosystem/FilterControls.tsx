import { ChevronDown } from "lucide-react";
import { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import type { VoteFilter, SortMethod } from "@/types/ecosystem";
import { BorderedBox, getClipPath } from "@/components/ui/BorderedBox";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { colors } from "@/lib/colors";

interface FilterControlsProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  showMegaMafiaOnly: boolean;
  setShowMegaMafiaOnly: (show: boolean) => void;
  showNativeOnly: boolean;
  setShowNativeOnly: (show: boolean) => void;
  showLiveOnly: boolean;
  setShowLiveOnly: (show: boolean) => void;
  voteFilter: VoteFilter;
  setVoteFilter: (filter: VoteFilter) => void;
  categories: string[];
  getCategoryCount: (category: string) => number;
  getMegaMafiaCount: () => number;
  getNativeCount: () => number;
  getLiveCount: () => number;
  getUserVotedCount: () => number;
  getUserNotVotedCount: () => number;
  totalProjects: number;
  sortMethod: SortMethod;
  onSortChange: (method: SortMethod) => void;
}

// Reusable filter button component
interface FilterButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function FilterButton({ isActive, onClick, children }: FilterButtonProps) {
  return (
    <Button
      variant={isActive ? "brutalist-active" : "brutalist"}
      size="sm"
      cornerSize={6}
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-bold"
      style={{ color: isActive ? colors.foreground : colors.background }}
    >
      {children}
    </Button>
  );
}

export function FilterControls({
  selectedCategory,
  setSelectedCategory,
  showMegaMafiaOnly,
  setShowMegaMafiaOnly,
  showNativeOnly,
  setShowNativeOnly,
  showLiveOnly,
  setShowLiveOnly,
  voteFilter,
  setVoteFilter,
  categories,
  getCategoryCount,
  getMegaMafiaCount,
  getNativeCount,
  getLiveCount,
  getUserVotedCount,
  getUserNotVotedCount,
  totalProjects,
  sortMethod,
  onSortChange,
}: FilterControlsProps) {
  const [showCategories, setShowCategories] = useState(false);

  const activeFiltersCount =
    (showMegaMafiaOnly ? 1 : 0) +
    (showNativeOnly ? 1 : 0) +
    (showLiveOnly ? 1 : 0) +
    (voteFilter !== "all" ? 1 : 0) +
    (selectedCategory !== null ? 1 : 0);

  return (
    <div className="w-full">
      <BorderedBox cornerSize={12} borderColor="dark" className="bg-card-foreground p-4">
        <div className="flex flex-col gap-3">
          {/* Main filters row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-black uppercase text-xs mr-2" style={{ color: colors.background }}>
              FILTERS {activeFiltersCount > 0 && `(${activeFiltersCount})`}:
            </span>

            {/* Quick filters */}
            <FilterButton
              isActive={showMegaMafiaOnly}
              onClick={() => {
                setShowMegaMafiaOnly(!showMegaMafiaOnly);
                setShowNativeOnly(false);
                setShowLiveOnly(false);
              }}
            >
              <div className="flex items-center gap-1.5">
                <img
                  src="/ui/pixelmafia.png"
                  alt="MegaMafia"
                  className="w-4 h-4 object-contain"
                  style={{ filter: showMegaMafiaOnly ? 'brightness(0)' : 'brightness(0) invert(1)' }}
                />
                <span>MAFIA</span>
                <span className="font-black font-data">({getMegaMafiaCount()})</span>
              </div>
            </FilterButton>

            <FilterButton
              isActive={showNativeOnly}
              onClick={() => {
                setShowNativeOnly(!showNativeOnly);
                setShowMegaMafiaOnly(false);
                setShowLiveOnly(false);
              }}
            >
              <div className="flex items-center gap-1.5">
                <span>OMEGA</span>
                <span className="font-black font-data">({getNativeCount()})</span>
              </div>
            </FilterButton>

            <FilterButton
              isActive={showLiveOnly}
              onClick={() => {
                setShowLiveOnly(!showLiveOnly);
                setShowMegaMafiaOnly(false);
                setShowNativeOnly(false);
              }}
            >
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" />
                </svg>
                <span>LIVE</span>
                <span className="font-black font-data">({getLiveCount()})</span>
              </div>
            </FilterButton>

            <div className="w-px h-8 bg-background mx-2" />

            {/* Vote filters */}
            <FilterButton isActive={voteFilter === "all"} onClick={() => setVoteFilter("all")}>
              ALL <span className="font-black font-data">({totalProjects})</span>
            </FilterButton>

            <FilterButton isActive={voteFilter === "voted"} onClick={() => setVoteFilter("voted")}>
              VOTED <span className="font-black font-data">({getUserVotedCount()})</span>
            </FilterButton>

            <FilterButton isActive={voteFilter === "not_voted"} onClick={() => setVoteFilter("not_voted")}>
              NOT VOTED <span className="font-black font-data">({getUserNotVotedCount()})</span>
            </FilterButton>

            <div className="w-px h-6 bg-background mx-1" />

            {/* Category toggle */}
            <FilterButton
              isActive={selectedCategory !== null}
              onClick={() => setShowCategories(!showCategories)}
            >
              <div className="flex items-center gap-1.5">
                <span>{selectedCategory || "CATEGORY"}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${showCategories ? "rotate-180" : ""}`}
                  strokeWidth={3}
                />
              </div>
            </FilterButton>

            {/* Sort controls - desktop only */}
            <div className="hidden md:flex items-center gap-2 ml-auto">
              <span className="font-black uppercase text-xs" style={{ color: colors.background }}>
                SORT:
              </span>
              <FilterButton
                isActive={sortMethod.type === "score"}
                onClick={() => onSortChange({ type: "score", direction: sortMethod.type === "score" && sortMethod.direction === "desc" ? "asc" : "desc" })}
              >
                SCORE{sortMethod.type === "score" && (sortMethod.direction === "desc" ? "↓" : "↑")}
              </FilterButton>
              <FilterButton
                isActive={sortMethod.type === "alphabetical"}
                onClick={() => onSortChange({ type: "alphabetical", direction: sortMethod.type === "alphabetical" && sortMethod.direction === "asc" ? "desc" : "asc" })}
              >
                A-Z{sortMethod.type === "alphabetical" && (sortMethod.direction === "asc" ? "↓" : "↑")}
              </FilterButton>
              <FilterButton
                isActive={sortMethod.type === "latest"}
                onClick={() => onSortChange({ type: "latest", direction: sortMethod.type === "latest" && sortMethod.direction === "desc" ? "asc" : "desc" })}
              >
                LATEST{sortMethod.type === "latest" && (sortMethod.direction === "desc" ? "↓" : "↑")}
              </FilterButton>

              {/* Info tooltip */}
              <Tooltip.Provider delayDuration={100}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <IconButton variant="default" size="sm" cornerSize={3} className="w-6 h-6">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                      </svg>
                    </IconButton>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content side="top" align="center" sideOffset={8} className="z-50">
                      <BorderedBox cornerSize={8} variant="tooltip" style={{ color: colors.background }}>
                        <span className="font-bold uppercase text-xs">
                          Projects are sorted by weighted score based on role-based voting power. Click arrows to reverse order.
                        </span>
                      </BorderedBox>
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>

            {/* Clear all filters */}
            {activeFiltersCount > 0 && (
              <Button
                variant="brutalist"
                size="sm"
                cornerSize={6}
                onClick={() => {
                  setSelectedCategory(null);
                  setShowMegaMafiaOnly(false);
                  setShowNativeOnly(false);
                  setShowLiveOnly(false);
                  setVoteFilter("all");
                }}
                className="px-3 py-1.5 text-xs font-bold border-red hover:bg-red hover:text-background"
                style={{ color: colors.background }}
              >
                CLEAR
              </Button>
            )}
          </div>

          {/* Categories dropdown */}
          {showCategories && (
            <div className="flex flex-wrap gap-2 pt-3 border-t-2 border-background/30 transition-all">
              <FilterButton
                isActive={selectedCategory === null}
                onClick={() => {
                  setSelectedCategory(null);
                  setShowCategories(false);
                }}
              >
                ALL <span className="font-black font-data">({totalProjects})</span>
              </FilterButton>

              {categories.map((category) => (
                <FilterButton
                  key={category}
                  isActive={selectedCategory === category}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === category ? null : category);
                    setShowCategories(false);
                  }}
                >
                  {category} <span className="font-black font-data">({getCategoryCount(category)})</span>
                </FilterButton>
              ))}
            </div>
          )}
        </div>
      </BorderedBox>
    </div>
  );
}
