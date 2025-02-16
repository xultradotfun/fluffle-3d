export function MetaverseHeader() {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 mb-6 shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
        </span>
        <span className="text-xs font-medium text-pink-600 dark:text-pink-400">
          Coming Soon
        </span>
      </div>

      <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
        Play With Your Fluffle in 3D
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        Your Fluffle is coming to life in the metaverse! Login to{" "}
        <a
          href="https://hyperfy.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 dark:text-pink-400 hover:text-pink-500 dark:hover:text-pink-300 transition-colors border-b border-pink-200 dark:border-pink-400/30 hover:border-pink-400 dark:hover:border-pink-400"
        >
          Hyperfy
        </a>{" "}
        with your wallet that owns a Fluffle and the base model will appear in
        your avatar inventory. Wearables coming soon!
      </p>
    </div>
  );
}
