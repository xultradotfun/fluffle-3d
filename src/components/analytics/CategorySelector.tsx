import { Badge } from "@/components/ui/Badge";
import type { TraitCategory } from "@/utils/traitsAnalytics";

interface CategorySelectorProps {
  categories: TraitCategory[];
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}

export function CategorySelector({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => onSelectCategory(category.name)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedCategory === category.name
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "bg-card dark:bg-white/5 text-muted-foreground hover:bg-accent dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white border border-border dark:border-white/10"
          }`}
        >
          <div className="flex items-center gap-2">
            {category.name}
            <Badge variant="secondary" size="sm">
              {category.traits.length}
            </Badge>
          </div>
        </button>
      ))}
    </div>
  );
}
