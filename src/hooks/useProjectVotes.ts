import { useState, useEffect } from "react";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";
import { apiClient, API_ENDPOINTS } from "@/lib/api";
import type { Project } from "@/types/ecosystem";

// Local storage key for user votes cache
const USER_VOTES_CACHE_KEY = "fluffle_user_votes";

// Helper to get cached user votes
const getCachedUserVotes = (userId: string | undefined): Record<string, "up" | "down"> => {
  if (!userId || typeof window === "undefined") return {};
  try {
    const cached = localStorage.getItem(`${USER_VOTES_CACHE_KEY}_${userId}`);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
};

// Helper to save user votes to cache
const saveCachedUserVotes = (userId: string | undefined, votes: Record<string, "up" | "down">) => {
  if (!userId || typeof window === "undefined") return;
  try {
    localStorage.setItem(`${USER_VOTES_CACHE_KEY}_${userId}`, JSON.stringify(votes));
  } catch (error) {
    console.error("Failed to cache user votes:", error);
  }
};

export function useProjectVotes() {
  const { user, isLoading } = useDiscordAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingVotes, setIsLoadingVotes] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // Fetch projects on mount
  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        setIsLoadingProjects(true);
        const response = await fetch("https://api.fluffle.tools/api/projects/full");
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        
        if (!isMounted) return;
        
        const projectsWithIndex: Project[] = data.projects.map((p: Project, index: number) => ({
          ...p,
          originalIndex: index,
          votes: {
            upvotes: 0,
            downvotes: 0,
            userVote: null,
            breakdown: {},
          },
        }));
        setProjects(projectsWithIndex);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        if (isMounted) {
          setIsLoadingProjects(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Wait for authentication to be fully loaded and projects to be fetched before fetching votes
    if (isLoading || projects.length === 0) {
      return;
    }

    let isMounted = true;

    const fetchVotes = async () => {
      try {
        setIsLoadingVotes(true);

        // Get cached user votes
        const cachedUserVotes = getCachedUserVotes(user?.id);

        const votesData = await apiClient.get(API_ENDPOINTS.VOTES.LIST);

        if (!isMounted) return;

        // Build a map of user votes from the API response
        const apiUserVotes: Record<string, "up" | "down"> = {};
        votesData.projects?.forEach((p: any) => {
          if (p.votes?.userVote) {
            apiUserVotes[p.twitter] = p.votes.userVote;
          }
        });

        // Merge API votes with cached votes (API takes precedence)
        const mergedUserVotes = { ...cachedUserVotes, ...apiUserVotes };

        // Save merged votes to cache
        if (user?.id && Object.keys(apiUserVotes).length > 0) {
          saveCachedUserVotes(user.id, mergedUserVotes);
        }

        setProjects(prev =>
          prev.map(project => {
            const projectVotes = votesData.projects.find(
              (v: any) => v.twitter === project.twitter
            )?.votes;
            
            // Use merged user votes (from cache or API)
            const userVote = mergedUserVotes[project.twitter] || projectVotes?.userVote || null;
            
            return {
              ...project,
              votes: {
                upvotes: projectVotes?.upvotes || 0,
                downvotes: projectVotes?.downvotes || 0,
                userVote,
                breakdown: projectVotes?.breakdown || {},
              },
            };
          })
        );
      } catch (error) {
        console.error("Failed to fetch votes:", error);
        
        // On error, still try to use cached votes
        if (!isMounted) return;
        const cachedUserVotes = getCachedUserVotes(user?.id);
        if (Object.keys(cachedUserVotes).length > 0) {
          setProjects(prev =>
            prev.map(project => ({
              ...project,
              votes: {
                upvotes: project.votes?.upvotes || 0,
                downvotes: project.votes?.downvotes || 0,
                userVote: cachedUserVotes[project.twitter] || project.votes?.userVote || null,
                breakdown: project.votes?.breakdown || {},
              },
            }))
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingVotes(false);
        }
      }
    };

    fetchVotes();

    return () => {
      isMounted = false;
    };
  }, [user, isLoading, projects.length]);

  const updateProjectVote = (twitter: string, voteData: any) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.twitter === twitter
          ? {
              ...project,
              votes: {
                upvotes: voteData.upvotes,
                downvotes: voteData.downvotes,
                userVote: voteData.userVote,
                breakdown: voteData.breakdown,
              },
            }
          : project
      )
    );

    // Update cache with the new vote
    if (user?.id && voteData.userVote) {
      const cachedVotes = getCachedUserVotes(user.id);
      cachedVotes[twitter] = voteData.userVote;
      saveCachedUserVotes(user.id, cachedVotes);
    }
  };

  return {
    projects,
    isLoadingVotes: isLoadingVotes || isLoadingProjects,
    updateProjectVote,
  };
}

