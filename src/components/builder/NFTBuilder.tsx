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
import ViewControls from "./ViewControls";
import ActionButtons from "./ActionButtons";
import TraitCategoryTabs from "./TraitCategoryTabs";
import PageHeader from "@/components/PageHeader";
import { getTraitImageUrl, getTraitBackImageUrl } from "@/utils/traitImageMap";
import { LAYER_ORDER, HAIR_WITH_BACK, LayerGroup } from "@/utils/layerOrder";
import { ZOOM_PRESETS } from "@/constants/zoom";

export default function NFTBuilder() {
  const [selectedTraits, setSelectedTraits] = useState<SelectedTraits>({});
  const [activeCategory, setActiveCategory] = useState<TraitType>("skin");
  const [zoom, setZoom] = useState<number>(ZOOM_PRESETS.FULL.zoom);
  const [offsetY, setOffsetY] = useState<number>(ZOOM_PRESETS.FULL.offsetY);
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

  const handleClearMutuallyExclusive = (traitTypes: TraitType[]) => {
    setSelectedTraits((prev) => {
      const newTraits = { ...prev };
      traitTypes.forEach((type) => {
        if (newTraits[type]) {
          newTraits[type] = undefined;
        }
      });
      return newTraits;
    });
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

      // Define drawImage function
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
              const baseScale = Math.min(
                canvas.width / img.width,
                canvas.height / img.height
              );
              const scaledWidth = img.width * baseScale;
              const scaledHeight = img.height * baseScale;
              const x = (canvas.width - scaledWidth) / 2;
              const y = (canvas.height - scaledHeight) / 2;
              ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
            }
            resolve();
          };
          img.onerror = reject;
          img.src = src;
        });
      };

      // Draw background if selected (before any transformations)
      if (selectedTraits.background) {
        await drawImage(
          getTraitImageUrl("background", selectedTraits.background),
          true // isBackground
        );
      }

      // Save the initial context state
      ctx.save();

      // Apply zoom and offset to the entire context
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(
        -canvas.width / 2,
        -canvas.height / 2 + (offsetY * canvas.height) / 100
      );

      // Draw hair back part if applicable
      if (
        selectedTraits.hair &&
        HAIR_WITH_BACK.includes(
          selectedTraits.hair as (typeof HAIR_WITH_BACK)[number]
        )
      ) {
        await drawImage(getTraitBackImageUrl("hair", selectedTraits.hair)!);
      }

      // Draw base character
      for (const traitType of LAYER_ORDER.BASE) {
        if (selectedTraits[traitType]) {
          await drawImage(
            getTraitImageUrl(traitType, selectedTraits[traitType]!)
          );
        }
      }

      // Draw face features
      for (const traitType of LAYER_ORDER.FACE_FEATURES) {
        if (selectedTraits[traitType]) {
          await drawImage(
            getTraitImageUrl(traitType, selectedTraits[traitType]!)
          );
        }
      }

      // Draw eye details
      for (const traitType of LAYER_ORDER.EYE_DETAILS) {
        if (selectedTraits[traitType]) {
          await drawImage(
            getTraitImageUrl(traitType, selectedTraits[traitType]!)
          );
        }
      }

      // Draw clothes
      for (const traitType of LAYER_ORDER.CLOTHES) {
        if (selectedTraits[traitType]) {
          await drawImage(
            getTraitImageUrl(traitType, selectedTraits[traitType]!)
          );
        }
      }

      // Draw hair front part if applicable
      if (selectedTraits.hair) {
        await drawImage(getTraitImageUrl("hair", selectedTraits.hair));
      }

      // Draw accessories
      for (const traitType of LAYER_ORDER.ACCESSORIES) {
        if (selectedTraits[traitType]) {
          await drawImage(
            getTraitImageUrl(traitType, selectedTraits[traitType]!)
          );
        }
      }

      // Restore the context state
      ctx.restore();

      // Convert to blob and copy to clipboard
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), "image/png")
      );
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
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

      // Define drawImage function
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
              const baseScale = Math.min(
                canvas.width / img.width,
                canvas.height / img.height
              );
              const scaledWidth = img.width * baseScale;
              const scaledHeight = img.height * baseScale;
              const x = (canvas.width - scaledWidth) / 2;
              const y = (canvas.height - scaledHeight) / 2;
              ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
            }
            resolve();
          };
          img.onerror = reject;
          img.src = src;
        });
      };

      // Draw background if selected (before any transformations)
      if (selectedTraits.background) {
        await drawImage(
          getTraitImageUrl("background", selectedTraits.background),
          true // isBackground
        );
      }

      // Save the initial context state
      ctx.save();

      // Apply zoom and offset to the entire context
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(
        -canvas.width / 2,
        -canvas.height / 2 + (offsetY * canvas.height) / 100
      );

      // Draw hair back part if applicable
      if (
        selectedTraits.hair &&
        HAIR_WITH_BACK.includes(
          selectedTraits.hair as (typeof HAIR_WITH_BACK)[number]
        )
      ) {
        await drawImage(getTraitBackImageUrl("hair", selectedTraits.hair)!);
      }

      // Draw base character
      for (const traitType of LAYER_ORDER.BASE) {
        if (selectedTraits[traitType]) {
          await drawImage(
            getTraitImageUrl(traitType, selectedTraits[traitType]!)
          );
        }
      }

      // Draw face features
      for (const traitType of LAYER_ORDER.FACE_FEATURES) {
        if (selectedTraits[traitType]) {
          await drawImage(
            getTraitImageUrl(traitType, selectedTraits[traitType]!)
          );
        }
      }

      // Draw eye details
      for (const traitType of LAYER_ORDER.EYE_DETAILS) {
        if (selectedTraits[traitType]) {
          await drawImage(
            getTraitImageUrl(traitType, selectedTraits[traitType]!)
          );
        }
      }

      // Draw clothes
      for (const traitType of LAYER_ORDER.CLOTHES) {
        if (selectedTraits[traitType]) {
          await drawImage(
            getTraitImageUrl(traitType, selectedTraits[traitType]!)
          );
        }
      }

      // Draw hair front part if applicable
      if (selectedTraits.hair) {
        await drawImage(getTraitImageUrl("hair", selectedTraits.hair));
      }

      // Draw accessories
      for (const traitType of LAYER_ORDER.ACCESSORIES) {
        if (selectedTraits[traitType]) {
          await drawImage(
            getTraitImageUrl(traitType, selectedTraits[traitType]!)
          );
        }
      }

      // Restore the context state
      ctx.restore();

      // Convert to blob and download
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), "image/png")
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "fluffle-nft.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full mx-auto p-6 animate-fade-in">
      <PageHeader
        title="Fluffle Builder"
        description="Create your perfect Fluffle by mixing and matching different traits"
      />

      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full">
        {/* Preview Section */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          {/* Preview Card with angled borders */}
          <div
            style={{
              clipPath:
                "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
            }}
          >
            <div
              style={{
                backgroundColor: "#19191a",
                padding: "2px",
              }}
            >
              <div
                className="p-4 lg:p-6"
                style={{
                  backgroundColor: "#19191a",
                  clipPath:
                    "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  {/* Preview icon with 3-layer border */}
                  <div
                    style={{
                      clipPath:
                        "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                    }}
                  >
                    <div style={{ backgroundColor: "#dfd9d9", padding: "2px" }}>
                      <div
                        className="w-8 h-8 flex items-center justify-center"
                        style={{
                          backgroundColor: "#f380cd",
                          clipPath:
                            "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
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
                    <h3
                      className="text-sm font-black uppercase"
                      style={{ color: "#dfd9d9" }}
                    >
                      Preview
                    </h3>
                    <p
                      className="text-xs font-bold uppercase"
                      style={{ color: "#dfd9d9" }}
                    >
                      Your Fluffle will appear here
                    </p>
                  </div>
                </div>

                {/* Preview with 3-layer border */}
                <div
                  className="relative aspect-square"
                  style={{
                    clipPath:
                      "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
                  }}
                >
                  <div style={{ backgroundColor: "#dfd9d9", padding: "2px" }}>
                    <div
                      className="relative aspect-square"
                      style={{
                        backgroundColor: "#e0e0e0",
                        clipPath:
                          "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
                      }}
                    >
                      <div ref={previewRef}>
                        <Preview
                          selectedTraits={selectedTraits}
                          zoom={zoom}
                          offsetY={offsetY}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Card with angled borders */}
          <div
            style={{
              clipPath:
                "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
            }}
          >
            <div
              style={{
                backgroundColor: "#19191a",
                padding: "2px",
              }}
            >
              <div
                className="p-4 lg:p-6 space-y-6"
                style={{
                  backgroundColor: "#19191a",
                  clipPath:
                    "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Controls icon with 3-layer border */}
                  <div
                    style={{
                      clipPath:
                        "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                    }}
                  >
                    <div style={{ backgroundColor: "#dfd9d9", padding: "2px" }}>
                      <div
                        className="w-8 h-8 flex items-center justify-center"
                        style={{
                          backgroundColor: "#058d5e",
                          clipPath:
                            "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
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
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="square"
                            strokeLinejoin="miter"
                            strokeWidth={3}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3
                      className="text-sm font-black uppercase"
                      style={{ color: "#dfd9d9" }}
                    >
                      Controls
                    </h3>
                    <p
                      className="text-xs font-bold uppercase"
                      style={{ color: "#dfd9d9" }}
                    >
                      Adjust view and export options
                    </p>
                  </div>
                </div>

                <ViewControls
                  zoom={zoom}
                  offsetY={offsetY}
                  onZoomChange={setZoom}
                  onOffsetYChange={setOffsetY}
                />

                <ActionButtons
                  onRandomize={handleRandomize}
                  onCopy={handleCopyToClipboard}
                  onDownload={handleDownload}
                  isCopied={isCopied}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Trait Selection Section */}
        <div className="w-full lg:w-1/2">
          <div
            style={{
              clipPath:
                "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
            }}
          >
            <div
              style={{
                backgroundColor: "#19191a",
                padding: "2px",
              }}
            >
              <div
                className="p-4 lg:p-6"
                style={{
                  backgroundColor: "#19191a",
                  clipPath:
                    "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  {/* Traits icon with 3-layer border */}
                  <div
                    style={{
                      clipPath:
                        "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                    }}
                  >
                    <div style={{ backgroundColor: "#dfd9d9", padding: "2px" }}>
                      <div
                        className="w-8 h-8 flex items-center justify-center"
                        style={{
                          backgroundColor: "#058d5e",
                          clipPath:
                            "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
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
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3
                      className="text-sm font-black uppercase"
                      style={{ color: "#dfd9d9" }}
                    >
                      Traits
                    </h3>
                    <p
                      className="text-xs font-bold uppercase"
                      style={{ color: "#dfd9d9" }}
                    >
                      Customize your character's appearance
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <TraitCategoryTabs
                    activeCategory={activeCategory}
                    selectedTraits={selectedTraits}
                    onCategorySelect={setActiveCategory}
                  />

                  {/* Trait selector area with 3-layer border */}
                  <div
                    style={{
                      clipPath:
                        "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
                    }}
                  >
                    <div style={{ backgroundColor: "#dfd9d9", padding: "2px" }}>
                      <div
                        className="overflow-y-auto max-h-[600px] p-4 scrollbar-thin scrollbar-thumb-foreground scrollbar-track-transparent hover:scrollbar-thumb-pink"
                        style={{
                          backgroundColor: "#e0e0e0",
                          clipPath:
                            "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
                        }}
                      >
                        <TraitSelector
                          type={activeCategory}
                          selectedId={selectedTraits[activeCategory]}
                          onSelect={handleTraitSelect}
                          allTraits={selectedTraits}
                          onClearMutuallyExclusive={
                            handleClearMutuallyExclusive
                          }
                        />
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
