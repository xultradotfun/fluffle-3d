"use client";

import { useEffect, useState } from "react";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";
import { toast } from "sonner";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectLinks } from "./ProjectLinks";
import { ProjectVoting } from "./ProjectVoting";
import * as Tooltip from "@radix-ui/react-tooltip";

interface VoteBreakdown {
  [roleName: string]: {
    up: number;
    down: number;
  };
}

interface Project {
  name: string;
  twitter: string;
  website?: string;
  discord?: string;
  telegram?: string;
  description: string;
  category: string;
  megaMafia: boolean;
  testnet: boolean;
  guide?: boolean;
  votes?: {
    upvotes: number;
    downvotes: number;
    userVote: "up" | "down" | null;
    breakdown: VoteBreakdown;
  };
}

interface ProjectCardProps {
  project: Project;
  isLoadingVotes: boolean;
}

export function ProjectCard({ project, isLoadingVotes }: ProjectCardProps) {
  const { user, login } = useDiscordAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [votes, setVotes] = useState({
    upvotes: project.votes?.upvotes || 0,
    downvotes: project.votes?.downvotes || 0,
    breakdown: project.votes?.breakdown,
  });
  const [userVote, setUserVote] = useState<"up" | "down" | null>(
    project.votes?.userVote || null
  );

  const guideUrl = project.guide
    ? `/explore/${project.twitter.toLowerCase()}`
    : undefined;

  useEffect(() => {
    if (project.votes) {
      setVotes({
        upvotes: project.votes.upvotes,
        downvotes: project.votes.downvotes,
        breakdown: project.votes.breakdown,
      });
      if (user && project.votes.userVote) {
        setUserVote(project.votes.userVote);
      } else {
        setUserVote(null);
      }
    }
  }, [project.votes, user]);

  const handleVote = async (vote: "up" | "down") => {
    if (!user) {
      login();
      return;
    }

    if (!user.canVote) {
      toast.error("You need the MiniETH role to vote");
      return;
    }

    if (cooldown) {
      toast.error("Please wait a moment before voting again");
      return;
    }

    if (isLoadingVotes) {
      toast.error("Please wait while votes are being loaded");
      return;
    }

    const previousVotes = { ...votes };
    const previousUserVote = userVote;
    const previousBreakdown = votes.breakdown
      ? { ...votes.breakdown }
      : undefined;

    try {
      setIsVoting(true);
      setCooldown(true);

      setTimeout(() => {
        setCooldown(false);
      }, 1000);

      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          twitter: project.twitter,
          vote,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            "Rate limit reached: You can cast up to 15 votes every 5 minutes. This helps prevent spam and ensures fair voting. Please try again later."
          );
        }
        throw new Error(data.error || "Failed to vote");
      }

      setVotes({
        upvotes: data.upvotes,
        downvotes: data.downvotes,
        breakdown: data.breakdown,
      });
      setUserVote(data.userVote);

      if (project.votes) {
        project.votes.upvotes = data.upvotes;
        project.votes.downvotes = data.downvotes;
        project.votes.userVote = data.userVote;
        project.votes.breakdown = data.breakdown;
      }
    } catch (error) {
      console.error("Failed to vote:", error);
      if (error instanceof Error) {
        if (error.message.includes("Rate limit")) {
          toast.error(error.message, {
            duration: 5000,
          });
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to vote");
      }
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Tooltip.Provider delayDuration={0} skipDelayDuration={0}>
      <div
        className={`group bg-background border-2 border-foreground hover:shadow-[8px_8px_0_hsl(var(--foreground))] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 ${
          isLoadingVotes ? "opacity-75" : ""
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <ProjectHeader
            name={project.name}
            twitter={project.twitter}
            category={project.category}
            megaMafia={project.megaMafia}
            testnet={project.testnet}
          />

          <p className="text-base leading-relaxed mb-6 flex-grow">
            {project.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto pt-4 border-t-2 border-foreground">
            <div className="flex items-center gap-3">
              <ProjectLinks
                website={project.website}
                discord={project.discord}
                telegram={project.telegram}
                guide={guideUrl}
              />
            </div>
            <div className="flex-shrink-0 self-end sm:self-auto">
              <ProjectVoting
                votes={votes}
                userVote={userVote}
                isVoting={isVoting || isLoadingVotes}
                canVote={!!user?.canVote}
                cooldown={cooldown}
                onVote={handleVote}
              />
            </div>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
