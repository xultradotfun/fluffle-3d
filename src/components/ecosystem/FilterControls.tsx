import { FlaskConical, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { VoteFilter } from "@/types/ecosystem";

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
      {/* Outer wrapper with clip-path */}
      <div
        style={{
          clipPath:
            "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
        }}
      >
        {/* Middle border layer */}
        <div style={{ backgroundColor: "#19191a", padding: "2px" }}>
          {/* Inner content layer */}
          <div
            className="bg-card-foreground p-4"
            style={{
              clipPath:
                "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
            }}
          >
            <div className="flex flex-col gap-3">
              {/* Main filters row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-black uppercase text-xs mr-2" style={{ color: "#dfd9d9" }}>
                  FILTERS {activeFiltersCount > 0 && `(${activeFiltersCount})`}:
                </span>

                {/* Quick filters */}
        <button
          onClick={() => {
            setShowMegaMafiaOnly(!showMegaMafiaOnly);
            setShowNativeOnly(false);
                    setShowLiveOnly(false);
          }}
                  className={`px-3 py-1.5 border-3 font-bold uppercase text-xs transition-colors ${
            showMegaMafiaOnly
                      ? "bg-pink border-foreground"
                      : "bg-transparent border-background hover:bg-muted"
          }`}
                  style={{
                    color: showMegaMafiaOnly ? "#19191a" : "#dfd9d9",
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}
        >
                  <div className="flex items-center gap-1.5">
            <img
                      src="/ui/pixelmafia.png"
              alt="MegaMafia"
                      className="w-4 h-4 object-contain"
                      style={{
                        filter: showMegaMafiaOnly ? 'brightness(0)' : 'brightness(0) invert(1)',
                      }}
            />
                    <span>MAFIA</span>
                    <span className="font-black font-data">({getMegaMafiaCount()})</span>
          </div>
        </button>

        <button
          onClick={() => {
            setShowNativeOnly(!showNativeOnly);
            setShowMegaMafiaOnly(false);
                    setShowLiveOnly(false);
          }}
                  className={`px-3 py-1.5 border-3 font-bold uppercase text-xs transition-colors ${
            showNativeOnly
                      ? "bg-pink border-foreground"
                      : "bg-transparent border-background hover:bg-muted"
          }`}
                  style={{
                    color: showNativeOnly ? "#19191a" : "#dfd9d9",
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span>OMEGA</span>
                    <span className="font-black font-data">({getNativeCount()})</span>
          </div>
        </button>

        <button
          onClick={() => {
                    setShowLiveOnly(!showLiveOnly);
            setShowMegaMafiaOnly(false);
            setShowNativeOnly(false);
          }}
                  className={`px-3 py-1.5 border-3 font-bold uppercase text-xs transition-colors ${
                    showLiveOnly
                      ? "bg-pink border-foreground"
                      : "bg-transparent border-background hover:bg-muted"
                  }`}
                  style={{
                    color: showLiveOnly ? "#19191a" : "#dfd9d9",
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}
        >
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="8" />
                    </svg>
                    <span>LIVE</span>
                    <span className="font-black font-data">({getLiveCount()})</span>
          </div>
        </button>

                <div className="w-px h-8 bg-background mx-2" />

                {/* Vote filters */}
        <button
                  onClick={() => setVoteFilter("all")}
                  className={`px-3 py-1.5 border-3 font-bold uppercase text-xs transition-colors ${
                    voteFilter === "all"
                      ? "bg-pink border-foreground"
                      : "bg-transparent border-background hover:bg-muted"
                  }`}
                  style={{
                    color: voteFilter === "all" ? "#19191a" : "#dfd9d9",
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}
        >
                  ALL <span className="font-black font-data">({totalProjects})</span>
                </button>

                <button
                  onClick={() => setVoteFilter("voted")}
                  className={`px-3 py-1.5 border-3 font-bold uppercase text-xs transition-colors ${
                    voteFilter === "voted"
                      ? "bg-pink border-foreground"
                      : "bg-transparent border-background hover:bg-muted"
                  }`}
                  style={{
                    color: voteFilter === "voted" ? "#19191a" : "#dfd9d9",
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}
                >
                  VOTED <span className="font-black font-data">({getUserVotedCount()})</span>
                </button>

                <button
                  onClick={() => setVoteFilter("not_voted")}
                  className={`px-3 py-1.5 border-3 font-bold uppercase text-xs transition-colors ${
                    voteFilter === "not_voted"
                      ? "bg-pink border-foreground"
                      : "bg-transparent border-background hover:bg-muted"
                  }`}
                  style={{
                    color: voteFilter === "not_voted" ? "#19191a" : "#dfd9d9",
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}
            >
                  NOT VOTED <span className="font-black font-data">({getUserNotVotedCount()})</span>
        </button>

                <div className="w-px h-6 bg-background mx-1" />

                {/* Category toggle */}
        <button
                  onClick={() => setShowCategories(!showCategories)}
                  className={`px-3 py-1.5 border-3 font-bold uppercase text-xs transition-colors ${
                    selectedCategory !== null
                      ? "bg-pink border-foreground"
                      : "bg-transparent border-background hover:bg-muted"
                  }`}
                  style={{
                    color: selectedCategory !== null ? "#19191a" : "#dfd9d9",
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}
        >
                  <div className="flex items-center gap-1.5">
                    <span>{selectedCategory || "CATEGORY"}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        showCategories ? "rotate-180" : ""
              }`}
                      strokeWidth={3}
                    />
          </div>
        </button>

                {/* Clear all filters */}
                {activeFiltersCount > 0 && (
        <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setShowMegaMafiaOnly(false);
                      setShowNativeOnly(false);
                      setShowLiveOnly(false);
                      setVoteFilter("all");
                    }}
                    className="px-3 py-1.5 border-3 border-red bg-transparent hover:bg-red hover:text-background font-bold uppercase text-xs transition-colors"
                    style={{ 
                      color: "#dfd9d9",
                      clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                    }}
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Categories dropdown */}
              {showCategories && (
              <div className="flex flex-wrap gap-2 pt-3 border-t-2 border-background/30 transition-all"
              >
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setShowCategories(false);
                  }}
                  className={`px-3 py-1.5 border-3 font-bold uppercase text-xs transition-colors ${
                    selectedCategory === null
                      ? "bg-pink border-foreground"
                      : "bg-transparent border-background hover:bg-muted"
              }`}
                  style={{
                    color: selectedCategory === null ? "#19191a" : "#dfd9d9",
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}
                >
                  ALL <span className="font-black font-data">({totalProjects})</span>
        </button>

        {categories.map((category) => (
          <button
            key={category}
                      onClick={() => {
                        setSelectedCategory(selectedCategory === category ? null : category);
                        setShowCategories(false);
                      }}
                      className={`px-3 py-1.5 border-3 font-bold uppercase text-xs transition-colors ${
              selectedCategory === category
                          ? "bg-pink border-foreground"
                          : "bg-transparent border-background hover:bg-muted"
            }`}
                      style={{
                        color: selectedCategory === category ? "#19191a" : "#dfd9d9",
                        clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                      }}
                    >
                      {category} <span className="font-black font-data">({getCategoryCount(category)})</span>
                    </button>
                  ))}
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
