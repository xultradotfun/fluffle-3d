import { useState, useEffect } from "react";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";
import { apiClient, API_ENDPOINTS } from "@/lib/api";
import { BingoCard } from "./BingoCard";
import { Trophy, Smartphone, LogOut } from "lucide-react";
import ecosystemData from "@/data/ecosystem.json";
import Image from "next/image";
import type { BingoTask, Project } from "@/types/bingo";

export function BingoView() {
  const { user, login, logout } = useDiscordAuth();
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string>("");
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [tempGuestName, setTempGuestName] = useState("");
  const [bingoConfig, setBingoConfig] = useState<any>(null);
  const [configLoading, setConfigLoading] = useState(true);

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

  // Load bingo configuration from API
  useEffect(() => {
    const loadBingoConfig = async () => {
      try {
        const config = await apiClient.get(API_ENDPOINTS.BINGO.CONFIG);
        setBingoConfig(config);
        setConfigLoading(false);
      } catch (error) {
        console.error("Failed to load bingo config:", error);
        setError("Failed to load bingo configuration");
        setConfigLoading(false);
      }
    };

    loadBingoConfig();
  }, []);

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
    ecosystemData.projects.map((project) => [project.twitter, project])
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
      const response = await fetch("/api/bingo/progress", {
        method: isCompleted ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        // Revert the optimistic update on error
        setCompletedTaskIds((prevIds) => {
          if (isCompleted) {
            return [...prevIds, taskId];
          } else {
            return prevIds.filter((id) => id !== taskId);
          }
        });
        const data = await response.json();
        throw new Error(data.error || "Failed to update progress");
      }

      setError(null);
    } catch (error) {
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
            <div className="p-4 rounded-full bg-yellow-50 dark:bg-yellow-500/10">
              <Smartphone className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Desktop View Required
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
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
          <p className="text-gray-600 dark:text-gray-300">
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
        <div className="text-red-500 dark:text-red-400">
          {error}. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-12 relative">
          <div className="absolute inset-x-0 top-6 -bottom-6 bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent dark:from-teal-500/[0.07] dark:via-emerald-500/[0.03] dark:to-transparent blur-2xl -z-10 rounded-[100%]" />

          <h1 className="flex items-center justify-center gap-3 text-4xl sm:text-5xl font-bold mb-6">
            <div
              className="relative h-10 sm:h-12"
              style={{ width: "calc(8.13 * 2.5rem)" }}
            >
              <Image
                src="/megalogo.png"
                alt="MegaETH"
                fill
                className="object-contain brightness-0 opacity-80 dark:opacity-100 dark:invert"
                unoptimized
                priority
              />
            </div>
            <span className="bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 dark:from-teal-400 dark:via-emerald-400 dark:to-green-400 bg-clip-text text-transparent tracking-tight">
              Testnet Bingo
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            Explore the MegaETH testnet through interactive challenges and
            complete your very own bingo card!
          </p>

          {user ? (
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/[0.08] backdrop-blur-sm">
                {user.avatar && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700">
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
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.username}
                </span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-500/[0.08] dark:hover:bg-red-500/[0.16] border border-red-200/50 dark:border-red-500/20 text-red-600 dark:text-red-400 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          ) : guestName ? (
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/[0.08] backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {guestName}
                </span>
              </div>
              <button
                onClick={handleGuestLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-500/[0.08] dark:hover:bg-red-500/[0.16] border border-red-200/50 dark:border-red-500/20 text-red-600 dark:text-red-400 transition-all"
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
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white dark:via-gray-900/80 dark:to-gray-900 z-[5]" />
              <div className="absolute inset-0 flex items-center justify-center z-[5]">
                <div className="text-center space-y-4">
                  <div className="p-4 rounded-full bg-teal-50 dark:bg-teal-500/10 inline-block">
                    <Trophy className="w-8 h-8 text-teal-500 dark:text-teal-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Connect to Start Playing
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 max-w-sm">
                    Sign in with Discord to get your personal bingo card and
                    start tracking your progress!
                  </p>
                  {!showGuestInput && (
                    <div className="flex flex-col items-center">
                      <button
                        onClick={handleLogin}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-500/[0.08] dark:hover:bg-teal-500/[0.16] border border-teal-200/50 dark:border-teal-500/20 text-teal-600 dark:text-teal-400 transition-all"
                      >
                        <Trophy className="w-5 h-5" />
                        <span className="font-medium">
                          Connect with Discord
                        </span>
                      </button>
                      <button
                        onClick={handleGuestStart}
                        className="mt-2 inline-flex items-center gap-2 px-2 py-1 rounded bg-transparent text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 text-sm font-normal underline-offset-2 hover:underline focus:underline border-none shadow-none transition-all"
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
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
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
