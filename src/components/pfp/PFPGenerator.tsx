"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { NFTInput } from "@/components/nft/NFTInput";
import type { NFTTrait } from "@/utils/nftLoader";

type ZoomLevel = "full" | "bust";

export function PFPGenerator() {
  const [selectedNFT, setSelectedNFT] = useState<{
    id: string;
    traits: NFTTrait;
  } | null>(null);
  const [error, setError] = useState("");
  const [compositeImage, setCompositeImage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>("bust");
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load background image on mount
  useEffect(() => {
    const loadBgImage = async () => {
      try {
        const img = await loadImage("/pfpbg.png");
        setBgImage(img);

        // Draw initial background
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
          }
        }
      } catch (err) {
        console.error("Error loading background:", err);
      }
    };
    loadBgImage();
  }, []);

  const generatePFP = async (nftId: string, currentZoom: ZoomLevel) => {
    try {
      setIsLoading(true);
      setError("");

      // First fetch the metadata to get the image URL
      const metadataResponse = await fetch(
        `https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/metadata/${nftId}`
      );
      if (!metadataResponse.ok) {
        throw new Error("Failed to fetch NFT metadata");
      }
      const metadata = await metadataResponse.json();
      const thumbnailUrl = metadata.image;

      const thumbnail = await loadImage(thumbnailUrl);

      // Ensure canvas and background are ready
      if (!canvasRef.current || !bgImage) {
        throw new Error("Canvas or background not initialized");
      }

      // Create canvas and draw images
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      // Reset canvas and draw background
      canvas.width = bgImage.width;
      canvas.height = bgImage.height;
      ctx.drawImage(bgImage, 0, 0);

      // Calculate dimensions based on zoom level
      let scale, y;
      if (currentZoom === "full") {
        // For full body, fit the entire image while maintaining aspect ratio
        scale =
          Math.min(
            canvas.width / thumbnail.width,
            canvas.height / thumbnail.height
          ) * 0.9; // 90% of the container to leave some padding
      } else {
        // For bust view, zoom in 80% more but keep centered
        scale =
          Math.min(
            canvas.width / thumbnail.width,
            canvas.height / thumbnail.height
          ) * 1.8; // 80% zoom
      }

      // Calculate y position (always centered vertically)
      y = (canvas.height - thumbnail.height * scale) / 2;

      // Add offset for bust view to move image down
      if (currentZoom === "bust") {
        y += canvas.height * 0.1; // Move down by 10% of canvas height
      }

      // Calculate x position (always centered horizontally)
      const x = (canvas.width - thumbnail.width * scale) / 2;

      // Draw thumbnail
      ctx.drawImage(
        thumbnail,
        x,
        y,
        thumbnail.width * scale,
        thumbnail.height * scale
      );

      // Convert to data URL
      const dataUrl = canvas.toDataURL("image/png");
      setCompositeImage(dataUrl);
    } catch (err) {
      console.error("Error generating PFP:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate PFP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  const handleNFTLoad = async (
    id: string,
    _urls: string[],
    traits: NFTTrait
  ) => {
    setSelectedNFT({ id, traits });
    setCompositeImage(null);
    setError("");
    await generatePFP(id, zoomLevel);
  };

  const handleClear = () => {
    setSelectedNFT(null);
    setCompositeImage(null);
    setError("");
    // Reset zoom level to bust when clearing
    setZoomLevel("bust");
    // Redraw background only
    if (canvasRef.current && bgImage) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.drawImage(bgImage, 0, 0);
      }
    }
  };

  const handleZoomChange = async (level: ZoomLevel) => {
    setZoomLevel(level);
    if (selectedNFT) {
      await generatePFP(selectedNFT.id, level);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      if (canvasRef.current) {
        const blob = await new Promise<Blob>((resolve) =>
          canvasRef.current!.toBlob((blob) => resolve(blob!))
        );
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      setError("Failed to copy image. Please try downloading instead.");
      console.error("Error copying to clipboard:", err);
    }
  };

  const handleDownload = () => {
    if (compositeImage) {
      const link = document.createElement("a");
      link.href = compositeImage;
      link.download = `fluffle-pfp-${selectedNFT?.id}.png`;
      link.click();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between h-[88px]">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">PFP Generator</h2>
          <div className="space-y-1">
            <p className="text-gray-400 text-sm">
              Create a custom profile picture with your Fluffle NFT.
            </p>
            <p className="text-gray-500 text-sm">
              Inspired by{" "}
              <a
                href="https://twitter.com/juliencoppola"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                @juliencoppola
              </a>
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          {selectedNFT ? (
            <Badge variant="primary" size="md">
              NFT #{selectedNFT.id} Selected
            </Badge>
          ) : (
            <Badge variant="secondary" size="md">
              No NFT Selected
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preview Card */}
        <Card>
          <div className="p-6 min-h-[600px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-400"
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
                  <h3 className="text-lg font-semibold text-white">Preview</h3>
                  <p className="text-sm text-gray-400">
                    Your generated PFP with background
                  </p>
                </div>
              </div>
            </div>

            <div className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10">
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 p-2 animate-pulse">
                      <svg
                        className="w-full h-full text-blue-400"
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
                    <span className="text-sm text-blue-400 font-medium">
                      Generating PFP...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Input and Actions Card */}
        <Card>
          <div className="p-6 min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
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
                  <h3 className="text-lg font-semibold text-white">
                    Enter NFT ID
                  </h3>
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
                      handleClear();
                      return;
                    }
                    // Validate input
                    const num = parseInt(value);
                    if (isNaN(num) || num < 0 || num > 4999) {
                      setError(
                        "Please enter a valid NFT ID between 0 and 4999"
                      );
                      return;
                    }
                    // Load NFT
                    handleNFTLoad(value, [], {
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
                    });
                  }}
                  className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 hover:border-blue-500/30 focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 transition-all"
                />
                {selectedNFT && (
                  <button
                    onClick={handleClear}
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
              <div className="flex items-center gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
                <button
                  onClick={() => handleZoomChange("full")}
                  className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    zoomLevel === "full"
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Full Body
                </button>
                <button
                  onClick={() => handleZoomChange("bust")}
                  className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    zoomLevel === "bust"
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Bust
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const random = Math.floor(Math.random() * 5000).toString();
                    handleNFTLoad(random, [], {
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
                    });
                  }}
                  className="px-4 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 hover:border-blue-500/30 transition-all group text-center"
                >
                  <span className="text-sm font-medium text-gray-400 group-hover:text-white">
                    Try Random NFT
                  </span>
                </button>
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-white/10">
                <Button
                  onClick={handleCopyToClipboard}
                  className="w-full justify-center"
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
                  onClick={handleDownload}
                  className="w-full justify-center"
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
      </div>
    </div>
  );
}
