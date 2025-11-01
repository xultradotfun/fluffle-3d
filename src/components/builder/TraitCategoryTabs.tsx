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
                className={`px-3 py-2 border-3 border-foreground text-xs font-black uppercase transition-colors ${
                  activeCategory === type
                    ? "bg-pink text-foreground"
                    : "bg-card-foreground text-background hover:bg-pink hover:text-foreground"
                }`}
              >
          {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ")}
          {selectedTraits[type] && (
            <span className="ml-2 w-2 h-2 bg-green border-2 border-foreground inline-block" />
          )}
        </button>
      ))}
    </div>
  );
}
