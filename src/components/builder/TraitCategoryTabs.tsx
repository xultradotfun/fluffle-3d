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
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === type
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ")}
          {selectedTraits[type] && (
            <span className="ml-2 w-2 h-2 rounded-full bg-green-500 inline-block" />
          )}
        </button>
      ))}
    </div>
  );
}
