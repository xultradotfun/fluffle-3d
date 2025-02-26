interface FilterControlsProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  showMegaMafiaOnly: boolean;
  setShowMegaMafiaOnly: (show: boolean) => void;
  showNativeOnly: boolean;
  setShowNativeOnly: (show: boolean) => void;
  categories: string[];
  getCategoryCount: (category: string, megaMafiaOnly?: boolean) => number;
  getMegaMafiaCount: () => number;
  getNativeCount: () => number;
  totalProjects: number;
}

export function FilterControls({
  selectedCategory,
  setSelectedCategory,
  showMegaMafiaOnly,
  setShowMegaMafiaOnly,
  showNativeOnly,
  setShowNativeOnly,
  categories,
  getCategoryCount,
  getMegaMafiaCount,
  getNativeCount,
  totalProjects,
}: FilterControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {/* MegaMafia Filter */}
      <button
        onClick={() => setShowMegaMafiaOnly(!showMegaMafiaOnly)}
        className={`group relative px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
          showMegaMafiaOnly
            ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg ring-1 ring-white/20"
            : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10"
        }`}
      >
        <div className="relative flex items-center gap-2">
          {showMegaMafiaOnly && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent)] rounded-full"></div>
          )}
          <img
            src="/icons/logo-02.png"
            alt="MegaMafia"
            className={`w-4 h-4 object-contain ${
              showMegaMafiaOnly
                ? "brightness-0 invert"
                : "dark:invert opacity-75"
            }`}
          />
          <span
            className={`relative ${showMegaMafiaOnly ? "font-semibold" : ""}`}
          >
            MegaMafia
          </span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full ${
              showMegaMafiaOnly
                ? "bg-white/20"
                : "bg-indigo-50 dark:bg-white/10 text-indigo-600 dark:text-indigo-400"
            }`}
          >
            {getMegaMafiaCount()}
          </span>
        </div>
      </button>

      {/* Native Filter */}
      <button
        onClick={() => setShowNativeOnly(!showNativeOnly)}
        className={`group relative px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
          showNativeOnly
            ? "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg ring-1 ring-white/20"
            : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10"
        }`}
      >
        <div className="relative flex items-center gap-2">
          {showNativeOnly && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent)] rounded-full"></div>
          )}
          <svg
            className={`w-4 h-4 ${
              showNativeOnly
                ? "text-white"
                : "text-emerald-600 dark:text-emerald-400"
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
          <span className={`relative ${showNativeOnly ? "font-semibold" : ""}`}>
            Native
          </span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full ${
              showNativeOnly
                ? "bg-white/20"
                : "bg-emerald-50 dark:bg-white/10 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {getNativeCount()}
          </span>
        </div>
      </button>

      {/* All Categories Button */}
      <button
        onClick={() => setSelectedCategory(null)}
        className={`group relative px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
          selectedCategory === null
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
            : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/10"
        }`}
      >
        <div className="relative flex items-center gap-2">
          <span>All Categories</span>
          <span
            className={`text-xs ${
              selectedCategory === null ? "text-blue-200" : "text-gray-400"
            }`}
          >
            {showMegaMafiaOnly
              ? getMegaMafiaCount()
              : showNativeOnly
              ? getNativeCount()
              : totalProjects}
          </span>
        </div>
      </button>

      {/* Category Filters */}
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`group relative px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
            selectedCategory === category
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/10"
          }`}
        >
          <div className="relative flex items-center gap-2">
            <span>{category}</span>
            <span
              className={`text-xs ${
                selectedCategory === category
                  ? "text-blue-200"
                  : "text-gray-400"
              }`}
            >
              {getCategoryCount(category, showMegaMafiaOnly)}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
