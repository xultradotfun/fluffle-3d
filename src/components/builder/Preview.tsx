"use client";

import { SelectedTraits } from "@/types/traits";
import { getTraitImageUrl, getTraitBackImageUrl } from "@/utils/traitImageMap";

interface PreviewProps {
  selectedTraits: SelectedTraits;
}

const PREVIEW_ORDER: (keyof SelectedTraits)[] = [
  "skin",
  "eyeball",
  "eyeliner",
  "eyebrow",
  "hair",
  "ear",
  "head",
  "face",
  "clothes",
  "eyelid",
  "eyewhite",
  "mouth",
  "eyeliner_for_skin_2",
  "eyeliner_for_skin_3",
  "eyebrow_for_skin_3",
  "mouth_for_skin_3",
];

// Hair styles that have back parts that should be rendered behind the character
const HAIR_WITH_BACK = [
  "4",
  "11",
  "12",
  "17",
  "18",
  "22",
  "27",
  "30",
  "31",
  "43",
  "50",
  "62",
  "63",
];

export default function Preview({ selectedTraits }: PreviewProps) {
  return (
    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-white dark:from-black/40 dark:to-black/60 ring-1 ring-border dark:ring-white/10">
      <div className="absolute inset-0 flex items-center justify-center">
        {Object.keys(selectedTraits).length > 0 ? (
          <>
            {/* Render hair back parts first */}
            {selectedTraits.hair && (
              <>
                {/* Try to render back part if it exists */}
                {getTraitBackImageUrl("hair", selectedTraits.hair) && (
                  <img
                    src={getTraitBackImageUrl("hair", selectedTraits.hair)!}
                    alt={`hair back part`}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                )}
              </>
            )}

            {/* Render all other traits in order */}
            {PREVIEW_ORDER.map((traitType) => {
              const traitId = selectedTraits[traitType];
              if (traitId) {
                return (
                  <img
                    key={traitType}
                    src={getTraitImageUrl(traitType, traitId)}
                    alt={`${traitType} trait`}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                );
              }
              return null;
            })}
          </>
        ) : (
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
        )}
      </div>
    </div>
  );
}
