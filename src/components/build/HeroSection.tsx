import Image from "next/image";

export function HeroSection() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/[0.08] text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-6 ring-1 ring-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Live Now
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tight">
        <span className="relative inline-block">
          <Image
            src="/megalogo.png"
            alt="MEGA"
            width={140}
            height={28}
            className="h-8 sm:h-10 w-auto brightness-0 opacity-80 dark:opacity-100 dark:invert"
            priority
          />
        </span>{" "}
        Builders Hub
      </h1>

      <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
        Everything you need to build and deploy on MegaETH testnet
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
        <div className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 shadow-sm">
          <div className="text-lg sm:text-2xl font-mono font-bold bg-gradient-to-r from-pink-500 to-indigo-500 dark:from-pink-400 dark:to-indigo-400 bg-clip-text text-transparent">
            2 Ggas/block
          </div>
          <div className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">
            Max Block Size
          </div>
        </div>
        <div className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 shadow-sm">
          <div className="text-lg sm:text-2xl font-mono font-bold bg-gradient-to-r from-pink-500 to-indigo-500 dark:from-pink-400 dark:to-indigo-400 bg-clip-text text-transparent">
            10ms
          </div>
          <div className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">
            Mini Block Time
          </div>
        </div>
      </div>
    </div>
  );
}
