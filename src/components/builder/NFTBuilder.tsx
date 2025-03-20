"use client";

import { useState, useEffect, useRef } from "react";
import { SelectedTraits, TraitType } from "@/types/traits";
import {
  TRAIT_CATEGORIES,
  getRandomTraits,
  getInitialTraits,
} from "@/utils/traitUtils";
import Preview from "./Preview";
import TraitSelector from "./TraitSelector";
import { getTraitImageUrl, getTraitBackImageUrl } from "@/utils/traitImageMap";
import { LAYER_ORDER, HAIR_WITH_BACK, LayerGroup } from "@/utils/layerOrder";

// Zoom presets
const ZOOM_PRESETS = {
  FULL: { zoom: 0.9, offsetY: 0 },
  BUST: { zoom: 2.2, offsetY: 10 },
};

export default function NFTBuilder() {
  const [selectedTraits, setSelectedTraits] = useState<SelectedTraits>({});
  const [activeCategory, setActiveCategory] = useState<TraitType>("skin");
  const [zoom, setZoom] = useState(ZOOM_PRESETS.FULL.zoom);
  const [offsetY, setOffsetY] = useState(ZOOM_PRESETS.FULL.offsetY);
  const [isCopied, setIsCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Initialize with initial traits
  useEffect(() => {
    setSelectedTraits(getInitialTraits());
  }, []);

  const handleTraitSelect = (traitId: string | undefined) => {
    setSelectedTraits((prev) => ({
      ...prev,
      [activeCategory]: traitId,
    }));
  };

  const handleRandomize = () => {
    setSelectedTraits(getRandomTraits());
  };

  const handleCopyToClipboard = async () => {
    try {
      if (!previewRef.current) return;

      // Create a canvas to draw the preview
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size
      canvas.width = 1000;
      canvas.height = 1000;

      // Load and draw all images in order
      const drawImage = async (
        src: string,
        isBackground: boolean = false
      ): Promise<void> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            if (isBackground) {
              // Background should fill the canvas
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            } else {
              // For traits, maintain aspect ratio and center
              const scale = Math.min(
                canvas.width / img.width,
                canvas.height / img.height
              );
              const x = (canvas.width - img.width * scale) / 2;
              const y = (canvas.height - img.height * scale) / 2;
              ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
            resolve();
          };
          img.onerror = reject;
          img.src = src;
        });
      };

      // Draw background if selected
      if (selectedTraits.background) {
        await drawImage(
          getTraitImageUrl("background", selectedTraits.background),
          true // isBackground
        );
      }

      // Draw hair back part if applicable
      if (
        selectedTraits.hair &&
        HAIR_WITH_BACK.includes(
          selectedTraits.hair as (typeof HAIR_WITH_BACK)[number]
        )
      ) {
        await drawImage(getTraitBackImageUrl("hair", selectedTraits.hair)!);
      }

      // Draw layers in order
      for (const groupName of Object.keys(LAYER_ORDER) as LayerGroup[]) {
        const traits = LAYER_ORDER[groupName];
        for (const traitType of traits) {
          const traitId = selectedTraits[traitType as keyof SelectedTraits];
          if (traitId) {
            await drawImage(getTraitImageUrl(traitType as TraitType, traitId));
          }
        }
      }

      // Draw hair front part
      if (selectedTraits.hair) {
        await drawImage(getTraitImageUrl("hair", selectedTraits.hair));
      }

      // Copy to clipboard
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!))
      );
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Error copying to clipboard:", err);
    }
  };

  const handleDownload = async () => {
    try {
      if (!previewRef.current) return;

      // Create a canvas to draw the preview
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size
      canvas.width = 1000;
      canvas.height = 1000;

      // Load and draw all images in order
      const drawImage = async (
        src: string,
        isBackground: boolean = false
      ): Promise<void> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            if (isBackground) {
              // Background should fill the canvas
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            } else {
              // For traits, maintain aspect ratio and center
              const scale = Math.min(
                canvas.width / img.width,
                canvas.height / img.height
              );
              const x = (canvas.width - img.width * scale) / 2;
              const y = (canvas.height - img.height * scale) / 2;
              ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
            resolve();
          };
          img.onerror = reject;
          img.src = src;
        });
      };

      // Draw background if selected
      if (selectedTraits.background) {
        await drawImage(
          getTraitImageUrl("background", selectedTraits.background),
          true // isBackground
        );
      }

      // Draw hair back part if applicable
      if (
        selectedTraits.hair &&
        HAIR_WITH_BACK.includes(
          selectedTraits.hair as (typeof HAIR_WITH_BACK)[number]
        )
      ) {
        await drawImage(getTraitBackImageUrl("hair", selectedTraits.hair)!);
      }

      // Draw layers in order
      for (const groupName of Object.keys(LAYER_ORDER) as LayerGroup[]) {
        const traits = LAYER_ORDER[groupName];
        for (const traitType of traits) {
          const traitId = selectedTraits[traitType as keyof SelectedTraits];
          if (traitId) {
            await drawImage(getTraitImageUrl(traitType as TraitType, traitId));
          }
        }
      }

      // Draw hair front part
      if (selectedTraits.hair) {
        await drawImage(getTraitImageUrl("hair", selectedTraits.hair));
      }

      // Download the image
      const link = document.createElement("a");
      link.download = "fluffle-nft.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Error downloading image:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Preview Section */}
        <div className="w-full lg:w-1/2">
          <div ref={previewRef}>
            <Preview
              selectedTraits={selectedTraits}
              zoom={zoom}
              offsetY={offsetY}
            />
          </div>
          <div className="flex flex-col gap-4 mt-4">
            {/* Zoom and Position Controls */}
            <div className="flex flex-col gap-2 bg-card/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Zoom: {(zoom * 100).toFixed(0)}%
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setZoom(ZOOM_PRESETS.FULL.zoom);
                      setOffsetY(ZOOM_PRESETS.FULL.offsetY);
                    }}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      zoom === ZOOM_PRESETS.FULL.zoom
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground hover:bg-card/80"
                    }`}
                  >
                    Full
                  </button>
                  <button
                    onClick={() => {
                      setZoom(ZOOM_PRESETS.BUST.zoom);
                      setOffsetY(ZOOM_PRESETS.BUST.offsetY);
                    }}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      zoom === ZOOM_PRESETS.BUST.zoom
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground hover:bg-card/80"
                    }`}
                  >
                    Bust
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                value={zoom * 100}
                onChange={(e) => setZoom(Number(e.target.value) / 100)}
                className="w-full"
              />
              <label className="text-sm font-medium mt-2">
                Vertical Position: {offsetY.toFixed(0)}%
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                value={offsetY}
                onChange={(e) => setOffsetY(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleRandomize}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Randomize
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyToClipboard}
                  className="px-4 py-2 bg-card text-card-foreground rounded-lg hover:bg-card/80 transition-colors relative"
                  title="Copy to clipboard"
                >
                  {isCopied ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-card text-card-foreground rounded-lg hover:bg-card/80 transition-colors"
                  title="Download"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trait Selection Section */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {TRAIT_CATEGORIES.map((type) => (
              <button
                key={type}
                onClick={() => setActiveCategory(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground hover:bg-card/80"
                }`}
              >
                {type.charAt(0).toUpperCase() +
                  type.slice(1).replace(/_/g, " ")}
                {selectedTraits[type] && (
                  <span className="ml-2 w-2 h-2 rounded-full bg-green-500 inline-block" />
                )}
              </button>
            ))}
          </div>

          {/* Trait Options */}
          <div className="bg-card rounded-xl p-4 flex-grow overflow-y-auto max-h-[500px]">
            <TraitSelector
              type={activeCategory}
              selectedId={selectedTraits[activeCategory]}
              onSelect={handleTraitSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
