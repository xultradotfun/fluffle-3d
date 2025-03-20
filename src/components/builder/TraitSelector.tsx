"use client";

import { TraitType } from "@/types/traits";
import { getTraitOptions, getTraitDisplayName } from "@/utils/traitUtils";

interface TraitSelectorProps {
  type: TraitType;
  selectedId?: string;
  onSelect: (id: string | null) => void;
}

export default function TraitSelector({
  type,
  selectedId,
  onSelect,
}: TraitSelectorProps) {
  const options = getTraitOptions(type);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* None option */}
      <button
        onClick={() => onSelect(null)}
        className={`aspect-square rounded-lg p-2 flex flex-col items-center justify-center gap-2 transition-colors ${
          !selectedId
            ? "bg-primary text-primary-foreground"
            : "bg-card hover:bg-card/80 text-card-foreground"
        }`}
      >
        <div className="w-full aspect-square rounded-lg bg-background/50 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <span className="text-sm font-medium truncate">None</span>
      </button>

      {/* Trait options */}
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`aspect-square rounded-lg p-2 flex flex-col items-center justify-center gap-2 transition-colors ${
            selectedId === option.id
              ? "bg-primary text-primary-foreground"
              : "bg-card hover:bg-card/80 text-card-foreground"
          }`}
        >
          <div className="w-full aspect-square rounded-lg bg-background/50 overflow-hidden">
            <img
              src={option.imageUrl}
              alt={option.displayName}
              className="w-full h-full object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
          <span
            className="text-sm font-medium truncate"
            title={option.displayName}
          >
            {option.displayName}
          </span>
          {option.tribe && (
            <span className="text-xs text-muted-foreground truncate">
              {option.tribe}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
