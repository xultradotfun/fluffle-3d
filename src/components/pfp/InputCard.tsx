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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* Input icon with 3-layer border */}
              <div
                style={{
                  clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                }}
              >
                <div style={{ backgroundColor: "#dfd9d9", padding: "2px" }}>
                  <div
                    className="w-8 h-8 flex items-center justify-center"
                    style={{
                      backgroundColor: "#058d5e",
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-black uppercase" style={{ color: "#dfd9d9" }}>
                  Enter NFT ID
                </h3>
                <p className="text-xs font-bold uppercase" style={{ color: "#dfd9d9" }}>
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
                  className="w-full border-3 border-background hover:border-pink focus:border-pink focus:ring-0 focus:outline-none px-4 py-3 placeholder:text-background/50 transition-all font-bold uppercase text-sm"
                  style={{
                    backgroundColor: "#fff",
                    color: "#19191a",
                    clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                  }}
                />
                {selectedNFT && (
                  <button
                    onClick={onClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-destructive border-3 border-background hover:bg-pink transition-colors group"
                    title="Clear NFT ID"
                    style={{
                      clipPath: "polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)",
                    }}
                  >
                    <svg
                      className="w-4 h-4"
                      strokeWidth={3}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: "#dfd9d9" }}
                    >
                      <path
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Info Note */}
              <div className="flex items-start gap-2 px-2.5 py-1.5 bg-pink border-3 border-background"
                style={{
                  clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                }}
              >
                <svg
                  className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                  strokeWidth={3}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: "#19191a" }}
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-[11px] leading-tight font-bold uppercase" style={{ color: "#19191a" }}>
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
                <div
                  style={{
                    clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                  }}
                >
                  <div style={{ backgroundColor: "#dfd9d9", padding: "2px" }}>
                    <div
                      className="space-y-4 px-4 py-3"
                      style={{
                        backgroundColor: "#e0e0e0",
                        clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground">
                          Background
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onBackgroundToggle(true)}
                            className={`px-3 py-2 text-xs font-black uppercase border-3 transition-colors ${
                              includeBackground
                                ? "bg-pink text-foreground border-foreground"
                                : "bg-transparent text-foreground border-foreground hover:bg-pink hover:text-foreground"
                            }`}
                            style={{
                              clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                            }}
                          >
                            With
                          </button>
                          <button
                            onClick={() => onBackgroundToggle(false)}
                            className={`px-3 py-2 text-xs font-black uppercase border-3 transition-colors ${
                              !includeBackground
                                ? "bg-pink text-foreground border-foreground"
                                : "bg-transparent text-foreground border-foreground hover:bg-pink hover:text-foreground"
                            }`}
                            style={{
                              clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                            }}
                          >
                            Without
                          </button>
                        </div>
                      </div>
                      {includeBackground && (
                        <div className="grid grid-cols-8 sm:grid-cols-10 gap-1 w-full max-w-[300px] mx-auto">
                          {getAvailableTraitIds("background").map((bg) => (
                            <button
                              key={bg}
                              onClick={() => onBackgroundChange(bg)}
                              disabled={selectedBackground === bg}
                              className={`p-[2px] border-3 transition-colors ${
                                selectedBackground === bg
                                  ? "border-pink bg-pink"
                                  : "border-foreground bg-transparent hover:border-pink"
                              }`}
                              style={{
                                clipPath: "polygon(2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%, 0 2px)",
                              }}
                            >
                              <img
                                src={getTraitImageUrl("background", bg)}
                                alt={bg}
                                className="w-full aspect-square object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-destructive/10 border-2 border-destructive px-4 py-3 text-xs font-bold uppercase text-destructive animate-shake">
                  {error}
                </div>
              )}
            </div>

            <div className="mt-auto pt-4 border-t-2 border-background">
              <div className="flex gap-3">
                <button
                  onClick={handleRandomNFT}
                  className="flex-1 px-4 py-3 bg-pink text-foreground border-3 border-foreground hover:bg-foreground hover:text-background transition-colors font-black uppercase text-sm"
                  style={{
                    clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                  }}
                >
                  Try Random NFT
                </button>
                {/* Icon buttons container with 3-layer border */}
                <div
                  style={{
                    clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                  }}
                >
                  <div style={{ backgroundColor: "#dfd9d9", padding: "2px" }}>
                    <div
                      className="p-1.5"
                      style={{
                        backgroundColor: "#19191a",
                        clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={onCopyToClipboard}
                          disabled={isLoading || !selectedNFT || !compositeImage}
                          className="flex items-center justify-center w-10 h-10 border-2 border-background bg-transparent hover:bg-pink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={isCopied ? "Copied!" : "Copy to clipboard"}
                          style={{
                            color: "#dfd9d9",
                            clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                          }}
                        >
                          {isCopied ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="square"
                                strokeLinejoin="miter"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="square"
                                strokeLinejoin="miter"
                                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                              />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={onDownload}
                          disabled={isLoading || !selectedNFT || !compositeImage}
                          className="flex items-center justify-center w-10 h-10 border-2 border-background bg-transparent hover:bg-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Download"
                          style={{
                            color: "#dfd9d9",
                            clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="square"
                              strokeLinejoin="miter"
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
