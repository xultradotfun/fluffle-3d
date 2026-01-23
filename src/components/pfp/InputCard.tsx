import { BorderedBox, BorderedIcon, getClipPath } from "@/components/ui/BorderedBox";
import { Button } from "@/components/ui/Button";
import { CopyButton, DownloadButton } from "@/components/ui/CopyButton";
import { IconButton } from "@/components/ui/IconButton";
import { ZoomControls } from "./ZoomControls";
import { colors } from "@/lib/colors";
import { type NFTTrait, EMPTY_TRAITS } from "@/utils/nftLoader";
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
    onNFTLoad(random, [], EMPTY_TRAITS);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (!value) {
      onClear();
      return;
    }
    const num = parseInt(value);
    if (isNaN(num) || num < 0 || num > 4999) {
      return;
    }
    onNFTLoad(value, [], EMPTY_TRAITS);
  };

  return (
    <div className="w-full">
      <BorderedBox cornerSize={20} variant="card">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BorderedIcon bgColor="green">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  style={{ color: colors.background }}
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </BorderedIcon>
              <div>
                <h3 className="text-sm font-black uppercase" style={{ color: colors.background }}>
                  Enter NFT ID
                </h3>
                <p className="text-xs font-bold uppercase" style={{ color: colors.background }}>
                  Type your Fluffle NFT ID below
                </p>
              </div>
            </div>
          </div>

          <div className="flex-grow flex flex-col">
            <div className="space-y-6 mb-6">
              {/* Input Field */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter NFT ID (0-4999)"
                  value={selectedNFT?.id || ""}
                  onChange={handleInputChange}
                  className="w-full border-3 border-background hover:border-pink focus:border-pink focus:ring-0 focus:outline-none px-4 py-3 placeholder:text-background/50 transition-all font-bold uppercase text-sm"
                  style={{
                    backgroundColor: "#fff",
                    color: colors.foreground,
                    clipPath: getClipPath(8),
                  }}
                />
                {selectedNFT && (
                  <IconButton
                    onClick={onClear}
                    variant="solid"
                    size="sm"
                    cornerSize={3}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-destructive hover:bg-pink"
                    title="Clear NFT ID"
                  >
                    <svg
                      className="w-4 h-4"
                      strokeWidth={3}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: colors.background }}
                    >
                      <path
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </IconButton>
                )}
              </div>

              {/* Info Note */}
              <div
                className="flex items-start gap-2 px-2.5 py-1.5 bg-pink border-3 border-background"
                style={{ clipPath: getClipPath(6) }}
              >
                <svg
                  className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                  strokeWidth={3}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: colors.foreground }}
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-[11px] leading-tight font-bold uppercase" style={{ color: colors.foreground }}>
                  Use Token ID from OpenSea/wallet, not the "#1234" in NFT name
                </div>
              </div>

              {/* Zoom Controls */}
              <ZoomControls currentZoom={zoomLevel} onZoomChange={onZoomChange} />

              {/* Background Selector */}
              {selectedNFT && (
                <BorderedBox cornerSize={12} bgColor="light" className="space-y-4 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-foreground">
                      Background
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={includeBackground ? "brutalist-active" : "brutalist"}
                        size="sm"
                        cornerSize={4}
                        onClick={() => onBackgroundToggle(true)}
                        className="px-3 py-2 text-xs"
                      >
                        With
                      </Button>
                      <Button
                        variant={!includeBackground ? "brutalist-active" : "brutalist"}
                        size="sm"
                        cornerSize={4}
                        onClick={() => onBackgroundToggle(false)}
                        className="px-3 py-2 text-xs"
                      >
                        Without
                      </Button>
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
                          style={{ clipPath: getClipPath(2) }}
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
                </BorderedBox>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-destructive/10 border-2 border-destructive px-4 py-3 text-xs font-bold uppercase text-destructive animate-shake">
                  {error}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-auto pt-4 border-t-2 border-background">
              <div className="flex gap-3">
                <Button
                  variant="pink"
                  onClick={handleRandomNFT}
                  className="flex-1 px-4 py-3 text-sm"
                >
                  Try Random NFT
                </Button>

                {/* Copy & Download buttons */}
                <BorderedBox cornerSize={8} className="p-1.5">
                  <div className="flex items-center gap-2">
                    <IconButton
                      variant="pink"
                      onClick={onCopyToClipboard}
                      disabled={isLoading || !selectedNFT || !compositeImage}
                      title={isCopied ? "Copied!" : "Copy to clipboard"}
                    >
                      {isCopied ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="square" strokeLinejoin="miter" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                      )}
                    </IconButton>
                    <IconButton
                      variant="green"
                      onClick={onDownload}
                      disabled={isLoading || !selectedNFT || !compositeImage}
                      title="Download"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="square" strokeLinejoin="miter" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </IconButton>
                  </div>
                </BorderedBox>
              </div>
            </div>
          </div>
        </div>
      </BorderedBox>
    </div>
  );
}
