"use client";

import { SelectedTraits } from "@/types/traits";
import { getTraitImageUrl, getTraitBackImageUrl } from "@/utils/traitImageMap";

const PREVIEW_ORDER = [
  "skin",
  "eyeball",
  "eyeliner_for_skin_2",
  "eyeliner_for_skin_3",
  "eyebrow_for_skin_3",
  "mouth_for_skin_3",
  "ear",
  "face",
  "head",
  "clothes",
  "hair",
] as const;

interface PreviewProps {
  selectedTraits: SelectedTraits;
}

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
    <div className="relative aspect-square w-full max-w-xl mx-auto">
      {/* Render hair back parts first */}
      {selectedTraits.hair && (
        <div className="absolute inset-0">
          {getTraitBackImageUrl("hair", selectedTraits.hair) && (
            <img
              src={getTraitBackImageUrl("hair", selectedTraits.hair)!}
              alt="Hair back"
              className="w-full h-full object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          )}
        </div>
      )}

      {/* Render traits in order */}
      {PREVIEW_ORDER.map((type) => {
        const traitId = selectedTraits[type];
        if (!traitId) return null;

        // Skip hair front if we already rendered the back
        if (type === "hair" && getTraitBackImageUrl("hair", traitId))
          return null;

        return (
          <div key={type} className="absolute inset-0">
            <img
              src={getTraitImageUrl(type, traitId)}
              alt={`${type} trait`}
              className="w-full h-full object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        );
      })}

      {/* Render hair front parts last */}
      {selectedTraits.hair &&
        getTraitBackImageUrl("hair", selectedTraits.hair) && (
          <div className="absolute inset-0">
            <img
              src={getTraitImageUrl("hair", selectedTraits.hair)}
              alt="Hair front"
              className="w-full h-full object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        )}
    </div>
  );
}
