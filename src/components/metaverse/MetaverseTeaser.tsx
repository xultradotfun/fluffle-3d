export function MetaverseTeaser() {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
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
          with your wallet that owns a Fluffle and the base model will appear in your avatar inventory. Wearables coming soon!
        </p>

        {/* Preview Video */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-2xl opacity-50"></div>
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-white dark:from-white/[0.02] to-gray-50/80 dark:to-white/[0.01] border border-gray-200 dark:border-white/10 group hover:border-pink-500/30 dark:hover:border-pink-500/20 transition-all shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.08),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.05),transparent)]" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-black/20">
              <video
                className="absolute inset-0 w-full h-full object-cover scale-[1.15] origin-center"
                autoPlay
                loop
                muted
                playsInline
                poster="/hyperfy-preview-poster.jpg"
              >
                <source
                  src="https://cdn.discordapp.com/attachments/1111164047904215094/1340446449737007184/hyperfyio_megaeth.mp4?ex=67b26389&is=67b11209&hm=b1d8eb5b73a667a26cd3e0031a09f1889d6b39875cf47d5f9b170a59f586e1cf&"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent dark:from-black/80 dark:via-black/40 pointer-events-none" />
            </div>

            {/* Coming Soon Badge */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-white/90 to-white/80 dark:from-black/80 dark:to-black/70 backdrop-blur-sm border border-white/30 dark:border-white/10 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-600"></span>
                </span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  Coming Soon to{" "}
                  <span className="bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-500 dark:to-purple-500 bg-clip-text text-transparent">
                    Hyperfy
                  </span>
                </span>
              </div>
              <a
                href="https://hyperfy.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium text-sm transition-all group/btn shadow-sm"
              >
                <span>Learn More</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {/* Play Mini-Games Card */}
          <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 hover:border-pink-500/30 dark:hover:border-pink-500/20 transition-all shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-purple-50/50 dark:from-pink-500/[0.08] dark:to-purple-500/[0.05]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.08),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.05),transparent)]" />
            <div className="relative p-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-500/20 dark:to-purple-500/20 border border-pink-100 dark:border-pink-500/20 p-2 mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <svg
                  className="w-full h-full text-pink-600 dark:text-pink-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Play Mini-Games
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Challenge other Fluffles in exciting mini-games and compete for
                the top spot on the leaderboard.
              </p>
            </div>
          </div>

          {/* Meet Friends Card */}
          <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 hover:border-purple-500/30 dark:hover:border-purple-500/20 transition-all shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-500/[0.08] dark:to-indigo-500/[0.05]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.08),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.05),transparent)]" />
            <div className="relative p-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-500/20 dark:to-indigo-500/20 border border-purple-100 dark:border-purple-500/20 p-2 mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <svg
                  className="w-full h-full text-purple-600 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Meet Friends
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Join the vibrant Fluffle community in immersive 3D spaces and
                make lasting connections.
              </p>
            </div>
          </div>

          {/* Explore Worlds Card */}
          <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-all shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-500/[0.08] dark:to-indigo-500/[0.05]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)]" />
            <div className="relative p-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-100 dark:border-blue-500/20 p-2 mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <svg
                  className="w-full h-full text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Explore Worlds
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Discover breathtaking 3D environments and embark on adventures
                with your Fluffle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
