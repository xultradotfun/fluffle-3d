import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";
import { Share2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import html2canvas from "html2canvas";
import { BingoTaskCard } from "./BingoTaskCard";
import { ShareModal } from "./ShareModal";
import type { BingoTask, Project } from "@/types/bingo";

interface BingoCardProps {
  tasks: BingoTask[];
  projectMap: Map<string, Project>;
  onTaskToggle: (taskId: string) => void;
  completedTaskIds: string[];
}

export function BingoCard({
  tasks,
  projectMap,
  onTaskToggle,
  completedTaskIds,
}: BingoCardProps) {
  const { user } = useDiscordAuth();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [preloadedImages, setPreloadedImages] = useState<Map<number, string>>(
    new Map()
  );

  // Preload background images
  useEffect(() => {
    const preloadImages = async () => {
      const newPreloadedImages = new Map<number, string>();
      for (let i = 0; i < tasks.length; i++) {
        const img = document.createElement("img");
        img.src = `https://mega-bingo.b-cdn.net/${i + 1}.jpg`;
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
        });
        newPreloadedImages.set(i, img.src);
      }
      setPreloadedImages(newPreloadedImages);
    };

    preloadImages();
  }, [tasks.length]);

  // Format Discord avatar URL
  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${
        user.avatar.startsWith("a_") ? "gif" : "png"
      }?size=128`
    : user?.id
    ? `https://cdn.discordapp.com/embed/avatars/${Number(user.id) % 5}.png`
    : null;

  const handleShareButtonClick = async () => {
    setIsShareModalOpen(true);
    // Small delay to ensure modal is rendered
    setTimeout(async () => {
      const card = document.getElementById("bingo-card-share");
      if (!card || !previewRef.current) return;

      try {
        // Show the share version temporarily
        card.classList.remove("hidden");

        const canvas = await html2canvas(card, {
          background: document.documentElement.classList.contains("dark")
            ? "#111"
            : "#fff",
          scale: 2,
          useCORS: true,
        } as any);

        // Hide the share version again
        card.classList.add("hidden");

        // Set the preview image
        previewRef.current.innerHTML = "";
        const previewImg = canvas.toDataURL("image/png");
        const img = document.createElement("img");
        img.src = previewImg;
        img.className = "w-full h-auto rounded-lg";
        previewRef.current.appendChild(img);
      } catch (error) {
        console.error("Failed to generate preview:", error);
      }
    }, 100);
  };

  const handleShare = async (platform: string) => {
    // Share logic here
    setIsShareModalOpen(false);
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {avatarUrl && (
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700">
                <Image
                  src={avatarUrl}
                  alt={user?.username || "User avatar"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                MegaETH Testnet Bingo
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {completedTaskIds.length} of {tasks.length} tasks completed (
                {Math.round((completedTaskIds.length / tasks.length) * 100)}%)
              </p>
            </div>
          </div>
          <button
            onClick={handleShareButtonClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {/* Bingo Grid */}
        <div
          id="bingo-card"
          className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-xl"
        >
          <div className="grid grid-cols-5 gap-2">
            {tasks.map((task, index) => (
              <BingoTaskCard
                key={task.id}
                task={task}
                index={index}
                projectMap={projectMap}
                onToggle={() => onTaskToggle(task.id)}
                isCompleted={completedTaskIds.includes(task.id)}
              />
            ))}
          </div>
        </div>

        {/* Hidden Share Preview */}
        <div
          id="bingo-card-share"
          className="hidden bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900 dark:to-gray-900/95 p-6 rounded-xl"
        >
          {/* Share Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className="relative h-8"
                style={{ width: "calc(8.13 * 2rem)" }}
              >
                <Image
                  src={
                    document.documentElement.classList.contains("dark")
                      ? "/megalogo-white.png"
                      : "/megalogo.png"
                  }
                  alt="MegaETH"
                  fill
                  className="object-contain"
                  unoptimized
                  priority
                />
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center gap-3">
                {avatarUrl && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700">
                    <Image
                      src={avatarUrl}
                      alt={user?.username || "User avatar"}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {user?.username || "Anon"}'s Bingo Progress
                  </h2>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {completedTaskIds.length} of {tasks.length} tasks completed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bingo Grid */}
          <div className="grid grid-cols-5 gap-2">
            {tasks.map((task, index) => {
              const isTaskCompleted = completedTaskIds.includes(task.id);
              const bgImageUrl =
                preloadedImages.get(index) ||
                `https://mega-bingo.b-cdn.net/${index + 1}.jpg`;

              return (
                <div
                  key={task.id}
                  className={`relative w-full aspect-square p-2.5 ${
                    isTaskCompleted
                      ? "bg-gradient-to-br from-teal-500/20 to-emerald-500/20 dark:from-teal-500/30 dark:to-emerald-500/30"
                      : "bg-white dark:bg-gray-900"
                  } ring-1 ring-gray-200 dark:ring-gray-700`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <Image
                      src={bgImageUrl}
                      alt=""
                      fill
                      className="object-cover opacity-10 dark:opacity-5"
                      unoptimized
                      priority={index < 5} // Prioritize loading first row
                    />
                  </div>

                  <div className="relative h-full flex flex-col">
                    {isTaskCompleted && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <CheckCircle2 className="w-10 h-10 text-teal-500/20 dark:text-teal-400/20" />
                      </div>
                    )}

                    <div className="relative w-full h-full flex flex-col">
                      {task.projects && task.projects.length > 0 && (
                        <div className="absolute top-0 right-0 flex -space-x-1.5">
                          {task.projects.map((twitter: string) => {
                            const project = projectMap.get(twitter);
                            if (!project) return null;
                            return (
                              <div
                                key={twitter}
                                className="relative w-4 h-4 rounded-full overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-800"
                              >
                                <Image
                                  src={`/avatars/${twitter}.jpg`}
                                  alt={project.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <h3 className="text-xs font-medium text-gray-900 dark:text-white mb-1.5 pr-6 text-center">
                        {task.title}
                      </h3>

                      <div className="flex-1 flex flex-col">
                        <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                          {task.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Share Footer */}
          <div className="mt-6 flex items-center justify-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Get your own MegaETH Bingo Card at{" "}
              <span className="text-teal-600 dark:text-teal-400">
                fluffle.tools
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShare={() => handleShare("")}
        previewRef={previewRef}
        completedCount={completedTaskIds.length}
        totalTasks={tasks.length}
        completedLines={0}
      />
    </>
  );
}
