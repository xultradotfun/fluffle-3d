"use client";

import { TraitType, SelectedTraits } from "@/types/traits";
import { getTraitOptions } from "@/utils/traitUtils";
import { useState, useRef, useEffect } from "react";
import { getClipPath } from "@/lib/sizes";

interface TraitSelectorProps {
  type: TraitType;
  selectedId?: string;
  onSelect: (id: string | undefined) => void;
  allTraits: SelectedTraits;
  onClearMutuallyExclusive: (traitTypes: TraitType[]) => void;
}

// Extracted None option button component
function NoneButton({
  isSelected,
  onSelect,
}: {
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`aspect-square p-3 flex flex-col items-center justify-center gap-2 transition-all border-3 border-foreground ${
        isSelected
          ? "bg-pink text-foreground"
          : "bg-card text-foreground hover:bg-pink"
      }`}
      style={{
        clipPath: getClipPath("md"),
      }}
    >
      <div className="w-full aspect-square bg-foreground/10 flex items-center justify-center border-2 border-foreground">
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={3}
        >
          <path
            strokeLinecap="square"
            strokeLinejoin="miter"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <span className="text-xs font-black uppercase">None</span>
    </button>
  );
}

// Extracted trait option button component
function TraitButton({
  option,
  isSelected,
  onSelect,
  croppedImageUrl,
  onImageLoad,
}: {
  option: ReturnType<typeof getTraitOptions>[number];
  isSelected: boolean;
  onSelect: () => void;
  croppedImageUrl?: string;
  onImageLoad: (img: HTMLImageElement) => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`aspect-square p-3 flex flex-col items-center justify-center gap-2 transition-all border-3 border-foreground ${
        isSelected
          ? "bg-pink text-foreground"
          : "bg-card text-foreground hover:bg-pink"
      }`}
      style={{
        clipPath: getClipPath("md"),
      }}
    >
      <div className="w-full aspect-square overflow-hidden relative border-2 border-foreground">
        <div className="absolute inset-0 bg-foreground/10" />
        {croppedImageUrl ? (
          <img
            src={croppedImageUrl}
            alt={option.displayName}
            className="w-full h-full object-contain relative z-10"
            style={{ imageRendering: "pixelated" }}
          />
        ) : (
          <img
            src={option.imageUrl}
            alt={option.displayName}
            crossOrigin="anonymous"
            className="w-full h-full object-contain relative z-10"
            style={{ imageRendering: "pixelated" }}
            onLoad={(e) => onImageLoad(e.target as HTMLImageElement)}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
      </div>
      <span
        className="text-xs font-black uppercase truncate w-full text-center"
        title={option.displayName}
      >
        {option.displayName}
      </span>
      {option.tribe && (
        <span className="text-[10px] font-bold uppercase truncate">
          {option.tribe}
        </span>
      )}
    </button>
  );
}

const TraitSelector = ({
  type,
  selectedId,
  onSelect,
  allTraits,
  onClearMutuallyExclusive,
}: TraitSelectorProps) => {
  const options = getTraitOptions(type);
  const [croppedImages, setCroppedImages] = useState<Record<string, string>>(
    {}
  );
  const processingRef = useRef<Set<string>>(new Set());

  // Ensure required traits have a default selection
  useEffect(() => {
    if (!selectedId && options.length > 0) {
      // These traits must always have a selection
      if (type === "eyewhite" || type === "skin" || type === "eyeball") {
        onSelect(options[0].id);
      }
    }
  }, [type, selectedId, options, onSelect]);

  const handleTraitSelect = (id: string | undefined) => {
    // If deselecting (id is undefined), just pass it through
    if (id === undefined) {
      onSelect(id);
      return;
    }

    // Handle mutual exclusivity
    switch (type) {
      case "eyeliner": {
        // Clear eyeliner_for_skin_2 and eyeliner_for_skin_3
        onClearMutuallyExclusive([
          "eyeliner_for_skin_2",
          "eyeliner_for_skin_3",
        ]);
        break;
      }
      case "eyeliner_for_skin_2": {
        // Clear eyeliner and eyeliner_for_skin_3
        onClearMutuallyExclusive(["eyeliner", "eyeliner_for_skin_3"]);
        break;
      }
      case "eyeliner_for_skin_3": {
        // Clear eyeliner and eyeliner_for_skin_2
        onClearMutuallyExclusive(["eyeliner", "eyeliner_for_skin_2"]);
        break;
      }
      case "eyebrow": {
        // Clear eyebrow_for_skin_3
        onClearMutuallyExclusive(["eyebrow_for_skin_3"]);
        break;
      }
      case "eyebrow_for_skin_3": {
        // Clear eyebrow
        onClearMutuallyExclusive(["eyebrow"]);
        break;
      }
      case "mouth": {
        // Clear mouth_for_skin_3
        onClearMutuallyExclusive(["mouth_for_skin_3"]);
        break;
      }
      case "mouth_for_skin_3": {
        // Clear mouth
        onClearMutuallyExclusive(["mouth"]);
        break;
      }
    }

    // Apply the new selection
    onSelect(id);
  };

  const processImage = async (img: HTMLImageElement, id: string) => {
    // Skip if already processing or processed
    if (processingRef.current.has(id) || croppedImages[id]) return;
    processingRef.current.add(id);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match original image
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw image to canvas
    ctx.drawImage(img, 0, 0);

    try {
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Find bounds of non-transparent pixels
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;

      // Scan through all pixels
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const alpha = data[(y * canvas.width + x) * 4 + 3];
          if (alpha > 0) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      // Add padding
      const padding = 2;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(canvas.width - 1, maxX + padding);
      maxY = Math.min(canvas.height - 1, maxY + padding);

      // Calculate dimensions
      const width = maxX - minX + 1;
      const height = maxY - minY + 1;

      // Only update if we found non-transparent pixels
      if (width > 0 && height > 0) {
        // Create a new canvas for the cropped image
        const croppedCanvas = document.createElement("canvas");
        const croppedCtx = croppedCanvas.getContext("2d");
        if (!croppedCtx) return;

        croppedCanvas.width = width;
        croppedCanvas.height = height;

        // Draw the cropped portion
        croppedCtx.drawImage(
          canvas,
          minX,
          minY,
          width,
          height,
          0,
          0,
          width,
          height
        );

        // Store the cropped image data URL
        setCroppedImages((prev) => ({
          ...prev,
          [id]: croppedCanvas.toDataURL(),
        }));
      }
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      processingRef.current.delete(id);
    }
  };

  // Reset cropped images when trait type changes
  useEffect(() => {
    setCroppedImages({});
    processingRef.current.clear();
  }, [type]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {/* Only show None button for traits that allow it */}
      {type !== "eyewhite" && type !== "skin" && type !== "eyeball" && (
        <NoneButton
          isSelected={!selectedId}
          onSelect={() => handleTraitSelect(undefined)}
        />
      )}
      {options.map((option) => (
        <TraitButton
          key={option.id}
          option={option}
          isSelected={selectedId === option.id}
          onSelect={() => handleTraitSelect(option.id)}
          croppedImageUrl={croppedImages[option.id]}
          onImageLoad={(img) => processImage(img, option.id)}
        />
      ))}
    </div>
  );
};

export default TraitSelector;
