import { Card } from "@/components/ui/Card";

interface PreviewCardProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isLoading: boolean;
}

export function PreviewCard({ canvasRef, isLoading }: PreviewCardProps) {
  return (
    <div className="w-full">
      <div
        style={{
          clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
        }}
      >
        <div
          style={{
            backgroundColor: "#19191a",
            padding: "2px",
          }}
        >
          <div
            className="relative overflow-hidden transition-colors p-4 lg:p-6"
            style={{
              backgroundColor: "#19191a",
              clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
            }}
          >
            <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-6">
                {/* Preview icon with 3-layer border */}
                <div
                  style={{
                    clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                  }}
                >
                  <div style={{ backgroundColor: "#dfd9d9", padding: "2px" }}>
                    <div
                      className="w-8 h-8 flex items-center justify-center"
                      style={{
                        backgroundColor: "#f380cd",
                        clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                      }}
                    >
              <svg
                        className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                        strokeWidth={3}
                        style={{ color: "#dfd9d9" }}
              >
                <path
                          strokeLinecap="square"
                          strokeLinejoin="miter"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
                    </div>
                  </div>
            </div>
            <div>
                  <h3 className="text-sm font-black uppercase" style={{ color: "#dfd9d9" }}>
                Preview
              </h3>
                  <p className="text-xs font-bold uppercase" style={{ color: "#dfd9d9" }}>
                Your generated PFP will appear here
              </p>
            </div>
          </div>

              {/* Canvas with 3-layer border */}
              <div
                style={{
                  clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
                }}
              >
                <div style={{ backgroundColor: "#dfd9d9", padding: "2px" }}>
                  <div
                    className="relative aspect-square"
                    style={{
                      backgroundColor: "#fff",
                      clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
                    }}
                  >
            {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                        <div className="w-16 h-16 border-4 border-foreground border-t-pink animate-spin" />
              </div>
            )}
            <canvas
              ref={canvasRef}
                      className="absolute inset-0 w-full h-full object-contain"
            />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
