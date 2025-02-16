export function MetaversePreview() {
  return (
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
  );
}
