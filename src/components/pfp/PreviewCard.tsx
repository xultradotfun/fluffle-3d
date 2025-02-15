import { Card } from "@/components/ui/Card";

interface PreviewCardProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isLoading: boolean;
}

export function PreviewCard({ canvasRef, isLoading }: PreviewCardProps) {
  return (
    <Card className="backdrop-blur-sm bg-white/[0.02] border-white/5 hover:border-white/10 transition-colors h-full">
      <div className="p-4 lg:p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Preview</h3>
              <p className="text-sm text-gray-400">
                Your generated PFP with background
              </p>
            </div>
          </div>
        </div>

        <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/5">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2 animate-pulse">
                  <svg
                    className="w-full h-full text-blue-400"
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
                <span className="text-sm text-blue-400 font-medium animate-pulse">
                  Generating PFP...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
