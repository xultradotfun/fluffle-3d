"use client";

import { TraitOption, TraitType } from "@/types/traits";

interface TraitSelectorProps {
  type: TraitType;
  options: TraitOption[];
  selectedId?: string;
  onSelect: (id: string | null) => void;
}

export default function TraitSelector({
  type,
  options,
  selectedId,
  onSelect,
}: TraitSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {/* None option */}
      <button
        onClick={() => onSelect(null)}
        className={`aspect-square rounded-lg p-2 flex flex-col items-center justify-center gap-2 transition-all ${
          !selectedId
            ? "bg-primary/10 ring-2 ring-primary"
            : "bg-card hover:bg-accent"
        }`}
      >
        <div className="w-full aspect-square rounded-md bg-background flex items-center justify-center">
          <svg
            className="w-6 h-6 text-muted-foreground"
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
        <span className="text-xs text-center font-medium">None</span>
      </button>

      {/* Trait options */}
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`aspect-square rounded-lg p-2 flex flex-col items-center justify-center gap-2 transition-all ${
            selectedId === option.id
              ? "bg-primary/10 ring-2 ring-primary"
              : "bg-card hover:bg-accent"
          }`}
        >
          <div className="w-full aspect-square rounded-md bg-background overflow-hidden">
            <img
              src={option.imageUrl}
              alt={option.displayName}
              className="w-full h-full object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
          <span className="text-xs text-center font-medium line-clamp-1">
            {option.displayName}
          </span>
        </button>
      ))}
    </div>
  );
}
