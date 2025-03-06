type TabSectionProps = {
  activeView: "users" | "builders";
  setActiveView: (view: "users" | "builders") => void;
};

export const TabSection = ({ activeView, setActiveView }: TabSectionProps) => (
  <div className="flex items-center gap-1.5 p-1 bg-white/60 dark:bg-white/[0.02] rounded-lg border border-gray-200/20 dark:border-white/[0.08] shadow-lg backdrop-blur-lg w-fit mb-6">
    <button
      onClick={() => setActiveView("users")}
      className={`flex items-center justify-start gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
        activeView === "users"
          ? "bg-gradient-to-r from-orange-50/90 to-amber-50/90 text-orange-600 border border-orange-200/30 shadow-sm dark:from-orange-500/20 dark:to-orange-500/10 dark:text-orange-400 dark:border-orange-500/20"
          : "text-gray-600 hover:text-gray-900 hover:bg-white/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/[0.08]"
      }`}
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
      <span>For Users</span>
    </button>
    <button
      onClick={() => setActiveView("builders")}
      className={`flex items-center justify-start gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
        activeView === "builders"
          ? "bg-gradient-to-r from-purple-50/90 to-pink-50/90 text-purple-600 border border-purple-200/30 shadow-sm dark:from-purple-500/20 dark:to-purple-500/10 dark:text-purple-400 dark:border-purple-500/20"
          : "text-gray-600 hover:text-gray-900 hover:bg-white/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/[0.08]"
      }`}
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
      <span>For Builders</span>
    </button>
  </div>
);
