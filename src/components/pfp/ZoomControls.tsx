import { Button } from "@/components/ui/Button";
import { getClipPath } from "@/components/ui/BorderedBox";
import { colors } from "@/lib/colors";

type ZoomLevel = "full" | "bust";

interface ZoomControlsProps {
  currentZoom: ZoomLevel;
  onZoomChange: (level: ZoomLevel) => void;
}

export function ZoomControls({ currentZoom, onZoomChange }: ZoomControlsProps) {
  return (
    <div
      className="flex items-center gap-2 p-2 bg-transparent border-3 border-background"
      style={{ clipPath: getClipPath(8) }}
    >
      <Button
        variant={currentZoom === "full" ? "brutalist-active" : "brutalist"}
        size="sm"
        cornerSize={4}
        onClick={() => onZoomChange("full")}
        className="flex-1 text-xs"
        style={{ color: currentZoom === "full" ? colors.foreground : colors.background }}
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
      </Button>
      <Button
        variant={currentZoom === "bust" ? "brutalist-active" : "brutalist"}
        size="sm"
        cornerSize={4}
        onClick={() => onZoomChange("bust")}
        className="flex-1 text-xs"
        style={{ color: currentZoom === "bust" ? colors.foreground : colors.background }}
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
      </Button>
    </div>
  );
}
