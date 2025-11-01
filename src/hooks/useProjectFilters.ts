import { useState, useMemo } from "react";
import type { Project, ProjectFilters, VoteFilter } from "@/types/ecosystem";
import { filterProjects, getCategoryCount, getFilteredCount } from "@/utils/projectFilters";

export function useProjectFilters(projects: Project[]) {
  const [filters, setFilters] = useState<ProjectFilters>({
    selectedCategory: null,
    showMegaMafiaOnly: false,
    showNativeOnly: false,
    showLiveOnly: false,
    showGuideOnly: false,
    voteFilter: "all",
  });

  const filteredProjects = useMemo(
    () => filterProjects(projects, filters),
    [projects, filters]
  );

  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))).sort(),
    [projects]
  );

  const counts = useMemo(
    () => ({
      megaMafia: getFilteredCount(projects, (p) => p.megaMafia),
      native: getFilteredCount(projects, (p) => p.native),
      testnet: getFilteredCount(projects, (p) => p.testnet),
      guide: getFilteredCount(projects, (p) => !!p.guide),
      voted: getFilteredCount(projects, (p) => p.votes?.userVote !== null),
      notVoted: getFilteredCount(projects, (p) => !p.votes || p.votes.userVote === null),
    }),
    [projects]
  );

  const getCategoryCountMemo = useMemo(
    () => (category: string) => getCategoryCount(projects, category, filters),
    [projects, filters]
  );

  return {
    filters,
    setFilters,
    filteredProjects,
    categories,
    counts,
    getCategoryCount: getCategoryCountMemo,
    // Individual setters for convenience
    setSelectedCategory: (category: string | null) =>
      setFilters((prev) => ({ ...prev, selectedCategory: category })),
    setShowMegaMafiaOnly: (show: boolean) =>
      setFilters((prev) => ({ ...prev, showMegaMafiaOnly: show })),
    setShowNativeOnly: (show: boolean) =>
      setFilters((prev) => ({ ...prev, showNativeOnly: show })),
    setShowTestnetOnly: (show: boolean) =>
      setFilters((prev) => ({ ...prev, showLiveOnly: show })),
    setShowGuideOnly: (show: boolean) =>
      setFilters((prev) => ({ ...prev, showGuideOnly: show })),
    setVoteFilter: (voteFilter: VoteFilter) =>
      setFilters((prev) => ({ ...prev, voteFilter })),
  };
}

