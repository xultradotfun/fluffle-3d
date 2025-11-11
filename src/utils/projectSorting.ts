import type { Project, SortMethod } from "@/types/ecosystem";

export function getProjectScore(project: Project): number {
  if (!project.votes) return 0;

  // Calculate score excluding minieth votes
  let score = 0;
  if (project.votes.breakdown) {
    for (const [role, votes] of Object.entries(project.votes.breakdown)) {
      if (role.toLowerCase() !== "minieth") {
        score += votes.up - votes.down;
      }
    }
  }
  return score;
}

export function sortProjects(
  projects: Project[],
  sortMethod: SortMethod,
  highlightedProject: string | null = null
): Project[] {
  return [...projects].sort((a, b) => {
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
      // Latest added sort (lower index = more recent, as API returns newest first)
      const indexA = a.originalIndex || 0;
      const indexB = b.originalIndex || 0;
      return sortMethod.direction === "desc"
        ? indexA - indexB // Most recent first (lower index)
        : indexB - indexA; // Oldest first (higher index)
    } else {
      // Alphabetical sort
      return sortMethod.direction === "desc"
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name);
    }
  });
}

