"use client";

import { useState } from "react";
import { SelectedTraits, TraitType } from "@/types/traits";
import { getRandomTraits, getTraitOptions } from "@/utils/traitUtils";
import Preview from "./Preview";
import TraitSelector from "./TraitSelector";

const TRAIT_CATEGORIES: { label: string; type: TraitType }[] = [
  { label: "Skin", type: "skin" },
  { label: "Eyes", type: "eyeball" },
  { label: "Eyeliner", type: "eyeliner" },
  { label: "Eyeliner (Skin 2)", type: "eyeliner_for_skin_2" },
  { label: "Eyeliner (Skin 3)", type: "eyeliner_for_skin_3" },
  { label: "Eyebrows", type: "eyebrow" },
  { label: "Eyebrows (Skin 3)", type: "eyebrow_for_skin_3" },
  { label: "Mouth (Skin 3)", type: "mouth_for_skin_3" },
  { label: "Hair", type: "hair" },
  { label: "Ears", type: "ear" },
  { label: "Head", type: "head" },
  { label: "Face", type: "face" },
  { label: "Clothes", type: "clothes" },
];

export default function NFTBuilder() {
  const [selectedTraits, setSelectedTraits] = useState<SelectedTraits>(
    getRandomTraits()
  );

  const handleTraitSelect = (type: TraitType, id: string | null) => {
    setSelectedTraits((prev) => ({
      ...prev,
      [type]: id ?? undefined,
    }));
  };

  const handleRandomize = () => {
    setSelectedTraits(getRandomTraits());
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        {/* Preview Section */}
        <div className="w-full">
          <Preview selectedTraits={selectedTraits} />
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleRandomize}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Randomize
            </button>
          </div>
        </div>

        {/* Trait Selection Section */}
        <div className="grid gap-8">
          {TRAIT_CATEGORIES.map(({ label, type }) => (
            <div key={type}>
              <h3 className="text-lg font-semibold mb-4">{label}</h3>
              <TraitSelector
                type={type}
                options={getTraitOptions(type)}
                selectedId={selectedTraits[type]}
                onSelect={(id) => handleTraitSelect(type, id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
