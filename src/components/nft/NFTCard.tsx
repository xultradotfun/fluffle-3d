import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
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
    <Card isInteractive className="animate-fade-in">
      {/* Dismiss Button */}
      {onRemove && (
        <button
          onClick={() => onRemove(id)}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/80 backdrop-blur-sm border border-white/10 hover:bg-black hover:border-blue-500/50 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
          title="Remove NFT"
        >
          <svg
            className="w-4 h-4 text-gray-400 hover:text-blue-400 transition-colors"
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
      <CardHeader className="animate-slide-down">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white">#{id}</h3>
            <div className="h-4 w-[1px] bg-white/20"></div>
            <span className="text-sm text-gray-400 font-medium">Fluffle</span>
          </div>
          <Badge variant="primary" size="sm">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
            </svg>
            3D Model
          </Badge>
        </div>
      </CardHeader>

      {/* VRM Viewer */}
      <div className="relative aspect-square w-full bg-[radial-gradient(circle_at_center,#1a1a1a,#111)] group-hover:bg-[radial-gradient(circle_at_center,#1a1a1a,#0f0f0f)] transition-all duration-300">
        <VRMViewer modelUrls={urls} />
        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10"></div>
      </div>

      {/* Traits */}
      <CardContent className="bg-gradient-to-b from-black/50 to-transparent animate-slide-up">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <Badge variant="secondary" size="sm">
            <svg
              className="w-3.5 h-3.5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 7.2L12 3l8 4.2v9.6L12 21l-8-4.2V7.2zm2 1.5v6.6l6 3.2 6-3.2V8.7l-6-3.2-6 3.2z" />
            </svg>
            Traits
          </Badge>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
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
                className="group/trait flex items-center px-3 py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-blue-500/20 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-gray-400 group-hover/trait:text-blue-400 transition-colors break-words">
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
                  <Badge>{value}</Badge>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
