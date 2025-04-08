"use client";

import { GuidesHeader } from "@/components/guides/GuidesHeader";
import { GuidesList } from "@/components/guides/GuidesList";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import Hero from "@/components/Hero";
import { useRouter } from "next/navigation";

export default function GuidesPage() {
  const router = useRouter();

  const handleViewChange = (view: string) => {
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
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Desktop View Switcher */}
      <div className="relative z-20 mb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <ViewSwitcher activeView="guides" onViewChange={handleViewChange} />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 sm:py-12 pb-24 pt-12 sm:pt-20 flex-grow">
        <div className="max-w-7xl mx-auto">
          <GuidesHeader />
          <GuidesList />
        </div>
      </section>
    </div>
  );
}
