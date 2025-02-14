import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ZoomControls } from "./ZoomControls";
import type { NFTTrait } from "@/utils/nftLoader";

type ZoomLevel = "full" | "bust";

interface InputCardProps {
  selectedNFT: { id: string; traits: NFTTrait } | null;
  error: string;
  isLoading: boolean;
  isCopied: boolean;
  zoomLevel: ZoomLevel;
  compositeImage: string | null;
  onNFTLoad: (id: string, urls: string[], traits: NFTTrait) => void;
  onClear: () => void;
  onZoomChange: (level: ZoomLevel) => void;
  onCopyToClipboard: () => void;
  onDownload: () => void;
}

export function InputCard({
  selectedNFT,
  error,
  isLoading,
  isCopied,
  zoomLevel,
  compositeImage,
  onNFTLoad,
  onClear,
  onZoomChange,
  onCopyToClipboard,
  onDownload,
}: InputCardProps) {
  const handleRandomNFT = () => {
    const random = Math.floor(Math.random() * 5000).toString();
    const emptyTraits: NFTTrait = {
      tribe: -1,
      skin: -1,
      hair: -1,
      eyeball: -1,
      eyeliner: -1,
      eyebrow: -1,
      head: -1,
      ear: -1,
      face: -1,
      tribe_display_name: "",
      skin_display_name: "",
      hair_display_name: "",
      eyeball_display_name: "",
      eyeliner_display_name: "",
      eyebrow_display_name: "",
      head_display_name: "",
      ear_display_name: "",
      face_display_name: "",
    };
    onNFTLoad(random, [], emptyTraits);
  };

  return (
    <Card className="backdrop-blur-sm bg-white/[0.02] border-white/5 hover:border-white/10 transition-colors">
      <div className="p-6 min-h-[600px]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-green-400"
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
            <div>
              <h3 className="text-lg font-semibold text-white">Enter NFT ID</h3>
              <p className="text-sm text-gray-400">
                Type your Fluffle NFT ID below
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Simple Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Enter NFT ID (0-4999)"
              value={selectedNFT?.id || ""}
              onChange={(e) => {
                const value = e.target.value.trim();
                // Clear if empty
                if (!value) {
                  onClear();
                  return;
                }
                // Validate input
                const num = parseInt(value);
                if (isNaN(num) || num < 0 || num > 4999) {
                  return;
                }
                // Load NFT with empty traits (they'll be loaded from metadata)
                const emptyTraits: NFTTrait = {
                  tribe: -1,
                  skin: -1,
                  hair: -1,
                  eyeball: -1,
                  eyeliner: -1,
                  eyebrow: -1,
                  head: -1,
                  ear: -1,
                  face: -1,
                  tribe_display_name: "",
                  skin_display_name: "",
                  hair_display_name: "",
                  eyeball_display_name: "",
                  eyeliner_display_name: "",
                  eyebrow_display_name: "",
                  head_display_name: "",
                  ear_display_name: "",
                  face_display_name: "",
                };
                onNFTLoad(value, [], emptyTraits);
              }}
              className="w-full bg-black/20 hover:bg-black/30 border border-white/5 hover:border-blue-500/30 focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 transition-all"
            />
            {selectedNFT && (
              <button
                onClick={onClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/10 transition-colors group"
                title="Clear NFT ID"
              >
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
          </div>

          {/* Zoom Controls */}
          <ZoomControls currentZoom={zoomLevel} onZoomChange={onZoomChange} />

          {/* Quick Actions */}
          <div className="flex justify-center">
            <button
              onClick={handleRandomNFT}
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-white/[0.03] to-white/[0.02] hover:from-white/[0.04] hover:to-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all group text-center"
            >
              <span className="text-sm font-medium text-gray-400 group-hover:text-white">
                Try Random NFT
              </span>
            </button>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400 animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-4 pt-4 border-t border-white/5">
            <Button
              onClick={onCopyToClipboard}
              className="w-full justify-center glow"
              disabled={isLoading || !selectedNFT || !compositeImage}
            >
              <div className="flex items-center justify-center w-[160px]">
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  />
                </svg>
                <span className="flex-shrink-0">
                  {isCopied ? "Copied!" : "Copy to Clipboard"}
                </span>
              </div>
            </Button>
            <Button
              variant="secondary"
              onClick={onDownload}
              className="w-full justify-center glow"
              disabled={isLoading || !selectedNFT || !compositeImage}
            >
              <div className="flex items-center justify-center w-[160px]">
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span className="flex-shrink-0">Download PNG</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
