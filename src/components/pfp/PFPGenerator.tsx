"use client";

import { useState, useRef, useEffect } from "react";
import { NFTBadge } from "./NFTBadge";
import { PreviewCard } from "./PreviewCard";
import { InputCard } from "./InputCard";
import PageHeader from "@/components/PageHeader";
import type { NFTTrait } from "@/utils/nftLoader";
import { getTraitImageUrl } from "@/utils/traitImageMap";

type ZoomLevel = "full" | "bust";

export function PFPGenerator() {
  // Generate a random NFT ID on mount
  const [defaultNFTId] = useState(() => Math.floor(Math.random() * 5000).toString());
  
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

  // Load initial background image and default NFT
  useEffect(() => {
    const loadInitialBg = async () => {
      try {
        const img = await loadImage(
          getTraitImageUrl("background", selectedBackground)
        );
        setCurrentBgImage(img);
        
        // Load default NFT after background is ready
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
        setSelectedNFT({ id: defaultNFTId, traits: emptyTraits });
        await generatePFP(defaultNFTId, "bust", true, img);
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
          : baseScale * 1.65; // Bust view (reduced from 2.2 to 1.65)

      // Calculate positions
      const x = (canvas.width - thumbnail.width * scale) / 2;
      let y = (canvas.height - thumbnail.height * scale) / 2;

      // Add offset for bust view - using same offset regardless of background
      if (currentZoom === "bust") {
        y += canvas.height * 0.12;
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
      <PageHeader
        title="PFP Generator"
        description="Transform your Fluffle NFT into a beautiful profile picture"
      />
      <div className="inline-flex items-center gap-2 text-xs px-2 py-1 bg-pink border-2 border-foreground">
        <span className="text-foreground font-bold uppercase">
              Design by{" "}
              <a
                href="https://x.com/juliencoppola"
                target="_blank"
                rel="noopener noreferrer"
            className="text-foreground hover:text-background transition-colors font-black"
              >
                @juliencoppola
              </a>
            </span>
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
