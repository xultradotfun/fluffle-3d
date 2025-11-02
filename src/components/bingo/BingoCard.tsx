import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";
import { Share2, CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
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
  isPreview?: boolean;
  guestName?: string;
}

export function BingoCard({
  tasks,
  projectMap,
  onTaskToggle,
  completedTaskIds,
  isPreview = false,
  guestName,
}: BingoCardProps) {
  const { user } = useDiscordAuth();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [preloadedImages, setPreloadedImages] = useState<Map<number, string>>(
    new Map()
  );
  const [hoveredCards, setHoveredCards] = useState<Set<string>>(new Set());
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const handleTaskHover = (taskId: string | null, isEntering: boolean) => {
    if (isEntering && taskId) {
      // Clear any existing timeout for this card
      if (timeoutsRef.current.has(taskId)) {
        clearTimeout(timeoutsRef.current.get(taskId));
        timeoutsRef.current.delete(taskId);
      }
      // Add to hovered set immediately
      setHoveredCards((prev) => {
        const next = new Set(prev);
        next.add(taskId);
        return next;
      });
    } else if (!isEntering && taskId) {
      // Set new timeout to remove the card
      const timeout = setTimeout(() => {
        setHoveredCards((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
        timeoutsRef.current.delete(taskId);
      }, 250);

      timeoutsRef.current.set(taskId, timeout);
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

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
          backgroundColor: null, // Let the gradient background show
          scale: 2,
          useCORS: true,
          allowTaint: true,
          imageTimeout: 0,
          onclone: (clonedDoc: Document) => {
            // Ensure all images in the cloned document have proper styling
            const images = clonedDoc.querySelectorAll("img");
            images.forEach((img: HTMLImageElement) => {
              img.style.objectFit = "cover";
              img.style.width = "100%";
              img.style.height = "100%";
              img.style.position = "absolute";
              img.style.top = "0";
              img.style.left = "0";
            });
          },
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

  const handleShare = async () => {
    try {
      const previewImg = previewRef.current?.querySelector("img");
      if (!previewImg) return;

      // Create a canvas element
      const canvas = document.createElement("canvas");
      canvas.width = previewImg.naturalWidth;
      canvas.height = previewImg.naturalHeight;

      // Draw the image onto the canvas
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(previewImg, 0, 0);

      // Get the blob from the canvas
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!blob) return;

      // Create a ClipboardItem and write to clipboard
      const item = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([item]);
    } catch (error) {
      console.error("Failed to copy image:", error);
    }
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative px-6 py-4 bg-white/50 dark:bg-white/[0.03] rounded-2xl border border-gray-200/50 dark:border-white/[0.05] backdrop-blur-sm">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
          <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {guestName ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20 dark:ring-white/10 bg-gray-200 dark:bg-gray-700">
                  <Image
                    src="/avatars/megaeth.jpg"
                    alt="MegaETH Guest Avatar"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                avatarUrl && (
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-teal-500/30 to-emerald-500/30 dark:from-teal-500/20 dark:to-emerald-500/20 rounded-full blur" />
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20 dark:ring-white/10">
                      <Image
                        src={avatarUrl}
                        alt={user?.username || "User avatar"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                )
              )}
              <div>
                <div className="flex items-center gap-3 mb-0.5">
                  <h2 className="text-xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    MegaETH Testnet Bingo
                  </h2>
                  <div className="h-4 w-px bg-gradient-to-b from-gray-200 to-transparent dark:from-white/10" />
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-teal-50/50 dark:bg-teal-500/[0.05] ring-1 ring-teal-500/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500/50" />
                    <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                      {Math.round(
                        (completedTaskIds.length / tasks.length) * 100
                      )}
                      % Complete
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {completedTaskIds.length} of {tasks.length} tiles completed
                </p>
                {guestName && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">
                    {guestName}
                  </p>
                )}
              </div>
            </div>
            {!isPreview && (
              <button
                onClick={handleShareButtonClick}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-gray-200/50 dark:border-white/[0.05] text-sm font-medium text-gray-700 dark:text-gray-200 transition-all hover:scale-105"
              >
                <Share2 className="w-4 h-4" />
                Share Progress
              </button>
            )}
          </div>
        </div>

        {/* Bingo Grid */}
        <div
          id="bingo-card"
          className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-xl"
        >
          <div className="grid grid-cols-6 gap-3">
            {tasks.map((task, index) => {
              const isCompleted = completedTaskIds.includes(task.id);
              return (
                <div
                  key={task.id}
                  className={`group relative w-full aspect-square rounded-xl overflow-hidden transition-all duration-150 ${
                    isCompleted
                      ? "ring-2 ring-teal-500/50 dark:ring-teal-400/50"
                      : "ring-1 ring-gray-200 dark:ring-gray-700"
                  } ${
                    !isPreview
                      ? "cursor-pointer hover:shadow-xl hover:shadow-teal-500/10 dark:hover:shadow-teal-500/20 hover:-translate-y-1"
                      : "cursor-default"
                  }`}
                  onClick={() => !isPreview && onTaskToggle(task.id)}
                  onMouseEnter={() =>
                    !isPreview && handleTaskHover(task.id, true)
                  }
                  onMouseLeave={() =>
                    !isPreview && handleTaskHover(task.id, false)
                  }
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={`https://mega-bingo.b-cdn.net/${index + 1}.jpg`}
                      alt=""
                      fill
                      className="object-cover transition-all duration-150 group-hover:scale-110"
                      unoptimized
                      priority={index < 5}
                    />
                    {/* Overlay gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-b ${
                        isCompleted
                          ? "from-teal-500/30 to-emerald-500/30 dark:from-teal-500/40 dark:to-emerald-500/40"
                          : "from-gray-900/70 to-gray-900/50 dark:from-gray-900/80 dark:to-gray-900/60"
                      }`}
                    />
                  </div>

                  {/* Completion Checkmark */}
                  {isCompleted && (
                    <div className="absolute top-3 right-3 flex items-center justify-center pointer-events-none">
                      <div className="bg-teal-500/20 dark:bg-teal-400/20 p-1.5 rounded-full">
                        <CheckCircle2 className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                      </div>
                    </div>
                  )}

                  {/* Project Avatars */}
                  {task.projects && task.projects.length > 0 && (
                    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1">
                      {task.projects.map((twitter: string) => {
                        const project = projectMap.get(twitter);
                        return (
                          <div
                            key={twitter}
                            className="relative w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/30 bg-white dark:bg-gray-800 shadow-sm"
                            title={project?.name || twitter}
                          >
                            <Image
                              src={project?.img || `/avatars/${twitter}.jpg`}
                              alt={project?.name || twitter}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="relative h-full flex flex-col p-3">
                    {/* Title - Always visible */}
                    <div className="flex-1 flex items-center justify-center">
                      <h3 className="text-sm font-semibold text-white text-center">
                        {task.title}
                      </h3>
                    </div>

                    {/* Description - Visible on hover and for 2s after */}
                    <div
                      className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center p-3 rounded-xl transition-opacity duration-300 ${
                        hoveredCards.has(task.id) ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="flex-1 w-full overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30 pr-2">
                        <div className="space-y-2">
                          <p className="text-xs text-white/90 leading-relaxed text-center">
                            {task.description}
                          </p>
                        </div>
                      </div>
                      {task.links && task.links.length > 0 && (
                        <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-white/10 w-full">
                          {task.links.map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] group/link"
                              onClick={(e) => e.stopPropagation()}
                              title="Start Task"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-white/70 group-hover/link:text-white transition-colors" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Coming Soon Message */}
            {tasks.length % 6 !== 0 && (
              <div
                className="group relative w-full rounded-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-50 dark:from-teal-900/20 dark:via-emerald-900/20 dark:to-teal-900/20"
                style={{
                  gridColumn: `${(tasks.length % 6) + 1} / span ${
                    6 - (tasks.length % 6)
                  }`,
                  aspectRatio: 6 - (tasks.length % 6) + 0.15,
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.1)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.2)_0%,transparent_70%)]" />
                <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 dark:from-teal-500/30 dark:to-emerald-500/30 flex items-center justify-center shadow-lg shadow-teal-500/10 dark:shadow-teal-500/5">
                      <Sparkles className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                        More Tasks Coming Soon
                      </h3>
                      <p className="text-xs text-teal-600/80 dark:text-teal-400/80">
                        New projects are launching on testnet every week!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hidden Share Preview */}
        {!isPreview && (
          <div
            id="bingo-card-share"
            className="hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg"
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
                  {guestName ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 shadow-sm bg-gray-200 dark:bg-gray-700">
                      <Image
                        src="/avatars/megaeth.jpg"
                        alt="MegaETH Guest Avatar"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    avatarUrl && (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 shadow-sm">
                        <Image
                          src={avatarUrl}
                          alt={user?.username || "User avatar"}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    )
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {guestName
                        ? `${guestName}'s Bingo Progress`
                        : `${user?.username || "Anon"}'s Bingo Progress`}
                    </h2>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {completedTaskIds.length} of {tasks.length} tasks
                      completed
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bingo Grid */}
            <div className="grid grid-cols-6 gap-3">
              {tasks.map((task, index) => {
                const isTaskCompleted = completedTaskIds.includes(task.id);

                return (
                  <div
                    key={task.id}
                    className={`group relative w-full aspect-square rounded-xl overflow-hidden ${
                      isTaskCompleted
                        ? "ring-2 ring-teal-500/50 dark:ring-teal-400/50"
                        : "ring-1 ring-gray-200 dark:ring-gray-700"
                    }`}
                  >
                    {/* Background Image Container */}
                    <div className="absolute inset-0">
                      <div className="absolute inset-0">
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                          <Image
                            src={`https://mega-bingo.b-cdn.net/${
                              index + 1
                            }.jpg`}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                            priority={index < 5}
                          />
                        </div>
                        <div
                          className={`absolute inset-0 bg-gradient-to-b ${
                            isTaskCompleted
                              ? "from-teal-500/30 to-emerald-500/30 dark:from-teal-500/40 dark:to-emerald-500/40"
                              : "from-gray-900/70 to-gray-900/50 dark:from-gray-900/80 dark:to-gray-900/60"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Completion Checkmark */}
                    {isTaskCompleted && (
                      <div className="absolute top-3 right-3 flex items-center justify-center pointer-events-none">
                        <div className="bg-teal-500/20 dark:bg-teal-400/20 p-1.5 rounded-full">
                          <CheckCircle2 className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                        </div>
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="relative h-full flex flex-col p-3">
                      {/* Title - Always visible */}
                      <div className="flex-1 flex items-center justify-center">
                        <h3 className="text-sm font-semibold text-white text-center">
                          {task.title}
                        </h3>
                      </div>

                      {/* Project Avatars - Now at the bottom */}
                      {task.projects && task.projects.length > 0 && (
                        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1">
                          {task.projects.map((twitter: string) => {
                            const project = projectMap.get(twitter);
                            return (
                              <div
                                key={twitter}
                                className="relative w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/30 bg-white dark:bg-gray-800 shadow-sm"
                                title={project?.name || twitter}
                              >
                                <Image
                                  src={
                                    project?.img || `/avatars/${twitter}.jpg`
                                  }
                                  alt={project?.name || twitter}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {/* Coming Soon Message for Share Preview */}
              {tasks.length % 6 !== 0 && (
                <div
                  className="group relative w-full rounded-xl overflow-hidden ring-1 ring-white/10 bg-gray-900"
                  style={{
                    gridColumn: `${(tasks.length % 6) + 1} / span ${
                      6 - (tasks.length % 6)
                    }`,
                    aspectRatio: 6 - (tasks.length % 6) + 0.15,
                  }}
                >
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                      <div
                        className="relative w-full"
                        style={{ aspectRatio: "2/1" }}
                      >
                        <Image
                          src="/socialpreview.jpg"
                          alt="MegaETH"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-end justify-end p-4">
                    <p className="text-sm font-medium text-white/90">
                      bingo.fluffle.tools
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Share Footer */}
            <div className="mt-6 flex items-center justify-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Get your unique bingo card and start exploring real-time apps at{" "}
                <span className="text-teal-600 dark:text-teal-400">
                  bingo.fluffle.tools
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {!isPreview && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onShare={() => handleShare()}
          previewRef={previewRef}
          completedCount={completedTaskIds.length}
          totalTasks={tasks.length}
          completedLines={0}
        />
      )}
    </>
  );
}
