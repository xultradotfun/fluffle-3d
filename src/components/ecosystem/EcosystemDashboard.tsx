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
  const { user, isLoading } = useDiscordAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMegaMafiaOnly, setShowMegaMafiaOnly] = useState(false);
  const [showNativeOnly, setShowNativeOnly] = useState(false);
  const [showTestnetOnly, setShowTestnetOnly] = useState(false);
  const [showGuideOnly, setShowGuideOnly] = useState(false);
  const [voteFilter, setVoteFilter] = useState<VoteFilter>("all");
  const [isLoadingVotes, setIsLoadingVotes] = useState(true);
  const [projects, setProjects] = useState<Project[]>(
    ecosystemData.projects.map((project, index) => ({
      ...project,
      originalIndex: index, // Add index for "latest added" sorting
      votes: {
        upvotes: 0,
        downvotes: 0,
        userVote: null,
        breakdown: {},
      },
    }))
  );
  const [sortMethod, setSortMethod] = useState<{
    type: "alphabetical" | "score" | "latest";
    direction: "asc" | "desc";
  }>({
    type: "score",
    direction: "desc",
  });
  const [highlightedProject, setHighlightedProject] = useState<string | null>(
    null
  );

  // Read query parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cardParam = params.get("card");
    if (cardParam) {
      setHighlightedProject(cardParam.toLowerCase());
    }
  }, []);

  useEffect(() => {
    // Wait for authentication to be fully loaded before fetching votes
    if (isLoading) {
      return;
    }

    let isMounted = true;

    const fetchVotes = async () => {
      try {
        setIsLoadingVotes(true);
        console.log(
          "Frontend: Fetching votes for user:",
          user?.id || "anonymous"
        );

        const response = await fetch("/api/votes");

        if (!response.ok) {
          throw new Error("Failed to fetch votes");
        }

        const votesData = await response.json();
        console.log(
          "Frontend: Received votes data, sample userVote:",
          votesData.projects[0]?.votes?.userVote || "none"
        );

        if (!isMounted) return;

        setProjects(
          ecosystemData.projects.map((project, index) => {
            const projectVotes = votesData.projects.find(
              (v: any) => v.twitter === project.twitter
            )?.votes;
            return {
              ...project,
              originalIndex: index, // Preserve index for "latest added" sorting
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

    // Only fetch once when auth is settled
    fetchVotes();

    return () => {
      isMounted = false;
    };
  }, [user, isLoading]); // Refetch when user OR loading state changes

  // Get unique categories and count projects per category
  const categories = Array.from(
    new Set(projects.map((project) => project.category))
  ).sort();

  const getCategoryCount = (
    category: string,
    megaMafiaOnly: boolean = false,
    nativeOnly: boolean = false,
    testnetOnly: boolean = false,
    showGuideOnly: boolean = false,
    voteFilter: VoteFilter = "all"
  ) => {
    return projects.filter(
      (project) =>
        project.category === category &&
        (!megaMafiaOnly || project.megaMafia) &&
        (!nativeOnly || project.native) &&
        (!testnetOnly || project.testnet) &&
        (!showGuideOnly || project.guide) &&
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
      // Prioritize the highlighted project
      const aIsHighlighted =
        highlightedProject && a.twitter.toLowerCase() === highlightedProject;
      const bIsHighlighted =
        highlightedProject && b.twitter.toLowerCase() === highlightedProject;

      if (aIsHighlighted && !bIsHighlighted) return -1;
      if (!aIsHighlighted && bIsHighlighted) return 1;

      // If neither or both are highlighted, use the selected sort method
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
      } else if (sortMethod.type === "latest") {
        // Latest added sort (higher index = more recent)
        const indexA = (a as any).originalIndex || 0;
        const indexB = (b as any).originalIndex || 0;
        return sortMethod.direction === "desc"
          ? indexB - indexA // Most recent first
          : indexA - indexB; // Oldest first
      } else {
        // Alphabetical sort
        return sortMethod.direction === "desc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="animate-fadeIn">
      <EcosystemHeader />

      {/* Projects Section */}
      <div className="space-y-12">
        {/* Controls */}
        <div className="space-y-8">
          {/* Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-editorial-medium">
              PROJECTS ({filteredProjects.length})
            </h2>
            <div className="flex items-center gap-6">
              <SortSelector
                sortMethod={sortMethod}
                onSortChange={setSortMethod}
              />
            </div>
          </div>

          {/* Filters Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-wide">
              FILTERS
            </h3>
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
          </div>
        </div>

        <div className="editorial-line"></div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.twitter}
              project={project}
              isLoadingVotes={isLoadingVotes}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
