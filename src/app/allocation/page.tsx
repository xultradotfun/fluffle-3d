"use client";

import { ViewSwitcher } from "@/components/layout/ViewSwitcher";
import Hero from "@/components/layout/Hero";
import PageHeader from "@/components/layout/PageHeader";
import { AllocationChecker } from "@/components/allocation/AllocationChecker";

export default function AllocationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <ViewSwitcher activeView="allocation" />

      <main className="container mx-auto px-4 pt-32 pb-32 max-w-4xl">
        <PageHeader
          title="ALLOCATION CHECKER"
          description="Check your MegaETH sale allocation by entering wallet addresses"
        />

        <AllocationChecker />
      </main>
    </div>
  );
}

