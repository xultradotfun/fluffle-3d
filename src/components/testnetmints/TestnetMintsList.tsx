"use client";

import { useEffect, useState, useRef } from "react";
import { TestnetMintCard } from "./TestnetMintCard";
import Image from "next/image";
import Link from "next/link";
import ecosystemData from "@/data/ecosystem.json";
import { findMatchingAlias } from "@/data/nft-aliases";

interface MintGroup {
  name: string;
  size: number;
  price: number;
  startTime: number;
  endTime?: number;
}

// API response interfaces
interface ApiMintGroup {
  id: number;
  name: string;
  price: number;
  allocation: number;
  max_mint_per_wallet?: number;
  mint_group_description?: string;
  startTime?: number;
}

interface ApiMint {
  collection_name: string;
  description: string;
  profile_image: string;
  header_image: string;
  total_supply: number;
  mint_live_timestamp: number;
  mint_page_link: string;
  slug: string;
  chain: {
    chain_id: number;
    chain_name: string;
    native_currency: string;
  };
  socials?: {
    twitter?: string;
    discord?: string;
    website?: string;
    telegram?: string;
  };
  mint_group_data: ApiMintGroup[];
  author?: string; // Added for Rarible collections
}

// Add interface for vote data
interface VoteData {
  upvotes: number;
  downvotes: number;
  userVote: string | null;
  breakdown: Record<string, { up: number; down: number }>;
}

interface ProjectVotes {
  twitter: string;
  name: string;
  votes: VoteData;
}

interface TestnetMint {
  name: string;
  description: string;
  profileImgUrl: string;
  headerImgUrl: string;
  totalSupply: number;
  mintTimestamp: number;
  mintLink: string;
  twitter?: string;
  discord?: string;
  website?: string;
  telegram?: string;
  mintGroups: MintGroup[];
  chain: string;
  status?: "live" | "upcoming" | "sold_out";
  ecosystemProject?: any; // Store matched ecosystem project
  votes?: VoteData; // Add votes data
  source: "kingdomly" | "rarible"; // Add source field
  author?: string; // Added for Rarible collections
}

