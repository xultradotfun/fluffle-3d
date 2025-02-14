import VRMViewer from "./VRMViewer";
import type { NFTTrait } from "@/utils/nftLoader";

interface NFTViewerProps {
  id: string;
  urls: string[];
  traits: NFTTrait;
  onRemove?: (id: string) => void;
}

export default function NFTViewer({
  id,
  urls,
  traits,
  onRemove,
}: NFTViewerProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#111] border border-white/10 transition-all hover:border-blue-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)]">
      {/* Dismiss Button */}
      {onRemove && (
        <button
          onClick={() => onRemove(id)}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/80 backdrop-blur-sm border border-white/10 hover:bg-black hover:border-blue-500/50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
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

      {/* Header Section */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Character #{id}</h3>
          <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2.5 py-1 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/30">
            VRM Model
          </span>
        </div>
      </div>

      {/* VRM Viewer Section */}
      <div className="relative aspect-square w-full bg-gradient-radial from-[#1a1a1a] to-[#111]">
        <VRMViewer modelUrls={urls} />
      </div>

      {/* Traits Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Traits
          </h4>
          <span className="text-xs text-gray-500">
            {
              Object.keys(traits).filter((key) => key.endsWith("_display_name"))
                .length
            }{" "}
            attributes
          </span>
        </div>

        <div className="divide-y divide-white/5">
          {Object.entries(traits)
            .filter(
              ([key, value]) =>
                key.endsWith("_display_name") &&
                typeof value === "string" &&
                value !== "-1"
            )
            .map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between py-2 first:pt-0 last:pb-0"
              >
                <span className="text-sm font-medium text-blue-400">
                  {key
                    .replace(/_display_name$/, "")
                    .replace(/([A-Z])/g, " $1")
                    .trim()}
                </span>
                <span className="text-sm font-medium text-white">{value}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
