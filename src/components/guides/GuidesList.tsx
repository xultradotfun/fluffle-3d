"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ecosystemData from "@/data/ecosystem.json";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";

interface Guide {
  project: {
    name: string;
    twitter: string;
    description: string;
    longDescription: string;
    features: string[];
    currentStatus: string;
    website?: string;
    discord?: string;
    telegram?: string;
  };
  guide: {
    sections: {
      title: string;
      steps: {
        title: string;
        description: string;
        link?: string;
        completable?: boolean;
      }[];
    }[];
    requirements: string[];
    rewards: string[];
    lastUpdated?: string;
  };
  votes?: {
    upvotes: number;
    downvotes: number;
    userVote: "up" | "down" | null;
    breakdown: Record<string, { up: number; down: number }>;
  };
}

interface Project {
  name: string;
  twitter: string;
  description: string;
  logo: string;
  banner: string;
  guide?: boolean;
}

interface EcosystemData {
  projects: Project[];
}

export function GuidesList() {
  const { user } = useDiscordAuth();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<
    Record<string, { completedSteps: string[]; lastVisited: string }>
  >({});

  useEffect(() => {
    const loadGuides = async () => {
      try {
        // Filter projects that have guides enabled
        const projectsWithGuides = ecosystemData.projects.filter(
          (project) => project.guide
        );

        // Load guide files for each project
        const guidePromises = projectsWithGuides.map(async (project) => {
          try {
            const guideData = await import(
              `@/data/guides/${project.twitter}.json`
            );
            return guideData.default;
          } catch (err) {
            console.error(`Error loading guide for ${project.twitter}:`, err);
            return null;
          }
        });

        const loadedGuides = (await Promise.all(guidePromises)).filter(
          (guide): guide is Guide => guide !== null
        );

        // Fetch votes for all projects
        try {
          const response = await fetch("/api/votes", {
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          });

          if (response.ok) {
            const votesData = await response.json();

            // Add votes data to guides
            const guidesWithVotes = loadedGuides.map((guide) => {
              const projectVotes = votesData.projects.find(
                (p: any) => p.twitter === guide.project.twitter
              )?.votes;

              return {
                ...guide,
                votes: projectVotes || {
                  upvotes: 0,
                  downvotes: 0,
                  userVote: null,
                  breakdown: {},
                },
              };
            });

            // Sort guides by score (votes excluding minieth)
            const sortedGuides = guidesWithVotes.sort((a, b) => {
              const scoreA = getProjectScore(a);
              const scoreB = getProjectScore(b);
              return scoreB - scoreA;
            });

            setGuides(sortedGuides);
          } else {
            throw new Error("Failed to fetch votes");
          }
        } catch (err) {
          console.error("Error fetching votes:", err);
          // Fall back to date-based sorting if vote fetching fails
          const sortedByDate = loadedGuides.sort((a, b) => {
            const dateA = a.guide.lastUpdated
              ? new Date(a.guide.lastUpdated).getTime()
              : 0;
            const dateB = b.guide.lastUpdated
              ? new Date(b.guide.lastUpdated).getTime()
              : 0;
            return dateB - dateA;
          });
          setGuides(sortedByDate);
        }
      } catch (err) {
        console.error("Error loading guides:", err);
        setError("Failed to load guides. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadGuides();
  }, [user]);

  // Calculate project score (excluding minieth votes)
  const getProjectScore = (guide: Guide) => {
    if (!guide.votes) return 0;

    let score = 0;
    if (guide.votes.breakdown) {
      for (const [role, votes] of Object.entries(guide.votes.breakdown)) {
        if (role.toLowerCase() !== "minieth") {
          score += votes.up - votes.down;
        }
      }
    }
    return score;
  };

  useEffect(() => {
    // Load progress from localStorage for all guides
    const loadProgress = () => {
      const newProgress: Record<
        string,
        { completedSteps: string[]; lastVisited: string }
      > = {};
      guides.forEach((guide) => {
        const savedProgress = localStorage.getItem(
          `guideProgress_${guide.project.twitter}`
        );
        if (savedProgress) {
          newProgress[guide.project.twitter] = JSON.parse(savedProgress);
        } else {
          newProgress[guide.project.twitter] = {
            completedSteps: [],
            lastVisited: new Date().toISOString(),
          };
        }
      });
      setProgress(newProgress);
    };

    if (guides.length > 0) {
      loadProgress();
    }
  }, [guides]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="text-primary hover:text-primary/80"
        >
          Try again
        </button>
      </div>
    );
  }

  if (guides.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No guides available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {guides.map((guide) => {
        const guideProgress = progress[guide.project.twitter];
        const totalSteps = guide.guide.sections.reduce(
          (total, section) =>
            total +
            section.steps.filter((step) => step.completable !== false).length,
          0
        );
        const completedSteps = guideProgress?.completedSteps.length || 0;
        const completionPercentage = Math.round(
          (completedSteps / totalSteps) * 100
        );
        const isComplete = completionPercentage === 100;

        return (
          <Link
            key={guide.project.twitter}
            href={`/explore/${guide.project.twitter}`}
            className="group flex flex-col overflow-hidden rounded-3xl bg-black/20 hover:bg-black/30 border border-white/[0.08] transition-all duration-300 hover:border-white/20"
          >
            {/* Header Section */}
            <div className="relative p-6 pb-0">
              <div className="flex items-start gap-5">
                {/* Project Logo */}
                <div className="relative flex-shrink-0">
                  <div className="relative h-[72px] w-[72px] rounded-2xl overflow-hidden bg-black/40 ring-1 ring-white/[0.12] transition-all duration-300 group-hover:ring-white/20">
                    <Image
                      src={`/avatars/${guide.project.twitter}.jpg`}
                      alt={`${guide.project.name} logo`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {isComplete && (
                    <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-green-500 ring-[3px] ring-black flex items-center justify-center">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="flex-1 min-w-0 pt-2">
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {guide.project.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400 line-clamp-2 leading-relaxed">
                    {guide.project.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Banner Image */}
            <div className="relative h-32 mt-6 overflow-hidden">
              <Image
                src={`/banners/${guide.project.twitter}.jpeg`}
                alt={`${guide.project.name} banner`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* Progress Section */}
            <div className="relative p-6 pt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-gray-300 font-medium">
                    Guide Progress
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-400 tabular-nums">
                    {completedSteps}/{totalSteps}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-400">
                  {completionPercentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isComplete
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500"
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              {/* Votes and Action Button */}
              <div className="mt-4 flex items-center justify-between">
                {/* Vote Count */}
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <svg
                    className="h-4 w-4 text-emerald-500/60 dark:text-emerald-400/60"
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
                  <span className="tabular-nums font-medium">
                    {guide.votes ? guide.votes.upvotes : 0}
                  </span>
                </div>

                {/* Action Button */}
                <div className="px-2 py-1 group/btn relative inline-flex items-center gap-2 text-sm font-medium">
                  <span className="relative z-10  text-blue-400 group-hover/btn:text-white transition-colors">
                    {isComplete ? "Review Guide" : "Start Guide"}
                  </span>
                  <div className="relative z-10 w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity bg-gradient-to-r from-blue-500 to-indigo-500" />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
