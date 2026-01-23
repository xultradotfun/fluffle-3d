import { BorderedBox, BorderedIcon } from "@/components/ui/BorderedBox";
import { colors } from "@/lib/colors";

interface PreviewCardProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isLoading: boolean;
}

export function PreviewCard({ canvasRef, isLoading }: PreviewCardProps) {
  return (
    <div className="w-full">
      <BorderedBox cornerSize={20} variant="card">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            {/* Preview icon with 3-layer border */}
            <BorderedIcon bgColor="pink">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
                style={{ color: colors.background }}
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </BorderedIcon>
            <div>
              <h3 className="text-sm font-black uppercase" style={{ color: colors.background }}>
                Preview
              </h3>
              <p className="text-xs font-bold uppercase" style={{ color: colors.background }}>
                Your generated PFP will appear here
              </p>
            </div>
          </div>

          {/* Canvas with 3-layer border */}
          <BorderedBox cornerSize={16} bgColor="white" className="relative aspect-square">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                <div className="w-16 h-16 border-4 border-foreground border-t-pink animate-spin" />
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </BorderedBox>
        </div>
      </BorderedBox>
    </div>
  );
}
