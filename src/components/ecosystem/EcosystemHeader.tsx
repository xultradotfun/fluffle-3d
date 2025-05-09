import * as Tooltip from "@radix-ui/react-tooltip";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useDiscordAuth } from "@/contexts/DiscordAuthContext";
import { Rabbit, Plus, X } from "lucide-react";

export function EcosystemHeader() {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { user, logout } = useDiscordAuth();
  const [stats, setStats] = useState<{
    totalVotes: number;
    uniqueVoters: number;
  } | null>(null);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);

  useEffect(() => {
    const fetchVoteStats = async () => {
      try {
        const response = await fetch("/api/votes");
        if (!response.ok) throw new Error("Failed to fetch votes");
        const data = await response.json();

        setStats({
          totalVotes: data.stats.totalVotes,
          uniqueVoters: data.stats.uniqueVoters,
        });
      } catch (error) {
        console.error("Failed to fetch vote stats:", error);
      }
    };

    fetchVoteStats();
  }, []);

  return (
    <Tooltip.Provider delayDuration={300} skipDelayDuration={0}>
      <div className="text-center max-w-3xl mx-auto relative">
        <div
          dangerouslySetInnerHTML={{
            __html: `<!-- 
-----BEGIN PGP MESSAGE-----

hF4DE9NOaOzmJc0SAQdAqNKnViIq4EorfjAwpWxJcsD0iUkY0gOcU/c0zyw492kw
WWroR4EC65+Vd1drdkJxCAsASXENS1TFKFTJzcX1qA7sI1MRD34gEgGhbyefxZws
1G8BCQIQDypF/i8/nbyWalNSyGplA8IySIokLgSwGMqwmRnDb0OJsXHWCaFYBJye
ddX5nXTrOlcbJmSytNdZJPWyZzNRgj7DkqDG5plD0Bez4hMXFAhjTAIBhLFdOrej
jEr32f0NXNjHpwG++DJNddk=
=phrv
-----END PGP MESSAGE-----
-->`,
          }}
        />
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
              <span className="absolute -inset-y-2 -inset-x-3 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-500/10 dark:via-purple-500/10 dark:to-indigo-500/10 opacity-75 blur-lg -z-0 rounded-[28px]" />
            </span>
          </p>

          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-indigo-500 dark:from-pink-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {stats ? stats.totalVotes.toLocaleString() : "-"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Total Votes
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-indigo-500 dark:from-pink-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {stats ? stats.uniqueVoters.toLocaleString() : "-"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Unique Voters
              </div>
            </div>
          </div>

          {/* Discord connection reset button - when user is logged in */}
          {user && (
            <div className="mt-3">
              <button
                onClick={logout}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Reset Discord connection
              </button>
            </div>
          )}
        </div>

        {/* Side-by-side buttons with modals */}
        <div className="mt-6 flex gap-3 justify-center">
          <Dialog.Root
            open={isVotingModalOpen}
            onOpenChange={setIsVotingModalOpen}
          >
            <Dialog.Trigger asChild>
              <button className="flex flex-row items-center gap-2 px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/[0.04] transition-all duration-200 shadow-sm">
                <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 p-1 border border-blue-500/20 dark:border-blue-500/30">
                  <Rabbit className="w-full h-full text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Voting Guide
                </span>
              </button>
            </Dialog.Trigger>

            {/* Voting Guide Modal */}
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[85vh] overflow-auto bg-white dark:bg-gray-900 rounded-xl shadow-xl z-50 p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 p-2.5 border border-blue-500/20 dark:border-blue-500/30">
                      <Rabbit className="w-full h-full text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      MEGA Civilization is about to expand
                    </h3>
                  </div>
                  <Dialog.Close asChild>
                    <button className="p-1 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <X size={20} />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Help fellow Fluffles organize signals from noise by casting
                    your vote to support long-term builders.
                    <br />
                    <br />
                    Go to the{" "}
                    <a
                      href="https://discord.com/invite/megaeth"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      MegaETH Discord
                    </a>{" "}
                    , get verified and{" "}
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
                          simply vote.
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
                                <div className="font-medium flex items-center">
                                  <span className="inline-flex items-center justify-center w-5 h-5 mr-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-800 dark:text-blue-300">
                                    1
                                  </span>
                                  Big Sequencer
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 pl-7">
                                  Standout contributors
                                </div>
                              </div>
                              <div>
                                <div className="font-medium flex items-center">
                                  <span className="inline-flex items-center justify-center w-5 h-5 mr-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-800 dark:text-blue-300">
                                    2
                                  </span>
                                  Chubby Bunny
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 pl-7">
                                  Valued external voices
                                </div>
                              </div>
                              <div>
                                <div className="font-medium flex items-center">
                                  <span className="inline-flex items-center justify-center w-5 h-5 mr-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-800 dark:text-blue-300">
                                    3
                                  </span>
                                  Megamind
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 pl-7">
                                  Quiz score 80+
                                </div>
                              </div>
                              <div>
                                <div className="font-medium flex items-center">
                                  <span className="inline-flex items-center justify-center w-5 h-5 mr-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-800 dark:text-blue-300">
                                    4
                                  </span>
                                  Fluffle Holder
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 pl-7">
                                  Users that own a Fluffle NFT
                                </div>
                              </div>
                              <div>
                                <div className="font-medium flex items-center">
                                  <span className="inline-flex items-center justify-center w-5 h-5 mr-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-800 dark:text-blue-300">
                                    5
                                  </span>
                                  Original Mafia
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 pl-7">
                                  Early members (pre-June 2024)
                                </div>
                              </div>
                              <div>
                                <div className="font-medium flex items-center">
                                  <span className="inline-flex items-center justify-center w-5 h-5 mr-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-800 dark:text-blue-300">
                                    6
                                  </span>
                                  MegaLevel
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 pl-7">
                                  Active community members
                                </div>
                              </div>
                              <div>
                                <div className="font-medium flex items-center">
                                  <span className="inline-flex items-center justify-center w-5 h-5 mr-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-800 dark:text-blue-300">
                                    7
                                  </span>
                                  MiniETH
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 pl-7">
                                  Basic role after verification
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 pt-1 border-t border-gray-200/50 dark:border-white/[0.08]">
                              Higher roles have more voting power.
                            </div>
                          </div>
                          <Tooltip.Arrow className="fill-white/90 dark:fill-gray-900/90" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </p>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <Dialog.Root
            open={isAddProjectModalOpen}
            onOpenChange={setIsAddProjectModalOpen}
          >
            <Dialog.Trigger asChild>
              <button className="flex flex-row items-center gap-2 px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-white/[0.04] transition-all duration-200 shadow-sm">
                <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 p-1 border border-purple-500/20 dark:border-purple-500/30">
                  <Plus className="w-full h-full text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Add Project
                </span>
              </button>
            </Dialog.Trigger>

            {/* Add Project Modal */}
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[85vh] overflow-auto bg-white dark:bg-gray-900 rounded-xl shadow-xl z-50 p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 p-2.5 border border-purple-500/20 dark:border-purple-500/30">
                      <Plus className="w-full h-full text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Add Your Project
                    </h3>
                  </div>
                  <Dialog.Close asChild>
                    <button className="p-1 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <X size={20} />
                    </button>
                  </Dialog.Close>
                </div>

                <div>
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
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
