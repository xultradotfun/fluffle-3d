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
                    <Hash className="w-4 h-4" />
                  </a>
                )}
                {projectData?.telegram && (
                  <a
                    href={projectData.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/40 text-white transition-colors backdrop-blur-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
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
          <div className="relative z-10">
            <div className="bg-white/[0.02] dark:bg-white/[0.02] border border-gray-200/10 dark:border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-100">
                    Project Details
                  </h2>
                </div>

                {/* Description */}
                {project.longDescription && (
                  <div className="mb-10">
                    <h3 className="text-lg text-gray-300 mb-3">
                      About {project.name}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-[15px]">
                      {project.longDescription}
                    </p>
                  </div>
                )}

                {/* Features */}
                {project.features && project.features.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-lg text-gray-300 mb-6">Key Features</h3>
                    <div className="grid gap-6 sm:grid-cols-2">
                      {project.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-5 h-5 mt-1 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-3 h-3 text-indigo-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-200 text-[15px] mb-1">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current Status */}
                {project.currentStatus && (
                  <div>
                    <h3 className="text-lg text-gray-300 mb-4">
                      Current Status
                    </h3>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 mt-1 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-3 h-3 text-green-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 leading-relaxed text-[15px]">
                        {project.currentStatus}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

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
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-8">
                    {section.steps.map((step) => (
                      <div id={step.id} key={step.id} className="group">
                        <div className="flex items-start gap-4">
                          {step.completable !== false && (
                            <button
                              onClick={() => toggleStep(step.id)}
                              className={`flex-shrink-0 w-6 h-6 mt-1 rounded-full border-2 transition-all duration-200 ${
                                progress.completedSteps.includes(step.id)
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-300 dark:border-gray-600 group-hover:border-blue-500 dark:group-hover:border-blue-400"
                              }`}
                            >
                              {progress.completedSteps.includes(step.id) && (
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              )}
                            </button>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {step.title}
                            </h3>
                            <div className="mt-3 prose prose-gray dark:prose-invert max-w-none">
                              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                                {step.content}
                              </p>
                            </div>
                            {step.images && step.images.length > 0 && (
                              <div className="mt-4">
                                <div
                                  className={`grid ${
                                    step.images.length > 1
                                      ? "grid-cols-1 sm:grid-cols-2 gap-4"
                                      : "grid-cols-1 place-items-center"
                                  }`}
                                >
                                  {step.images.map((image, index) => (
                                    <button
                                      key={index}
                                      className={`relative rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/5 shadow-sm hover:ring-2 hover:ring-blue-500/50 transition-all cursor-zoom-in group ${
                                        step.images && step.images.length === 1
                                          ? "w-full sm:w-1/2"
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
                              <div className="mt-4 flex flex-wrap gap-2">
                                {step.links.map((link, index) => (
                                  <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                  >
                                    {link.text}
                                    <ExternalLink className="w-3.5 h-3.5" />
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
