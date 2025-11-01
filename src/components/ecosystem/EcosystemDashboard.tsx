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
    setShowTestnetOnly,
    setShowGuideOnly,
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
            showTestnetOnly={filters.showTestnetOnly}
            setShowTestnetOnly={setShowTestnetOnly}
            showGuideOnly={filters.showGuideOnly}
            setShowGuideOnly={setShowGuideOnly}
            voteFilter={filters.voteFilter}
            setVoteFilter={setVoteFilter}
            categories={categories}
            getCategoryCount={getCategoryCount}
            getMegaMafiaCount={() => counts.megaMafia}
            getNativeCount={() => counts.native}
            getTestnetCount={() => counts.testnet}
            getGuideCount={() => counts.guide}
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
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project.twitter}
              project={project}
              isLoadingVotes={isLoadingVotes}
              onVoteUpdate={updateProjectVote}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
