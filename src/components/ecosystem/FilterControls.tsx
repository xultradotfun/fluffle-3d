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
  voteFilter: "all" | "voted" | "not_voted";
  setVoteFilter: (filter: "all" | "voted" | "not_voted") => void;
  categories: string[];
  getCategoryCount: (
    category: string,
    megaMafiaOnly?: boolean,
    nativeOnly?: boolean,
    voteFilter?: "all" | "voted" | "not_voted"
  ) => number;
  getMegaMafiaCount: () => number;
  getNativeCount: () => number;
  getTestnetCount: () => number;
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
  voteFilter,
  setVoteFilter,
  categories,
  getCategoryCount,
  getMegaMafiaCount,
  getNativeCount,
  getTestnetCount,
  getUserVotedCount,
  getUserNotVotedCount,
  totalProjects,
}: FilterControlsProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      {/* Project Type Group */}
      <div className="inline-flex flex-wrap gap-1.5 p-1 bg-white/80 dark:bg-white/[0.03] rounded-lg border border-gray-200/80 dark:border-white/[0.06] w-fit">
        <button
          onClick={() => {
            setShowMegaMafiaOnly(!showMegaMafiaOnly);
            setShowNativeOnly(false);
            setShowTestnetOnly(false);
          }}
          className={`group relative px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            showMegaMafiaOnly
              ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-sm"
              : "bg-gray-50 dark:bg-white/[0.04] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-200/80 dark:border-white/[0.06]"
          }`}
        >
          <div className="relative flex items-center justify-center sm:justify-start gap-2">
            <img
              src="/icons/logo-02.png"
              alt="MegaMafia"
              className={`w-4 h-4 object-contain ${
                showMegaMafiaOnly
                  ? "brightness-0 invert"
                  : "dark:invert opacity-75"
              }`}
            />
            <span>MegaMafia</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${
                showMegaMafiaOnly
                  ? "bg-white/20"
                  : "bg-black/5 dark:bg-white/10"
              }`}
            >
              {getMegaMafiaCount()}
            </span>
          </div>
        </button>

        <button
          onClick={() => {
            setShowNativeOnly(!showNativeOnly);
            setShowMegaMafiaOnly(false);
            setShowTestnetOnly(false);
          }}
          className={`group relative px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            showNativeOnly
              ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm"
              : "bg-gray-50 dark:bg-white/[0.04] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-200/80 dark:border-white/[0.06]"
          }`}
        >
          <div className="relative flex items-center justify-center sm:justify-start gap-2">
            <svg
              className={`w-4 h-4 ${
                showNativeOnly ? "text-white" : "text-emerald-500"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Native</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${
                showNativeOnly ? "bg-white/20" : "bg-black/5 dark:bg-white/10"
              }`}
            >
              {getNativeCount()}
            </span>
          </div>
        </button>

        <button
          onClick={() => {
            setShowTestnetOnly(!showTestnetOnly);
            setShowMegaMafiaOnly(false);
            setShowNativeOnly(false);
          }}
          className={`group relative px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            showTestnetOnly
              ? "bg-gradient-to-br from-yellow-500 to-amber-500 text-white shadow-sm"
              : "bg-gray-50 dark:bg-white/[0.04] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-200/80 dark:border-white/[0.06]"
          }`}
        >
          <div className="relative flex items-center justify-center sm:justify-start gap-2">
            <FlaskConical
              className={`w-4 h-4 ${
                showTestnetOnly ? "text-white" : "text-yellow-500"
              }`}
              strokeWidth={2}
            />
            <span>Live on Testnet</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${
                showTestnetOnly ? "bg-white/20" : "bg-black/5 dark:bg-white/10"
              }`}
            >
              {getTestnetCount()}
            </span>
          </div>
        </button>
      </div>

      {/* Vote Status Group */}
      <div className="inline-flex flex-wrap gap-1.5 p-1 bg-white/80 dark:bg-white/[0.03] rounded-lg border border-gray-200/80 dark:border-white/[0.06] w-fit">
        <button
          onClick={() =>
            setVoteFilter(voteFilter === "voted" ? "all" : "voted")
          }
          className={`group relative px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            voteFilter === "voted"
              ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm"
              : "bg-gray-50 dark:bg-white/[0.04] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-200/80 dark:border-white/[0.06]"
          }`}
        >
          <div className="relative flex items-center justify-center sm:justify-start gap-2">
            <svg
              className={`w-4 h-4 ${
                voteFilter === "voted" ? "text-white" : "text-blue-500"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Voted</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${
                voteFilter === "voted"
                  ? "bg-white/20"
                  : "bg-black/5 dark:bg-white/10"
              }`}
            >
              {getUserVotedCount()}
            </span>
          </div>
        </button>

        <button
          onClick={() =>
            setVoteFilter(voteFilter === "not_voted" ? "all" : "not_voted")
          }
          className={`group relative px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            voteFilter === "not_voted"
              ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-sm"
              : "bg-gray-50 dark:bg-white/[0.04] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-200/80 dark:border-white/[0.06]"
          }`}
        >
          <div className="relative flex items-center justify-center sm:justify-start gap-2">
            <svg
              className={`w-4 h-4 ${
                voteFilter === "not_voted" ? "text-white" : "text-orange-500"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11v6m0 0l-4-4m4 4l4-4M12 7V4"
              />
            </svg>
            <span>Not Voted</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${
                voteFilter === "not_voted"
                  ? "bg-white/20"
                  : "bg-black/5 dark:bg-white/10"
              }`}
            >
              {getUserNotVotedCount()}
            </span>
          </div>
        </button>
      </div>

      {/* Categories Group */}
      <div className="inline-flex flex-wrap gap-1.5 p-1 bg-white/80 dark:bg-white/[0.03] rounded-lg border border-gray-200/80 dark:border-white/[0.06] w-fit">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === category ? null : category
              )
            }
            className={`group relative px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              selectedCategory === category
                ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm"
                : "bg-gray-50 dark:bg-white/[0.04] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-200/80 dark:border-white/[0.06]"
            }`}
          >
            <div className="relative flex items-center justify-center sm:justify-start gap-2">
              <span>{category}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${
                  selectedCategory === category
                    ? "bg-white/20"
                    : "bg-black/5 dark:bg-white/10"
                }`}
              >
                {getCategoryCount(
                  category,
                  showMegaMafiaOnly,
                  showNativeOnly,
                  voteFilter
                )}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
