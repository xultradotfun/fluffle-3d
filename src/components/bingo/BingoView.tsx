import { useState, useEffect } from "react";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";
import { apiClient, API_ENDPOINTS } from "@/lib/api";
import { useBingoConfig } from "@/hooks/useBingoConfig";
import { BingoCard } from "./BingoCard";
import { Trophy, Smartphone, LogOut } from "lucide-react";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";
import type { BingoTask, Project } from "@/types/bingo";

export function BingoView() {
  const { user, login, logout } = useDiscordAuth();
  const { bingoConfig, configLoading, configError } = useBingoConfig();
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string>("");
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [tempGuestName, setTempGuestName] = useState("");
  const [ecosystemProjects, setEcosystemProjects] = useState<Project[]>([]);

  // Fetch projects from API
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("https://api.fluffle.tools/api/projects/full");
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        setEcosystemProjects(data.projects);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    }

    fetchProjects();
  }, []);

  const handleLogin = () => {
    login("/#bingo");
  };

  const handleGuestStart = () => {
    setShowGuestInput(true);
    setTempGuestName(guestName || "");
  };

  const handleGuestConfirm = () => {
    setGuestName(tempGuestName.trim() || "Guest");
    setShowGuestInput(false);
  };

  const handleGuestLogout = () => {
    // Clear guest data from localStorage
    localStorage.removeItem("bingo_guest_name");
    localStorage.removeItem("bingo_guest_completed");

    // Reset state
    setGuestName("");
    setCompletedTaskIds([]);
  };

  // Config loading is now handled by useBingoConfig hook

  // Check for mobile device on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load progress from database when user is logged in
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setCompletedTaskIds([]); // Reset progress when logged out
        setIsLoading(false);
        return;
      }

      try {
        // Use backend API with JWT authentication
        const data = await apiClient.get(API_ENDPOINTS.BINGO.PROGRESS);
        // Handle case where user has no completions - data.completedTasks will be an empty array
        setCompletedTaskIds(data.completedTasks.map((t: any) => t.taskId));
        setError(null);
      } catch (error) {
        console.error("Error loading bingo progress:", error);
        setError("Failed to load progress");
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  // Load guestName and completedTaskIds from localStorage if not logged in
  useEffect(() => {
    if (!user) {
      const storedGuestName = localStorage.getItem("bingo_guest_name");
      if (storedGuestName) setGuestName(storedGuestName);
      const storedCompleted = localStorage.getItem("bingo_guest_completed");
      if (storedCompleted) {
        try {
          setCompletedTaskIds(JSON.parse(storedCompleted));
        } catch {}
      }
    }
  }, [user]);

  // Save guestName to localStorage when it changes (for guests only)
  useEffect(() => {
    if (!user && guestName) {
      localStorage.setItem("bingo_guest_name", guestName);
    }
  }, [guestName, user]);

  // Save completedTaskIds to localStorage when they change (for guests only)
  useEffect(() => {
    if (!user) {
      localStorage.setItem(
        "bingo_guest_completed",
        JSON.stringify(completedTaskIds)
      );
    }
  }, [completedTaskIds, user]);

  // Merge completed state with base tasks
  const tasks =
    bingoConfig?.tasks?.map((task: any) => ({
      ...task,
      completed: completedTaskIds.includes(task.id),
    })) || [];

  // Create a map of Twitter handles to project data for quick lookup
  const projectMap = new Map<string, Project>(
    ecosystemProjects.map((project) => [project.twitter, project])
  );

  const handleTaskToggle = async (taskId: string) => {
    if (!user) {
      // For guests, just update local state (and localStorage will sync via effect)
      setCompletedTaskIds((prevIds) => {
        const isCompleted = prevIds.includes(taskId);
        if (isCompleted) {
          return prevIds.filter((id) => id !== taskId);
        } else {
          return [...prevIds, taskId];
        }
      });
      return;
    }

    // Optimistically update the UI
    setCompletedTaskIds((prevIds) => {
      const isCompleted = prevIds.includes(taskId);
      if (isCompleted) {
        return prevIds.filter((id) => id !== taskId);
      } else {
        return [...prevIds, taskId];
      }
    });

    try {
      const isCompleted = completedTaskIds.includes(taskId);

      if (isCompleted) {
        // Remove task completion
        await apiClient.delete(API_ENDPOINTS.BINGO.PROGRESS, { taskId });
      } else {
        // Mark task as completed
        await apiClient.post(API_ENDPOINTS.BINGO.PROGRESS, { taskId });
      }

      setError(null);
    } catch (error) {
      // Revert the optimistic update on error
      setCompletedTaskIds((prevIds) => {
        const wasCompleted = completedTaskIds.includes(taskId);
        if (wasCompleted) {
          return [...prevIds, taskId]; // Re-add if it was completed
        } else {
          return prevIds.filter((id) => id !== taskId); // Remove if it wasn't completed
        }
      });
      console.error("Error updating task completion:", error);
      setError("Failed to update progress");
    }
  };

  // Get unique categories and calculate stats
  const categories = [
    ...new Set(tasks.map((task: any) => task.category)),
  ].sort();
  const categoryStats = categories.map((category) => {
    const categoryTasks = tasks.filter(
      (task: any) => task.category === category
    );
    const completed = categoryTasks.filter(
      (task: any) => task.completed
    ).length;
    return {
      category,
      completed,
      total: categoryTasks.length,
      percentage: Math.floor((completed / categoryTasks.length) * 100),
    };
  });

  const completedCount = completedTaskIds.length;

  // If on mobile, show warning message
  if (isMobile) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-yellow-50">
              <Smartphone className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Desktop View Required
          </h2>
          <p className="text-gray-600">
            The MegaETH Testnet Bingo is optimized for desktop viewing. Please
            visit this page on a desktop device for the best experience.
          </p>
        </div>
      </div>
    );
  }

  if (configLoading || !bingoConfig) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading bingo configuration...
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-red-500">
          {error}. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <PageHeader
            title="MegaETH Testnet Bingo"
            description="Explore the MegaETH testnet through interactive challenges and complete your very own bingo card!"
          />
        </div>

        {/* User/Guest Info */}
        <div className="mb-8">
          {user ? (
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/50 border border-gray-200/50 backdrop-blur-sm">
                {user.avatar && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-200">
                    <Image
                      src={`https://cdn.discordapp.com/avatars/${user.id}/${
                        user.avatar
                      }.${
                        user.avatar.startsWith("a_") ? "gif" : "png"
                      }?size=128`}
                      alt={user.username}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-900">
                  {user.username}
                </span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200/50 text-red-600 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          ) : guestName ? (
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/50 border border-gray-200/50 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {guestName}
                </span>
              </div>
              <button
                onClick={handleGuestLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200/50 text-red-600 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Exit Guest Mode</span>
              </button>
            </div>
          ) : null}
        </div>

        {/* Bingo Card */}
        <div className="max-w-5xl mx-auto">
          {user || guestName ? (
            <BingoCard
              tasks={tasks}
              onTaskToggle={handleTaskToggle}
              completedTaskIds={completedTaskIds}
              projectMap={projectMap}
              guestName={guestName || undefined}
            />
          ) : (
            <div className="relative">
              {/* Preview overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white z-[5]" />
              <div className="absolute inset-0 flex items-center justify-center z-[5]">
                <div className="text-center space-y-4">
                  <div className="p-4 rounded-full bg-teal-50 inline-block">
                    <Trophy className="w-8 h-8 text-teal-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Connect to Start Playing
                  </h3>
                  <p className="text-gray-600 max-w-sm">
                    Sign in with Discord to get your personal bingo card and
                    start tracking your progress!
                  </p>
                  {!showGuestInput && (
                    <div className="flex flex-col items-center">
                      <button
                        onClick={handleLogin}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200/50 text-teal-600 transition-all"
                      >
                        <Trophy className="w-5 h-5" />
                        <span className="font-medium">
                          Connect with Discord
                        </span>
                      </button>
                      <button
                        onClick={handleGuestStart}
                        className="mt-2 inline-flex items-center gap-2 px-2 py-1 rounded bg-transparent text-gray-500 hover:text-teal-600 text-sm font-normal underline-offset-2 hover:underline focus:underline border-none shadow-none transition-all"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span className="font-normal">Play without login</span>
                      </button>
                    </div>
                  )}
                  {showGuestInput && !user && !guestName && (
                    <div className="mt-4 flex flex-col items-center gap-2">
                      <input
                        type="text"
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Enter your name"
                        value={tempGuestName}
                        onChange={(e) => setTempGuestName(e.target.value)}
                        maxLength={24}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleGuestConfirm}
                          className="px-4 py-2 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 transition"
                        >
                          Start Playing
                        </button>
                        <button
                          onClick={() => setShowGuestInput(false)}
                          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Show a non-interactive preview of the bingo card */}
              <BingoCard
                tasks={tasks}
                onTaskToggle={() => {}}
                completedTaskIds={[]}
                projectMap={projectMap}
                isPreview={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
