import { FlaskConical } from "lucide-react";
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
  showGuideOnly: boolean;
  setShowGuideOnly: (show: boolean) => void;
  voteFilter: VoteFilter;
  setVoteFilter: (filter: VoteFilter) => void;
  categories: string[];
  getCategoryCount: (category: string) => number;
  getMegaMafiaCount: () => number;
  getNativeCount: () => number;
  getLiveCount: () => number;
  getGuideCount: () => number;
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
  showGuideOnly,
  setShowGuideOnly,
  voteFilter,
  setVoteFilter,
  categories,
  getCategoryCount,
  getMegaMafiaCount,
  getNativeCount,
  getLiveCount,
  getGuideCount,
  getUserVotedCount,
  getUserNotVotedCount,
  totalProjects,
}: FilterControlsProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Project Type Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setShowMegaMafiaOnly(!showMegaMafiaOnly);
            setShowNativeOnly(false);
            setShowLiveOnly(false);
            setShowGuideOnly(false);
          }}
          className={`px-4 py-2 border-3 border-foreground font-bold uppercase text-xs ${
            showMegaMafiaOnly
              ? "bg-pink text-foreground"
              : "bg-[#e0e0e0] hover:bg-pink hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <img
              src="/icons/logo-02.png"
              alt="MegaMafia"
              className="w-4 h-4 object-contain brightness-0"
            />
            <span>MEGAMAFIA</span>
            <span className="font-black font-data">({getMegaMafiaCount()})</span>
          </div>
        </button>

        <button
          onClick={() => {
            setShowNativeOnly(!showNativeOnly);
            setShowMegaMafiaOnly(false);
            setShowLiveOnly(false);
            setShowGuideOnly(false);
          }}
          className={`px-4 py-2 border-3 border-foreground font-bold uppercase text-xs ${
            showNativeOnly
              ? "bg-green text-background"
              : "bg-[#e0e0e0] hover:bg-green hover:text-background"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>NATIVE</span>
            <span className="font-black font-data">({getNativeCount()})</span>
          </div>
        </button>

        <button
          onClick={() => {
            setShowLiveOnly(!showLiveOnly);
            setShowMegaMafiaOnly(false);
            setShowNativeOnly(false);
            setShowGuideOnly(false);
          }}
          className={`px-4 py-2 border-3 border-foreground font-bold uppercase text-xs ${
            showLiveOnly
              ? "bg-green text-background"
              : "bg-[#e0e0e0] hover:bg-green hover:text-background"
          }`}
        >
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4" strokeWidth={3} />
            <span>LIVE</span>
            <span className="font-black font-data">({getLiveCount()})</span>
          </div>
        </button>
      </div>

      {/* Vote Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setVoteFilter("all")}
          className={`px-4 py-2 border-3 border-foreground font-bold uppercase text-xs ${
            voteFilter === "all"
              ? "bg-foreground text-background"
              : "bg-[#e0e0e0] hover:bg-foreground hover:text-background"
          }`}
        >
          ALL <span className="font-black font-data">({totalProjects})</span>
        </button>

        <button
          onClick={() => setVoteFilter("voted")}
          className={`px-4 py-2 border-3 border-foreground font-bold uppercase text-xs ${
            voteFilter === "voted"
              ? "bg-foreground text-background"
              : "bg-[#e0e0e0] hover:bg-foreground hover:text-background"
          }`}
        >
          VOTED <span className="font-black font-data">({getUserVotedCount()})</span>
        </button>

        <button
          onClick={() => setVoteFilter("not_voted")}
          className={`px-4 py-2 border-3 border-foreground font-bold uppercase text-xs ${
            voteFilter === "not_voted"
              ? "bg-foreground text-background"
              : "bg-[#e0e0e0] hover:bg-foreground hover:text-background"
          }`}
        >
          NOT VOTED <span className="font-black font-data">({getUserNotVotedCount()})</span>
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 border-3 border-foreground font-bold uppercase text-xs ${
            selectedCategory === null
              ? "bg-foreground text-background"
              : "bg-[#e0e0e0] hover:bg-foreground hover:text-background"
          }`}
        >
          ALL CATEGORIES <span className="font-black font-data">({totalProjects})</span>
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() =>
              setSelectedCategory(selectedCategory === category ? null : category)
            }
            className={`px-4 py-2 border-3 border-foreground font-bold uppercase text-xs ${
              selectedCategory === category
                ? "bg-foreground text-background"
                : "bg-[#e0e0e0] hover:bg-foreground hover:text-background"
            }`}
          >
            {category} <span className="font-black font-data">({getCategoryCount(category)})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
