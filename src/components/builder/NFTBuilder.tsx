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
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto p-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-3">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Fluffle Builder
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl">
            Create your perfect Fluffle by mixing and matching different traits.
            Use the zoom controls to focus on specific details.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm px-2 py-1 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 border border-purple-100 dark:border-purple-500/10">
          <span className="text-gray-500 dark:text-gray-400">
            Tip: You can download your creation or copy to clipboard!
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Preview Section */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          {/* Preview Card */}
          <div className="bg-card rounded-xl p-6 ring-1 ring-black/5 dark:ring-white/5">
            <div ref={previewRef}>
              <Preview
                selectedTraits={selectedTraits}
                zoom={zoom}
                offsetY={offsetY}
              />
            </div>
          </div>

          {/* Controls Card */}
          <div className="bg-card rounded-xl p-6 ring-1 ring-black/5 dark:ring-white/5 space-y-6">
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

        {/* Trait Selection Section */}
        <div className="w-full lg:w-1/2 bg-card rounded-xl p-6 ring-1 ring-black/5 dark:ring-white/5">
          <div className="flex flex-col gap-6">
            <TraitCategoryTabs
              activeCategory={activeCategory}
              selectedTraits={selectedTraits}
              onCategorySelect={setActiveCategory}
            />
            <div className="flex-grow overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/30">
              <TraitSelector
                type={activeCategory}
                selectedId={selectedTraits[activeCategory]}
                onSelect={handleTraitSelect}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
