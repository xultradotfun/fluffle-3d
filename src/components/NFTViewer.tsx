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
    <div className="group relative overflow-hidden rounded-xl bg-[#111] border border-white/10 transition-all hover:border-blue-500/50 hover:shadow-lg">
      {/* Dismiss Button */}
      {onRemove && (
        <button
          onClick={() => onRemove(id)}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/80 backdrop-blur-sm border border-white/10 hover:bg-black hover:border-blue-500/50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
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

      {/* VRM Viewer Section */}
      <div className="relative aspect-square w-full bg-[#1a1a1a]">
        <VRMViewer modelUrls={urls} />
      </div>

      {/* Traits Section */}
      <div className="p-5 space-y-4 bg-gradient-to-b from-[#111]/50 to-[#111] border-t border-white/10">
        {/* ID Section */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#ededed]">Character #{id}</h3>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/25">
              VRM Model
            </span>
          </div>
        </div>

        {/* Traits Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {Object.entries(traits)
            .filter(
              ([key]) =>
                !key.endsWith("_display_name") &&
                key in traits &&
                typeof traits[key as keyof NFTTrait] !== "number"
            )
            .map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col rounded-lg bg-white/[0.03] p-3 border border-white/10 hover:border-white/20 transition-colors"
              >
                <span className="text-xs font-medium text-blue-400 uppercase tracking-wide">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span className="mt-1 text-sm font-medium text-[#ededed] truncate">
                  {value}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
