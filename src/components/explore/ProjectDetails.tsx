import { Project, ProjectFeature } from "@/components/guides/types";

interface ProjectDetailsProps {
  project: Project;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  return (
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
                {project.features.map(
                  (feature: ProjectFeature, index: number) => (
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
                  )
                )}
              </div>
            </div>
          )}

          {/* Current Status */}
          {project.currentStatus && (
            <div>
              <h3 className="text-lg text-gray-300 mb-4">Current Status</h3>
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
  );
}
