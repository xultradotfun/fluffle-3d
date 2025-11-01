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
    return {
      upvotes: votes.upvotes || 0,
      downvotes: votes.downvotes || 0,
    };
  }, [votes]);

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
    <div className="flex items-center gap-2">
      {/* Upvote Button */}
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger asChild>
          <button
            onClick={() => !isVoting && !cooldown && onVote("up")}
            disabled={isVoting || cooldown || !canVote}
            className={cn(
              "flex items-center gap-2 px-3 py-2 border-3 border-foreground font-black font-data text-sm uppercase",
              userVote === "up"
                ? "bg-green text-background"
                : "bg-[#e0e0e0] hover:bg-green hover:text-background",
              (isVoting || cooldown || !canVote) && "opacity-50 cursor-not-allowed"
            )}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4l-8 8h5v8h6v-8h5z" />
            </svg>
            <span>{filteredVotes.upvotes}</span>
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            sideOffset={8}
            className="z-50 max-w-[280px] bg-[#e0e0e0] border-3 border-foreground p-4"
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
              "flex items-center gap-2 px-3 py-2 border-3 border-foreground font-black font-data text-sm uppercase",
              userVote === "down"
                ? "bg-red text-background"
                : "bg-[#e0e0e0] hover:bg-red hover:text-background",
              (isVoting || cooldown || !canVote) && "opacity-50 cursor-not-allowed"
            )}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 20l8-8h-5V4H9v8H4z" />
            </svg>
            <span>{filteredVotes.downvotes}</span>
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            sideOffset={8}
            className="z-50 max-w-[280px] bg-[#e0e0e0] border-3 border-foreground p-4"
          >
            {getVoteBreakdownText("down")}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      {/* Mobile Info Button */}
      <Tooltip.Root open={isMobileTooltipOpen} onOpenChange={setIsMobileTooltipOpen}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            className="sm:hidden p-2 border-3 border-foreground bg-[#e0e0e0] hover:bg-pink"
            onClick={() => setIsMobileTooltipOpen(true)}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            sideOffset={8}
            className="z-50 max-w-[280px] bg-[#e0e0e0] border-3 border-foreground p-4"
            onPointerDownOutside={() => setIsMobileTooltipOpen(false)}
            onEscapeKeyDown={() => setIsMobileTooltipOpen(false)}
          >
            {getCombinedBreakdownText()}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </div>
  );
}

export const ProjectVoting = memo(ProjectVotingComponent);
