interface ViewSwitcherProps {
  activeView: "viewer" | "analytics";
  onViewChange: (view: "viewer" | "analytics") => void;
}

export function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
      <button
        onClick={() => onViewChange("viewer")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          activeView === "viewer"
            ? "bg-blue-500 text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        3D Viewer
      </button>
      <button
        onClick={() => onViewChange("analytics")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          activeView === "analytics"
            ? "bg-blue-500 text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        Traits Analytics
      </button>
    </div>
  );
}
