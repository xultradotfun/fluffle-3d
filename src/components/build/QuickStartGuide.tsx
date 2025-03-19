export function QuickStartGuide() {
  return (
    <div className="p-6 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm shadow-xl">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Quick Start Guide
      </h2>
      <div className="space-y-6">
        <div className="flex gap-4">
          <span className="flex-none w-7 h-7 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 text-purple-500 flex items-center justify-center text-base font-medium border border-purple-500/20 dark:border-purple-500/30">
            1
          </span>
          <div>
            <div className="text-base font-medium text-foreground mb-2">
              Join MegaForge
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Get early access and dedicated support for integrating your app
              with MegaETH testnet.
            </p>
            <a
              href="https://forms.gle/iwPBVdCmzaYh5x837"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all text-sm font-medium shadow-sm hover:shadow-md group"
            >
              Apply Now
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className="flex gap-4">
          <span className="flex-none w-7 h-7 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 text-purple-500 flex items-center justify-center text-base font-medium border border-purple-500/20 dark:border-purple-500/30">
            2
          </span>
          <div>
            <div className="text-base font-medium text-foreground mb-2">
              Review Documentation
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Familiarize yourself with technical documentation and integration
              guides.
            </p>
            <a
              href="https://docs.megaeth.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group"
            >
              View Docs
              <svg
                className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
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
        <div className="flex gap-4">
          <span className="flex-none w-7 h-7 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 text-purple-500 flex items-center justify-center text-base font-medium border border-purple-500/20 dark:border-purple-500/30">
            3
          </span>
          <div>
            <div className="text-base font-medium text-foreground mb-2">
              Connect to Testnet
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Add MegaETH testnet to your wallet and start building.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
