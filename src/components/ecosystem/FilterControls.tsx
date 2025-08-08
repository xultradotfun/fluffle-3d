import { FlaskConical } from "lucide-react";

interface FilterControlsProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  showMegaMafiaOnly: boolean;
  setShowMegaMafiaOnly: (show: boolean) => void;
  showNativeOnly: boolean;
  setShowNativeOnly: (show: boolean) => void;
  showTestnetOnly: boolean;
  setShowTestnetOnly: (show: boolean) => void;
  showGuideOnly: boolean;
  setShowGuideOnly: (show: boolean) => void;
  voteFilter: "all" | "voted" | "not_voted";
  setVoteFilter: (filter: "all" | "voted" | "not_voted") => void;
  categories: string[];
  getCategoryCount: (
    category: string,
    megaMafiaOnly?: boolean,
    nativeOnly?: boolean,
    testnetOnly?: boolean,
    showGuideOnly?: boolean,
    voteFilter?: "all" | "voted" | "not_voted"
  ) => number;
  getMegaMafiaCount: () => number;
  getNativeCount: () => number;
  getTestnetCount: () => number;
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
  showTestnetOnly,
  setShowTestnetOnly,
  showGuideOnly,
  setShowGuideOnly,
  voteFilter,
  setVoteFilter,
  categories,
  getCategoryCount,
  getMegaMafiaCount,
  getNativeCount,
  getTestnetCount,
  getGuideCount,
  getUserVotedCount,
  getUserNotVotedCount,
  totalProjects,
}: FilterControlsProps) {
  return (
    <div className="space-y-6">
      {/* Project Type Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-black uppercase tracking-wide text-foreground/70">
          PROJECT TYPE
        </h4>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setShowMegaMafiaOnly(!showMegaMafiaOnly);
              setShowNativeOnly(false);
              setShowTestnetOnly(false);
              setShowGuideOnly(false);
            }}
            className={`px-4 py-2 font-bold uppercase tracking-wide text-sm transition-all border-2 ${
              showMegaMafiaOnly
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            MEGA MAFIA ({getMegaMafiaCount()})
          </button>

          <button
            onClick={() => {
              setShowNativeOnly(!showNativeOnly);
              setShowMegaMafiaOnly(false);
              setShowTestnetOnly(false);
              setShowGuideOnly(false);
            }}
            className={`px-4 py-2 font-bold uppercase tracking-wide text-sm transition-all border-2 ${
              showNativeOnly
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            NATIVE ({getNativeCount()})
          </button>

          <button
            onClick={() => {
              setShowTestnetOnly(!showTestnetOnly);
              setShowMegaMafiaOnly(false);
              setShowNativeOnly(false);
              setShowGuideOnly(false);
            }}
            className={`px-4 py-2 font-bold uppercase tracking-wide text-sm transition-all border-2 ${
              showTestnetOnly
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            TESTNET ({getTestnetCount()})
          </button>

          <button
            onClick={() => {
              setShowGuideOnly(!showGuideOnly);
              setShowMegaMafiaOnly(false);
              setShowNativeOnly(false);
              setShowTestnetOnly(false);
            }}
            className={`px-4 py-2 font-bold uppercase tracking-wide text-sm transition-all border-2 ${
              showGuideOnly
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            HAS GUIDE ({getGuideCount()})
          </button>
        </div>
      </div>

      {/* Vote Status Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-black uppercase tracking-wide text-foreground/70">
          VOTE STATUS
        </h4>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() =>
              setVoteFilter(voteFilter === "voted" ? "all" : "voted")
            }
            className={`px-4 py-2 font-bold uppercase tracking-wide text-sm transition-all border-2 ${
              voteFilter === "voted"
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            VOTED ({getUserVotedCount()})
          </button>

          <button
            onClick={() =>
              setVoteFilter(voteFilter === "not_voted" ? "all" : "not_voted")
            }
            className={`px-4 py-2 font-bold uppercase tracking-wide text-sm transition-all border-2 ${
              voteFilter === "not_voted"
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            NOT VOTED ({getUserNotVotedCount()})
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-black uppercase tracking-wide text-foreground/70">
          CATEGORIES
        </h4>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category ? null : category
                )
              }
              className={`px-4 py-2 font-bold uppercase tracking-wide text-sm transition-all border-2 ${
                selectedCategory === category
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-foreground border-foreground hover:bg-foreground hover:text-background"
              }`}
            >
              {category} ({getCategoryCount(
                category,
                showMegaMafiaOnly,
                showNativeOnly,
                showTestnetOnly,
                showGuideOnly,
                voteFilter
              )})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
