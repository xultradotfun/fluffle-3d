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
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto p-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center shadow-sm">
            <svg
              className="w-6 h-6 text-blue-600 dark:text-blue-400"
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
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Fluffle Builder
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl">
              Create your perfect Fluffle by mixing and matching different
              traits
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-100/50 dark:border-blue-500/20">
          <svg
            className="w-5 h-5 text-blue-600/70 dark:text-blue-400/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Tip: Use the randomize button to discover unique combinations, or
            adjust the zoom to focus on specific details
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Preview Section */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          {/* Preview Card */}
          <div className="relative overflow-hidden rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-white/10 transition-colors">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03),transparent)]" />

            <div className="relative p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center shadow-sm">
                  <svg
                    className="w-4 h-4 text-blue-600 dark:text-blue-400"
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Preview
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your Fluffle will appear here
                  </p>
                </div>
              </div>

              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-white dark:from-white/[0.02] dark:to-white/[0.01] rounded-lg border border-gray-200 dark:border-white/5">
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

          {/* Controls Card */}
          <div className="relative overflow-hidden rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-white/10 transition-colors">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03),transparent)]" />

            <div className="relative p-4 lg:p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center shadow-sm">
                  <svg
                    className="w-4 h-4 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Controls
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRandomize}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all font-medium shadow-sm flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Randomize
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleCopyToClipboard}
                    className="px-4 py-2.5 bg-gradient-to-br from-gray-50 to-white dark:from-white/[0.03] dark:to-white/[0.02] text-gray-700 dark:text-gray-200 rounded-lg hover:from-gray-100 hover:to-gray-50 dark:hover:from-white/[0.04] dark:hover:to-white/[0.03] transition-all border border-gray-200 dark:border-white/5 shadow-sm relative group flex items-center justify-center"
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
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {isCopied ? "Copied!" : "Copy to clipboard"}
                    </span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2.5 bg-gradient-to-br from-gray-50 to-white dark:from-white/[0.03] dark:to-white/[0.02] text-gray-700 dark:text-gray-200 rounded-lg hover:from-gray-100 hover:to-gray-50 dark:hover:from-white/[0.04] dark:hover:to-white/[0.03] transition-all border border-gray-200 dark:border-white/5 shadow-sm relative group flex items-center justify-center"
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
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Download
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trait Selection Section */}
        <div className="w-full lg:w-1/2">
          <div className="relative overflow-hidden rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-white/10 transition-colors">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03),transparent)]" />

            <div className="relative p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center shadow-sm">
                  <svg
                    className="w-4 h-4 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Traits
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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
                <div className="flex-grow overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 dark:hover:scrollbar-thumb-white/20">
                  <TraitSelector
                    type={activeCategory}
                    selectedId={selectedTraits[activeCategory]}
                    onSelect={handleTraitSelect}
                    allTraits={selectedTraits}
                    onClearMutuallyExclusive={handleClearMutuallyExclusive}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
