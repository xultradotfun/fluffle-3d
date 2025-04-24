"use client";

import { useEffect, useState, useRef } from "react";
import { TestnetMintCard } from "./TestnetMintCard";
import Image from "next/image";
import Link from "next/link";

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
}

export function TestnetMintsList() {
  const [mints, setMints] = useState<TestnetMint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  // Add a ref to track fetch requests and prevent duplication
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // Skip if already fetching to prevent double requests
    if (isFetchingRef.current) return;

    const fetchMints = async () => {
      try {
        // Set fetching flag to prevent duplicate requests
        isFetchingRef.current = true;

        setLoading(true);
        setError(null);

        // Try the proxy endpoint first
        const proxyUrl = "/api/proxy-mints";
        console.log("Fetching mints from proxy:", proxyUrl);

        const response = await fetch(proxyUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
          cache: "no-store",
          next: { revalidate: 0 },
        });

        console.log("Proxy response status:", response.status);

        if (!response.ok) {
          throw new Error(
            `Proxy fetch failed: ${response.status} ${response.statusText}`
          );
        }

        const responseData = await response.json();
        console.log("Received data from proxy:", responseData);

        // Add detailed logging to understand the response structure
        console.log("Response data structure:", {
          isArray: Array.isArray(responseData),
          topLevelKeys: responseData ? Object.keys(responseData) : [],
          hasPartnerCollections:
            responseData && responseData.partnerCollections ? true : false,
          partnerCollectionKeys:
            responseData && responseData.partnerCollections
              ? Object.keys(responseData.partnerCollections)
              : [],
        });

        if (responseData && responseData.partnerCollections) {
          console.log(
            "Live collections:",
            responseData.partnerCollections.live?.length || 0
          );
          console.log(
            "Upcoming collections:",
            responseData.partnerCollections.upcoming?.length || 0
          );
          console.log(
            "Sold out collections:",
            responseData.partnerCollections.sold_out?.length || 0
          );
        }

        // Extract mints from the response
        // The structure might be an array directly or might be inside an object
        let allMints: ApiMint[] = [];
        let megaEthMints: (ApiMint & { status?: string })[] = [];

        // Helper function to check if the chain ID matches MegaETH Testnet
        const isMegaETHChain = (chain: any): boolean => {
          if (!chain || !chain.chain_id) return false;
          const chainId = chain.chain_id;
          return chainId === 6342 || String(chainId) === "6342";
        };

        if (Array.isArray(responseData)) {
          allMints = responseData as ApiMint[];
          megaEthMints = allMints.filter(
            (item: ApiMint) => item.chain && isMegaETHChain(item.chain)
          );
        } else if (responseData && typeof responseData === "object") {
          if (responseData.partnerCollections) {
            // Handle the nested partnerCollections structure and preserve status
            const { partnerCollections } = responseData;

            if (
              partnerCollections.live &&
              Array.isArray(partnerCollections.live)
            ) {
              const liveMints = partnerCollections.live
                .filter(
                  (item: ApiMint) => item.chain && isMegaETHChain(item.chain)
                )
                .map((item: ApiMint) => ({ ...item, status: "live" }));
              megaEthMints = [...megaEthMints, ...liveMints];
            }

            if (
              partnerCollections.upcoming &&
              Array.isArray(partnerCollections.upcoming)
            ) {
              const upcomingMints = partnerCollections.upcoming
                .filter(
                  (item: ApiMint) => item.chain && isMegaETHChain(item.chain)
                )
                .map((item: ApiMint) => ({ ...item, status: "upcoming" }));
              megaEthMints = [...megaEthMints, ...upcomingMints];
            }

            if (
              partnerCollections.sold_out &&
              Array.isArray(partnerCollections.sold_out)
            ) {
              const soldOutMints = partnerCollections.sold_out
                .filter(
                  (item: ApiMint) => item.chain && isMegaETHChain(item.chain)
                )
                .map((item: ApiMint) => ({ ...item, status: "sold_out" }));
              megaEthMints = [...megaEthMints, ...soldOutMints];
            }
          } else {
            // Try other properties as before
            if (Array.isArray(responseData.partners_results)) {
              allMints = responseData.partners_results as ApiMint[];
            } else if (Array.isArray(responseData.other_partner_mints)) {
              allMints = responseData.other_partner_mints as ApiMint[];
            } else {
              // Try to find any array property that might contain our mints
              for (const key in responseData) {
                if (Array.isArray(responseData[key])) {
                  allMints = [...allMints, ...(responseData[key] as ApiMint[])];
                }
              }
            }

            megaEthMints = allMints.filter(
              (item: ApiMint) => item.chain && isMegaETHChain(item.chain)
            );
          }
        }

        // Log chain_ids to help debug
        if (
          responseData &&
          typeof responseData === "object" &&
          responseData.partnerCollections
        ) {
          const allChainIds = new Set();

          // Check chain_ids in each collection type
          ["live", "upcoming", "sold_out"].forEach((status) => {
            if (Array.isArray(responseData.partnerCollections[status])) {
              responseData.partnerCollections[status].forEach(
                (item: ApiMint) => {
                  if (item.chain && item.chain.chain_id) {
                    allChainIds.add(item.chain.chain_id);
                    // Log each chain to see specific values
                    console.log(
                      `Chain in ${status}:`,
                      item.chain.chain_id,
                      typeof item.chain.chain_id,
                      item.collection_name
                    );
                  }
                }
              );
            }
          });

          console.log(
            "All chain_ids found in response:",
            Array.from(allChainIds)
          );
        }

        console.log("Found MegaETH Testnet mints:", megaEthMints.length);

        // If we have MegaETH mints, format them and display them
        if (megaEthMints.length > 0) {
          // Format the data to match our expected structure
          const formattedMints = megaEthMints.map(
            (mint: ApiMint & { status?: string }) => ({
              name: mint.collection_name,
              description: mint.description,
              profileImgUrl: mint.profile_image,
              headerImgUrl: mint.header_image,
              totalSupply: mint.total_supply,
              mintTimestamp: Math.floor(mint.mint_live_timestamp / 1000), // Convert milliseconds to seconds
              mintLink: mint.mint_page_link,
              twitter: mint.socials?.twitter || "",
              discord: mint.socials?.discord || "",
              website: mint.socials?.website || "",
              telegram: mint.socials?.telegram || "",
              mintGroups: Array.isArray(mint.mint_group_data)
                ? mint.mint_group_data.map((group: ApiMintGroup) => ({
                    name: group.name,
                    size: group.allocation,
                    price: group.price,
                    startTime: Math.floor(
                      (group.startTime || mint.mint_live_timestamp) / 1000
                    ),
                  }))
                : [],
              chain: mint.chain.chain_name,
              status: mint.status as
                | "live"
                | "upcoming"
                | "sold_out"
                | undefined,
            })
          );

          // Clear any errors and set the data
          setError(null);
          setMints(formattedMints);
        } else {
          // No MegaETH Testnet mints found - set empty array without any mock data
          setMints([]);
          setError(
            "No MegaETH Testnet mints (chain_id: 6342) were found in the API response."
          );
        }

        // Only after successfully processing the data, mark as attempted
        setHasAttemptedLoad(true);
      } catch (err) {
        console.error("Error fetching from proxy:", err);

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
    // Sort mints: live first, then upcoming, then sold out
    const sortedMints = [...mints].sort((a, b) => {
      // Define priority order: live > upcoming > sold_out
      const getPriority = (status: string | undefined) => {
        if (status === "live") return 0;
        if (status === "upcoming") return 1;
        if (status === "sold_out") return 2;
        return 3; // For undefined or any other value
      };

      return getPriority(a.status) - getPriority(b.status);
    });

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMints.map((mint, index) => (
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
            />
          ))}
        </div>

        {/* Powered by Kingdomly section */}
        <div className="mt-12 pt-8 flex flex-col items-center justify-center">
          <p className="text-gray-500 mb-3">Powered by</p>
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
        </div>
      </div>
    );
  }

  // No data and attempted load - show the appropriate message

  // Show error if we have one
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4">
        <p className="font-medium">Error loading testnet mints</p>
        <p className="text-sm">{error}</p>
        <p className="text-sm mt-2">
          This error occurs when we can't find any MegaETH Testnet mints
          (chain_id: 6342) in the API response. Please check the browser console
          for more debugging information, including the available chain IDs.
        </p>
        <p className="text-sm mt-2">
          <strong>Possible issues:</strong>
        </p>
        <ul className="text-sm list-disc pl-5">
          <li>
            The Kingdomly API may not be returning any MegaETH Testnet mints
          </li>
          <li>
            There may be a formatting difference in how chain_id is represented
          </li>
          <li>
            The API key might not be configured correctly in your .env file
          </li>
        </ul>
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
