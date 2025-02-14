type ZoomLevel = "full" | "bust";

interface ZoomControlsProps {
  currentZoom: ZoomLevel;
  onZoomChange: (level: ZoomLevel) => void;
}

export function ZoomControls({ currentZoom, onZoomChange }: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-gradient-to-br from-white/[0.03] to-white/[0.02] rounded-lg border border-white/5">
      <button
        onClick={() => onZoomChange("full")}
        className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          currentZoom === "full"
            ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        Full Body
      </button>
      <button
        onClick={() => onZoomChange("bust")}
        className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          currentZoom === "bust"
            ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        Bust
      </button>
    </div>
  );
}
