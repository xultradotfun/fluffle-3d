"use client";

import { useState, useEffect } from "react";
import { TestnetMintsList } from "@/components/testnetmints/TestnetMintsList";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import Hero from "@/components/Hero";
import { useRouter } from "next/navigation";

export default function TestnetMintsPage() {
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
  >("mints");

  // Handle view changes
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
    } else if (view === "analytics") {
      router.push("/#rarities");
    } else if (view === "pfp") {
      router.push("/#pfp");
    } else if (view === "testnet") {
      router.push("/#testnet");
    } else if (view === "build") {
      router.push("/#build");
    } else if (view === "builder") {
      router.push("/#builder");
    } else if (view === "ecosystem") {
      router.push("/");
    } else if (view === "bingo") {
      router.push("/#bingo");
    } else if (view === "mints") {
      router.push("/mints");
    }
    setActiveView(view);
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

      {/* Main Content */}
      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            What's Minting on Testnet?
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover all NFT projects launching on the MegaETH
            Testnet.
          </p>
        </div>

        <TestnetMintsList />
      </main>
    </div>
  );
}
