import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ROLE_TIERS } from "@/lib/constants";
import { useState } from "react";

interface VoteBreakdown {
  [roleName: string]: {
    up: number;
    down: number;
  };
}

interface ProjectVotingProps {
  votes: {
    upvotes: number;
    downvotes: number;
    breakdown?: VoteBreakdown;
  };
  userVote: "up" | "down" | null;
  isVoting: boolean;
  canVote: boolean;
  onVote: (type: "up" | "down") => void;
}

export function ProjectVoting({
  votes,
  userVote,
  isVoting,
  canVote,
  onVote,
}: ProjectVotingProps) {
  const [isMobileTooltipOpen, setIsMobileTooltipOpen] = useState(false);

  const getVoteBreakdownText = (voteType: "up" | "down") => {
    if (!votes.breakdown) return "";

    return [...ROLE_TIERS]
      .reverse()
      .map((role) => {
        const roleVotes = votes.breakdown![role.name] || { up: 0, down: 0 };
        const count = voteType === "up" ? roleVotes.up : roleVotes.down;
        if (count === 0) return null;
        return `${role.name}: ${count}`;
      })
      .filter(Boolean)
      .join("\n");
  };

  const getCombinedBreakdownText = () => {
    if (!votes.breakdown) return "No votes yet";

    return [...ROLE_TIERS]
      .reverse()
      .map((role) => {
        const roleVotes = votes.breakdown![role.name] || { up: 0, down: 0 };
        if (roleVotes.up === 0 && roleVotes.down === 0) return null;
        return `${role.name}: +${roleVotes.up} / -${roleVotes.down}`;
      })
      .filter(Boolean)
      .join("\n");
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              onClick={() => onVote("up")}
              disabled={isVoting}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium rounded-md px-2 py-1 transition-all",
                !canVote && "opacity-50 cursor-not-allowed",
                userVote === "up"
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400"
              )}
            >
              <svg
                className={cn(
                  "w-4 h-4 transition-transform",
                  userVote === "up" && "text-green-500"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
              <span>{votes.upvotes}</span>
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm whitespace-pre shadow-xl border border-white/10 select-none touch-none hidden sm:block"
              side="top"
              sideOffset={5}
              align="center"
              avoidCollisions={true}
              collisionPadding={16}
              sticky="partial"
            >
              <div className="font-medium mb-2 pb-2 border-b border-white/10">
                Upvotes Breakdown
              </div>
              {getVoteBreakdownText("up") || "No votes yet"}
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>

        <div className="w-px h-4 bg-gray-200 dark:bg-white/10" />

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              onClick={() => onVote("down")}
              disabled={isVoting}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium rounded-md px-2 py-1 transition-all",
                !canVote && "opacity-50 cursor-not-allowed",
                userVote === "down"
                  ? "bg-red-500/10 text-red-600 dark:text-red-400"
                  : "hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400"
              )}
            >
              <svg
                className={cn(
                  "w-4 h-4 transition-transform",
                  userVote === "down" && "text-red-500"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              <span>{votes.downvotes}</span>
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm whitespace-pre shadow-xl border border-white/10 select-none touch-none hidden sm:block"
              side="top"
              sideOffset={5}
              align="center"
              avoidCollisions={true}
              collisionPadding={16}
              sticky="partial"
            >
              <div className="font-medium mb-2 pb-2 border-b border-white/10">
                Downvotes Breakdown
              </div>
              {getVoteBreakdownText("down") || "No votes yet"}
              <Tooltip.Arrow className="fill-gray-900" />
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
            className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400"
            aria-label="Vote breakdown"
            onClick={() => setIsMobileTooltipOpen(true)}
          >
            ⓘ
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm whitespace-pre shadow-xl border border-white/10 select-none touch-none"
            side="top"
            sideOffset={5}
            align="center"
            avoidCollisions={true}
            collisionPadding={16}
            sticky="partial"
            onPointerDownOutside={() => setIsMobileTooltipOpen(false)}
            onEscapeKeyDown={() => setIsMobileTooltipOpen(false)}
          >
            <div className="font-medium mb-2 pb-2 border-b border-white/10">
              Vote Breakdown
            </div>
            {getCombinedBreakdownText()}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </div>
  );
}
