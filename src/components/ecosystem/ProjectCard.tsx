"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";
import { toast } from "sonner";

interface Project {
  name: string;
  twitter: string;
  website?: string;
  discord?: string;
  telegram?: string;
  description: string;
  category: string;
  megaMafia: boolean;
  votes?: {
    upvotes: number;
    downvotes: number;
    userVote: "up" | "down" | null;
  };
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { user, login } = useDiscordAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [votes, setVotes] = useState({
    upvotes: project.votes?.upvotes || 0,
    downvotes: project.votes?.downvotes || 0,
  });
  const [userVote, setUserVote] = useState<"up" | "down" | null>(
    project.votes?.userVote || null
  );

  useEffect(() => {
    // Update votes and user vote when project.votes or user changes
    if (project.votes) {
      setVotes({
        upvotes: project.votes.upvotes,
        downvotes: project.votes.downvotes,
      });
      // Update user vote if user is logged in and has voted before
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

    // Store previous state in case we need to revert
    const previousVotes = { ...votes };
    const previousUserVote = userVote;

    try {
      setIsVoting(true);

      // Optimistically update the UI
      if (previousUserVote === vote) {
        // Removing vote
        setVotes({
          upvotes: vote === "up" ? votes.upvotes - 1 : votes.upvotes,
          downvotes: vote === "down" ? votes.downvotes - 1 : votes.downvotes,
        });
        setUserVote(null);
      } else {
        // Adding or changing vote
        setVotes({
          upvotes:
            vote === "up"
              ? votes.upvotes + 1
              : previousUserVote === "up"
              ? votes.upvotes - 1
              : votes.upvotes,
          downvotes:
            vote === "down"
              ? votes.downvotes + 1
              : previousUserVote === "down"
              ? votes.downvotes - 1
              : votes.downvotes,
        });
        setUserVote(vote);
      }

      // Make the actual API request
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
        throw new Error(data.error || "Failed to vote");
      }

      // Update with actual server state
      setVotes({
        upvotes: data.votes.upvotes,
        downvotes: data.votes.downvotes,
      });
      setUserVote(data.votes.userVote);
    } catch (error) {
      // Revert to previous state on error
      setVotes(previousVotes);
      setUserVote(previousUserVote);
      console.error("Failed to vote:", error);
      toast.error(error instanceof Error ? error.message : "Failed to vote");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50/80 dark:from-white/[0.02] dark:to-white/[0.01] border border-gray-200 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-all">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03),transparent)]" />

      <div className="relative p-6 sm:p-8 flex flex-col h-full">
        {/* Header: Project Name, Logo, and Badges */}
        <div className="flex items-start gap-4 mb-6">
          {/* Logo */}
          <div className="relative w-14 h-14 flex-shrink-0">
            <Image
              src={`/avatars/${project.twitter}.jpg`}
              alt={`${project.name} Logo`}
              width={56}
              height={56}
              className="rounded-xl bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 group-hover:ring-blue-500/30 dark:group-hover:ring-blue-500/30 transition-all object-cover"
              priority={false}
              loading="lazy"
            />
          </div>

          {/* Name and Badges */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  {project.name}
                </h3>
                {project.megaMafia && (
                  <div className="relative flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-sm ring-1 ring-white/20 group-hover:scale-110 transition-transform">
                      <Image
                        src="/icons/logo-02.png"
                        alt="MegaMafia"
                        title="MegaMafia Project"
                        width={20}
                        height={20}
                        className="w-full h-full object-contain brightness-0 invert"
                        priority={false}
                      />
                    </div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.3),transparent)] rounded-full blur-sm"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                {project.category}
              </span>
              <a
                href={`https://twitter.com/${project.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>@{project.twitter}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow">
          {project.description}
        </p>

        {/* Footer: Links and Voting */}
        <div className="flex items-end justify-between gap-4 mt-auto pt-4 border-t border-gray-200 dark:border-white/5">
          {/* Links */}
          <div className="flex flex-wrap items-center gap-2">
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all group/link"
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover/link:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                <span>Website</span>
              </a>
            )}
            {project.discord && (
              <a
                href={project.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-[#5865F2]/5 hover:bg-[#5865F2]/10 text-[#5865F2] hover:text-[#5865F2] border border-[#5865F2]/20 hover:border-[#5865F2]/30 transition-all group/link"
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover/link:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span>Discord</span>
              </a>
            )}
            {project.telegram && (
              <a
                href={project.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-[#229ED9]/5 hover:bg-[#229ED9]/10 text-[#229ED9] hover:text-[#229ED9] border border-[#229ED9]/20 hover:border-[#229ED9]/30 transition-all group/link"
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover/link:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.265 2.428a2.048 2.048 0 0 0-2.078-.324L2.266 9.339a2.043 2.043 0 0 0-.104 3.818l3.625 1.261c.215.074.445.075.66 0l6.73-2.345-5.379 3.205a1.058 1.058 0 0 0-.463.901v3.182c0 .89 1.037 1.375 1.725.808l2.274-1.864 3.038 1.057a2.039 2.039 0 0 0 2.44-.974l5.99-11.772a2.048 2.048 0 0 0-.537-2.188z" />
                </svg>
                <span>Telegram</span>
              </a>
            )}
          </div>

          {/* Voting Section */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={() => handleVote("up")}
              disabled={isVoting}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                userVote === "up"
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                  : "hover:bg-green-50 dark:hover:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20"
              )}
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
                  d="M5 15l7-7 7 7"
                />
              </svg>
              <span className="sr-only">Upvote</span>
            </button>
            <span
              className={cn(
                "text-sm font-medium",
                userVote === "up"
                  ? "text-green-600 dark:text-green-400"
                  : userVote === "down"
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              {votes.upvotes - votes.downvotes}
            </span>
            <button
              onClick={() => handleVote("down")}
              disabled={isVoting}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                userVote === "down"
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                  : "hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20"
              )}
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              <span className="sr-only">Downvote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