export function TestnetMintsList() {
  const [mints, setMints] = useState<TestnetMint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [votesData, setVotesData] = useState<ProjectVotes[]>([]);
  const [activeFilter, setActiveFilter] = useState<
    "upcoming" | "live" | "sold_out" | "all"
  >("all");

  // Add source filter state
  const [activeSourceFilter, setActiveSourceFilter] = useState<
    "kingdomly" | "rarible" | null
  >(null);

  // Add a ref to track fetch requests and prevent duplication
  const isFetchingRef = useRef(false);

  // Add a ref to track processed data combinations to prevent infinite loops
  const lastProcessedDataRef = useRef<string | null>(null);

  // Fetch votes data
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch("/api/votes", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          console.warn("Failed to fetch votes data:", response.status);
          return;
        }

        const data = await response.json();
        if (data.projects && Array.isArray(data.projects)) {
          setVotesData(data.projects);
          console.log("Votes data loaded:", data.projects.length, "projects");
        }
      } catch (err) {
        console.error("Error fetching votes data:", err);
      }
    };

    fetchVotes();
  }, []);

  useEffect(() => {
    // Skip if already fetching to prevent double requests
    if (isFetchingRef.current) return;

    const fetchMints = async () => {
      try {
        // Set fetching flag to prevent duplicate requests
        isFetchingRef.current = true;

        setLoading(true);
        setError(null);

        // Fetch from both Kingdomly and Rarible APIs
        const [kingdomlyResponse, raribleResponse] = await Promise.allSettled([
          fetch("/api/proxy-mints", {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Cache-Control": "no-cache",
            },
            cache: "no-store",
            next: { revalidate: 0 },
          }),
          fetch("/api/proxy-rarible", {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Cache-Control": "no-cache",
            },
            cache: "no-store",
            next: { revalidate: 0 },
          }),
        ]);

        let kingdomlyData;
        let raribleData;
        let errors: string[] = [];

        // Process Kingdomly response
        if (
          kingdomlyResponse.status === "fulfilled" &&
          kingdomlyResponse.value.ok
        ) {
          kingdomlyData = await kingdomlyResponse.value.json();
        } else {
          console.error("Failed to fetch Kingdomly data");
          errors.push("Kingdomly");
        }

        // Process Rarible response
        if (
          raribleResponse.status === "fulfilled" &&
          raribleResponse.value.ok
        ) {
          raribleData = await raribleResponse.value.json();
        } else {
          console.error("Failed to fetch Rarible data");
          errors.push("Rarible");
        }

        // If both APIs failed, show error
        if (errors.length === 2) {
          throw new Error(
            `Failed to fetch data from both Kingdomly and Rarible`
          );
        }

        // Combine collections from both sources
        const combinedCollections = {
          live: [
            ...(kingdomlyData?.partnerCollections?.live || []).map(
              (mint: any) => ({ ...mint, source: "kingdomly" })
            ),
            ...(raribleData?.partnerCollections?.live || []).map(
              (mint: any) => ({ ...mint, source: "rarible" })
            ),
          ],
          upcoming: [
            ...(kingdomlyData?.partnerCollections?.upcoming || []).map(
              (mint: any) => ({ ...mint, source: "kingdomly" })
            ),
            ...(raribleData?.partnerCollections?.upcoming || []).map(
              (mint: any) => ({ ...mint, source: "rarible" })
            ),
          ],
          sold_out: [
            ...(kingdomlyData?.partnerCollections?.sold_out || []).map(
              (mint: any) => ({ ...mint, source: "kingdomly" })
            ),
            ...(raribleData?.partnerCollections?.sold_out || []).map(
              (mint: any) => ({ ...mint, source: "rarible" })
            ),
          ],
        };

        // Format the mints
        const formattedMints = Object.entries(combinedCollections).flatMap(
          ([status, collections]) =>
            collections.map((mint: any) => {
              // Extract Twitter handle from the URL (if it exists)
              let twitterHandle = "";
              if (mint.socials?.twitter) {
                const twitterUrl = mint.socials.twitter;
                twitterHandle = twitterUrl.split("/").pop() || "";
                // Remove @ if present
                twitterHandle = twitterHandle.replace("@", "");
              }

              // Find matching ecosystem project by Twitter handle if it exists
              let ecosystemProject = null;
              if (twitterHandle) {
                ecosystemProject = ecosystemData.projects.find(
                  (project) =>
                    project.twitter &&
                    project.twitter.toLowerCase() ===
                      twitterHandle.toLowerCase()
                );
              }

              return {
                name: mint.collection_name,
                description: mint.description,
                profileImgUrl: mint.profile_image,
                headerImgUrl: mint.header_image,
                totalSupply: mint.total_supply,
                mintTimestamp: Math.floor(mint.mint_live_timestamp / 1000),
                mintLink: mint.mint_page_link,
                twitter: mint.socials?.twitter || "",
                discord: mint.socials?.discord || "",
                website: mint.socials?.website || "",
                telegram: mint.socials?.telegram || "",
                mintGroups: Array.isArray(mint.mint_group_data)
                  ? mint.mint_group_data.map((group: any) => ({
                      name: group.name,
                      size: group.allocation,
                      price: group.price,
                      startTime: Math.floor(
                        (group.startTime || mint.mint_live_timestamp) / 1000
                      ),
                      endTime: group.endTime
                        ? Math.floor(group.endTime / 1000)
                        : undefined,
                    }))
                  : [],
                chain: mint.chain.chain_name,
                status: status as "live" | "upcoming" | "sold_out",
                ecosystemProject: ecosystemProject,
                source: mint.source,
              };
            })
        );

        // Clear any errors and set the data
        setError(
          errors.length > 0
            ? `Failed to fetch data from ${errors.join(" and ")}`
            : null
        );
        setMints(formattedMints);

        // Only after successfully processing the data, mark as attempted
        setHasAttemptedLoad(true);
      } catch (err) {
        console.error("Error fetching mints:", err);

        // Mark as attempted load even if there was an error
        setHasAttemptedLoad(true);

        // Set error message
        const errorMessage =
          err instanceof Error
            ? `${err.message}`
            : "Failed to fetch testnet mints";

        setError(errorMessage);
        setMints([]);
      } finally {
        // Reset fetching flag to allow future requests
        isFetchingRef.current = false;
        setLoading(false);
      }
    };

    fetchMints();
  }, []);

  // Modify the mints mapping to include votes data
  useEffect(() => {
    if (mints.length > 0 && votesData.length > 0) {
      console.log("Processing mints with votes data...");

      // Use a ref to track if we've already processed this data combination
      const mintsKey = mints.map((m) => m.name).join("|");
      const votesKey = votesData.map((v) => v.twitter).join("|");
      const dataKey = `${mintsKey}:${votesKey}`;

      // Check if we already processed this exact data combination
      if (lastProcessedDataRef.current === dataKey) {
        console.log("Skipping redundant processing - data already processed");
        return;
      }

      // Mark this data combination as processed
      lastProcessedDataRef.current = dataKey;

      const updatedMints = mints.map((mint) => {
        // Helper function to extract Twitter handle from URL or handle text
        const extractTwitterHandle = (twitterText?: string): string => {
          if (!twitterText) return "";
          // Remove any URL parts
          let handle = twitterText.split("/").pop() || "";
          // Remove @ if present
          handle = handle.replace("@", "");
          return handle.toLowerCase();
        };

        const twitterHandle = extractTwitterHandle(mint.twitter);

        // Check for any matching alias rules
        const aliasRule = findMatchingAlias({
          name: mint.name,
          twitter: twitterHandle,
          description: mint.description,
          author: mint.source === "rarible" ? mint.author : undefined,
        });

        if (aliasRule) {
          console.log(
            `Found alias rule for ${mint.name} → ${aliasRule.target.twitter}`
          );

          // Find votes for the target collection
          const targetVotes = votesData.find(
            (p) =>
              p.twitter.toLowerCase() === aliasRule.target.twitter.toLowerCase()
          );

          // Find ecosystem data for the target collection if override is enabled
          const targetEcosystem = aliasRule.target.ecosystemOverride
            ? ecosystemData.projects.find(
                (project) =>
                  project.twitter &&
                  project.twitter.toLowerCase() ===
                    aliasRule.target.twitter.toLowerCase()
              )
            : mint.ecosystemProject;

          if (targetVotes) {
            console.log(
              `Applied alias mapping: ${mint.name} → ${aliasRule.target.twitter}`
            );
            return {
              ...mint,
              votes: targetVotes.votes,
              ecosystemProject: targetEcosystem || mint.ecosystemProject,
            };
          }
        }

        // Try to find votes for this project by Twitter handle
        if (twitterHandle) {
          const projectVotes = votesData.find(
            (p) => p.twitter.toLowerCase() === twitterHandle
          );

          if (projectVotes) {
            console.log(`Found votes for ${mint.name} (${twitterHandle})`);
            return { ...mint, votes: projectVotes.votes };
          }
        }

        return mint;
      });

      setMints(updatedMints);
    }
  }, [votesData, mints]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // At this point, loading is false

  // If we have data, show it regardless of error state
  if (mints.length > 0) {
    // Sort mints: primarily by status (upcoming > live > sold_out), then by mint timestamp
    const sortedMints = [...mints].sort((a, b) => {
      // Primary sort: status priority (upcoming > live > sold_out)
      const getPriority = (status: string | undefined) => {
        if (status === "upcoming") return 0;
        if (status === "live") return 1;
        if (status === "sold_out") return 2;
        return 3; // For undefined or any other value
      };

      const priorityA = getPriority(a.status);
      const priorityB = getPriority(b.status);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // Secondary sort: within each status group, sort by timestamp
      // For upcoming: show soonest first
      // For live: show most recently launched first
      // For sold out: show most recently sold out first
      if (a.status === "upcoming") {
        return a.mintTimestamp - b.mintTimestamp; // Ascending for upcoming (soonest first)
      } else {
        return b.mintTimestamp - a.mintTimestamp; // Descending for live and sold out (newest first)
      }
    });

    // Calculate counts for each status and source
    const counts = {
      upcoming: sortedMints.filter((mint) => mint.status === "upcoming").length,
      live: sortedMints.filter((mint) => mint.status === "live").length,
      sold_out: sortedMints.filter((mint) => mint.status === "sold_out").length,
      kingdomly: sortedMints.filter((mint) => mint.source === "kingdomly")
        .length,
      rarible: sortedMints.filter((mint) => mint.source === "rarible").length,
    };

    // Filter mints based on both active filters
    const filteredMints = sortedMints.filter((mint) => {
      const matchesStatus =
        activeFilter === "all" || mint.status === activeFilter;
      const matchesSource =
        activeSourceFilter === null || mint.source === activeSourceFilter;
      return matchesStatus && matchesSource;
    });

    return (
      <div className="space-y-8">
        {/* Status filter buttons */}
        <div className="flex flex-col gap-4 items-center">
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2
                ${
                  activeFilter === "all"
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-gray-800/80 text-gray-300 hover:bg-gray-800"
                }`}
            >
              <span>All</span>
              <span className="bg-black/30 px-2 py-0.5 rounded-md text-xs">
                {sortedMints.length}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("upcoming")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2
                ${
                  activeFilter === "upcoming"
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                    : "bg-gray-800/80 text-gray-300 hover:bg-gray-800"
                }`}
            >
              <span>Upcoming</span>
              <span className="bg-black/30 px-2 py-0.5 rounded-md text-xs">
                {counts.upcoming}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("live")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2
                ${
                  activeFilter === "live"
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                    : "bg-gray-800/80 text-gray-300 hover:bg-gray-800"
                }`}
            >
              <span>Minting</span>
              <span className="bg-black/30 px-2 py-0.5 rounded-md text-xs">
                {counts.live}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("sold_out")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2
                ${
                  activeFilter === "sold_out"
                    ? "bg-gray-500 text-white shadow-lg shadow-gray-500/20"
                    : "bg-gray-800/80 text-gray-300 hover:bg-gray-800"
                }`}
            >
              <span>Sold Out</span>
              <span className="bg-black/30 px-2 py-0.5 rounded-md text-xs">
                {counts.sold_out}
              </span>
            </button>
          </div>

          {/* Source filter buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() =>
                setActiveSourceFilter(
                  activeSourceFilter === "kingdomly" ? null : "kingdomly"
                )
              }
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2
                ${
                  activeSourceFilter === "kingdomly"
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : "bg-gray-800/80 text-gray-300 hover:bg-gray-800"
                }`}
            >
              <Image
                src="/kingdomlylogo.png"
                alt="Kingdomly"
                width={20}
                height={20}
                className="rounded-sm"
              />
              <span>Kingdomly</span>
              <span className="bg-black/30 px-2 py-0.5 rounded-md text-xs">
                {counts.kingdomly}
              </span>
            </button>
            <button
              onClick={() =>
                setActiveSourceFilter(
                  activeSourceFilter === "rarible" ? null : "rarible"
                )
              }
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2
                ${
                  activeSourceFilter === "rarible"
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : "bg-gray-800/80 text-gray-300 hover:bg-gray-800"
                }`}
            >
              <Image
                src="/rariblelogo.png"
                alt="Rarible"
                width={20}
                height={20}
                className="rounded-sm"
              />
              <span>Rarible</span>
              <span className="bg-black/30 px-2 py-0.5 rounded-md text-xs">
                {counts.rarible}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMints.map((mint, index) => (
            <TestnetMintCard
              key={`mint-${index}`}
              name={mint.name}
              description={mint.description}
              profileImgUrl={mint.profileImgUrl}
              headerImgUrl={mint.headerImgUrl}
              totalSupply={mint.totalSupply}
              mintTimestamp={mint.mintTimestamp}
              mintLink={mint.mintLink}
              twitter={mint.twitter}
              discord={mint.discord}
              website={mint.website}
              telegram={mint.telegram}
              mintGroups={mint.mintGroups}
              chain={mint.chain}
              status={mint.status}
              ecosystemProject={mint.ecosystemProject}
              votes={mint.votes}
              source={mint.source}
            />
          ))}
        </div>

        {/* Powered by Kingdomly section */}
        <div className="mt-12 pt-8 flex flex-col items-center justify-center">
          <p className="text-gray-500 mb-3">Powered by</p>
          <div className="flex items-center gap-8">
            <Link
              href="https://kingdomly.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Image
                src="/kingdomlylogo.png"
                alt="Kingdomly Logo"
                width={40}
                height={40}
                className="rounded-md"
              />
              <span className="ml-2 text-lg font-semibold text-gray-800 dark:text-white">
                Kingdomly
              </span>
            </Link>
            <Link
              href="https://testnet.rarible.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Image
                src="/rariblelogo.png"
                alt="Rarible Logo"
                width={40}
                height={40}
                className="rounded-md"
              />
              <span className="ml-2 text-lg font-semibold text-gray-800 dark:text-white">
                Rarible
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No data and attempted load - show the appropriate message

  // Show error if we have one
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4">
        <p className="font-medium">Unable to fetch testnet mints</p>
        <p className="text-sm">
          We can't connect to Kingdomly at this time. Please try again later.
        </p>
      </div>
    );
  }

  // No data, no error, and attempted load - show "no mints available"
  if (hasAttemptedLoad) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-500">
          No MegaETH Testnet mints available at the moment
        </h3>
        <p className="text-sm text-gray-400 mt-2">
          Check back later for upcoming MegaETH Testnet mint opportunities
        </p>
      </div>
    );
  }

  // If we get here, we're in a strange state (not loading, no data, no error, not attempted)
  // Show a generic loading message as a fallback
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
