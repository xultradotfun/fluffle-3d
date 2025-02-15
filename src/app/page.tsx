"use client";

import { useState, useEffect } from "react";
import { NFTInput } from "@/components/nft/NFTInput";
import { NFTCard } from "@/components/nft/NFTCard";
import { Badge } from "@/components/ui/Badge";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import { TraitsAnalyticsDashboard } from "@/components/analytics/TraitsAnalytics";
import { PFPGenerator } from "@/components/pfp/PFPGenerator";
import { MetaverseTeaser } from "@/components/metaverse/MetaverseTeaser";
import Hero from "@/components/Hero";
import type { NFTTrait } from "@/utils/nftLoader";

interface ViewerData {
  id: string;
  urls: string[];
  traits: NFTTrait;
  timestamp: number;
}

export default function Home() {
  const [activeView, setActiveView] = useState<
    "viewer" | "analytics" | "pfp" | "metaverse"
  >("viewer");
  const [viewers, setViewers] = useState<ViewerData[]>([]);
  const [error, setError] = useState("");

  // Add effect to handle URL
  useEffect(() => {
    // Check initial hash
    const hash = window.location.hash;
    if (hash === "#rarities") {
      setActiveView("analytics");
    } else if (hash === "#pfp") {
      setActiveView("pfp");
    } else if (hash === "#metaverse") {
      setActiveView("metaverse");
    }

    // Listen for hash changes
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#rarities") {
        setActiveView("analytics");
      } else if (hash === "#pfp") {
        setActiveView("pfp");
      } else if (hash === "#metaverse") {
        setActiveView("metaverse");
      } else {
        setActiveView("viewer");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Update URL when view changes
  const handleViewChange = (
    view: "viewer" | "analytics" | "pfp" | "metaverse"
  ) => {
    if (view === "analytics") {
      window.history.replaceState(null, "", "/#rarities");
      // Clear loaded NFTs when switching to analytics
      setViewers([]);
      setError("");
    } else if (view === "pfp") {
      window.history.replaceState(null, "", "/#pfp");
      // Clear loaded NFTs when switching to PFP generator
      setViewers([]);
      setError("");
    } else if (view === "metaverse") {
      window.history.replaceState(null, "", "/#metaverse");
      // Clear loaded NFTs when switching to metaverse
      setViewers([]);
      setError("");
    } else {
      window.history.replaceState(null, "", "/");
    }
    setActiveView(view);
  };

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

      {/* View Switcher */}
      <div className="relative z-20 mb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <ViewSwitcher
              activeView={activeView}
              onViewChange={handleViewChange}
            />
          </div>
        </div>
      </div>

      {/* Form Section - Only show in viewer mode */}
      {activeView === "viewer" && (
        <section className="relative z-10">
          <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-xl bg-white/5 shadow-lg ring-1 ring-white/10 backdrop-blur-lg transition-all hover:bg-white/[0.07] hover:ring-white/20">
              <div className="p-4">
                <NFTInput
                  onLoad={handleNFTLoad}
                  onError={handleNFTError}
                  loadedIds={viewers.map((v) => v.id)}
                />
                {error && (
                  <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400 animate-slide-down">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        {activeView === "viewer" ? (
          viewers.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-white">Your NFTs</h2>
                <Badge variant="default" size="md">
                  {viewers.length} loaded
                </Badge>
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
            <div className="text-center py-16 animate-fade-in">
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
                Enter a Fluffle NFT ID above to view its 3D model and traits.
                You can load multiple NFTs at once.
              </p>
            </div>
          )
        ) : activeView === "analytics" ? (
          <TraitsAnalyticsDashboard />
        ) : activeView === "metaverse" ? (
          <MetaverseTeaser />
        ) : (
          <PFPGenerator />
        )}
      </section>
    </div>
  );
}
