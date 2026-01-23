import { ZOOM_PRESETS } from "@/constants/zoom";
import { Button } from "@/components/ui/Button";
import { colors } from "@/lib/colors";

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
  const isFullView = zoom === ZOOM_PRESETS.FULL.zoom;
  const isBustView = zoom === ZOOM_PRESETS.BUST.zoom;

  return (
    <div className="space-y-6">
      {/* Preset Views */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm uppercase" style={{ color: colors.background }}>
            Preset Views
          </h3>
          <div className="flex gap-2">
            <Button
              variant={isFullView ? "brutalist-active" : "brutalist"}
              size="sm"
              cornerSize={6}
              onClick={() => {
                onZoomChange(ZOOM_PRESETS.FULL.zoom);
                onOffsetYChange(ZOOM_PRESETS.FULL.offsetY);
              }}
              className="text-xs flex items-center gap-2"
              style={{ color: isFullView ? colors.foreground : colors.background }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Full View
            </Button>
            <Button
              variant={isBustView ? "brutalist-active" : "brutalist"}
              size="sm"
              cornerSize={6}
              onClick={() => {
                onZoomChange(ZOOM_PRESETS.BUST.zoom);
                onOffsetYChange(ZOOM_PRESETS.BUST.offsetY);
              }}
              className="text-xs flex items-center gap-2"
              style={{ color: isBustView ? colors.foreground : colors.background }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Bust View
            </Button>
          </div>
        </div>
      </div>

      {/* Custom Controls */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase flex items-center gap-2" style={{ color: colors.background }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Zoom
            </label>
            <span
              className="text-xs font-black px-2 py-1 border-2"
              style={{ backgroundColor: colors.background, color: colors.foreground, borderColor: colors.background }}
            >
              {(zoom * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="300"
            value={zoom * 100}
            onChange={(e) => onZoomChange(Number(e.target.value) / 100)}
            className="w-full h-3 border-3 border-background appearance-none cursor-pointer slider-brutalist"
            style={{
              background: `linear-gradient(to right, ${colors.pink} 0%, ${colors.pink} ${((zoom * 100 - 50) / 250) * 100}%, ${colors.background} ${((zoom * 100 - 50) / 250) * 100}%, ${colors.background} 100%)`
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase flex items-center gap-2" style={{ color: colors.background }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Position
            </label>
            <span
              className="text-xs font-black px-2 py-1 border-2"
              style={{ backgroundColor: colors.background, color: colors.foreground, borderColor: colors.background }}
            >
              {offsetY.toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={offsetY}
            onChange={(e) => onOffsetYChange(Number(e.target.value))}
            className="w-full h-3 border-3 border-background appearance-none cursor-pointer slider-brutalist"
            style={{
              background: `linear-gradient(to right, ${colors.pink} 0%, ${colors.pink} ${((offsetY + 50) / 100) * 100}%, ${colors.background} ${((offsetY + 50) / 100) * 100}%, ${colors.background} 100%)`
            }}
          />
        </div>
      </div>
    </div>
  );
}
