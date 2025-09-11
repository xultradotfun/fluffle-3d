"use client";

import { useEffect, useState } from "react";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";
import { apiClient, API_ENDPOINTS } from "@/lib/api";
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

      const data = await apiClient.post(API_ENDPOINTS.VOTES.SUBMIT, {
        twitter: project.twitter,
        vote,
        userId: user.id,
      });

      // Backend now returns the same format as original Next.js API
      setVotes({
        upvotes: data.upvotes,
        downvotes: data.downvotes,
        breakdown: data.breakdown,
      });
      setUserVote(data.userVote);

      // Update the project data for other components
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
        className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50/80 dark:from-white/[0.03] dark:to-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-all duration-300 shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-blue-500/5 ${
          isLoadingVotes ? "opacity-75" : ""
        }`}
      >
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.04),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative p-6 sm:p-8 flex flex-col h-full">
          <ProjectHeader
            name={project.name}
            twitter={project.twitter}
            category={project.category}
            megaMafia={project.megaMafia}
            testnet={project.testnet}
          />

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto pt-4 border-t border-gray-200/80 dark:border-white/[0.06]">
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
