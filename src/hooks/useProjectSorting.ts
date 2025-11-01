import { useState, useMemo } from "react";
import type { Project, SortMethod } from "@/types/ecosystem";
import { sortProjects } from "@/utils/projectSorting";

export function useProjectSorting(projects: Project[], highlightedProject: string | null = null) {
  const [sortMethod, setSortMethod] = useState<SortMethod>({
    type: "score",
    direction: "desc",
  });

  const sortedProjects = useMemo(
    () => sortProjects(projects, sortMethod, highlightedProject),
    [projects, sortMethod, highlightedProject]
  );

  return {
    sortMethod,
    setSortMethod,
    sortedProjects,
  };
}

