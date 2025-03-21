import Link from "next/link";
import { ChevronRight, Menu, X, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Project {
  name: string;
  twitter: string;
  description: string;
}

interface Guide {
  sections: {
    id: string;
    title: string;
    steps: {
      id: string;
      title: string;
    }[];
  }[];
}

interface GuideSidebarProps {
  currentProject: Project;
  guide: Guide;
  availableGuides: Project[];
  completedSteps: string[];
}

export function GuideSidebar({
  currentProject,
  guide,
  availableGuides,
  completedSteps,
}: GuideSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate section progress
  const getSectionProgress = (section: Guide["sections"][0]) => {
    const totalSteps = section.steps.length;
    const completedStepsInSection = section.steps.filter((step) =>
      completedSteps.includes(step.id)
    ).length;
    return (completedStepsInSection / totalSteps) * 100;
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("guide-sidebar");
      const toggle = document.getElementById("sidebar-toggle");
      if (
        sidebar &&
        toggle &&
        !sidebar.contains(event.target as Node) &&
        !toggle.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close sidebar when navigating to a section
  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        id="guide-sidebar"
        className={`fixed top-0 left-0 h-screen w-72 border-r border-gray-200/50 dark:border-white/5 bg-white dark:bg-gray-900 z-20 ${
          isOpen
            ? "transform translate-x-0 transition-transform duration-300"
            : "transform -translate-x-full transition-transform duration-300 lg:translate-x-0"
        }`}
      >
        {/* Fixed Header */}
        <div className="h-[120px] p-6 border-b border-gray-200/50 dark:border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-gray-200/50 dark:border-white/5">
              <Image
                src={`/avatars/${currentProject.twitter}.jpg`}
                alt={currentProject.name}
                className="object-cover"
                fill
                priority
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {currentProject.name}
              </h2>
            </div>
          </div>
          <div className="h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{
                width: `${
                  (completedSteps.length /
                    guide.sections.reduce(
                      (acc, section) => acc + section.steps.length,
                      0
                    )) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="h-[calc(100vh-120px)] overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Guide Sections */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Guide Progress
              </h3>
              <div className="space-y-6">
                {guide.sections.map((section) => {
                  const progress = getSectionProgress(section);
                  const isComplete = progress === 100;
                  return (
                    <div key={section.id}>
                      <div className="mb-3">
                        <button
                          className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            isComplete
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                          }`}
                          onClick={() => handleSectionClick(section.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span>{section.title}</span>
                            <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <div className="h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                isComplete ? "bg-blue-500" : "bg-blue-500"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </button>
                      </div>
                      <div className="ml-3 space-y-0.5">
                        {section.steps.map((step) => {
                          const isStepComplete = completedSteps.includes(
                            step.id
                          );
                          return (
                            <button
                              key={step.id}
                              className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 group ${
                                isStepComplete
                                  ? "text-gray-900 dark:text-white bg-gray-50 dark:bg-white/[0.02]"
                                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                              }`}
                              onClick={() => handleSectionClick(step.id)}
                            >
                              <div
                                className={`w-4 h-4 flex items-center justify-center ${
                                  isStepComplete
                                    ? "text-blue-500"
                                    : "text-gray-400 dark:text-gray-600"
                                }`}
                              >
                                {isStepComplete ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <div className="w-1.5 h-1.5 rounded-full bg-current group-hover:bg-gray-600 dark:group-hover:bg-gray-400 transition-colors" />
                                )}
                              </div>
                              <span className="truncate">{step.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Other Available Guides */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Other Guides
              </h3>
              <div className="space-y-1">
                {availableGuides
                  .filter(
                    (project) => project.twitter !== currentProject.twitter
                  )
                  .map((project) => (
                    <Link
                      key={project.twitter}
                      href={`/guides/${project.twitter}`}
                      className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {project.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        id="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg hover:scale-105 transition-transform border border-gray-200/50 dark:border-white/5"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
