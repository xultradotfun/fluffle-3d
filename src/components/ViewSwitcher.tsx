interface ViewSwitcherProps {
  activeView: "viewer" | "analytics" | "pfp" | "metaverse";
  onViewChange: (view: "viewer" | "analytics" | "pfp" | "metaverse") => void;
}

export function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2 p-2 sm:p-1.5 bg-white dark:bg-white/[0.02] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm backdrop-blur-sm max-w-[calc(100vw-2rem)] mx-auto">
      <button
        onClick={() => onViewChange("viewer")}
        className={`flex items-center justify-center sm:justify-start gap-2 sm:gap-2 px-3 sm:px-4 py-3 sm:py-2 rounded-lg text-sm font-medium transition-all ${
          activeView === "viewer"
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-200 dark:from-blue-500/20 dark:to-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
        }`}
      >
        <svg
          className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <span className="flex-shrink-0">3D Viewer</span>
      </button>
      <button
        onClick={() => onViewChange("analytics")}
        className={`flex items-center justify-center sm:justify-start gap-2 sm:gap-2 px-3 sm:px-4 py-3 sm:py-2 rounded-lg text-sm font-medium transition-all ${
          activeView === "analytics"
            ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 border border-purple-200 dark:from-purple-500/20 dark:to-purple-500/10 dark:text-purple-400 dark:border-purple-500/20"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
        }`}
      >
        <svg
          className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <span className="flex-shrink-0">Rarities</span>
      </button>
      <button
        onClick={() => onViewChange("pfp")}
        className={`flex items-center justify-center sm:justify-start gap-2 sm:gap-2 px-3 sm:px-4 py-3 sm:py-2 rounded-lg text-sm font-medium transition-all ${
          activeView === "pfp"
            ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 border border-green-200 dark:from-green-500/20 dark:to-green-500/10 dark:text-green-400 dark:border-green-500/20"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
        }`}
      >
        <svg
          className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="flex-shrink-0">PFP</span>
      </button>
      <button
        onClick={() => onViewChange("metaverse")}
        className={`flex items-center justify-center sm:justify-start gap-2 sm:gap-2 px-3 sm:px-4 py-3 sm:py-2 rounded-lg text-sm font-medium transition-all ${
          activeView === "metaverse"
            ? "bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 border border-pink-200 dark:from-pink-500/20 dark:to-pink-500/10 dark:text-pink-400 dark:border-pink-500/20"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
        }`}
      >
        <svg
          className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
        <span className="flex-shrink-0">Metaverse</span>
      </button>
    </div>
  );
}
