"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  X,
  Globe,
  Twitter,
  Hash,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { GuideSidebar } from "./GuideSidebar";
import { Project, Guide, GuideStep, GuideImage } from "./types";
import { ProjectDetails } from "@/components/explore/ProjectDetails";

interface ProjectFeature {
  title: string;
  description: string;
}

interface GuideContentProps {
  guide: Guide;
  project: Project;
  availableGuides: Project[];
}

interface Progress {
  completedSteps: string[];
  lastVisited: string;
}

export function GuideContent({
  guide,
  project,
  availableGuides,
}: GuideContentProps) {
  const router = useRouter();
  const [expandedImage, setExpandedImage] = useState<GuideImage | null>(null);
  const [progress, setProgress] = useState<Progress>({
    completedSteps: [],
    lastVisited: new Date().toISOString(),
  });

  // Find the project data from ecosystem.json
  const projectData = availableGuides.find(
    (p) => p.twitter === project.twitter
  );

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem(
      `guideProgress_${project.twitter}`
    );
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, [project.twitter]);

  const toggleStep = (stepId: string) => {
    // Find the step to check if it's completable
    const step = guide.sections
      .flatMap((section) => section.steps)
      .find((step) => step.id === stepId);

    // Only allow toggling if the step is completable
    if (!step?.completable) return;

    setProgress((prev) => {
      const newProgress = {
        completedSteps: prev.completedSteps.includes(stepId)
          ? prev.completedSteps.filter((id) => id !== stepId)
          : [...prev.completedSteps, stepId],
        lastVisited: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem(
        `guideProgress_${project.twitter}`,
        JSON.stringify(newProgress)
      );

      return newProgress;
    });
  };

  const totalSteps = guide.sections.reduce(
    (acc, section) =>
      acc + section.steps.filter((step) => step.completable !== false).length,
    0
  );
  const completedSteps = progress.completedSteps.length;
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="relative">
      <GuideSidebar
        currentProject={project}
        guide={guide}
        availableGuides={availableGuides}
        completedSteps={progress.completedSteps}
      />

      <main className="lg:pl-72 pt-8">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 space-y-8">
          {/* Header */}
          <div className="relative z-0">
            {/* Banner */}
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <Image
                src={`/banners/${project.twitter}.jpeg`}
                alt={`${project.name} banner`}
                className="object-cover"
                fill
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />

              {/* Social Links */}
              <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
                {projectData?.website && (
                  <a
                    href={projectData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/40 text-white transition-colors backdrop-blur-sm"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={`https://twitter.com/${projectData?.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/40 text-white transition-colors backdrop-blur-sm"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                {projectData?.discord && (
                  <a
                    href={projectData.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/40 text-white transition-colors backdrop-blur-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </a>
                )}
                {projectData?.telegram && (
                  <a
                    href={projectData.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/40 text-white transition-colors backdrop-blur-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M11.99432,2a10,10,0,1,0,10,10A9.99917,9.99917,0,0,0,11.99432,2Zm3.17951,15.15247a.70547.70547,0,0,1-1.002.3515l-2.71467-2.10938L9.71484,17.002a.29969.29969,0,0,1-.285.03894l.334-3.23242,5.90283-5.90283a.31193.31193,0,0,0-.37573-.49219L8.73438,12.552,5.69873,11.4502a.28978.28978,0,0,1,.00361-.54394l12.54718-4.8418a.29832.29832,0,0,1,.39844.41015Z" />
                    </svg>
                  </a>
                )}
              </div>

              {/* Back Button */}
              <button
                onClick={() => router.push("/explore")}
                className="absolute top-4 left-4 flex items-center gap-2 text-white bg-black/30 hover:bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm transition-colors z-10"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Explore
              </button>
            </div>

            {/* Project Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 rounded-xl overflow-hidden border-4 border-white dark:border-gray-900">
                  <Image
                    src={`/avatars/${project.twitter}.jpg`}
                    alt={`${project.name} logo`}
                    className="object-cover"
                    fill
                    priority
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white">
                    {project.name}
                  </h1>
                  <p className="text-gray-200 mt-1">{project.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Progress
              </h2>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {completedSteps} of {totalSteps} steps
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Project Details */}
          <ProjectDetails project={project} />

          {/* Guide Content */}
          <div className="space-y-6">
            {guide.sections.map((section) => (
              <div
                id={section.id}
                key={section.id}
                className="bg-white/50 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/5 rounded-xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-8">
                    {section.steps.map((step) => (
                      <div
                        id={step.id}
                        key={step.id}
                        className="group relative"
                      >
                        <div className="flex items-start gap-4">
                          {step.completable !== false && (
                            <button
                              onClick={() => toggleStep(step.id)}
                              className={`flex-shrink-0 w-6 h-6 mt-1 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                progress.completedSteps.includes(step.id)
                                  ? "bg-gradient-to-br from-green-500 to-emerald-500 border-transparent shadow-sm shadow-green-500/10"
                                  : "border-gray-300 dark:border-gray-600 group-hover:border-blue-500 dark:group-hover:border-blue-400 hover:scale-105 hover:shadow-sm hover:shadow-blue-500/10"
                              }`}
                            >
                              {progress.completedSteps.includes(step.id) ? (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-500 dark:group-hover:bg-blue-400 transition-colors" />
                              )}
                            </button>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {step.title}
                              </h3>
                              {step.completable !== false &&
                                progress.completedSteps.includes(step.id) && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                    Completed
                                  </span>
                                )}
                            </div>
                            <div className="mt-3 prose prose-gray dark:prose-invert max-w-none">
                              <p className="text-[14px] text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                {step.content}
                              </p>
                            </div>
                            {step.images && step.images.length > 0 && (
                              <div className="mt-6">
                                <div
                                  className={`grid ${
                                    step.images.length > 1
                                      ? "grid-cols-1 sm:grid-cols-2 gap-6"
                                      : "grid-cols-1 place-items-center"
                                  }`}
                                >
                                  {step.images.map((image, index) => (
                                    <button
                                      key={index}
                                      className={`relative rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 shadow-lg hover:ring-2 hover:ring-blue-500/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-zoom-in group ${
                                        step.images && step.images.length === 1
                                          ? "w-full sm:w-2/3"
                                          : "w-full"
                                      }`}
                                      onClick={() => setExpandedImage(image)}
                                    >
                                      <div className="relative aspect-video">
                                        <Image
                                          src={image.url}
                                          alt={
                                            image.alt ||
                                            `${step.title} - Image ${index + 1}`
                                          }
                                          fill
                                          className="object-contain group-hover:scale-105 transition-transform duration-300"
                                          sizes={
                                            step.images &&
                                            step.images.length > 1
                                              ? "(max-width: 640px) 100vw, 50vw"
                                              : "100vw"
                                          }
                                          priority={index === 0}
                                        />
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                            {step.links && step.links.length > 0 && (
                              <div className="mt-6 flex flex-wrap gap-3">
                                {step.links.map((link, index) => (
                                  <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                                  >
                                    <Globe className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                      {link.text}
                                    </span>
                                    <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Requirements */}
          <div className="bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Requirements
            </h2>
            <ul className="space-y-2">
              {guide.requirements.map((req, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                >
                  <CheckCircle2 className="w-5 h-5 text-gray-400" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setExpandedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setExpandedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] m-4">
            <Image
              src={expandedImage.url}
              alt={expandedImage.alt || "Guide step image"}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
