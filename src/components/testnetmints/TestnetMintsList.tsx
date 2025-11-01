"use client";

import { useEffect, useState } from "react";
import { TestnetMintCard } from "./TestnetMintCard";
import { apiClient, API_ENDPOINTS } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { findMatchingAlias } from "@/data/nft-aliases";

// Simplified interfaces (backend handles the complex ones)
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
  mintGroups: Array<{
    name: string;
    size: number;
    price: number;
    startTime: number;
    endTime?: number;
  }>;
  chain: string;
  status?: "live" | "upcoming" | "sold_out";
  source: "kingdomly" | "rarible";
  minted_supply?: number;
  media_type?: string;
  votes?: {
    upvotes: number;
    downvotes: number;
    userVote: string | null;
    breakdown: Record<string, { up: number; down: number }>;
  };
}

export function TestnetMintsList() {
  const [mints, setMints] = useState<TestnetMint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "upcoming" | "live" | "sold_out" | null
  >(null);
  const [activeSourceFilter, setActiveSourceFilter] = useState<
    "kingdomly" | "rarible" | null
  >(null);

  // Single data fetch - backend handles all complexity
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Backend returns processed, sorted, cached data
        const [mintsData, votesData] = await Promise.all([
          apiClient.get(API_ENDPOINTS.MINTS),
          apiClient.get(API_ENDPOINTS.VOTES.LIST),
        ]);

        // Integrate vote data with mints
        const mintsWithVotes = (mintsData || []).map((mint: TestnetMint) => {
          // Find matching project by Twitter handle
          let matchingProject = null;
          if (mint.twitter) {
            matchingProject = votesData.projects?.find(
              (p: any) =>
                p.twitter === mint.twitter ||
                p.twitter === mint.twitter?.replace("@", "")
            );
          }

          // If no direct match, try ecosystem data matching
          if (!matchingProject && mint.name) {
            const alias = findMatchingAlias({
              name: mint.name,
              twitter: mint.twitter,
              description: mint.description || "",
            });
            if (alias) {
              matchingProject = votesData.projects?.find(
                (p: any) => p.twitter === alias
              );
            }
          }

          return {
            ...mint,
            votes: matchingProject?.votes
              ? {
                  upvotes: matchingProject.votes.upvotes,
                  downvotes: matchingProject.votes.downvotes,
                  userVote: matchingProject.votes.userVote,
                  breakdown: matchingProject.votes.breakdown || {},
                }
              : undefined,
          };
        });

        setMints(mintsWithVotes);
        console.log(`Loaded ${mintsWithVotes.length} mints with vote data`);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        setMints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate counts for filters
  const counts = {
    upcoming: mints.filter((mint) => mint.status === "upcoming").length,
    live: mints.filter((mint) => mint.status === "live").length,
    sold_out: mints.filter((mint) => mint.status === "sold_out").length,
    kingdomly: mints.filter((mint) => mint.source === "kingdomly").length,
    rarible: mints.filter((mint) => mint.source === "rarible").length,
  };

  // Filter mints based on active filters
  const filteredMints = mints.filter((mint) => {
    const matchesStatus = activeFilter === null || mint.status === activeFilter;
    const matchesSource =
      activeSourceFilter === null || mint.source === activeSourceFilter;
    return matchesStatus && matchesSource;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        <p className="text-gray-600 dark:text-gray-300">
          Loading testnet mints...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (mints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          No testnet mints available at the moment.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Check back later for new minting opportunities!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Status filter buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => setActiveFilter(null)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === null
              ? "bg-teal-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          All ({mints.length})
        </button>

        <button
          onClick={() => setActiveFilter("upcoming")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === "upcoming"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Upcoming ({counts.upcoming})
        </button>

        <button
          onClick={() => setActiveFilter("live")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === "live"
              ? "bg-green-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Live ({counts.live})
        </button>

        <button
          onClick={() => setActiveFilter("sold_out")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === "sold_out"
              ? "bg-gray-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Sold Out ({counts.sold_out})
        </button>
      </div>

      {/* Source filter buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => setActiveSourceFilter(null)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeSourceFilter === null
              ? "bg-purple-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          All Sources
        </button>

        <button
          onClick={() => setActiveSourceFilter("kingdomly")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeSourceFilter === "kingdomly"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Kingdomly ({counts.kingdomly})
        </button>

        <button
          onClick={() => setActiveSourceFilter("rarible")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeSourceFilter === "rarible"
              ? "bg-pink-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Rarible ({counts.rarible})
        </button>
      </div>

      {/* Mints grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMints.map((mint, index) => (
          <TestnetMintCard
            key={`${mint.source}-${mint.name}-${index}`}
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
            ecosystemProject={mint.votes ? { votes: mint.votes } : null}
            votes={mint.votes}
            source={mint.source}
            minted_supply={mint.minted_supply}
            media_type={mint.media_type}
          />
        ))}
      </div>

      {filteredMints.length === 0 && mints.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300">
            No mints match the current filters.
          </p>
        </div>
      )}

      {/* Info section */}
      <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Data provided by{" "}
          <Link
            href="https://kingdomly.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-500 hover:text-teal-600 font-medium"
          >
            Kingdomly
          </Link>
          {counts.rarible > 0 && (
            <>
              {" and "}
              <Link
                href="https://rarible.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-600 font-medium"
              >
                Rarible
              </Link>
            </>
          )}
        </p>

        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          <span>Total: {mints.length} collections</span>
          <span>•</span>
          <span>Cached for performance</span>
        </div>
      </div>
    </div>
  );
}
