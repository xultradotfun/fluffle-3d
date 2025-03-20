"use client";

import { useState, useEffect } from "react";
import { SelectedTraits, TraitType } from "@/types/traits";
import {
  TRAIT_CATEGORIES,
  getRandomTraits,
  getTraitOptions,
} from "@/utils/traitUtils";
import Preview from "./Preview";
import TraitSelector from "./TraitSelector";

export default function NFTBuilder() {
  const [selectedTraits, setSelectedTraits] = useState<SelectedTraits>({});
  const [activeCategory, setActiveCategory] = useState<TraitType>("skin");

  // Initialize with random traits
  useEffect(() => {
    setSelectedTraits(getRandomTraits());
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

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Preview Section */}
        <div className="w-full lg:w-1/2">
          <Preview selectedTraits={selectedTraits} />
          <button
            onClick={handleRandomize}
            className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Randomize
          </button>
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
