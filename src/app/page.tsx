"use client";

import { useState, useEffect } from "react";
import { NFTInput } from "@/components/nft/NFTInput";
import { NFTCard } from "@/components/nft/NFTCard";
import { Badge } from "@/components/ui/Badge";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import { TraitsAnalyticsDashboard } from "@/components/analytics/TraitsAnalytics";
import { PFPGenerator } from "@/components/pfp/PFPGenerator";
import { TestnetView } from "@/components/testnet/index";
import { BuildersView } from "@/components/build/index";
import NFTBuilder from "@/components/builder/NFTBuilder";
import Hero from "@/components/Hero";
import type { NFTTrait } from "@/utils/nftLoader";
import { EcosystemDashboard } from "@/components/ecosystem/EcosystemDashboard";
import { GuidesHeader } from "@/components/guides/GuidesHeader";
import { GuidesList } from "@/components/guides/GuidesList";
import { useRouter } from "next/navigation";
import { BingoView } from "@/components/bingo/BingoView";

interface ViewerData {
  id: string;
  urls: string[];
  traits: NFTTrait;
  timestamp: number;
}

export default function Home() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<
    | "viewer"
    | "analytics"
    | "pfp"
    | "ecosystem"
    | "testnet"
    | "build"
    | "builder"
    | "guides"
    | "bingo"
    | "mints"
  >("ecosystem");
  const [viewers, setViewers] = useState<ViewerData[]>([]);
  const [error, setError] = useState("");

  // Add effect to handle URL
  useEffect(() => {
    // Check initial hash
    const hash = window.location.hash;
    if (hash === "#viewer") {
      setActiveView("viewer");
    } else if (hash === "#rarities") {
      setActiveView("analytics");
    } else if (hash === "#pfp") {
      setActiveView("pfp");
    } else if (hash === "#testnet") {
      setActiveView("testnet");
    } else if (hash === "#build") {
      setActiveView("build");
    } else if (hash === "#builder") {
      setActiveView("builder");
    } else if (hash === "#guides") {
      setActiveView("guides");
    } else if (hash === "#bingo") {
      setActiveView("bingo");
    } else if (hash === "#mints") {
      setActiveView("mints");
    } else {
      setActiveView("ecosystem");
    }

    // Listen for hash changes
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#viewer") {
        setActiveView("viewer");
      } else if (hash === "#rarities") {
        setActiveView("analytics");
      } else if (hash === "#pfp") {
        setActiveView("pfp");
      } else if (hash === "#testnet") {
        setActiveView("testnet");
      } else if (hash === "#build") {
        setActiveView("build");
      } else if (hash === "#builder") {
        setActiveView("builder");
      } else if (hash === "#guides") {
        setActiveView("guides");
      } else if (hash === "#bingo") {
        setActiveView("bingo");
      } else if (hash === "#mints") {
        setActiveView("mints");
      } else {
        setActiveView("ecosystem");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Update URL when view changes
  const handleViewChange = (
    view:
      | "viewer"
      | "analytics"
      | "pfp"
      | "ecosystem"
      | "testnet"
      | "build"
      | "builder"
      | "guides"
      | "bingo"
      | "mints"
  ) => {
    if (view === "guides") {
      router.push("/explore");
    } else if (view === "viewer") {
      router.push("/#viewer");
      setViewers([]);
      setError("");
    } else if (view === "analytics") {
      router.push("/#rarities");
      setViewers([]);
      setError("");
    } else if (view === "pfp") {
      router.push("/#pfp");
      setViewers([]);
      setError("");
    } else if (view === "testnet") {
      router.push("/#testnet");
    } else if (view === "build") {
      router.push("/#build");
    } else if (view === "builder") {
      router.push("/#builder");
    } else if (view === "ecosystem") {
      router.push("/");
      setViewers([]);
      setError("");
    } else if (view === "bingo") {
      router.push("/#bingo");
    } else if (view === "mints") {
      router.push("/mints");
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
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Desktop View Switcher */}
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
        <section className="relative z-10 pt-12 sm:pt-20">
          <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-xl bg-card shadow-lg ring-1 ring-border backdrop-blur-lg transition-all hover:bg-card/80">
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
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 sm:py-12 pb-24">
        {activeView === "ecosystem" && <EcosystemDashboard />}
        {activeView === "viewer" && (
          <div className="max-w-7xl mx-auto space-y-12">
            {viewers.map((viewer) => (
              <NFTCard
                key={`${viewer.id}-${viewer.timestamp}`}
                id={viewer.id}
                urls={viewer.urls}
                traits={viewer.traits}
                onRemove={() => handleRemoveViewer(viewer.id, viewer.timestamp)}
              />
            ))}
          </div>
        )}
        {activeView === "analytics" && <TraitsAnalyticsDashboard />}
        {activeView === "pfp" && <PFPGenerator />}
        {activeView === "testnet" && <TestnetView />}
        {activeView === "build" && <BuildersView />}
        {activeView === "builder" && <NFTBuilder />}
        {activeView === "guides" && (
          <div className="max-w-7xl mx-auto">
            <GuidesHeader />
            <GuidesList />
          </div>
        )}
        {activeView === "bingo" && <BingoView />}
      </section>
    </div>
  );
}
