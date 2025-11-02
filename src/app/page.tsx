"use client";

import { ViewSwitcher } from "@/components/ViewSwitcher";
import Hero from "@/components/Hero";
import { EcosystemDashboard } from "@/components/ecosystem/EcosystemDashboard";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleViewChange = (view: "pfp" | "ecosystem" | "builder" | "bingo" | "math") => {
    if (view === "pfp") {
      router.push("/pfp");
    } else if (view === "builder") {
      router.push("/builder");
    } else if (view === "ecosystem") {
      router.push("/");
    } else if (view === "bingo") {
      router.push("/bingo");
    } else if (view === "math") {
      router.push("/math");
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
            <ViewSwitcher
              activeView="ecosystem"
              onViewChange={handleViewChange}
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 sm:py-12 pb-24">
        <EcosystemDashboard />
      </section>
    </div>
  );
}
