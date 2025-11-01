"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";
import { apiClient, API_ENDPOINTS } from "@/lib/api";
import { toast } from "sonner";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectLinks } from "./ProjectLinks";
import { ProjectVoting } from "./ProjectVoting";
import * as Tooltip from "@radix-ui/react-tooltip";
import type { Project } from "@/types/ecosystem";

interface ProjectCardProps {
  project: Project;
  isLoadingVotes: boolean;
  onVoteUpdate?: (twitter: string, voteData: any) => void;
}

function ProjectCardComponent({
  project,
  isLoadingVotes,
  onVoteUpdate,
}: ProjectCardProps) {
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

  const handleVote = useCallback(
    async (vote: "up" | "down") => {
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

        setVotes({
          upvotes: data.upvotes,
          downvotes: data.downvotes,
          breakdown: data.breakdown,
        });
        setUserVote(data.userVote);

        if (onVoteUpdate) {
          onVoteUpdate(project.twitter, data);
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
    },
    [user, login, cooldown, isLoadingVotes, project.twitter, onVoteUpdate]
  );

  return (
    <Tooltip.Provider delayDuration={0} skipDelayDuration={0}>
      <div
        className={`group h-full ${isLoadingVotes ? "opacity-50" : ""}`}
        style={{
          clipPath:
            "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
        }}
      >
        <div
          className="h-full"
          style={{
            backgroundColor: "#19191a",
            padding: "2px",
          }}
        >
          <div
            className="h-full relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(224, 224, 224, 0.5) 0%, rgba(224, 224, 224, 0.45) 100%)",
              clipPath:
                "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
            }}
          >
            {/* Background icon layer - behind content */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url(/avatars/${project.twitter}.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                filter: "blur(8px) saturate(1.3) brightness(0.7)",
                opacity: 0.7,
              }}
            />
            {/* Heavy grain/noise overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.8' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                opacity: 0.35,
                mixBlendMode: "overlay",
              }}
            />
            {/* Content wrapper */}
            <div className="p-6 flex flex-col h-full relative z-10 text-white">
              <ProjectHeader
                name={project.name}
                twitter={project.twitter}
                category={project.category}
                megaMafia={project.megaMafia}
                testnet={project.testnet}
              />

              <p className="text-sm font-bold uppercase mb-6 flex-grow leading-snug text-white">
                {project.description}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t-3 border-white">
                <div className="flex items-center gap-3">
                  <ProjectLinks
                    website={project.website}
                    discord={project.discord}
                    telegram={project.telegram}
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
            {/* End content wrapper */}
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
}

export const ProjectCard = memo(ProjectCardComponent);
