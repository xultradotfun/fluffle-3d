"use client";

import { useState, useEffect } from "react";
import ecosystemData from "@/data/ecosystem.json";
import { ProjectCard } from "./ProjectCard";

export function EcosystemDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMegaMafiaOnly, setShowMegaMafiaOnly] = useState(false);
  const [showNativeOnly, setShowNativeOnly] = useState(false);
  const [projects, setProjects] = useState(ecosystemData.projects);

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
    megaMafiaOnly: boolean = false
  ) => {
    return projects.filter(
      (project) =>
        project.category === category && (!megaMafiaOnly || project.megaMafia)
    ).length;
  };

  const getMegaMafiaCount = () => {
    return projects.filter((project) => project.megaMafia).length;
  };

  const getNativeCount = () => {
    return projects.filter((project) => project.native).length;
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
      // First sort by MegaMafia status
      if (a.megaMafia && !b.megaMafia) return -1;
      if (!a.megaMafia && b.megaMafia) return 1;
      // Then sort alphabetically within each group
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
          Ecosystem Projects
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Discover and vote on the growing ecosystem of projects building on
          MegaETH
        </p>

        {/* Voting Explainer */}
        <div className="mt-8 p-6 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-left">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 p-3 border border-blue-500/20 dark:border-blue-500/30">
              <svg
                className="w-full h-full text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                How Voting Works
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Join the{" "}
                <a
                  href="https://discord.com/invite/megaeth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  MegaETH Discord
                </a>{" "}
                and get the MiniETH role to vote. Higher roles have more voting
                power - hover over vote counts to see the breakdown.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* MegaMafia Filter */}
        <button
          onClick={() => setShowMegaMafiaOnly(!showMegaMafiaOnly)}
          className={`group relative px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
            showMegaMafiaOnly
              ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg ring-1 ring-white/20"
              : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10"
          }`}
        >
          <div className="relative flex items-center gap-2">
            {showMegaMafiaOnly && (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent)] rounded-full"></div>
            )}
            <img
              src="/icons/logo-02.png"
              alt="MegaMafia"
              className={`w-4 h-4 object-contain ${
                showMegaMafiaOnly
                  ? "brightness-0 invert"
                  : "dark:invert opacity-75"
              }`}
            />
            <span
              className={`relative ${showMegaMafiaOnly ? "font-semibold" : ""}`}
            >
              MegaMafia
            </span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                showMegaMafiaOnly
                  ? "bg-white/20"
                  : "bg-indigo-50 dark:bg-white/10 text-indigo-600 dark:text-indigo-400"
              }`}
            >
              {getMegaMafiaCount()}
            </span>
          </div>
        </button>

        {/* Native Filter */}
        <button
          onClick={() => setShowNativeOnly(!showNativeOnly)}
          className={`group relative px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
            showNativeOnly
              ? "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg ring-1 ring-white/20"
              : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10"
          }`}
        >
          <div className="relative flex items-center gap-2">
            {showNativeOnly && (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent)] rounded-full"></div>
            )}
            <svg
              className={`w-4 h-4 ${
                showNativeOnly
                  ? "text-white"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span
              className={`relative ${showNativeOnly ? "font-semibold" : ""}`}
            >
              Native
            </span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                showNativeOnly
                  ? "bg-white/20"
                  : "bg-emerald-50 dark:bg-white/10 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {getNativeCount()}
            </span>
          </div>
        </button>

        {/* All Categories Button */}
        <button
          onClick={() => setSelectedCategory(null)}
          className={`group relative px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
            selectedCategory === null
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/10"
          }`}
        >
          <div className="relative flex items-center gap-2">
            <span>All Categories</span>
            <span
              className={`text-xs ${
                selectedCategory === null ? "text-blue-200" : "text-gray-400"
              }`}
            >
              {showMegaMafiaOnly
                ? getMegaMafiaCount()
                : showNativeOnly
                ? getNativeCount()
                : projects.length}
            </span>
          </div>
        </button>

        {/* Category Filters */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`group relative px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/10"
            }`}
          >
            <div className="relative flex items-center gap-2">
              <span>{category}</span>
              <span
                className={`text-xs ${
                  selectedCategory === category
                    ? "text-blue-200"
                    : "text-gray-400"
                }`}
              >
                {getCategoryCount(category, showMegaMafiaOnly)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  );
}
