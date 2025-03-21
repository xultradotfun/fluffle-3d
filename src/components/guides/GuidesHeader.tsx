import { BookOpen } from "lucide-react";
import Image from "next/image";

export function GuidesHeader() {
  return (
    <div className="text-center max-w-4xl mx-auto relative mb-12">
      <div className="absolute inset-x-0 top-6 -bottom-6 bg-gradient-to-b from-pink-500/10 via-purple-500/5 to-transparent dark:from-pink-500/[0.07] dark:via-purple-500/[0.03] dark:to-transparent blur-2xl -z-10 rounded-[100%]" />
      <div className="relative">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tight">
          Explore{" "}
          <span className="relative inline-block">
            <Image
              src="/megalogo.png"
              alt="MEGA"
              width={140}
              height={28}
              className="h-8 sm:h-10 w-auto brightness-0 opacity-80 dark:opacity-100 dark:invert"
              priority
            />
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Step-by-step guides to help you explore and interact with projects on
          the MegaETH testnet.
        </p>
      </div>
    </div>
  );
}
