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
      <EcosystemHeader />

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
          />

          {/* Sort Controls */}
          <div className="flex justify-end">
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
              <div key={i} className="border-3 border-foreground bg-[#e0e0e0] p-6 h-80 animate-pulse">
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 bg-foreground/20 border-3 border-foreground"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-foreground/20 w-3/4 mb-2"></div>
                    <div className="h-4 bg-foreground/20 w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-foreground/20 w-full"></div>
                  <div className="h-4 bg-foreground/20 w-5/6"></div>
                  <div className="h-4 bg-foreground/20 w-4/6"></div>
                </div>
                <div className="flex gap-2 mt-auto">
                  <div className="h-10 bg-foreground/20 flex-1"></div>
                  <div className="h-10 bg-foreground/20 flex-1"></div>
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
