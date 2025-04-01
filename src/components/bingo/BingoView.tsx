import { useState, useEffect } from "react";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";
import { BingoCard } from "./BingoCard";
import { Trophy, Smartphone } from "lucide-react";
import bingoConfig from "@/data/bingo.json";
import ecosystemData from "@/data/ecosystem.json";
import Image from "next/image";
import type { BingoTask, Project } from "@/types/bingo";

export function BingoView() {
  const { user, login } = useDiscordAuth();
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile device on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Merge completed state with base tasks
  const tasks = bingoConfig.tasks.map((task) => ({
    ...task,
    completed: completedTaskIds.includes(task.id),
  }));

  // Create a map of Twitter handles to project data for quick lookup
  const projectMap = new Map<string, Project>(
    ecosystemData.projects.map((project) => [project.twitter, project])
  );

  useEffect(() => {
    // Load saved progress from local storage if user is logged in
    if (user) {
      const savedProgress = localStorage.getItem(`bingo_progress_${user.id}`);
      if (savedProgress) {
        setCompletedTaskIds(JSON.parse(savedProgress));
      }
    }
  }, [user]);

  useEffect(() => {
    // Save progress to local storage if user is logged in
    if (user) {
      localStorage.setItem(
        `bingo_progress_${user.id}`,
        JSON.stringify(completedTaskIds)
      );
    }
  }, [completedTaskIds, user]);

  const handleTaskToggle = (taskId: string) => {
    setCompletedTaskIds((prevIds) => {
      if (prevIds.includes(taskId)) {
        return prevIds.filter((id) => id !== taskId);
      } else {
        return [...prevIds, taskId];
      }
    });
  };

  // Get unique categories and calculate stats
  const categories = [...new Set(tasks.map((task) => task.category))].sort();
  const categoryStats = categories.map((category) => {
    const categoryTasks = tasks.filter((task) => task.category === category);
    const completed = categoryTasks.filter((task) => task.completed).length;
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
            The MegaETH Community Bingo is optimized for desktop viewing. Please
            visit this page on a desktop device for the best experience.
          </p>
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

          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 dark:from-teal-400 dark:via-emerald-400 dark:to-green-400 bg-clip-text text-transparent tracking-tight">
            {bingoConfig.metadata.title}
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            {bingoConfig.metadata.description}
          </p>

          {/* Progress Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {/* Overall Progress */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-4 flex items-center justify-center gap-8 mb-4">
              <div className="px-4 py-2 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/[0.08] backdrop-blur-sm">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completedCount}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Tasks Completed
                </div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/[0.08] backdrop-blur-sm">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.floor((completedCount / tasks.length) * 100)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Completion
                </div>
              </div>
            </div>
          </div>

          {!user && (
            <button
              onClick={login}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-500/[0.08] dark:hover:bg-teal-500/[0.16] border border-teal-200/50 dark:border-teal-500/20 text-teal-600 dark:text-teal-400 transition-all"
            >
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Connect with Discord</span>
            </button>
          )}
        </div>

        {/* Bingo Card */}
        <div className="max-w-5xl mx-auto">
          <BingoCard
            tasks={tasks}
            onTaskToggle={handleTaskToggle}
            completedTaskIds={completedTaskIds}
            projectMap={projectMap}
          />
        </div>
      </div>
    </div>
  );
}
