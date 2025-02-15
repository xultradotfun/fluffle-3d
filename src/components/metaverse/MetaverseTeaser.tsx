export function MetaverseTeaser() {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
          </span>
          <span className="text-xs font-medium text-pink-400">Coming Soon</span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Play With Your Fluffle in 3D
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
          Your Fluffle is coming to life in the metaverse! Soon you'll be able
          to play games, explore, and hang out with other Fluffles in immersive
          3D worlds, powered by{" "}
          <a
            href="https://hyperfy.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 hover:text-pink-300 transition-colors border-b border-pink-400/30 hover:border-pink-400"
          >
            Hyperfy
          </a>
          .
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-pink-500/20 hover:from-white/[0.08] hover:to-white/[0.05] transition-all group">
            <svg
              className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform"
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
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
              Play Mini-Games
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-pink-500/20 hover:from-white/[0.08] hover:to-white/[0.05] transition-all group">
            <svg
              className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform"
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
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
              Meet Friends
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-pink-500/20 hover:from-white/[0.08] hover:to-white/[0.05] transition-all group">
            <svg
              className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform"
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
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
              Explore Worlds
            </span>
          </div>
        </div>
      </div>

      {/* Preview Video */}
      <div className="relative max-w-4xl mx-auto">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-2xl opacity-50"></div>
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/10 group hover:border-pink-500/20 transition-all">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.12),transparent)]" />
          <div className="relative w-full h-full">
            <video
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              autoPlay
              loop
              muted
              playsInline
            >
              <source
                src="https://cdn.discordapp.com/attachments/867523448447041599/1340267799976869900/hyperfy-preview.mp4?ex=67b1bd28&is=67b06ba8&hm=da49ffc22cf64dcee1c628a55c410f9228edd68d36331d9ed59e73c6a421e3c6"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Coming Soon Badge */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/80 backdrop-blur-sm border border-white/10 hover:border-pink-500/20 transition-all">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                <svg
                  className="w-4.5 h-4.5 text-pink-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Metaverse Integration
                </h3>
                <p className="text-sm text-gray-400">Coming Soon</p>
              </div>
            </div>
            <a
              href="https://hyperfy.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium text-sm hover:from-pink-600 hover:to-purple-600 transition-all flex items-center gap-2 hover:gap-3 group/btn shadow-lg shadow-pink-500/20"
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
    </div>
  );
}
