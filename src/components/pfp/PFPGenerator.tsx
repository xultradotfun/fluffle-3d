"use client";

import { useState, useRef, useEffect } from "react";
import { NFTBadge } from "./NFTBadge";
import { PreviewCard } from "./PreviewCard";
import { InputCard } from "./InputCard";
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
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              PFP Generator
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300">
              Transform your Fluffle NFT into a beautiful profile picture with
              our custom generator.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-4 w-[1px] bg-gradient-to-b from-purple-200 to-pink-200 dark:from-purple-500/30 dark:to-pink-500/30"></div>
            <span className="text-gray-500 dark:text-gray-400">
              Design by{" "}
              <a
                href="https://twitter.com/juliencoppola"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 dark:text-purple-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                @juliencoppola
              </a>
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <NFTBadge selectedId={selectedNFT?.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
        {/* Preview Card */}
        <PreviewCard canvasRef={canvasRef} isLoading={isLoading} />

        {/* Input Card */}
        <InputCard
          selectedNFT={selectedNFT}
          error={error}
          isLoading={isLoading}
          isCopied={isCopied}
          zoomLevel={zoomLevel}
          compositeImage={compositeImage}
          onNFTLoad={handleNFTLoad}
          onClear={handleClear}
          onZoomChange={handleZoomChange}
          onCopyToClipboard={handleCopyToClipboard}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}
