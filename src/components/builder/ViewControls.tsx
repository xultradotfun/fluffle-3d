import { ZOOM_PRESETS } from "@/constants/zoom";

interface ViewControlsProps {
  zoom: number;
  offsetY: number;
  onZoomChange: (zoom: number) => void;
  onOffsetYChange: (offsetY: number) => void;
}

export default function ViewControls({
  zoom,
  offsetY,
  onZoomChange,
  onOffsetYChange,
}: ViewControlsProps) {
  return (
    <div className="space-y-6">
      {/* Preset Views */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm uppercase text-foreground">
            Preset Views
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onZoomChange(ZOOM_PRESETS.FULL.zoom);
                onOffsetYChange(ZOOM_PRESETS.FULL.offsetY);
              }}
              className={`px-3 py-2 text-xs border-3 border-foreground transition-all font-black uppercase flex items-center gap-2 ${
                zoom === ZOOM_PRESETS.FULL.zoom
                  ? "bg-pink text-foreground"
                  : "bg-card-foreground text-background hover:bg-pink hover:text-foreground"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
              Full View
            </button>
            <button
              onClick={() => {
                onZoomChange(ZOOM_PRESETS.BUST.zoom);
                onOffsetYChange(ZOOM_PRESETS.BUST.offsetY);
              }}
              className={`px-3 py-2 text-xs border-3 border-foreground transition-all font-black uppercase flex items-center gap-2 ${
                zoom === ZOOM_PRESETS.BUST.zoom
                  ? "bg-pink text-foreground"
                  : "bg-card-foreground text-background hover:bg-pink hover:text-foreground"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Bust View
            </button>
          </div>
        </div>
      </div>

      {/* Custom Controls */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-foreground flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Zoom
            </label>
            <span className="text-xs font-black bg-foreground text-background px-2 py-1 border-2 border-foreground">
              {(zoom * 100).toFixed(0)}%
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="50"
              max="300"
              value={zoom * 100}
              onChange={(e) => onZoomChange(Number(e.target.value) / 100)}
              className="w-full accent-pink h-3 bg-[#e0e0e0] border-2 border-foreground appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #f380cd 0%, #f380cd ${((zoom * 100 - 50) / 250) * 100}%, #e0e0e0 ${((zoom * 100 - 50) / 250) * 100}%, #e0e0e0 100%)`
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-foreground flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
              Position
            </label>
            <span className="text-xs font-black bg-foreground text-background px-2 py-1 border-2 border-foreground">
              {offsetY.toFixed(0)}%
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="-50"
              max="50"
              value={offsetY}
              onChange={(e) => onOffsetYChange(Number(e.target.value))}
              className="w-full accent-pink h-3 bg-[#e0e0e0] border-2 border-foreground appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #f380cd 0%, #f380cd ${((offsetY + 50) / 100) * 100}%, #e0e0e0 ${((offsetY + 50) / 100) * 100}%, #e0e0e0 100%)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
