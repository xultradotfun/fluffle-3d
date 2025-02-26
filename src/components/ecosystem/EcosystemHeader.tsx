import * as Tooltip from "@radix-ui/react-tooltip";

export function EcosystemHeader() {
  return (
    <Tooltip.Provider delayDuration={300}>
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
          Ecosystem Projects
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Discover and vote on the growing ecosystem of projects building on
          MegaETH
        </p>

        {/* Voting Explainer */}
        <div className="mt-8 p-6 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-left">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 p-3 border border-blue-500/20 dark:border-blue-500/30">
              <svg
                className="w-full h-full text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                How Voting Works
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Join the{" "}
                <a
                  href="https://discord.com/invite/megaeth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  MegaETH Discord
                </a>{" "}
                and get the MiniETH role to vote. Higher roles have more{" "}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <span className="text-blue-600 dark:text-blue-400 cursor-help border-b border-dashed border-blue-600 dark:border-blue-400">
                      voting power
                    </span>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      align="center"
                      sideOffset={5}
                      className="z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl px-4 py-3 rounded-xl text-sm text-gray-900 dark:text-gray-100 shadow-xl border border-gray-200/50 dark:border-white/[0.08] select-none touch-none max-w-sm"
                      avoidCollisions={true}
                      collisionPadding={16}
                    >
                      <p className="font-semibold mb-2 pb-2 border-b border-gray-200/50 dark:border-white/[0.08]">
                        Discord Roles
                      </p>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                            <p className="font-medium">MiniETH</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Basic role after verification
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">MegaLevel</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Active community members
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Big Sequencer</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Standout contributors
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Chubby Bunny</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Valued external voices
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">MegaMind</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Quiz score 80+
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Original Mafia</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Early members (pre-June 2024)
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 pt-1 border-t border-gray-200/50 dark:border-white/[0.08]">
                          Higher roles have more voting power.
                        </p>
                      </div>
                      <Tooltip.Arrow className="fill-white/90 dark:fill-gray-900/90" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>{" "}
                - hover over vote counts to see the breakdown.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
