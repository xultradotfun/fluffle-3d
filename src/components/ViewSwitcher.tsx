interface ViewSwitcherProps {
  activeView: "viewer" | "analytics" | "pfp" | "metaverse";
  onViewChange: (view: "viewer" | "analytics" | "pfp" | "metaverse") => void;
}

export function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-white/[0.02] rounded-xl border border-white/10 backdrop-blur-sm">
      <button
        onClick={() => onViewChange("viewer")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          activeView === "viewer"
            ? "bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-blue-400 border border-blue-500/20"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <svg
          className="w-4 h-4"
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
        3D Viewer
      </button>
      <button
        onClick={() => onViewChange("analytics")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          activeView === "analytics"
            ? "bg-gradient-to-r from-purple-500/20 to-purple-500/10 text-purple-400 border border-purple-500/20"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <svg
          className="w-4 h-4"
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
        Rarities
      </button>
      <button
        onClick={() => onViewChange("pfp")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          activeView === "pfp"
            ? "bg-gradient-to-r from-green-500/20 to-green-500/10 text-green-400 border border-green-500/20"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <svg
          className="w-4 h-4"
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
        PFP Generator
      </button>
      <button
        onClick={() => onViewChange("metaverse")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          activeView === "metaverse"
            ? "bg-gradient-to-r from-pink-500/20 to-pink-500/10 text-pink-400 border border-pink-500/20"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <svg
          className="w-4 h-4"
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
        Metaverse
      </button>
    </div>
  );
}
