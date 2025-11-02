import { TraitType } from "@/types/traits";
import { TRAIT_CATEGORIES } from "@/utils/traitUtils";
import { SelectedTraits } from "@/types/traits";

interface TraitCategoryTabsProps {
  activeCategory: TraitType;
  selectedTraits: SelectedTraits;
  onCategorySelect: (category: TraitType) => void;
}

export default function TraitCategoryTabs({
  activeCategory,
  selectedTraits,
  onCategorySelect,
}: TraitCategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TRAIT_CATEGORIES.map((type) => (
              <button
                key={type}
                onClick={() => onCategorySelect(type)}
                className={`px-3 py-2 border-3 text-xs font-black uppercase transition-colors ${
                  activeCategory === type
                    ? "bg-pink text-foreground border-foreground"
                    : "bg-transparent border-background hover:bg-pink hover:text-foreground hover:border-foreground"
                }`}
                style={{
                  clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  color: activeCategory === type ? "#19191a" : "#dfd9d9",
                }}
              >
          {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ")}
          {selectedTraits[type] && (
            <span className="ml-2 w-2 h-2 bg-green border-2 border-background inline-block" />
          )}
        </button>
      ))}
    </div>
  );
}
