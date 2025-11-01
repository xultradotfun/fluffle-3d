import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ROLE_TIERS } from "@/lib/constants";
import { useState, memo, useMemo } from "react";
import type { VoteBreakdown } from "@/types/ecosystem";

interface ProjectVotingProps {
  votes: {
    upvotes: number;
    downvotes: number;
    breakdown?: VoteBreakdown;
  };
  userVote: "up" | "down" | null;
  isVoting: boolean;
  canVote: boolean;
  cooldown?: boolean;
  onVote: (vote: "up" | "down") => void;
}

function ProjectVotingComponent({
  votes,
  userVote,
  isVoting,
  canVote,
  cooldown,
  onVote,
}: ProjectVotingProps) {
  const [isMobileTooltipOpen, setIsMobileTooltipOpen] = useState(false);

  const filteredVotes = useMemo(() => {
    if (!votes.breakdown) {
      return {
        upvotes: votes.upvotes || 0,
        downvotes: votes.downvotes || 0,
      };
    }

    // Show all votes in the display
    return {
      upvotes: votes.upvotes,
      downvotes: votes.downvotes,
    };
  }, [votes]);

  const getVoteBreakdownText = (voteType: "up" | "down") => {
    if (!votes.breakdown)
      return (
        <div className="text-gray-500 dark:text-gray-400">No votes yet</div>
      );

    const breakdownLines = [...ROLE_TIERS]
      .reverse()
      .map((role) => {
        const roleVotes = votes.breakdown![role.name] || { up: 0, down: 0 };
        const count = voteType === "up" ? roleVotes.up : roleVotes.down;
        if (count === 0) return null;
        return (
          <div
            key={role.name}
            className="flex justify-between items-center gap-3 py-1"
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  voteType === "up"
                    ? "bg-emerald-500 dark:bg-emerald-400"
                    : "bg-red-500 dark:bg-red-400"
                )}
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {role.name}
              </span>
            </div>
            <span
              className={cn(
                "font-semibold tabular-nums",
                voteType === "up"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {voteType === "up" ? "+" : "-"}
              {count}
            </span>
          </div>
        );
      })
      .filter(Boolean);

    return breakdownLines.length > 0 ? (
      <div className="space-y-0.5">
        {breakdownLines}
        <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-white/[0.08] text-xs text-gray-500 dark:text-gray-400">
          Note: Project sorting excludes MiniETH votes
        </div>
      </div>
    ) : (
      <div className="text-gray-500 dark:text-gray-400">No votes yet</div>
    );
  };

  const getCombinedBreakdownText = () => {
    if (!votes.breakdown)
      return (
        <div className="text-gray-500 dark:text-gray-400">No votes yet</div>
      );

    const breakdownLines = [...ROLE_TIERS]
      .reverse()
      .map((role) => {
        const roleVotes = votes.breakdown![role.name] || { up: 0, down: 0 };
        if (roleVotes.up === 0 && roleVotes.down === 0) return null;
        return (
          <div
            key={role.name}
            className="flex justify-between items-center gap-3 py-1"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 dark:from-emerald-400 dark:to-blue-400" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {role.name}
              </span>
            </div>
            <div className="flex items-center gap-2 font-semibold tabular-nums">
              <span className="text-emerald-600 dark:text-emerald-400">
                +{roleVotes.up}
              </span>
              <span className="text-gray-400 dark:text-gray-500">/</span>
              <span className="text-red-600 dark:text-red-400">
                -{roleVotes.down}
              </span>
            </div>
          </div>
        );
      })
      .filter(Boolean);

    return breakdownLines.length > 0 ? (
      <div className="space-y-0.5">
        {breakdownLines}
        <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-white/[0.08] text-xs text-gray-500 dark:text-gray-400">
          Note: Project sorting excludes MiniETH votes
        </div>
      </div>
    ) : (
      <div className="text-gray-500 dark:text-gray-400">No votes yet</div>
    );
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              onClick={() => onVote("up")}
              disabled={isVoting || cooldown}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  userVote === "up"
                    ? "bg-emerald-100 dark:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30 dark:ring-emerald-500/50"
                    : "bg-white dark:bg-white/[0.05] text-emerald-600/60 dark:text-emerald-400/60 shadow-[0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10"
                }
                ${
                  (isVoting || cooldown) &&
                  "cursor-not-allowed opacity-50 hover:bg-white dark:hover:bg-white/[0.05]"
                }
              `}
            >
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${
                  userVote === "up"
                    ? "text-emerald-600 dark:text-emerald-300"
                    : "text-emerald-500/60 dark:text-emerald-400/60"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
              <span className="min-w-[1.5rem] text-center tabular-nums">
                {filteredVotes.upvotes}
              </span>
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="top"
              align="center"
              sideOffset={5}
              className="z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-4 py-3 rounded-xl text-sm text-gray-900 dark:text-gray-100 shadow-xl border border-gray-200/50 dark:border-white/[0.08] select-none touch-none"
              avoidCollisions={true}
              collisionPadding={16}
              sticky="partial"
            >
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200/50 dark:border-white/[0.08]">
                <svg
                  className="w-4 h-4 text-emerald-500 dark:text-emerald-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                <span className="font-semibold">Upvotes Breakdown</span>
              </div>
              <div className="min-w-[180px] space-y-1">
                {getVoteBreakdownText("up")}
              </div>
              <Tooltip.Arrow className="fill-white/95 dark:fill-gray-900/95" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              onClick={() => onVote("down")}
              disabled={isVoting || cooldown}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  userVote === "down"
                    ? "bg-red-100 dark:bg-red-500/30 text-red-700 dark:text-red-300 ring-1 ring-red-500/30 dark:ring-red-500/50"
                    : "bg-white dark:bg-white/[0.05] text-red-600/60 dark:text-red-400/60 shadow-[0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-500/10"
                }
                ${
                  (isVoting || cooldown) &&
                  "cursor-not-allowed opacity-50 hover:bg-white dark:hover:bg-white/[0.05]"
                }
              `}
            >
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${
                  userVote === "down"
                    ? "text-red-600 dark:text-red-300"
                    : "text-red-500/60 dark:text-red-400/60"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              <span className="min-w-[1.5rem] text-center tabular-nums">
                {filteredVotes.downvotes}
              </span>
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="top"
              align="center"
              sideOffset={5}
              className="z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-4 py-3 rounded-xl text-sm text-gray-900 dark:text-gray-100 shadow-xl border border-gray-200/50 dark:border-white/[0.08] select-none touch-none"
              avoidCollisions={true}
              collisionPadding={16}
              sticky="partial"
            >
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200/50 dark:border-white/[0.08]">
                <svg
                  className="w-4 h-4 text-red-500 dark:text-red-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span className="font-semibold">Downvotes Breakdown</span>
              </div>
              <div className="min-w-[180px] space-y-1">
                {getVoteBreakdownText("down")}
              </div>
              <Tooltip.Arrow className="fill-white/95 dark:fill-gray-900/95" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>

      {/* Mobile Info Button */}
      <Tooltip.Root
        open={isMobileTooltipOpen}
        onOpenChange={setIsMobileTooltipOpen}
        delayDuration={0}
      >
        <Tooltip.Trigger asChild>
          <button
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-white/[0.05] shadow-[0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-all duration-200"
            aria-label="Vote breakdown"
            onClick={() => setIsMobileTooltipOpen(true)}
          >
            ⓘ
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-4 py-3 rounded-xl text-sm text-gray-900 dark:text-gray-100 shadow-xl border border-gray-200/50 dark:border-white/[0.08] select-none touch-none"
            side="top"
            sideOffset={5}
            align="center"
            avoidCollisions={true}
            collisionPadding={16}
            sticky="partial"
            onPointerDownOutside={() => setIsMobileTooltipOpen(false)}
            onEscapeKeyDown={() => setIsMobileTooltipOpen(false)}
          >
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200/50 dark:border-white/[0.08]">
              <svg
                className="w-4 h-4 text-blue-500 dark:text-blue-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-semibold">Vote Breakdown</span>
            </div>
            <div className="min-w-[180px] space-y-1">
              {getCombinedBreakdownText()}
            </div>
            <Tooltip.Arrow className="fill-white/95 dark:fill-gray-900/95" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </div>
  );
}

export const ProjectVoting = memo(ProjectVotingComponent);
