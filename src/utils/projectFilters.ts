import type { Project, ProjectFilters, VoteFilter } from "@/types/ecosystem";

export function filterProjects(
  projects: Project[],
  filters: ProjectFilters
): Project[] {
  return projects.filter((project) => {
    const categoryMatch = filters.selectedCategory
      ? project.category === filters.selectedCategory
      : true;

    const megaMafiaMatch = filters.showMegaMafiaOnly
      ? project.megaMafia
      : true;

    const nativeMatch = filters.showNativeOnly ? project.native : true;

    const testnetMatch = filters.showTestnetOnly ? project.testnet : true;

    const guideMatch = filters.showGuideOnly ? project.guide : true;

    const userVoteMatch =
      filters.voteFilter === "all" ||
      (filters.voteFilter === "voted"
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
  });
}

export function getCategoryCount(
  projects: Project[],
  category: string,
  filters: Partial<ProjectFilters> = {}
): number {
  return projects.filter((project) => {
    const categoryMatch = project.category === category;
    const megaMafiaMatch = filters.showMegaMafiaOnly
      ? project.megaMafia
      : true;
    const nativeMatch = filters.showNativeOnly ? project.native : true;
    const testnetMatch = filters.showTestnetOnly ? project.testnet : true;
    const guideMatch = filters.showGuideOnly ? project.guide : true;
    const voteMatch =
      !filters.voteFilter ||
      filters.voteFilter === "all" ||
      (filters.voteFilter === "voted"
        ? project.votes?.userVote !== null
        : project.votes?.userVote === null);

    return (
      categoryMatch &&
      megaMafiaMatch &&
      nativeMatch &&
      testnetMatch &&
      guideMatch &&
      voteMatch
    );
  }).length;
}

export function getFilteredCount(
  projects: Project[],
  filterFn: (project: Project) => boolean
): number {
  return projects.filter(filterFn).length;
}

