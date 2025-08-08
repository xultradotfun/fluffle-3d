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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />

      {/* Navigation */}
      <ViewSwitcher
        activeView={activeView}
        onViewChange={handleViewChange}
      />

      {/* Form Section - Only show in viewer mode */}
      {activeView === "viewer" && (
        <section className="container mx-auto px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-background border-2 border-foreground p-6">
              <h2 className="font-black uppercase tracking-wider text-lg mb-4">
                Load NFT
              </h2>
              <NFTInput
                onLoad={handleNFTLoad}
                onError={handleNFTError}
                loadedIds={viewers.map((v) => v.id)}
              />
              {error && (
                <div className="mt-4 p-4 bg-red-100 border-2 border-red-600 text-red-800 font-medium">
                  {error}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Content Section */}
      <main className="container mx-auto px-8 py-12 pb-32 lg:pb-12">
        {activeView === "ecosystem" && <EcosystemDashboard />}
        {activeView === "viewer" && (
          <div className="space-y-16">
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
          <div>
            <GuidesHeader />
            <GuidesList />
          </div>
        )}
        {activeView === "bingo" && <BingoView />}
      </main>
    </div>
  );
}
