import { Card } from "@/components/ui/Card";

interface PreviewCardProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isLoading: boolean;
}

export function PreviewCard({ canvasRef, isLoading }: PreviewCardProps) {
  return (
    <Card className="relative overflow-hidden bg-white dark:bg-white/[0.02] border-gray-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-white/10 transition-colors h-full">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.05),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.03),transparent)]" />

      <div className="relative p-4 lg:p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center shadow-sm">
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Preview
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your generated PFP with background
              </p>
            </div>
          </div>
        </div>

        <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-white/[0.02] dark:to-white/[0.01] border border-gray-200 dark:border-white/5 shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent)]" />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-white/50 dark:bg-black/30">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-100 dark:border-blue-500/20 p-2 animate-pulse shadow-sm">
                  <svg
                    className="w-full h-full text-blue-600 dark:text-blue-400"
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
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium animate-pulse">
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
