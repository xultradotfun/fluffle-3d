import { cn } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";

interface SortSelectorProps {
  sortMethod: {
    type: "alphabetical" | "score";
    direction: "asc" | "desc";
  };
  onSortChange: (method: {
    type: "alphabetical" | "score";
    direction: "asc" | "desc";
  }) => void;
  includeMinieth: boolean;
  onMiniethChange: (include: boolean) => void;
}

export function SortSelector({
  sortMethod,
  onSortChange,
  includeMinieth,
  onMiniethChange,
}: SortSelectorProps) {
  const handleSortClick = (type: "alphabetical" | "score") => {
    if (sortMethod.type === type) {
      // Toggle direction if same type
      onSortChange({
        type,
        direction: sortMethod.direction === "asc" ? "desc" : "asc",
      });
    } else {
      // Set default direction for new type
      onSortChange({
        type,
        direction: type === "alphabetical" ? "asc" : "desc",
      });
    }
  };

  return (
    <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
      <button
        onClick={() => handleSortClick("alphabetical")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
          sortMethod.type === "alphabetical"
            ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/10 text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
        )}
      >
        <svg
          className={cn(
            "w-4 h-4 transition-transform",
            sortMethod.type === "alphabetical" &&
              sortMethod.direction === "desc" &&
              "rotate-180"
          )}
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

      <div className="flex items-center gap-1">
        <button
          onClick={() => handleSortClick("score")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
            sortMethod.type === "score"
              ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/10 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
          )}
        >
          <svg
            className={cn(
              "w-4 h-4 transition-transform",
              sortMethod.type === "score" &&
                sortMethod.direction === "asc" &&
                "rotate-180"
            )}
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

        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              className={cn(
                "p-1.5 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-white/5",
                sortMethod.type === "score"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              )}
              aria-label="Score settings"
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="z-50 w-[260px] bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200/50 dark:border-white/[0.08] backdrop-blur-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
              sideOffset={5}
              align="end"
            >
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Score Settings
                    </span>
                  </div>
                  <Popover.Close
                    className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    aria-label="Close"
                  >
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Popover.Close>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Vote Counting
                  </div>
                  <button
                    onClick={() => onMiniethChange(!includeMinieth)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm transition-all hover:bg-gray-50 dark:hover:bg-white/[0.02]",
                      includeMinieth
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span>Include Minieth Votes</span>
                    </div>
                    <div
                      className={cn(
                        "relative w-9 h-5 rounded-full transition-colors",
                        includeMinieth
                          ? "bg-blue-500"
                          : "bg-gray-200 dark:bg-white/10"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform",
                          includeMinieth && "translate-x-4"
                        )}
                      />
                    </div>
                  </button>
                </div>

                <div className="pt-3 border-t border-gray-200/50 dark:border-white/[0.08] text-xs text-gray-500 dark:text-gray-400">
                  {includeMinieth
                    ? "All votes are counted in the total score"
                    : "Minieth votes are excluded from the total score"}
                </div>
              </div>
              <Popover.Arrow className="fill-white dark:fill-gray-900" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
}
