import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ROLE_TIERS } from "@/lib/constants";
import { useState, memo, useMemo, useEffect } from "react";
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

// Utility function to abbreviate large numbers
function abbreviateNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredVotes = useMemo(() => {
    return {
      upvotes: votes.upvotes || 0,
      downvotes: votes.downvotes || 0,
    };
  }, [votes]);

  const displayVotes = useMemo(() => {
    return {
      upvotes: isMobile
        ? abbreviateNumber(filteredVotes.upvotes)
        : filteredVotes.upvotes.toString(),
      downvotes: isMobile
        ? abbreviateNumber(filteredVotes.downvotes)
        : filteredVotes.downvotes.toString(),
    };
  }, [filteredVotes, isMobile]);

  const getVoteBreakdownText = (voteType: "up" | "down") => {
    if (!votes.breakdown)
      return <div className="font-bold uppercase">NO VOTES YET</div>;

    const breakdownLines = [...ROLE_TIERS]
      .reverse()
      .map((role) => {
        const roleVotes = votes.breakdown![role.name] || { up: 0, down: 0 };
        const count = voteType === "up" ? roleVotes.up : roleVotes.down;
        if (count === 0) return null;
        return (
          <div
            key={role.name}
            className="flex justify-between items-center gap-4 py-1 border-b-2 border-foreground"
          >
            <span className="font-bold uppercase text-xs">{role.name}</span>
            <span className="font-black font-data">
              {voteType === "up" ? "+" : "-"}
              {count}
            </span>
          </div>
        );
      })
      .filter(Boolean);

    return breakdownLines.length > 0 ? (
      <div className="space-y-1">
        {breakdownLines}
        <div className="mt-3 pt-3 border-t-3 border-foreground text-xs font-bold uppercase">
          SORTING EXCLUDES MINIETH
        </div>
      </div>
    ) : (
      <div className="font-bold uppercase">NO VOTES YET</div>
    );
  };

  const getCombinedBreakdownText = () => {
    if (!votes.breakdown)
      return <div className="font-bold uppercase">NO VOTES YET</div>;

    const breakdownLines = [...ROLE_TIERS]
      .reverse()
      .map((role) => {
        const roleVotes = votes.breakdown![role.name] || { up: 0, down: 0 };
        if (roleVotes.up === 0 && roleVotes.down === 0) return null;
        return (
          <div
            key={role.name}
            className="flex justify-between items-center gap-4 py-2 border-b-2 border-foreground"
          >
            <span className="font-bold uppercase text-xs">{role.name}</span>
            <div className="flex items-center gap-3 font-black font-data">
              <span className="text-foreground">+{roleVotes.up}</span>
              <span className="text-muted-foreground">-{roleVotes.down}</span>
            </div>
          </div>
        );
      })
      .filter(Boolean);

    return breakdownLines.length > 0 ? (
      <div className="space-y-0">
        {breakdownLines}
        <div className="mt-3 pt-3 border-t-3 border-foreground text-xs font-bold uppercase">
          SORTING EXCLUDES MINIETH
        </div>
      </div>
    ) : (
      <div className="font-bold uppercase">NO VOTES YET</div>
    );
  };

  return (
    <div>
      {/* Outer wrapper with clip-path only */}
      <div
        style={{
          clipPath:
            "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
        }}
      >
        {/* Middle border layer - light with padding */}
        <div style={{ backgroundColor: "#dfd9d9", padding: "2px" }}>
          {/* Inner content layer - dark with same clip-path */}
          <div
            className="p-2"
            style={{
              backgroundColor: "#19191a",
              clipPath:
                "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
            }}
          >
            <div className="flex items-center gap-2">
              {/* Upvote Button */}
              <Tooltip.Root delayDuration={0}>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => !isVoting && !cooldown && onVote("up")}
                    disabled={isVoting || cooldown || !canVote}
                    className={cn(
                      "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 border-3 border-background font-black font-data text-xs sm:text-sm uppercase",
                      userVote === "up"
                        ? "bg-green"
                        : "bg-transparent hover:bg-green",
                      (isVoting || cooldown || !canVote) &&
                        "opacity-50 cursor-not-allowed"
                    )}
                    style={{
                      color: "#dfd9d9",
                      clipPath:
                        "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                    }}
                  >
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 4l-8 8h5v8h6v-8h5z" />
                    </svg>
                    <span>{displayVotes.upvotes}</span>
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    align="center"
                    sideOffset={8}
                    className="z-50 max-w-[280px] border-3 border-background p-4"
                    style={{
                      backgroundColor: "#19191a",
                      color: "#dfd9d9",
                      clipPath:
                        "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                    }}
                  >
                    {getVoteBreakdownText("up")}
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              {/* Downvote Button */}
              <Tooltip.Root delayDuration={0}>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => !isVoting && !cooldown && onVote("down")}
                    disabled={isVoting || cooldown || !canVote}
                    className={cn(
                      "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 border-3 border-background font-black font-data text-xs sm:text-sm uppercase",
                      userVote === "down"
                        ? "bg-red"
                        : "bg-transparent hover:bg-red",
                      (isVoting || cooldown || !canVote) &&
                        "opacity-50 cursor-not-allowed"
                    )}
                    style={{
                      color: "#dfd9d9",
                      clipPath:
                        "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                    }}
                  >
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 20l8-8h-5V4H9v8H4z" />
                    </svg>
                    <span>{displayVotes.downvotes}</span>
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    align="center"
                    sideOffset={8}
                    className="z-50 max-w-[280px] border-3 border-background p-4"
                    style={{
                      backgroundColor: "#19191a",
                      color: "#dfd9d9",
                      clipPath:
                        "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                    }}
                  >
                    {getVoteBreakdownText("down")}
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              {/* Mobile Info Button */}
              <Tooltip.Root
                open={isMobileTooltipOpen}
                onOpenChange={setIsMobileTooltipOpen}
              >
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    className="sm:hidden p-2 border-3 border-background bg-transparent hover:bg-pink"
                    onClick={() => setIsMobileTooltipOpen(true)}
                    style={{
                      color: "#dfd9d9",
                      clipPath:
                        "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                    }}
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    align="center"
                    sideOffset={8}
                    className="z-50 max-w-[280px] border-3 border-background p-4"
                    style={{
                      backgroundColor: "#19191a",
                      color: "#dfd9d9",
                      clipPath:
                        "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                    }}
                    onPointerDownOutside={() => setIsMobileTooltipOpen(false)}
                    onEscapeKeyDown={() => setIsMobileTooltipOpen(false)}
                  >
                    {getCombinedBreakdownText()}
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ProjectVoting = memo(ProjectVotingComponent);
