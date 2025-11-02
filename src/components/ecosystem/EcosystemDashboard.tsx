"use client";

import { useState, useEffect } from "react";
import { ProjectCard } from "./ProjectCard";
import { EcosystemHeader } from "./EcosystemHeader";
import { FilterControls } from "./FilterControls";
import { SortSelector } from "./SortSelector";
import { useProjectVotes } from "@/hooks/useProjectVotes";
import { useProjectFilters } from "@/hooks/useProjectFilters";
import { useProjectSorting } from "@/hooks/useProjectSorting";

export function EcosystemDashboard() {
  const [highlightedProject, setHighlightedProject] = useState<string | null>(null);

  // Custom hooks for separation of concerns
  const { projects, isLoadingVotes, updateProjectVote } = useProjectVotes();
  
  const {
    filters,
    filteredProjects,
    categories,
    counts,
    getCategoryCount,
    setSelectedCategory,
    setShowMegaMafiaOnly,
    setShowNativeOnly,
    setShowLiveOnly,
    setVoteFilter,
  } = useProjectFilters(projects);

  const { sortMethod, setSortMethod, sortedProjects } = useProjectSorting(
    filteredProjects,
    highlightedProject
  );

  // Read query parameter on mount for highlighting
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cardParam = params.get("card");
    if (cardParam) {
      setHighlightedProject(cardParam.toLowerCase());
    }
  }, []);

  return (
    <div className="space-y-12 animate-fade-in">
      <EcosystemHeader 
        projectCount={projects.length}
        categoryCount={categories.length}
      />

      <div className="space-y-8">
        {/* Controls Header */}
        <div className="flex flex-col gap-4">
          {/* Filter Controls */}
          <FilterControls
            selectedCategory={filters.selectedCategory}
            setSelectedCategory={setSelectedCategory}
            showMegaMafiaOnly={filters.showMegaMafiaOnly}
            setShowMegaMafiaOnly={setShowMegaMafiaOnly}
            showNativeOnly={filters.showNativeOnly}
            setShowNativeOnly={setShowNativeOnly}
            showLiveOnly={filters.showLiveOnly}
            setShowLiveOnly={setShowLiveOnly}
            voteFilter={filters.voteFilter}
            setVoteFilter={setVoteFilter}
            categories={categories}
            getCategoryCount={getCategoryCount}
            getMegaMafiaCount={() => counts.megaMafia}
            getNativeCount={() => counts.native}
            getLiveCount={() => counts.live}
            getUserVotedCount={() => counts.voted}
            getUserNotVotedCount={() => counts.notVoted}
            totalProjects={projects.length}
            sortMethod={sortMethod}
            onSortChange={setSortMethod}
          />

          {/* Sort Controls - mobile only */}
          <div className="flex justify-end md:hidden">
            <SortSelector
              sortMethod={sortMethod}
              onSortChange={setSortMethod}
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingVotes ? (
            // Show skeleton cards while loading
            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div
                key={i}
                className="h-full"
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
                    className="h-full relative overflow-hidden p-6 flex flex-col"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(224, 224, 224, 0.5) 0%, rgba(224, 224, 224, 0.45) 100%)",
                      clipPath:
                        "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                    }}
                  >
                    {/* Animated shimmer effect */}
                    <div
                      className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                      }}
                    />

                    {/* Header skeleton */}
                    <div className="flex gap-4 mb-4 relative">
                      <div className="w-16 h-16 bg-white/40 animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/40 w-2/3 animate-pulse"></div>
                        <div className="h-3 bg-white/40 w-1/3 animate-pulse"></div>
                        <div className="flex gap-2 mt-2">
                          <div className="h-5 bg-white/40 w-16 animate-pulse"></div>
                          <div className="h-5 bg-white/40 w-20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    {/* Description skeleton - takes up flex-grow space */}
                    <div className="space-y-2.5 mb-6 flex-grow relative">
                      <div className="h-3.5 bg-white/40 w-full animate-pulse"></div>
                      <div className="h-3.5 bg-white/40 w-[95%] animate-pulse"></div>
                      <div className="h-3.5 bg-white/40 w-full animate-pulse"></div>
                      <div className="h-3.5 bg-white/40 w-[90%] animate-pulse"></div>
                      <div className="h-3.5 bg-white/40 w-full animate-pulse"></div>
                      <div className="h-3.5 bg-white/40 w-[85%] animate-pulse"></div>
                    </div>

                    {/* Footer skeleton */}
                    <div className="flex flex-row items-center justify-between gap-3 pt-4 border-t-3 border-white/40 relative">
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-8 h-8 bg-white/40 animate-pulse"></div>
                        <div className="w-8 h-8 bg-white/40 animate-pulse"></div>
                        <div className="w-8 h-8 bg-white/40 animate-pulse"></div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <div className="w-16 h-10 bg-white/40 animate-pulse"></div>
                        <div className="w-16 h-10 bg-white/40 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            sortedProjects.map((project) => (
            <ProjectCard
              key={project.twitter}
              project={project}
              isLoadingVotes={isLoadingVotes}
                onVoteUpdate={updateProjectVote}
            />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
