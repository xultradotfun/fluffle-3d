"use client";

import { useState } from "react";
import { NFTInput } from "@/components/nft/NFTInput";
import { NFTCard } from "@/components/nft/NFTCard";
import Hero from "@/components/Hero";
import type { NFTTrait } from "@/utils/nftLoader";

interface ViewerData {
  id: string;
  urls: string[];
  traits: NFTTrait;
  timestamp: number;
}

export default function Home() {
  const [viewers, setViewers] = useState<ViewerData[]>([]);
  const [error, setError] = useState("");

  const handleNFTLoad = (id: string, urls: string[], traits: NFTTrait) => {
    setViewers((prev) => [
      ...prev,
      { id, urls, traits, timestamp: Date.now() },
    ]);
    setError("");
  };

  const handleNFTError = (error: string) => {
    setError(error);
  };

  const handleRemoveViewer = (id: string, timestamp?: number) => {
    setViewers((prev) =>
      prev.filter(
        (viewer) => !(viewer.id === id && viewer.timestamp === timestamp)
      )
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Hero Section */}
      <Hero />

      {/* Form Section */}
      <section className="relative -mt-4 z-10">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl bg-white/5 shadow-lg ring-1 ring-white/10 backdrop-blur-lg">
            <div className="p-4">
              <NFTInput onLoad={handleNFTLoad} onError={handleNFTError} />
              {error && (
                <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        {viewers.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Your NFTs</h2>
              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400 ring-1 ring-inset ring-blue-500/30">
                {viewers.length} loaded
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {viewers.map(({ id, urls, traits, timestamp }) => (
                <NFTCard
                  key={`${id}-${timestamp}`}
                  id={id}
                  urls={urls}
                  traits={traits}
                  onRemove={() => handleRemoveViewer(id, timestamp)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6 ring-1 ring-white/10">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No NFTs Loaded
            </h3>
            <p className="text-gray-400 max-w-sm mx-auto">
              Enter a Fluffle NFT ID above to view its 3D model and traits. You
              can load multiple NFTs at once.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 bg-black/50 backdrop-blur-lg mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Fluffle 3D Viewer</span>
            <a
              href="https://github.com/yourusername/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
