"use client";

import { useState, useEffect } from "react";
import ecosystemData from "@/data/ecosystem.json";
import { ProjectCard } from "./ProjectCard";
import { EcosystemHeader } from "./EcosystemHeader";
import { FilterControls } from "./FilterControls";
import { SortSelector } from "./SortSelector";

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
  votes?: {
    upvotes: number;
    downvotes: number;
    userVote: "up" | "down" | null;
    breakdown: VoteBreakdown;
  };
}

export function EcosystemDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMegaMafiaOnly, setShowMegaMafiaOnly] = useState(false);
  const [showNativeOnly, setShowNativeOnly] = useState(false);
  const [projects, setProjects] = useState<Project[]>(ecosystemData.projects);
  const [sortMethod, setSortMethod] = useState<{
    type: "alphabetical" | "score";
    direction: "asc" | "desc";
  }>({
    type: "score",
    direction: "desc",
  });
  const [includeMiniethVotes, setIncludeMiniethVotes] = useState(true);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch("/api/votes");
        if (!response.ok) {
          throw new Error("Failed to fetch votes");
        }
        const votesData = await response.json();

        // Update projects with vote data
        setProjects(
          ecosystemData.projects.map((project) => {
            const projectVotes = votesData.find(
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
      }
    };

    fetchVotes();
  }, []);

  // Get unique categories and count projects per category
  const categories = Array.from(
    new Set(projects.map((project) => project.category))
  ).sort();

  const getCategoryCount = (
    category: string,
    megaMafiaOnly: boolean = false,
    nativeOnly: boolean = false
  ) => {
    return projects.filter(
      (project) =>
        project.category === category &&
        (!megaMafiaOnly || project.megaMafia) &&
        (!nativeOnly || project.native)
    ).length;
  };

  const getMegaMafiaCount = () => {
    return projects.filter((project) => project.megaMafia).length;
  };

  const getNativeCount = () => {
    return projects.filter((project) => project.native).length;
  };

  const getProjectScore = (project: Project) => {
    if (!project.votes) return 0;

    if (!includeMiniethVotes && project.votes.breakdown) {
      // Calculate score excluding minieth votes
      let score = 0;
      for (const [role, votes] of Object.entries(project.votes.breakdown)) {
        if (role.toLowerCase() !== "minieth") {
          score += votes.up - votes.down;
        }
      }
      return score;
    }

    // Include all votes
    return project.votes.upvotes - project.votes.downvotes;
  };

  const filteredProjects = projects
    .filter((project) => {
      const categoryMatch = selectedCategory
        ? project.category === selectedCategory
        : true;
      const megaMafiaMatch = showMegaMafiaOnly ? project.megaMafia : true;
      const nativeMatch = showNativeOnly ? project.native : true;
      return categoryMatch && megaMafiaMatch && nativeMatch;
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filter & Sort</span>
            <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
              {filteredProjects.length} projects
            </span>
          </div>

          <SortSelector
            sortMethod={sortMethod}
            onSortChange={setSortMethod}
            includeMinieth={includeMiniethVotes}
            onMiniethChange={setIncludeMiniethVotes}
          />
        </div>

        {/* Filter Controls */}
        <FilterControls
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          showMegaMafiaOnly={showMegaMafiaOnly}
          setShowMegaMafiaOnly={setShowMegaMafiaOnly}
          showNativeOnly={showNativeOnly}
          setShowNativeOnly={setShowNativeOnly}
          categories={categories}
          getCategoryCount={getCategoryCount}
          getMegaMafiaCount={getMegaMafiaCount}
          getNativeCount={getNativeCount}
          totalProjects={projects.length}
        />
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            includeMiniethVotes={includeMiniethVotes}
          />
        ))}
      </div>
    </div>
  );
}
