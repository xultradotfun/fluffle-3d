import { cn } from "@/lib/utils";

interface SortSelectorProps {
  sortMethod: "alphabetical" | "score";
  onSortChange: (method: "alphabetical" | "score") => void;
}

export function SortSelector({ sortMethod, onSortChange }: SortSelectorProps) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
      <button
        onClick={() => onSortChange("alphabetical")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
          sortMethod === "alphabetical"
            ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/10 text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
        )}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
          />
        </svg>
        <span>A-Z</span>
      </button>

      <button
        onClick={() => onSortChange("score")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
          sortMethod === "score"
            ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/10 text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
        )}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
        <span>Score</span>
      </button>
    </div>
  );
}
