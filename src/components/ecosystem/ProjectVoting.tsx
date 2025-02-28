import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ROLE_TIERS } from "@/lib/constants";
import { useState } from "react";
import { calculateProjectScore } from "@/lib/utils";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

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
    userVote?: "up" | "down" | null;
    breakdown?: VoteBreakdown;
  };
  userVote: "up" | "down" | null;
  isVoting: boolean;
  canVote: boolean;
  cooldown: boolean;
  onVote: (type: "up" | "down") => void;
  includeMiniethVotes: boolean;
}

export function ProjectVoting({
  votes,
  userVote,
  isVoting,
  canVote,
  cooldown,
  onVote,
  includeMiniethVotes,
}: ProjectVotingProps) {
  const [isMobileTooltipOpen, setIsMobileTooltipOpen] = useState(false);
  const score = calculateProjectScore(votes);

  const getFilteredVoteCounts = () => {
    if (includeMiniethVotes || !votes.breakdown) {
      return {
        upvotes: votes.upvotes,
        downvotes: votes.downvotes,
      };
    }

    // Calculate filtered vote counts
    let upvotes = 0;
    let downvotes = 0;
    for (const [role, counts] of Object.entries(votes.breakdown)) {
      if (role.toLowerCase() !== "minieth") {
        upvotes += counts.up;
        downvotes += counts.down;
      }
    }
    return { upvotes, downvotes };
  };

  const filteredVotes = getFilteredVoteCounts();

  const getVoteBreakdownText = (voteType: "up" | "down") => {
    if (!votes.breakdown)
      return (
        <div className="text-gray-500 dark:text-gray-400">No votes yet</div>
      );

    const breakdownLines = [...ROLE_TIERS]
      .reverse()
      .map((role) => {
        const roleVotes = votes.breakdown![role.name] || { up: 0, down: 0 };
        // Skip Minieth votes if they're excluded
        if (!includeMiniethVotes && role.name.toLowerCase() === "minieth") {
          return null;
        }
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
          {includeMiniethVotes
            ? "Showing all votes"
            : "Excluding MiniETH votes"}
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
        // Skip Minieth votes if they're excluded
        if (!includeMiniethVotes && role.name.toLowerCase() === "minieth") {
          return null;
        }
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
          {includeMiniethVotes
            ? "Showing all votes"
            : "Excluding MiniETH votes"}
        </div>
      </div>
    ) : (
      <div className="text-gray-500 dark:text-gray-400">No votes yet</div>
    );
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className="text-sm font-medium px-2 py-0.5 rounded bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-blue-500 dark:text-blue-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
            <span
              className={cn(
                score >= 7
                  ? "text-emerald-600 dark:text-emerald-400"
                  : score >= 4
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              {score}
            </span>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            sideOffset={5}
            className="z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-4 py-3 rounded-xl text-sm text-gray-900 dark:text-gray-100 shadow-xl border border-gray-200/50 dark:border-white/[0.08] select-none touch-none max-w-[350px]"
          >
            <div className="space-y-2.5">
              <p className="font-medium">Project Score: {score}/10</p>
              <div className="text-xs space-y-1.5">
                <p className="text-gray-600 dark:text-gray-300">
                  Score based on:
                </p>
                <ul className="text-gray-500 dark:text-gray-400 list-disc pl-4 space-y-1">
                  <li>Vote quality (weighted by role)</li>
                  <li>Total engagement level</li>
                </ul>
                <div className="pt-1.5 pb-0.5 text-gray-600 dark:text-gray-300">
                  Formula:
                </div>
                <div className="px-3 py-2 bg-gray-50 dark:bg-white/[0.03] rounded-lg font-mono text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
                  <div className="flex flex-col items-center">
                    <BlockMath>
                      {"score = base \\cdot m_{eng} + bonus"}
                    </BlockMath>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 mb-2">
                      where:
                    </div>
                    <BlockMath>
                      {
                        "base = 5(1 + \\frac{\\sum w_r(up_r - down_r)}{\\sum w_r(up_r + down_r)})"
                      }
                    </BlockMath>
                    <BlockMath>
                      {"m_{eng} = 0.5 + 0.5(1 - e^{-votes/10})"}
                    </BlockMath>
                    <BlockMath>
                      {"bonus = \\frac{\\ln(votes + 1)}{2}"}
                    </BlockMath>
                  </div>
                  <div className="mt-2 space-y-0.5 border-t border-gray-200/50 dark:border-white/[0.08] pt-2">
                    <div>
                      <InlineMath>{"w_r"}</InlineMath> = role weight
                    </div>
                    <div>
                      <InlineMath>{"up_r, down_r"}</InlineMath> = up/down votes
                      per role
                    </div>
                    <div>
                      <InlineMath>{"votes"}</InlineMath> = total vote count
                    </div>
                    <div>
                      <InlineMath>{"m_{eng}"}</InlineMath> = engagement
                      multiplier
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 pt-1.5">
                  Role weights: Big Sequencer (21×) → Chubby Bunny (13×) →
                  Megamind (8×) → Original Mafia (5×) → MegaLevel (3×) → MiniETH
                  (1×)
                </p>
              </div>
            </div>
            <Tooltip.Arrow className="fill-white/95 dark:fill-gray-900/95" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={() => onVote("up")}
                disabled={isVoting || cooldown}
                className={`relative flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-all
                  ${
                    userVote === "up"
                      ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                      : "text-emerald-700/90 dark:text-emerald-400/90 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                  }
                  ${
                    (isVoting || cooldown) &&
                    "cursor-not-allowed opacity-50 hover:bg-transparent dark:hover:bg-transparent"
                  }
                `}
              >
                <svg
                  className={`h-4 w-4 transition-transform ${
                    userVote === "up"
                      ? "fill-emerald-500"
                      : "fill-none stroke-emerald-600/75 dark:stroke-emerald-400/75"
                  }`}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                <span>{filteredVotes.upvotes}</span>
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
                    strokeWidth="2"
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

          <div className="w-px h-4 bg-gray-200 dark:bg-white/10" />

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={() => onVote("down")}
                disabled={isVoting || cooldown}
                className={`relative flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-all
                  ${
                    userVote === "down"
                      ? "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                      : "text-red-700/90 dark:text-red-400/90 hover:bg-red-50 dark:hover:bg-red-500/10"
                  }
                  ${
                    (isVoting || cooldown) &&
                    "cursor-not-allowed opacity-50 hover:bg-transparent dark:hover:bg-transparent"
                  }
                `}
              >
                <svg
                  className={`h-4 w-4 transition-transform ${
                    userVote === "down"
                      ? "fill-red-500"
                      : "fill-none stroke-red-600/75 dark:stroke-red-400/75"
                  }`}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span>{filteredVotes.downvotes}</span>
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
                    strokeWidth="2"
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
              className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400"
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
                  strokeWidth="2"
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
    </div>
  );
}
