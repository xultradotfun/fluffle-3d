interface ViewSwitcherProps {
  activeView: "viewer" | "analytics" | "pfp" | "metaverse" | "ecosystem";
  onViewChange: (
    view: "viewer" | "analytics" | "pfp" | "metaverse" | "ecosystem"
  ) => void;
}

export function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden sm:block fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-gray-900/80 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg backdrop-blur-sm max-w-[calc(100vw-2rem)] mx-auto">
          {/* Fluffle Tools Group */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewChange("viewer")}
              className={`flex items-center justify-start gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === "viewer"
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-200 dark:from-blue-500/20 dark:to-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
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
              className={`flex items-center justify-start gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === "analytics"
                  ? "bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-600 border border-purple-200 dark:from-purple-500/20 dark:to-purple-500/10 dark:text-purple-400 dark:border-purple-500/20"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="flex-shrink-0">Rarities</span>
            </button>
            <button
              onClick={() => onViewChange("pfp")}
              className={`flex items-center justify-start gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === "pfp"
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 border border-green-200 dark:from-green-500/20 dark:to-green-500/10 dark:text-green-400 dark:border-green-500/20"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
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
              <span className="flex-shrink-0">PFP Generator</span>
            </button>
            <button
              onClick={() => onViewChange("metaverse")}
              className={`flex items-center justify-start gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === "metaverse"
                  ? "bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 border border-pink-200 dark:from-pink-500/20 dark:to-pink-500/10 dark:text-pink-400 dark:border-pink-500/20"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
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

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />

          {/* Ecosystem Section */}
          <button
            onClick={() => onViewChange("ecosystem")}
            className={`flex items-center justify-start gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === "ecosystem"
                ? "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 border border-orange-200 dark:from-orange-500/20 dark:to-orange-500/10 dark:text-orange-400 dark:border-orange-500/20"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
            }`}
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="flex-shrink-0">Ecosystem</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 border-t border-gray-200 dark:border-white/10 pb-safe backdrop-blur-lg">
        <div className="flex items-center justify-around px-2 py-3">
          {/* Fluffle Tools */}
          <button
            onClick={() => onViewChange("viewer")}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
              activeView === "viewer"
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/20 dark:to-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            <div
              className={`relative transition-transform duration-200 ${
                activeView === "viewer" ? "scale-110" : ""
              }`}
            >
              <svg
                className="w-5 h-5"
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
            </div>
            <span className="text-xs font-medium">3D Viewer</span>
          </button>
          <button
            onClick={() => onViewChange("analytics")}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
              activeView === "analytics"
                ? "bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-500/20 dark:to-purple-500/10 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            <div
              className={`relative transition-transform duration-200 ${
                activeView === "analytics" ? "scale-110" : ""
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-xs font-medium">Rarities</span>
          </button>
          <button
            onClick={() => onViewChange("pfp")}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
              activeView === "pfp"
                ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/20 dark:to-green-500/10 text-green-600 dark:text-green-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            <div
              className={`relative transition-transform duration-200 ${
                activeView === "pfp" ? "scale-110" : ""
              }`}
            >
              <svg
                className="w-5 h-5"
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
            </div>
            <span className="text-xs font-medium">PFP</span>
          </button>
          <button
            onClick={() => onViewChange("metaverse")}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
              activeView === "metaverse"
                ? "bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-500/20 dark:to-pink-500/10 text-pink-600 dark:text-pink-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            <div
              className={`relative transition-transform duration-200 ${
                activeView === "metaverse" ? "scale-110" : ""
              }`}
            >
              <svg
                className="w-5 h-5"
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
            </div>
            <span className="text-xs font-medium">Metaverse</span>
          </button>
          <button
            onClick={() => onViewChange("ecosystem")}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
              activeView === "ecosystem"
                ? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-500/20 dark:to-orange-500/10 text-orange-600 dark:text-orange-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            <div
              className={`relative transition-transform duration-200 ${
                activeView === "ecosystem" ? "scale-110" : ""
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-xs font-medium">Ecosystem</span>
          </button>
        </div>
      </div>
    </>
  );
}
