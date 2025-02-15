import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import VRMViewer from "@/components/VRMViewer";
import type { NFTTrait } from "@/utils/nftLoader";

interface NFTCardProps {
  id: string;
  urls: string[];
  traits: NFTTrait;
  onRemove?: (id: string) => void;
}

export function NFTCard({ id, urls, traits, onRemove }: NFTCardProps) {
  return (
    <Card
      variant="glass"
      className="group relative animate-fade-in overflow-hidden bg-white dark:bg-white/[0.02] border-gray-200 dark:border-white/10"
    >
      {/* Dismiss Button */}
      {onRemove && (
        <button
          onClick={() => onRemove(id)}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-white/80 dark:bg-black/50 backdrop-blur-sm border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-black/70 hover:border-red-500/50 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
          title="Remove NFT"
        >
          <svg
            className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-gray-900/80 via-gray-900/50 to-transparent dark:from-black/80 dark:via-black/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">#{id}</h3>
              <div className="h-4 w-[1px] bg-white/20"></div>
              <span className="text-sm text-gray-300 dark:text-gray-400 font-medium">
                Fluffle
              </span>
            </div>
          </div>
          <Badge variant="default" size="sm" className="shadow-xl">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
            </svg>
            3D Model
          </Badge>
        </div>
      </div>

      {/* VRM Viewer */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-gray-100 to-gray-50 dark:from-black/40 dark:to-black/60 group-hover:from-gray-50 group-hover:to-white dark:group-hover:from-black/50 dark:group-hover:to-black/70 transition-all duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.03),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.05),transparent)]" />
        <VRMViewer modelUrls={urls} />
        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-gray-200 dark:ring-white/10 group-hover:ring-gray-300 dark:group-hover:ring-white/20 transition-colors" />
      </div>

      {/* Traits */}
      <div className="p-4 bg-gradient-to-b from-gray-50/80 via-white to-white dark:from-black/50 dark:via-transparent dark:to-transparent">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/10"></div>
          <Badge variant="secondary" size="sm" className="shadow-lg">
            <svg
              className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 mr-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 7.2L12 3l8 4.2v9.6L12 21l-8-4.2V7.2zm2 1.5v6.6l6 3.2 6-3.2V8.7l-6-3.2-6 3.2z" />
            </svg>
            Traits
          </Badge>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/10"></div>
        </div>

        <div className="space-y-2">
          {Object.entries(traits)
            .filter(
              ([key, value]) =>
                key.endsWith("_display_name") &&
                typeof value === "string" &&
                value !== "-1"
            )
            .map(([key, value], index) => (
              <div
                key={key}
                className="group/trait flex items-center px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.04] border border-gray-200 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/20 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-gray-500 group-hover/trait:text-blue-600 dark:text-gray-400 dark:group-hover/trait:text-blue-400 transition-colors break-words">
                    {key
                      .replace(/_display_name$/, "")
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")}
                  </span>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <Badge variant="default" size="sm" className="shadow-sm">
                    {value}
                  </Badge>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
}
