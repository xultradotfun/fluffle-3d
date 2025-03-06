export const BuildersContent = () => (
  <div className="p-5 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm shadow-xl">
    <div className="flex flex-row items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 p-2.5 border border-purple-500/20 dark:border-purple-500/30">
        <svg
          className="w-full h-full text-purple-600 dark:text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
      <div className="space-y-2 flex-1">
        <h3 className="text-lg font-semibold text-foreground">
          Join MegaForge
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          Get early access and dedicated support for integrating your app with
          MegaETH testnet.
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

    <div className="mt-6 pt-6 border-t border-gray-200/10">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="text-base font-medium text-foreground">
            Want to get started?
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Check out developer documentation
          </p>
        </div>
        <a
          href="https://docs.megaeth.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group"
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
  </div>
);
