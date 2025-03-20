"use client";

import { SelectedTraits } from "@/types/traits";
import { getTraitImageUrl, getTraitBackImageUrl } from "@/utils/traitImageMap";
import { useRef } from "react";
import { LAYER_ORDER, HAIR_WITH_BACK } from "@/utils/layerOrder";

interface PreviewProps {
  selectedTraits: SelectedTraits;
  zoom?: number; // Scale factor (1 = 100%)
  offsetY?: number; // Vertical offset in percentage
}

// Empty state component
function EmptyState() {
  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-card mb-6 ring-1 ring-border">
        <svg
          className="w-10 h-10 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No Traits Selected
      </h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        Select traits from the options below to preview your NFT.
      </p>
    </div>
  );
}

// Helper function to render a layer group
function renderLayerGroup(
  selectedTraits: SelectedTraits,
  layers: readonly (keyof SelectedTraits)[],
  defaultValues?: Partial<SelectedTraits>
) {
  return layers.map((traitType) => {
    // Use default value if provided and no selected value exists
    const traitId = selectedTraits[traitType] || defaultValues?.[traitType];
    if (!traitId) return null;

    return (
      <img
        key={traitType}
        src={getTraitImageUrl(traitType, traitId)}
        alt={`${traitType} trait`}
        className="absolute inset-0 w-full h-full object-contain"
        style={{ imageRendering: "pixelated" }}
      />
    );
  });
}

const Preview = ({
  selectedTraits,
  zoom = 0.9, // Default to 90% size
  offsetY = 0,
}: PreviewProps) => {
  const hasTraits = Object.keys(selectedTraits).length > 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Default values for required traits
  const defaultTraits: Partial<SelectedTraits> = {
    eyewhite: "0", // Default eyewhite value
  };

  return (
    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-white dark:from-black/40 dark:to-black/60 ring-1 ring-border dark:ring-white/10">
      {/* Background layer - always full size */}
      {selectedTraits.background && (
        <div className="absolute inset-0">
          <img
            src={getTraitImageUrl("background", selectedTraits.background)}
            alt="background"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      )}

      {/* Character traits container - zoomable */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="relative w-full h-full transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) translateY(${offsetY}%)`,
          }}
        >
          {hasTraits ? (
            <>
              {/* Hair back part */}
              {selectedTraits.hair &&
                HAIR_WITH_BACK.includes(
                  selectedTraits.hair as (typeof HAIR_WITH_BACK)[number]
                ) && (
                  <img
                    src={getTraitBackImageUrl("hair", selectedTraits.hair)!}
                    alt="hair back part"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                )}

              {/* Base character */}
              {renderLayerGroup(
                selectedTraits,
                LAYER_ORDER.BASE,
                defaultTraits
              )}

              {/* Face features */}
              {renderLayerGroup(selectedTraits, LAYER_ORDER.FACE_FEATURES)}

              {/* Eye details */}
              {renderLayerGroup(selectedTraits, LAYER_ORDER.EYE_DETAILS)}

              {/* Clothes */}
              {renderLayerGroup(selectedTraits, LAYER_ORDER.CLOTHES)}

              {/* Hair front part */}
              {selectedTraits.hair && (
                <img
                  src={getTraitImageUrl("hair", selectedTraits.hair)}
                  alt="hair front part"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              )}

              {/* Accessories */}
              {renderLayerGroup(selectedTraits, LAYER_ORDER.ACCESSORIES)}
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* Hidden canvas for export */}
      <canvas ref={canvasRef} className="hidden" width={1000} height={1000} />
    </div>
  );
};

export default Preview;
