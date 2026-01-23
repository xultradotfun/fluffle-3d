import { TraitType } from "@/types/traits";
import { TRAIT_CATEGORIES } from "@/utils/traitUtils";
import { SelectedTraits } from "@/types/traits";
import { Button } from "@/components/ui/Button";
import { colors } from "@/lib/colors";

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
      {TRAIT_CATEGORIES.map((type) => {
        const isActive = activeCategory === type;
        return (
          <Button
            key={type}
            variant={isActive ? "brutalist-active" : "brutalist"}
            size="sm"
            cornerSize={6}
            onClick={() => onCategorySelect(type)}
            className="text-xs"
            style={{ color: isActive ? colors.foreground : colors.background }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ")}
            {selectedTraits[type] && (
              <span className="ml-2 w-2 h-2 bg-green border-2 border-background inline-block" />
            )}
          </Button>
        );
      })}
    </div>
  );
}
