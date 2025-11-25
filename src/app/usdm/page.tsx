"use client";

import { ViewSwitcher } from "@/components/ViewSwitcher";
import Hero from "@/components/Hero";
import PageHeader from "@/components/PageHeader";
import { RevenueLeaderboard } from "@/components/usdm/RevenueLeaderboard";

export default function UsdmPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Desktop View Switcher */}
      <div className="relative z-20 mb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <ViewSwitcher activeView="usdm" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="mx-auto w-full max-w-[95vw] 2xl:max-w-[2000px] px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32 py-6 sm:py-12 pb-24">
        <PageHeader
          title="USDM Revenue Comparison"
          description="Compare MegaETH revenue against other major chains"
        />

        <div className="mt-8">
          <RevenueLeaderboard />
        </div>
      </section>
    </div>
  );
}
