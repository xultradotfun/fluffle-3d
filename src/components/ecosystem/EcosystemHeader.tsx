import * as Tooltip from "@radix-ui/react-tooltip";
import Image from "next/image";
import { useState } from "react";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";

export function EcosystemHeader() {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { user, logout } = useDiscordAuth();

  return (
    <Tooltip.Provider delayDuration={300} skipDelayDuration={0}>
      <div className="text-center max-w-3xl mx-auto relative">
        <div className="absolute inset-x-0 top-6 -bottom-6 bg-gradient-to-b from-pink-500/10 via-purple-500/5 to-transparent dark:from-pink-500/[0.07] dark:via-purple-500/[0.03] dark:to-transparent blur-2xl -z-10 rounded-[100%]" />
        <div className="relative">
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-5 tracking-tight leading-[1.15]">
            Ecosystem Projects
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
            Discover and vote on the growing ecosystem of projects building on{" "}
            <span className="relative inline-block">
              <span className="relative z-10 inline-flex items-center">
                <Image
                  src="/megalogo.png"
                  alt="MegaETH"
                  width={140}
                  height={28}
                  className="h-6 sm:h-7 w-auto brightness-0 opacity-80 dark:opacity-100 dark:invert"
                  priority
                />
              </span>
              <div className="absolute -inset-y-2 -inset-x-3 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-500/10 dark:via-purple-500/10 dark:to-indigo-500/10 opacity-75 blur-lg -z-0 rounded-[28px]" />
            </span>
          </p>
        </div>

        {/* Voting Explainer */}
        <div className="mt-6 space-y-3">
          <div className="p-4 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm">
            <div className="flex flex-row items-start gap-3 text-left">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 p-2.5 border border-blue-500/20 dark:border-blue-500/30">
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
              <div className="space-y-1.5 flex-1">
                <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  Community Reputation Vote
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 touch-manipulation"
                        aria-label="Learn more about community reputation voting"
                        onClick={(e) => e.preventDefault()}
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 16V12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 8H12.01"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="z-50 max-w-[320px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-5 py-4 rounded-xl text-sm text-gray-900 dark:text-gray-100 shadow-xl border border-gray-200/50 dark:border-white/[0.08] select-none touch-manipulation"
                        side="top"
                        sideOffset={5}
                        align="center"
                        onPointerDownOutside={(e) => e.preventDefault()}
                      >
                        <p className="font-medium text-base text-gray-900 dark:text-white">
                          How can users identify malicious inhabitants in the
                          permissionless Mega Civilization?
                        </p>
                        <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">
                          We believe in the collective wisdom of the community -
                          the voting system aims to organize signals from
                          dedicated citizens of MegaETH to help you remain safe.
                        </p>
                        <div className="mt-3 flex items-center gap-4 pt-3 border-t border-gray-200/50 dark:border-white/[0.08]">
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-emerald-500"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M5 15l7-7 7 7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="text-sm text-emerald-600 dark:text-emerald-400">
                              Eagerness to interact
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-red-500"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M19 9l-7 7-7-7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="text-sm text-red-600 dark:text-red-400">
                              Signals caution
                            </span>
                          </div>
                        </div>
                        <Tooltip.Arrow className="fill-white/95 dark:fill-gray-900/95" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
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
                  <Tooltip.Root
                    open={tooltipOpen}
                    onOpenChange={setTooltipOpen}
                  >
                    <Tooltip.Trigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 border-b border-dashed border-blue-600 dark:border-blue-400 cursor-help touch-manipulation"
                        aria-label="View voting power explanation"
                        onClick={() => setTooltipOpen(true)}
                      >
                        voting power
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        align="center"
                        sideOffset={5}
                        className="z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl px-4 py-3 rounded-xl text-sm text-gray-900 dark:text-gray-100 shadow-xl border border-gray-200/50 dark:border-white/[0.08] select-none touch-none max-w-sm"
                        avoidCollisions={true}
                        collisionPadding={16}
                        sticky="partial"
                        onPointerDownOutside={() => setTooltipOpen(false)}
                      >
                        <p className="font-semibold mb-2 pb-2 border-b border-gray-200/50 dark:border-white/[0.08]">
                          Discord Roles (by voting power)
                        </p>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <div>
                              <p className="font-medium flex items-center">
                                <span className="inline-flex items-center justify-center w-5 h-5 mr-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-800 dark:text-blue-300">
                                  1
                                </span>
                                Big Sequencer
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 pl-7">
                                Standout contributors
                              </p>
                            </div>
                            <div>
                              <p className="font-medium flex items-center">
                                <span className="inline-flex items-center justify-center w-5 h-5 mr-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-800 dark:text-blue-300">
                                  2
                                </span>
                                Chubby Bunny
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 pl-7">
                                Valued external voices
                              </p>
                            </div>
                            <div>
                              <p className="font-medium flex items-center">
                                <span className="inline-flex items-center justify-center w-5 h-5 mr-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-800 dark:text-blue-300">
                                  3
                                </span>
                                Megamind
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 pl-7">
                                Quiz score 80+
                              </p>
                            </div>
                            <div>
                              <p className="font-medium flex items-center">
                                <span className="inline-flex items-center justify-center w-5 h-5 mr-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-800 dark:text-blue-300">
                                  4
                                </span>
                                Original Mafia
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 pl-7">
                                Early members (pre-June 2024)
                              </p>
                            </div>
                            <div>
                              <p className="font-medium flex items-center">
                                <span className="inline-flex items-center justify-center w-5 h-5 mr-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-800 dark:text-blue-300">
                                  5
                                </span>
                                MegaLevel
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 pl-7">
                                Active community members
                              </p>
                            </div>
                            <div>
                              <p className="font-medium flex items-center">
                                <span className="inline-flex items-center justify-center w-5 h-5 mr-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-800 dark:text-blue-300">
                                  6
                                </span>
                                MiniETH
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 pl-7">
                                Basic role after verification
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
                  <br />
                  <br />
                  <span className="text-gray-500 dark:text-gray-400">
                    All votes are shown in counts, but MiniETH votes are
                    excluded from sorting to prioritize higher-tier roles.
                  </span>
                  {user && (
                    <>
                      <br />
                      <button
                        onClick={logout}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
                      >
                        Reset Discord connection
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Project Application */}
          <div className="p-4 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm">
            <div className="flex flex-row items-start gap-3 text-left">
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
              <div className="space-y-1.5 flex-1">
                <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  Add Your Project
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Building on MegaETH? Submit your project through our{" "}
                  <a
                    href="https://forms.gle/azBRst51mDecvG867"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    application form
                  </a>{" "}
                  to get listed in the ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
