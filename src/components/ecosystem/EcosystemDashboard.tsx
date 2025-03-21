"use client";

import { useState, useEffect } from "react";
import ecosystemData from "@/data/ecosystem.json";
import { ProjectCard } from "./ProjectCard";
import { EcosystemHeader } from "./EcosystemHeader";
import { FilterControls } from "./FilterControls";
import { SortSelector } from "./SortSelector";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";

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
  native: boolean;
  testnet: boolean;
  guide?: boolean;
  votes?: {
    upvotes: number;
    downvotes: number;
    userVote: "up" | "down" | null;
    breakdown: VoteBreakdown;
  };
}

type VoteFilter = "all" | "voted" | "not_voted";

export function EcosystemDashboard() {
  const { user } = useDiscordAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMegaMafiaOnly, setShowMegaMafiaOnly] = useState(false);
  const [showNativeOnly, setShowNativeOnly] = useState(false);
  const [showTestnetOnly, setShowTestnetOnly] = useState(false);
  const [showGuideOnly, setShowGuideOnly] = useState(false);
  const [voteFilter, setVoteFilter] = useState<VoteFilter>("all");
  const [isLoadingVotes, setIsLoadingVotes] = useState(true);
  const [projects, setProjects] = useState<Project[]>(
    ecosystemData.projects.map((project) => ({
      ...project,
      votes: {
        upvotes: 0,
        downvotes: 0,
        userVote: null,
        breakdown: {},
      },
    }))
  );
  const [sortMethod, setSortMethod] = useState<{
    type: "alphabetical" | "score";
    direction: "asc" | "desc";
  }>({
    type: "score",
    direction: "desc",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchVotes = async () => {
      try {
        setIsLoadingVotes(true);
        const response = await fetch("/api/votes", {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch votes");
        }

        const votesData = await response.json();

        if (!isMounted) return;

        setProjects(
          ecosystemData.projects.map((project) => {
            const projectVotes = votesData.projects.find(
              (v: any) => v.twitter === project.twitter
            )?.votes;
            return {
              ...project,
              votes: projectVotes || {
                upvotes: 0,
                downvotes: 0,
                userVote: null,
                breakdown: {},
              },
            };
          })
        );
      } catch (error) {
        console.error("Failed to fetch votes:", error);
      } finally {
        if (isMounted) {
          setIsLoadingVotes(false);
        }
      }
    };

    fetchVotes();

    // Re-fetch votes when user changes
    if (user) {
      fetchVotes();
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Get unique categories and count projects per category
  const categories = Array.from(
    new Set(projects.map((project) => project.category))
  ).sort();

  const getCategoryCount = (
    category: string,
    megaMafiaOnly: boolean = false,
    nativeOnly: boolean = false,
    voteFilter: VoteFilter = "all"
  ) => {
    return projects.filter(
      (project) =>
        project.category === category &&
        (!megaMafiaOnly || project.megaMafia) &&
        (!nativeOnly || project.native) &&
        (voteFilter === "all" ||
          (voteFilter === "voted"
            ? project.votes?.userVote !== null
            : project.votes?.userVote === null))
    ).length;
  };

  const getMegaMafiaCount = () => {
    return projects.filter((project) => project.megaMafia).length;
  };

  const getNativeCount = () => {
    return projects.filter((project) => project.native).length;
  };

  const getTestnetCount = () => {
    return projects.filter((project) => project.testnet).length;
  };

  const getGuideCount = () => {
    return projects.filter((project) => project.guide).length;
  };

  const getUserVotedCount = () => {
    return projects.filter(
      (project) => project.votes && project.votes.userVote !== null
    ).length;
  };

  const getUserNotVotedCount = () => {
    return projects.filter(
      (project) => !project.votes || project.votes.userVote === null
    ).length;
  };

  const getProjectScore = (project: Project) => {
    if (!project.votes) return 0;

    // Always calculate score excluding minieth votes
    let score = 0;
    if (project.votes.breakdown) {
      for (const [role, votes] of Object.entries(project.votes.breakdown)) {
        if (role.toLowerCase() !== "minieth") {
          score += votes.up - votes.down;
        }
      }
    }
    return score;
  };

  const filteredProjects = projects
    .filter((project) => {
      const categoryMatch = selectedCategory
        ? project.category === selectedCategory
        : true;
      const megaMafiaMatch = showMegaMafiaOnly ? project.megaMafia : true;
      const nativeMatch = showNativeOnly ? project.native : true;
      const testnetMatch = showTestnetOnly ? project.testnet : true;
      const guideMatch = showGuideOnly ? project.guide : true;
      const userVoteMatch =
        voteFilter === "all" ||
        (voteFilter === "voted"
          ? project.votes?.userVote !== null
          : project.votes?.userVote === null);
      return (
        categoryMatch &&
        megaMafiaMatch &&
        nativeMatch &&
        testnetMatch &&
        guideMatch &&
        userVoteMatch
      );
    })
    .sort((a, b) => {
      if (sortMethod.type === "score") {
        const scoreA = getProjectScore(a);
        const scoreB = getProjectScore(b);
        if (scoreB !== scoreA) {
          return sortMethod.direction === "desc"
            ? scoreB - scoreA // Higher score first
            : scoreA - scoreB; // Lower score first
        }
        // If scores are equal, fall back to alphabetical
        return sortMethod.direction === "desc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      } else {
        // Alphabetical sort
        return sortMethod.direction === "desc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="space-y-12 animate-fade-in">
      <EcosystemHeader />

      <div className="space-y-8">
        {/* Controls Header */}
        <div className="flex flex-col gap-4">
          {/* Filter Controls */}
          <FilterControls
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            showMegaMafiaOnly={showMegaMafiaOnly}
            setShowMegaMafiaOnly={setShowMegaMafiaOnly}
            showNativeOnly={showNativeOnly}
            setShowNativeOnly={setShowNativeOnly}
            showTestnetOnly={showTestnetOnly}
            setShowTestnetOnly={setShowTestnetOnly}
            showGuideOnly={showGuideOnly}
            setShowGuideOnly={setShowGuideOnly}
            voteFilter={voteFilter}
            setVoteFilter={setVoteFilter}
            categories={categories}
            getCategoryCount={getCategoryCount}
            getMegaMafiaCount={getMegaMafiaCount}
            getNativeCount={getNativeCount}
            getTestnetCount={getTestnetCount}
            getGuideCount={getGuideCount}
            getUserVotedCount={getUserVotedCount}
            getUserNotVotedCount={getUserNotVotedCount}
            totalProjects={projects.length}
          />

          {/* Results and Sort */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing {filteredProjects.length} projects
              {isLoadingVotes && (
                <span className="ml-2 text-blue-500 dark:text-blue-400">
                  Loading votes...
                </span>
              )}
            </div>
            <SortSelector
              sortMethod={sortMethod}
              onSortChange={setSortMethod}
            />
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.name}
              project={project}
              isLoadingVotes={isLoadingVotes}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
