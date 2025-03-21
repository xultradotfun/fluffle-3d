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

interface ProjectFeature {
  title: string;
  description: string;
}

interface Project {
  name: string;
  twitter: string;
  description: string;
  longDescription: string;
  features: ProjectFeature[];
  currentStatus: string;
  website?: string;
  discord?: string;
  telegram?: string;
}

interface Guide {
  sections: {
    id: string;
    title: string;
    steps: {
      id: string;
      title: string;
      content: string;
      images?: {
        url: string;
        alt: string;
      }[];
      links?: {
        text: string;
        url: string;
      }[];
    }[];
  }[];
  requirements: string[];
  lastUpdated: string;
}

interface GuideContentProps {
  project: Project;
  guide: Guide;
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
  const [expandedImage, setExpandedImage] = useState<{
    url: string;
    alt: string;
  } | null>(null);
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
    (acc, section) => acc + section.steps.length,
    0
  );
  const completedSteps = progress.completedSteps.length;
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="relative h-screen overflow-hidden">
      <GuideSidebar
        currentProject={project}
        guide={guide}
        availableGuides={availableGuides}
      />

      <main className="h-screen overflow-y-auto lg:pl-72 pt-8">
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
                onClick={() => router.push("/guides")}
                className="absolute top-4 left-4 flex items-center gap-2 text-white bg-black/30 hover:bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm transition-colors z-10"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Guides
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
          <div className="space-y-6 relative z-10">
            {/* Description */}
            <div className="bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                About {project.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {project.longDescription}
              </p>
            </div>

            {/* Features */}
            <div className="bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Features
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.features.map((feature, index) => (
                  <div key={index} className="space-y-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Current Status
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {project.currentStatus}
              </p>
            </div>
          </div>

          {/* Guide Content */}
          <div className="space-y-8">
            {guide.sections.map((section) => (
              <div
                id={section.id}
                key={section.id}
                className="bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.steps.map((step) => (
                    <div id={step.id} key={step.id} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleStep(step.id)}
                          className={`flex-shrink-0 w-6 h-6 mt-1 rounded-full border-2 transition-colors ${
                            progress.completedSteps.includes(step.id)
                              ? "bg-green-500 border-green-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {progress.completedSteps.includes(step.id) && (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          )}
                        </button>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {step.title}
                          </h3>
                          <div className="mt-2 prose prose-gray dark:prose-invert max-w-none">
                            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
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
                                    className={`relative rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/5 shadow-sm hover:ring-2 hover:ring-blue-500/50 transition-all cursor-zoom-in group ${
                                      step.images && step.images.length === 1
                                        ? "w-full sm:w-1/2"
                                        : "w-full"
                                    }`}
                                    onClick={() => setExpandedImage(image)}
                                  >
                                    <div className="relative aspect-video">
                                      <Image
                                        src={image.url}
                                        alt={image.alt}
                                        fill
                                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                                        sizes={
                                          step.images && step.images.length > 1
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
                                  className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {link.text}
                                  <ExternalLink className="w-3 h-3" />
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
              alt={expandedImage.alt}
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
