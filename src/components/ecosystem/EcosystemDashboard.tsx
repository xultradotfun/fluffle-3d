"use client";

import { useState, useEffect } from "react";
import ecosystemData from "@/data/ecosystem.json";
import { ProjectCard } from "./ProjectCard";
import { EcosystemHeader } from "./EcosystemHeader";
import { FilterControls } from "./FilterControls";

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
      <EcosystemHeader />

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

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  );
}
