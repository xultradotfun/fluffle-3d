import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ZoomControls } from "./ZoomControls";
import type { NFTTrait } from "@/utils/nftLoader";
import { getAvailableTraitIds, getTraitImageUrl } from "@/utils/traitImageMap";

type ZoomLevel = "full" | "bust";

interface InputCardProps {
  selectedNFT: { id: string; traits: NFTTrait } | null;
  error: string;
  isLoading: boolean;
  isCopied: boolean;
  zoomLevel: ZoomLevel;
  compositeImage: string | null;
  includeBackground: boolean;
  selectedBackground: string;
  onNFTLoad: (id: string, urls: string[], traits: NFTTrait) => void;
  onClear: () => void;
  onZoomChange: (level: ZoomLevel) => void;
  onCopyToClipboard: () => void;
  onDownload: () => void;
  onBackgroundToggle: (include: boolean) => void;
  onBackgroundChange: (background: string) => void;
}

export function InputCard({
  selectedNFT,
  error,
  isLoading,
  isCopied,
  zoomLevel,
  compositeImage,
  includeBackground,
  selectedBackground,
  onNFTLoad,
  onClear,
  onZoomChange,
  onCopyToClipboard,
  onDownload,
  onBackgroundToggle,
  onBackgroundChange,
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
    <div className="w-full">
      <div className="relative overflow-hidden rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-white/10 transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent)]" />

        <div className="relative p-4 lg:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/20 dark:to-emerald-500/20 border border-green-100 dark:border-green-500/20 flex items-center justify-center shadow-sm">
                <svg
                  className="w-4 h-4 text-green-600 dark:text-green-400"
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Enter NFT ID
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Type your Fluffle NFT ID below
                </p>
              </div>
            </div>
          </div>

          <div className="flex-grow flex flex-col">
            <div className="space-y-6 mb-6">
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
                  className="w-full bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-black/30 border border-gray-200 dark:border-white/5 hover:border-blue-500/30 focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/30 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
                />
                {selectedNFT && (
                  <button
                    onClick={onClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors group"
                    title="Clear NFT ID"
                  >
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white"
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

              {/* Info Note */}
              <div className="flex items-start gap-2 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/10">
                <svg
                  className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-[11px] leading-tight text-blue-600 dark:text-blue-300">
                  Use Token ID from OpenSea/wallet, not the "#1234" in NFT name
                </div>
              </div>

              {/* Zoom Controls */}
              <ZoomControls
                currentZoom={zoomLevel}
                onZoomChange={onZoomChange}
              />

              {/* Add background selector after zoom controls */}
              {selectedNFT && (
                <div className="space-y-4 px-4 py-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Background
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onBackgroundToggle(true)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          includeBackground
                            ? "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        With
                      </button>
                      <button
                        onClick={() => onBackgroundToggle(false)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          !includeBackground
                            ? "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        Without
                      </button>
                    </div>
                  </div>
                  {includeBackground && (
                    <div className="grid grid-cols-8 sm:grid-cols-10 gap-[1px] w-full max-w-[300px] mx-auto">
                      {getAvailableTraitIds("background").map((bg) => (
                        <button
                          key={bg}
                          onClick={() => onBackgroundChange(bg)}
                          disabled={selectedBackground === bg}
                          className={`p-[1px] rounded-sm border transition-colors ${
                            selectedBackground === bg
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-500/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-purple-500/50 dark:hover:border-purple-500/50"
                          }`}
                        >
                          <img
                            src={getTraitImageUrl("background", bg)}
                            alt={bg}
                            className="w-full aspect-square object-cover rounded-[2px]"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex justify-center">
                <button
                  onClick={handleRandomNFT}
                  className="px-4 py-2 rounded-lg bg-gradient-to-br from-gray-50 to-white dark:from-white/[0.03] dark:to-white/[0.02] hover:from-gray-100 hover:to-gray-50 dark:hover:from-white/[0.04] dark:hover:to-white/[0.03] border border-gray-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-white/10 transition-all group text-center shadow-sm"
                >
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                    Try Random NFT
                  </span>
                </button>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-4 py-3 text-sm text-red-600 dark:text-red-400 animate-shake">
                  {error}
                </div>
              )}
            </div>

            <div className="mt-auto pt-4 space-y-4 border-t border-gray-200 dark:border-white/5">
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
      </div>
    </div>
  );
}
