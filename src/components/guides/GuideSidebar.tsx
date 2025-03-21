import Link from "next/link";
import { ChevronRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

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
}

export function GuideSidebar({
  currentProject,
  guide,
  availableGuides,
}: GuideSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

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
      {/* Mobile Toggle Button */}
      <button
        id="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg hover:scale-105 transition-transform"
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

      {/* Sidebar */}
      <aside
        id="guide-sidebar"
        className={`fixed top-0 left-0 h-screen w-72 overflow-y-auto border-r border-gray-200 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm z-20 ${
          isOpen
            ? "transform translate-x-0 transition-transform duration-300"
            : "transform -translate-x-full transition-transform duration-300 lg:translate-x-0"
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Guide Sections */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Guide Sections
            </h3>
            <div className="space-y-1">
              {guide.sections.map((section) => (
                <div key={section.id}>
                  <button
                    className="w-full text-left px-2 py-1.5 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => handleSectionClick(section.id)}
                  >
                    {section.title}
                  </button>
                  <div className="ml-4 space-y-1 mt-1">
                    {section.steps.map((step) => (
                      <button
                        key={step.id}
                        className="w-full text-left px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                        onClick={() => handleSectionClick(step.id)}
                      >
                        <ChevronRight className="w-3 h-3 flex-shrink-0" />
                        {step.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other Available Guides */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Other Guides
            </h3>
            <div className="space-y-1">
              {availableGuides
                .filter((project) => project.twitter !== currentProject.twitter)
                .map((project) => (
                  <Link
                    key={project.twitter}
                    href={`/guides/${project.twitter}`}
                    className="block px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {project.name}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
