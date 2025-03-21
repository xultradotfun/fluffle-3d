"use client";

import { useState, useRef, useEffect } from "react";
import { NFTBadge } from "./NFTBadge";
import { PreviewCard } from "./PreviewCard";
import { InputCard } from "./InputCard";
import type { NFTTrait } from "@/utils/nftLoader";
import { getTraitImageUrl } from "@/utils/traitImageMap";

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
  const [includeBackground, setIncludeBackground] = useState(true);
  const [selectedBackground, setSelectedBackground] = useState("Mega");
  const [currentBgImage, setCurrentBgImage] = useState<HTMLImageElement | null>(
    null
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load initial background image
  useEffect(() => {
    const loadInitialBg = async () => {
      try {
        const img = await loadImage(
          getTraitImageUrl("background", selectedBackground)
        );
        setCurrentBgImage(img);
      } catch (err) {
        console.error("Error loading initial background:", err);
      }
    };
    loadInitialBg();
  }, []); // Only run once when component mounts

  const generatePFP = async (
    nftId: string,
    currentZoom: ZoomLevel,
    withBackground: boolean,
    bgImage?: HTMLImageElement | null
  ) => {
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

      // Ensure canvas is ready
      if (!canvasRef.current) {
        throw new Error("Canvas not initialized");
      }

      // Create canvas and get context
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      // Set dimensions based on background preference
      canvas.width = withBackground ? 1000 : 1000;
      canvas.height = withBackground ? 1000 : 1000;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background if requested
      if (withBackground && bgImage) {
        // Calculate background scale to cover the canvas
        const bgScale = Math.max(
          canvas.width / bgImage.width,
          canvas.height / bgImage.height
        );

        // Calculate position to center the background
        const bgX = (canvas.width - bgImage.width * bgScale) / 2;
        const bgY = (canvas.height - bgImage.height * bgScale) / 2;

        // Draw background with cover scaling
        ctx.drawImage(
          bgImage,
          bgX,
          bgY,
          bgImage.width * bgScale,
          bgImage.height * bgScale
        );
      }

      // Calculate base scale to fit the image
      const baseScale = Math.min(
        canvas.width / thumbnail.width,
        canvas.height / thumbnail.height
      );

      // Apply zoom scaling - using same multipliers regardless of background
      const scale =
        currentZoom === "full"
          ? baseScale * 0.9 // Full body view
          : baseScale * 2.2; // Bust view

      // Calculate positions
      const x = (canvas.width - thumbnail.width * scale) / 2;
      let y = (canvas.height - thumbnail.height * scale) / 2;

      // Add offset for bust view - using same offset regardless of background
      if (currentZoom === "bust") {
        y += canvas.height * 0.15;
      }

      // Draw NFT
      ctx.drawImage(
        thumbnail,
        x,
        y,
        thumbnail.width * scale,
        thumbnail.height * scale
      );

      // Update state
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
    await generatePFP(id, zoomLevel, includeBackground, currentBgImage);
  };

  const handleClear = () => {
    setSelectedNFT(null);
    setCompositeImage(null);
    setError("");
    setZoomLevel("bust");
    setIncludeBackground(true);

    // Clear canvas and reset to initial state
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = 1000;
        canvas.height = 1000;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleZoomChange = async (level: ZoomLevel) => {
    setZoomLevel(level);
    if (selectedNFT) {
      await generatePFP(
        selectedNFT.id,
        level,
        includeBackground,
        currentBgImage
      );
    }
  };

  const handleBackgroundToggle = async (include: boolean) => {
    if (!selectedNFT) return;

    setIncludeBackground(include);
    await generatePFP(selectedNFT.id, zoomLevel, include, currentBgImage);
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

  const handleBackgroundChange = async (background: string) => {
    try {
      // Load the new background image first
      const newBgImage = await loadImage(
        getTraitImageUrl("background", background)
      );

      // Only proceed if we have a valid image
      if (!newBgImage) {
        throw new Error("Failed to load new background image");
      }

      // Generate PFP with new background before updating states
      if (selectedNFT) {
        // Generate PFP with new background image directly
        await generatePFP(
          selectedNFT.id,
          zoomLevel,
          includeBackground,
          newBgImage
        );

        // Update states after successful generation
        setCurrentBgImage(newBgImage);
        setSelectedBackground(background);
      }
    } catch (err) {
      console.error("Error changing background:", err);
      setError("Failed to load new background. Please try again.");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              PFP Generator
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-lg">
              Transform your Fluffle NFT into a beautiful profile picture with
              our custom generator.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm px-2 py-1 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 border border-purple-100 dark:border-purple-500/10">
            <span className="text-gray-500 dark:text-gray-400">
              Design by{" "}
              <a
                href="https://x.com/juliencoppola"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 dark:text-purple-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-medium"
              >
                @juliencoppola
              </a>
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 hidden sm:block">
          <NFTBadge selectedId={selectedNFT?.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Preview Card */}
        <div className="h-fit w-full">
          <PreviewCard canvasRef={canvasRef} isLoading={isLoading} />
        </div>

        {/* Input Card */}
        <div className="h-fit w-full">
          <InputCard
            selectedNFT={selectedNFT}
            error={error}
            isLoading={isLoading}
            isCopied={isCopied}
            zoomLevel={zoomLevel}
            compositeImage={compositeImage}
            includeBackground={includeBackground}
            selectedBackground={selectedBackground}
            onNFTLoad={handleNFTLoad}
            onClear={handleClear}
            onZoomChange={handleZoomChange}
            onCopyToClipboard={handleCopyToClipboard}
            onDownload={handleDownload}
            onBackgroundToggle={handleBackgroundToggle}
            onBackgroundChange={handleBackgroundChange}
          />
        </div>
      </div>
    </div>
  );
}
