type ZoomLevel = "full" | "bust";

interface ZoomControlsProps {
  currentZoom: ZoomLevel;
  onZoomChange: (level: ZoomLevel) => void;
}

export function ZoomControls({ currentZoom, onZoomChange }: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-gradient-to-br from-gray-50 to-white dark:from-white/[0.03] dark:to-white/[0.02] rounded-lg border border-gray-200 dark:border-white/5 shadow-sm">
      <button
        onClick={() => onZoomChange("full")}
        className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          currentZoom === "full"
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
        }`}
      >
        <div className="flex items-center justify-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h18M3 12h18M3 20h18"
            />
          </svg>
          Full Body
        </div>
      </button>
      <button
        onClick={() => onZoomChange("bust")}
        className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          currentZoom === "bust"
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
        }`}
      >
        <div className="flex items-center justify-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Bust
        </div>
      </button>
    </div>
  );
}
