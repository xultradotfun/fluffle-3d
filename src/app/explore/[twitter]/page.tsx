"use client";

import { useParams } from "next/navigation";
import { GuideContent } from "@/components/guides/GuideContent";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import Hero from "@/components/Hero";
import { useRouter } from "next/navigation";
import ecosystemData from "@/data/ecosystem.json";

export default function GuidePage() {
  const params = useParams();
  const router = useRouter();
  const twitter = params.twitter as string;

  // Get all projects with guides
  const availableGuides = ecosystemData.projects.filter(
    (project) => project.guide
  );

  // Load the guide data dynamically
  let guideData;
  try {
    guideData = require(`@/data/guides/${twitter}.json`);
  } catch (error) {
    console.error("Error loading guide data:", error);
    router.push("/explore");
    return;
  }

  if (!guideData) {
    router.push("/explore");
    return;
  }

  const { project, guide } = guideData;

  return (
    <div className="flex min-h-screen flex-col">
      <Hero />
      <ViewSwitcher
        activeView="guides"
        onViewChange={(view) => {
          if (view === "guides") {
            router.push("/guides");
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
        }}
      />
      <div className="flex-1">
        <GuideContent
          guide={guide}
          project={project}
          availableGuides={availableGuides}
        />
      </div>
    </div>
  );
}
