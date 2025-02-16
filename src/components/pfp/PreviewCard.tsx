import { Card } from "@/components/ui/Card";

interface PreviewCardProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isLoading: boolean;
}

export function PreviewCard({ canvasRef, isLoading }: PreviewCardProps) {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-white/10 transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03),transparent)]" />

        <div className="relative p-4 lg:p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center shadow-sm">
              <svg
                className="w-4 h-4 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Preview
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your generated PFP will appear here
              </p>
            </div>
          </div>

          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-white dark:from-white/[0.02] dark:to-white/[0.01] rounded-lg border border-gray-200 dark:border-white/5">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/20 backdrop-blur-sm z-10 rounded-lg">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
