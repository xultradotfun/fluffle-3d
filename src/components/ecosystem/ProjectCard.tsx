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
import { getProjectImage } from "@/utils/projectUtils";

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
        {project.featured && (
          <style>
            {`
              @keyframes spin-border {
                0% {
                  transform: translate(-50%, -50%) rotate(0deg);
                }
                100% {
                  transform: translate(-50%, -50%) rotate(360deg);
                }
              }
            `}
          </style>
        )}
        <div
          className="h-full relative"
          style={{
            padding: "2px",
            backgroundColor: "#19191a",
          }}
        >
          {/* Spinning pink wave background for featured cards */}
          {project.featured && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                zIndex: 0,
              }}
            >
              <div
                className="absolute"
                style={{
                  top: "50%",
                  left: "50%",
                  width: "200%",
                  height: "200%",
                  background:
                    "conic-gradient(from 0deg, #f380cd 0%, #f380cd 50%, transparent 50%, transparent 100%)",
                  animation: "spin-border 3s linear infinite",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          )}
          <div
            className="h-full relative overflow-hidden"
            style={{
              clipPath:
                "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
              zIndex: 1,
              backgroundColor: "#19191a",
            }}
          >
            {/* Semi-transparent gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(224, 224, 224, 0.5) 0%, rgba(224, 224, 224, 0.45) 100%)",
                zIndex: 0,
              }}
            />
            {/* Background icon layer - behind content */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url(${getProjectImage(project)})`,
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
            {/* Featured Indicator - Corner Ribbon */}
            {project.featured && (
              <div className="absolute top-0 right-0 z-20 overflow-hidden w-32 h-32 pointer-events-none">
                <div
                  className="absolute top-6 right-[-35px] w-40 text-center py-1.5 rotate-45 shadow-lg"
                  style={{
                    backgroundColor: "#f380cd",
                    borderTop: "2px solid #19191a",
                    borderBottom: "2px solid #19191a",
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="#19191a"
                      stroke="#19191a"
                      strokeWidth="0.5"
                    >
                      <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" />
                    </svg>
                    <span
                      className="text-[10px] font-black uppercase"
                      style={{ color: "#19191a" }}
                    >
                      FEATURED
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Live Indicator - Simple Pulsing Dot */}
            {project.live && (
              <div className="absolute top-4 right-4 z-20">
                <div className="relative flex items-center justify-center w-4 h-4">
                  <div className="absolute w-4 h-4 bg-green rounded-full animate-ping opacity-75"></div>
                  <div className="relative w-4 h-4 bg-green rounded-full border-2 border-white shadow-[0_0_8px_rgba(5,141,94,0.8)]"></div>
                </div>
              </div>
            )}

            {/* Content wrapper */}
            <div className="p-6 flex flex-col h-full relative z-10 text-white">
          <ProjectHeader
            name={project.name}
            twitter={project.twitter}
            category={project.category}
            megaMafia={project.megaMafia}
                live={project.live}
                featured={project.featured}
                img={project.img}
          />

              <p className="text-sm font-bold uppercase mb-6 flex-grow leading-snug text-white">
            {project.description}
          </p>

              <div className="flex flex-row items-center justify-between gap-3 pt-4 border-t-3 border-white">
                <div className="flex items-center gap-3 flex-shrink-0">
              <ProjectLinks
                website={project.website}
                discord={project.discord}
                telegram={project.telegram}
              />
            </div>
                <div className="flex-shrink-0">
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
