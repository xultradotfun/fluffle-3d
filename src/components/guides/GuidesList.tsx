"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ecosystemData from "@/data/ecosystem.json";

interface Guide {
  project: {
    name: string;
    twitter: string;
    description: string;
    longDescription: string;
    features: string[];
    currentStatus: string;
    website?: string;
    discord?: string;
    telegram?: string;
  };
  guide: {
    sections: {
      title: string;
      steps: {
        title: string;
        description: string;
        link?: string;
        completable?: boolean;
      }[];
    }[];
    requirements: string[];
    rewards: string[];
  };
  lastUpdated: string;
}

interface Project {
  name: string;
  twitter: string;
  description: string;
  logo: string;
  banner: string;
  guide?: boolean;
}

interface EcosystemData {
  projects: Project[];
}

export function GuidesList() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<
    Record<string, { completedSteps: string[]; lastVisited: string }>
  >({});

  useEffect(() => {
    const loadGuides = async () => {
      try {
        // Filter projects that have guides enabled
        const projectsWithGuides = ecosystemData.projects.filter(
          (project) => project.guide
        );

        // Load guide files for each project
        const guidePromises = projectsWithGuides.map(async (project) => {
          try {
            const guideData = await import(
              `@/data/guides/${project.twitter}.json`
            );
            return guideData.default;
          } catch (err) {
            console.error(`Error loading guide for ${project.twitter}:`, err);
            return null;
          }
        });

        const loadedGuides = (await Promise.all(guidePromises)).filter(
          (guide): guide is Guide => guide !== null
        );

        setGuides(loadedGuides);
      } catch (err) {
        console.error("Error loading guides:", err);
        setError("Failed to load guides. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadGuides();
  }, []);

  useEffect(() => {
    // Load progress from localStorage for all guides
    const loadProgress = () => {
      const newProgress: Record<
        string,
        { completedSteps: string[]; lastVisited: string }
      > = {};
      guides.forEach((guide) => {
        const savedProgress = localStorage.getItem(
          `guideProgress_${guide.project.twitter}`
        );
        if (savedProgress) {
          newProgress[guide.project.twitter] = JSON.parse(savedProgress);
        } else {
          newProgress[guide.project.twitter] = {
            completedSteps: [],
            lastVisited: new Date().toISOString(),
          };
        }
      });
      setProgress(newProgress);
    };

    if (guides.length > 0) {
      loadProgress();
    }
  }, [guides]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="text-primary hover:text-primary/80"
        >
          Try again
        </button>
      </div>
    );
  }

  if (guides.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No guides available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {guides.map((guide) => {
        const guideProgress = progress[guide.project.twitter];
        const totalSteps = guide.guide.sections.reduce(
          (total, section) =>
            total +
            section.steps.filter((step) => step.completable !== false).length,
          0
        );
        const completedSteps = guideProgress?.completedSteps.length || 0;
        const completionPercentage = Math.round(
          (completedSteps / totalSteps) * 100
        );
        const isComplete = completionPercentage === 100;

        return (
          <Link
            key={guide.project.twitter}
            href={`/explore/${guide.project.twitter}`}
            className="group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-xl border border-white/5 transition-all hover:border-white/10 hover:bg-black/30"
          >
            {/* Banner Image */}
            <div className="relative h-40 w-full overflow-hidden">
              <Image
                src={`/banners/${guide.project.twitter}.jpeg`}
                alt={`${guide.project.name} banner`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Completion Badge */}
              {isComplete && (
                <div className="absolute top-4 right-4 bg-green-500/90 text-white text-sm font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                  Completed
                </div>
              )}
            </div>

            {/* Content */}
            <div className="relative p-6">
              {/* Project Logo */}
              <div className="absolute -top-10 left-6">
                <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-black/50 backdrop-blur-xl ring-1 ring-white/10 transition-all group-hover:ring-white/20">
                  <Image
                    src={`/avatars/${guide.project.twitter}.jpg`}
                    alt={`${guide.project.name} logo`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Project Info */}
              <div className="pt-8 space-y-2">
                <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">
                  {guide.project.name}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {guide.project.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-gray-400">{completionPercentage}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isComplete ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    {completedSteps} of {totalSteps} steps
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8V12L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <span>Updated {guide.lastUpdated}</span>
                </div>
              </div>

              {/* View Guide Button */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center text-primary group-hover:text-primary/80 transition-colors">
                  <span className="text-sm font-medium">
                    {isComplete ? "Review Guide" : "Continue Guide"}
                  </span>
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
