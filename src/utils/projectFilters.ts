import type { Project, ProjectFilters } from "@/types/ecosystem";

function matchesBaseFilters(
  project: Project,
  filters: Partial<ProjectFilters>
): boolean {
  if (filters.showMegaMafiaOnly && !project.megaMafia) return false;
  if (filters.showNativeOnly && !project.native) return false;
  if (filters.showLiveOnly && !project.live) return false;
  if (
    filters.voteFilter &&
    filters.voteFilter !== "all"
  ) {
    const hasVoted = project.votes?.userVote !== null;
    if (filters.voteFilter === "voted" && !hasVoted) return false;
    if (filters.voteFilter === "not_voted" && hasVoted) return false;
  }
  return true;
}

export function filterProjects(
  projects: Project[],
  filters: ProjectFilters
): Project[] {
  return projects.filter((project) => {
    if (filters.selectedCategory && project.category !== filters.selectedCategory) {
      return false;
    }
    return matchesBaseFilters(project, filters);
  });
}

export function getCategoryCount(
  projects: Project[],
  category: string,
  filters: Partial<ProjectFilters> = {}
): number {
  return projects.filter((project) => {
    if (project.category !== category) return false;
    return matchesBaseFilters(project, filters);
  }).length;
}

export function getFilteredCount(
  projects: Project[],
  filterFn: (project: Project) => boolean
): number {
  return projects.filter(filterFn).length;
}

