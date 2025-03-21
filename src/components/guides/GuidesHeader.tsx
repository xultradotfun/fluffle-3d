import { BookOpen } from "lucide-react";

export function GuidesHeader() {
  return (
    <div className="text-center max-w-3xl mx-auto relative mb-12">
      <div className="absolute inset-x-0 top-6 -bottom-6 bg-gradient-to-b from-pink-500/10 via-purple-500/5 to-transparent dark:from-pink-500/[0.07] dark:via-purple-500/[0.03] dark:to-transparent blur-2xl -z-10 rounded-[100%]" />
      <div className="relative">
        <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-5 tracking-tight leading-[1.15]">
          Explore MegaETH
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
          Step-by-step guides to help you explore and interact with projects on
          the MegaETH testnet.
        </p>

        <div className="mt-8">
          <div className="p-4 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm">
            <div className="flex flex-row items-start gap-3 text-left">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 p-2.5 border border-blue-500/20 dark:border-blue-500/30">
                <BookOpen className="w-full h-full text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  Track Your Progress
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Complete guides to earn rewards and contribute to the
                  ecosystem. Your progress is saved automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
