"use client";

import { ViewSwitcher } from "@/components/ViewSwitcher";
import Hero from "@/components/Hero";
import PageHeader from "@/components/PageHeader";
import { AllocationChecker } from "@/components/allocation/AllocationChecker";

export default function AllocationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <ViewSwitcher activeView="allocation" />

      <main className="container mx-auto px-4 pt-32 pb-32">
        <PageHeader
          title="MEGAETH ALLOCATION CHECKER"
          description="Check your MegaETH sale allocation by entering wallet addresses"
        />

        <AllocationChecker />
      </main>
    </div>
  );
}

