type ZoomLevel = "full" | "bust";

interface ZoomControlsProps {
  currentZoom: ZoomLevel;
  onZoomChange: (level: ZoomLevel) => void;
}

export function ZoomControls({ currentZoom, onZoomChange }: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-card-foreground border-2 border-foreground">
      <button
        onClick={() => onZoomChange("full")}
        className={`flex-1 px-3 py-2 text-xs font-black uppercase border-2 border-background transition-all ${
          currentZoom === "full"
            ? "bg-pink text-foreground"
            : "bg-transparent text-background hover:bg-pink hover:text-foreground"
        }`}
      >
        <div className="flex items-center justify-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="square"
              strokeLinejoin="miter"
              d="M3 4h18M3 12h18M3 20h18"
            />
          </svg>
          Full Body
        </div>
      </button>
      <button
        onClick={() => onZoomChange("bust")}
        className={`flex-1 px-3 py-2 text-xs font-black uppercase border-2 border-background transition-all ${
          currentZoom === "bust"
            ? "bg-pink text-foreground"
            : "bg-transparent text-background hover:bg-pink hover:text-foreground"
        }`}
      >
        <div className="flex items-center justify-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="square"
              strokeLinejoin="miter"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Bust
        </div>
      </button>
    </div>
  );
}
