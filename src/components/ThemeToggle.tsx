"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`fixed top-4 right-4 z-50 p-2.5 rounded-xl transition-all duration-300 group
        ${
          theme === "dark"
            ? "bg-white/5 hover:bg-white/10 border-white/10 shadow-lg shadow-black/10"
            : "bg-white hover:bg-gray-50 border-gray-200 shadow-lg shadow-gray-200/50"
        } border`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="relative">
        {theme === "dark" ? (
          <svg
            className="w-5 h-5 text-yellow-400 transition-transform duration-500 rotate-0 scale-100 group-hover:rotate-90 group-hover:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-indigo-600 transition-transform duration-500 rotate-0 scale-100 group-hover:-rotate-90 group-hover:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </div>
    </button>
  );
}
