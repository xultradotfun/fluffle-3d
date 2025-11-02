import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import type { Project, BingoTask } from "@/types/bingo";

interface BingoTaskCardProps {
  task: BingoTask;
  index: number;
  projectMap: Map<string, Project>;
  onToggle: () => void;
  isCompleted: boolean;
}

export function BingoTaskCard({
  task,
  index,
  projectMap,
  onToggle,
  isCompleted,
}: BingoTaskCardProps) {
  // Get background image URL based on index
  const bgImageUrl = `https://mega-bingo.b-cdn.net/${index + 1}.jpg`;

  return (
    <motion.button
      onClick={onToggle}
      className={`group relative w-full aspect-square p-2.5 transition-all ${
        isCompleted
          ? "bg-gradient-to-br from-teal-500/20 to-emerald-500/20 dark:from-teal-500/30 dark:to-emerald-500/30"
          : "bg-white dark:bg-gray-900 hover:bg-gray-50/80 dark:hover:bg-gray-800/80"
      } ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <Image
          src={bgImageUrl}
          alt=""
          fill
          className="object-cover opacity-10 dark:opacity-5"
          unoptimized
        />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col">
        {isCompleted && (
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
                    className="relative w-4 h-4 rounded-full overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 group-hover:scale-110 transition-transform bg-white dark:bg-gray-800"
                    title={project.name}
                  >
                    <Image
                      src={project.img || `/avatars/${twitter}.jpg`}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                );
              })}
            </div>
          )}

          <h3
            className="text-xs font-medium text-gray-900 dark:text-white mb-1.5 pr-6"
            title={task.title}
          >
            {task.title}
          </h3>

          <div className="flex-1 flex flex-col">
            <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-relaxed">
              {task.description}
            </p>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
