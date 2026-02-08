"use client";

import { useState, useEffect, useRef } from "react";
import { colors } from "@/lib/colors";
import { BorderedBox, BorderedIcon } from "@/components/ui/BorderedBox";
import { SelectedTraits, TraitType } from "@/types/traits";
import {
  getRandomTraits,
  getInitialTraits,
} from "@/utils/traitUtils";
import Preview from "./Preview";
import TraitSelector from "./TraitSelector";
import ViewControls from "./ViewControls";
import ActionButtons from "./ActionButtons";
import TraitCategoryTabs from "./TraitCategoryTabs";
import PageHeader from "@/components/layout/PageHeader";
import { renderTraitsToCanvas, canvasToBlob } from "@/utils/canvasRenderer";
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
      const canvas = await renderTraitsToCanvas(selectedTraits, zoom, offsetY);
      const blob = await canvasToBlob(canvas);
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
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
      const canvas = await renderTraitsToCanvas(selectedTraits, zoom, offsetY);
      const blob = await canvasToBlob(canvas);
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
          {/* Preview Card */}
          <BorderedBox cornerSize="2xl" borderColor="dark" bgColor="dark" className="p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-6">
              <BorderedIcon bgColor="pink">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  style={{ color: colors.background }}
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </BorderedIcon>
              <div>
                <h3
                  className="text-sm font-black uppercase"
                  style={{ color: colors.background }}
                >
                  Preview
                </h3>
                <p
                  className="text-xs font-bold uppercase"
                  style={{ color: colors.background }}
                >
                  Your Fluffle will appear here
                </p>
              </div>
            </div>

            <BorderedBox cornerSize="xl" bgColor="light" className="relative aspect-square">
              <div ref={previewRef}>
                <Preview
                  selectedTraits={selectedTraits}
                  zoom={zoom}
                  offsetY={offsetY}
                />
              </div>
            </BorderedBox>
          </BorderedBox>

          {/* Controls Card */}
          <BorderedBox cornerSize="2xl" borderColor="dark" bgColor="dark" className="p-4 lg:p-6 space-y-6">
            <div className="flex items-center gap-3">
              <BorderedIcon bgColor="green">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  style={{ color: colors.background }}
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
              </BorderedIcon>
              <div>
                <h3
                  className="text-sm font-black uppercase"
                  style={{ color: colors.background }}
                >
                  Controls
                </h3>
                <p
                  className="text-xs font-bold uppercase"
                  style={{ color: colors.background }}
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
          </BorderedBox>
        </div>

        {/* Trait Selection Section */}
        <div className="w-full lg:w-1/2">
          <BorderedBox cornerSize="2xl" borderColor="dark" bgColor="dark" className="p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-6">
              <BorderedIcon bgColor="green">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  style={{ color: colors.background }}
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </BorderedIcon>
              <div>
                <h3
                  className="text-sm font-black uppercase"
                  style={{ color: colors.background }}
                >
                  Traits
                </h3>
                <p
                  className="text-xs font-bold uppercase"
                  style={{ color: colors.background }}
                >
                  Customize your character&apos;s appearance
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <TraitCategoryTabs
                activeCategory={activeCategory}
                selectedTraits={selectedTraits}
                onCategorySelect={setActiveCategory}
              />

              <BorderedBox
                cornerSize="xl"
                bgColor="light"
                className="overflow-y-auto max-h-[600px] p-4 scrollbar-thin scrollbar-thumb-foreground scrollbar-track-transparent hover:scrollbar-thumb-pink"
              >
                <TraitSelector
                  type={activeCategory}
                  selectedId={selectedTraits[activeCategory]}
                  onSelect={handleTraitSelect}
                  allTraits={selectedTraits}
                  onClearMutuallyExclusive={handleClearMutuallyExclusive}
                />
              </BorderedBox>
            </div>
          </BorderedBox>
        </div>
      </div>
    </div>
  );
}
