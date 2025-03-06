export const UsersContent = () => (
  <div className="grid sm:grid-cols-2 gap-6">
    <div className="p-5 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm shadow-xl">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Get Started
      </h3>
      <ol className="space-y-4">
        <li className="flex gap-3">
          <span className="flex-none w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 text-blue-500 flex items-center justify-center text-sm font-medium border border-blue-500/20 dark:border-blue-500/30">
            1
          </span>
          <div>
            <div className="font-medium text-foreground text-base mb-1">
              Join Discord
            </div>
            <a
              href="https://discord.com/invite/megaeth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
            >
              Join MegaETH Discord
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex-none w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 text-blue-500 flex items-center justify-center text-sm font-medium border border-blue-500/20 dark:border-blue-500/30">
            2
          </span>
          <div>
            <div className="font-medium text-foreground text-base mb-1">
              Register Wallet
            </div>
            <a
              href="https://discord.com/channels/1219739501673451551/1322104558847266848"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
            >
              Go to #wallet-registration
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex-none w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 text-blue-500 flex items-center justify-center text-sm font-medium border border-blue-500/20 dark:border-blue-500/30">
            3
          </span>
          <div>
            <div className="font-medium text-foreground text-base mb-1">
              Use /register
            </div>
            <div className="text-sm text-muted-foreground">
              Enter the command in Discord
            </div>
          </div>
        </li>
      </ol>
    </div>
    <div className="p-5 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm shadow-xl">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Distribution Details
      </h3>
      <div className="space-y-4 text-sm">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Testnet ETH will be distributed directly to registered wallets
          starting March 10th.
        </p>
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 border border-blue-500/10 dark:border-blue-500/20">
          <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
            <svg
              className="w-5 h-5 flex-none text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="leading-relaxed">
              Direct distribution helps prevent faucet issues and ensures fair
              access to testnet ETH
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
