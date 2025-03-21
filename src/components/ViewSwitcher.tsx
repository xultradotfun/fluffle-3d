import { cn } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import {
  Flower2,
  Rabbit,
  ChevronDown,
  Box,
  BarChart3,
  Image,
  Globe,
  X,
  FlaskConical,
  Wrench,
  BookOpen,
} from "lucide-react";

interface ViewSwitcherProps {
  activeView:
    | "viewer"
    | "analytics"
    | "pfp"
    | "metaverse"
    | "ecosystem"
    | "testnet"
    | "build"
    | "builder"
    | "guides";
  onViewChange: (
    view:
      | "viewer"
      | "analytics"
      | "pfp"
      | "metaverse"
      | "ecosystem"
      | "testnet"
      | "build"
      | "builder"
      | "guides"
  ) => void;
}

export function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTestnetMenuOpen, setIsTestnetMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop View */}
      <div className="hidden sm:block fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-3 p-2 bg-white/60 dark:bg-gray-900/50 rounded-2xl border border-gray-200/20 dark:border-white/[0.08] shadow-lg backdrop-blur-lg max-w-[calc(100vw-2rem)] mx-auto">
          {/* Ecosystem Section */}
          <button
            onClick={() => onViewChange("ecosystem")}
            className={`flex items-center justify-start gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeView === "ecosystem"
                ? "bg-gradient-to-r from-orange-50/90 to-amber-50/90 text-orange-600 border border-orange-200/30 shadow-sm dark:from-orange-500/20 dark:to-orange-500/10 dark:text-orange-400 dark:border-orange-500/20"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/[0.08]"
            }`}
          >
            <Flower2 className="w-4 h-4 flex-shrink-0" />
            <span className="flex-shrink-0">Ecosystem</span>
          </button>

          {/* Testnet Section */}
          <div className="group relative">
            <button
              className={`flex items-center justify-start gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                ["testnet", "build"].includes(activeView)
                  ? "bg-gradient-to-r from-violet-50 to-purple-50 text-violet-600 border border-violet-200/50 shadow-sm dark:from-violet-500/20 dark:to-violet-500/10 dark:text-violet-400 dark:border-violet-500/20"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/[0.08]"
              }`}
            >
              <FlaskConical className="w-4 h-4 flex-shrink-0" />
              <span className="flex-shrink-0">Testnet</span>
              <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                New
              </span>
              <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-300 ease-in-out group-hover:rotate-180" />
            </button>

            {/* Testnet Dropdown Menu */}
            <div className="absolute invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out z-50 w-60 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-xl shadow-lg border border-gray-200/30 dark:border-white/[0.12] bottom-full left-1/2 -translate-x-1/2 mb-2">
              <div className="relative space-y-1">
                <button
                  onClick={() => onViewChange("testnet")}
                  className={`flex items-center w-full gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === "testnet"
                      ? "bg-gradient-to-r from-violet-50/90 to-purple-50/90 text-violet-600 shadow-sm dark:from-violet-500/20 dark:to-violet-500/10 dark:text-violet-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <FlaskConical className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">Overview</span>
                  {activeView === "testnet" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400" />
                  )}
                </button>
                <button
                  onClick={() => onViewChange("guides")}
                  className={`flex items-center w-full gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === "guides"
                      ? "bg-gradient-to-r from-violet-50/90 to-purple-50/90 text-violet-600 shadow-sm dark:from-violet-500/20 dark:to-violet-500/10 dark:text-violet-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">Explore</span>
                  {activeView === "guides" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400" />
                  )}
                </button>
                <button
                  onClick={() => onViewChange("build")}
                  className={`flex items-center w-full gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === "build"
                      ? "bg-gradient-to-r from-violet-50/90 to-purple-50/90 text-violet-600 shadow-sm dark:from-violet-500/20 dark:to-violet-500/10 dark:text-violet-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Wrench className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">Build</span>
                  {activeView === "build" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400" />
                  )}
                </button>
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border-b border-r border-gray-200/30 dark:border-white/[0.12]" />
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200/70 dark:bg-white/[0.06] mx-1" />

          {/* Fluffles Dropdown */}
          <div className="group relative">
            <button
              className={`flex items-center justify-start gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                ["viewer", "analytics", "pfp", "metaverse"].includes(activeView)
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-200/50 shadow-sm dark:from-blue-500/20 dark:to-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/[0.08]"
              }`}
            >
              <Rabbit className="w-4 h-4 flex-shrink-0" />
              <span className="flex-shrink-0">Fluffle Tools</span>
              <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-300 ease-in-out group-hover:rotate-180" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out z-50 w-60 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-xl shadow-lg border border-gray-200/30 dark:border-white/[0.12] bottom-full left-1/2 -translate-x-1/2 mb-2">
              <div className="relative space-y-1">
                <button
                  onClick={() => onViewChange("viewer")}
                  className={`flex items-center w-full gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === "viewer"
                      ? "bg-gradient-to-r from-blue-50/90 to-indigo-50/90 text-blue-600 shadow-sm dark:from-blue-500/20 dark:to-blue-500/10 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Box className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">3D Viewer</span>
                  {activeView === "viewer" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                  )}
                </button>
                <button
                  onClick={() => onViewChange("analytics")}
                  className={`flex items-center w-full gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === "analytics"
                      ? "bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-600 shadow-sm dark:from-purple-500/20 dark:to-purple-500/10 dark:text-purple-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <BarChart3 className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">Rarities</span>
                  {activeView === "analytics" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400" />
                  )}
                </button>
                <button
                  onClick={() => onViewChange("pfp")}
                  className={`flex items-center w-full gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === "pfp"
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 shadow-sm dark:from-green-500/20 dark:to-green-500/10 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Image className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">PFP Generator</span>
                  {activeView === "pfp" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400" />
                  )}
                </button>
                <button
                  onClick={() => onViewChange("metaverse")}
                  className={`flex items-center w-full gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === "metaverse"
                      ? "bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 shadow-sm dark:from-pink-500/20 dark:to-pink-500/10 dark:text-pink-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">Metaverse</span>
                  {activeView === "metaverse" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500 dark:bg-pink-400" />
                  )}
                </button>
                <button
                  onClick={() => onViewChange("builder")}
                  className={`flex items-center w-full gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === "builder"
                      ? "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-600 shadow-sm dark:from-amber-500/20 dark:to-amber-500/10 dark:text-amber-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Rabbit className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">Fluffle Builder</span>
                  {activeView === "builder" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                  )}
                </button>
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border-b border-r border-gray-200/30 dark:border-white/[0.12]" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/60 dark:bg-gray-900/50 border-t border-gray-200/20 dark:border-white/[0.08] pb-safe backdrop-blur-lg">
        <div className="flex items-center justify-around px-2 py-3">
          {/* Ecosystem */}
          <button
            onClick={() => onViewChange("ecosystem")}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 ${
              activeView === "ecosystem"
                ? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-500/20 dark:to-orange-500/10 text-orange-600 dark:text-orange-400 shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/[0.08]"
            }`}
          >
            <div
              className={`relative transition-transform duration-200 ${
                activeView === "ecosystem" ? "scale-110" : ""
              }`}
            >
              <Flower2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Ecosystem</span>
          </button>

          {/* Testnet Button (Mobile) */}
          <button
            onClick={() => setIsTestnetMenuOpen(true)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 ${
              ["testnet", "build"].includes(activeView)
                ? "bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-500/20 dark:to-violet-500/10 text-violet-600 dark:text-violet-400 shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/[0.08]"
            }`}
          >
            <div className="relative">
              <div
                className={`transition-transform duration-200 ${
                  ["testnet", "build"].includes(activeView) ? "scale-110" : ""
                }`}
              >
                <FlaskConical className="w-5 h-5" />
              </div>
              <span className="absolute -top-3.5 -right-6 px-1.5 py-0.5 text-[8px] font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
                New
              </span>
              <ChevronDown className="w-3 h-3 absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full shadow-sm" />
            </div>
            <span className="text-xs font-medium mt-0.5">Testnet</span>
          </button>

          {/* Fluffles Button (Mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 ${
              ["viewer", "analytics", "pfp", "metaverse"].includes(activeView)
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/20 dark:to-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/[0.08]"
            }`}
          >
            <div className="relative">
              <div
                className={`transition-transform duration-200 ${
                  ["viewer", "analytics", "pfp", "metaverse"].includes(
                    activeView
                  )
                    ? "scale-110"
                    : ""
                }`}
              >
                <Rabbit className="w-5 h-5" />
              </div>
              <ChevronDown className="w-3 h-3 absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full shadow-sm" />
            </div>
            <span className="text-xs font-medium mt-0.5">Fluffle Tools</span>
          </button>
        </div>
      </div>

      {/* Testnet Mobile Menu */}
      {isTestnetMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-black/10 dark:bg-black/20 backdrop-blur-sm">
          <div
            className="absolute inset-x-0 bottom-0 bg-white/90 dark:bg-gray-900/90 rounded-t-2xl shadow-lg backdrop-blur-2xl"
            style={{ maxHeight: "calc(100vh - 4rem)" }}
          >
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200/30 dark:border-white/[0.12]">
              <div className="flex items-center gap-2.5">
                <FlaskConical className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span className="text-sm font-medium">Testnet</span>
              </div>
              <button
                onClick={() => setIsTestnetMenuOpen(false)}
                className="p-2 -mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div
              className="p-2 overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 8rem)" }}
            >
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onViewChange("testnet");
                    setIsTestnetMenuOpen(false);
                  }}
                  className={`flex items-center w-full gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeView === "testnet"
                      ? "bg-gradient-to-r from-violet-50 to-purple-50 text-violet-600 shadow-sm dark:from-violet-500/20 dark:to-violet-500/10 dark:text-violet-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <FlaskConical className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Overview</span>
                  {activeView === "testnet" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400" />
                  )}
                </button>
                <button
                  onClick={() => {
                    onViewChange("guides");
                    setIsTestnetMenuOpen(false);
                  }}
                  className={`flex items-center w-full gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeView === "guides"
                      ? "bg-gradient-to-r from-violet-50 to-purple-50 text-violet-600 shadow-sm dark:from-violet-500/20 dark:to-violet-500/10 dark:text-violet-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <BookOpen className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Guides</span>
                  {activeView === "guides" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400" />
                  )}
                </button>
                <button
                  onClick={() => {
                    onViewChange("build");
                    setIsTestnetMenuOpen(false);
                  }}
                  className={`flex items-center w-full gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeView === "build"
                      ? "bg-gradient-to-r from-violet-50 to-purple-50 text-violet-600 shadow-sm dark:from-violet-500/20 dark:to-violet-500/10 dark:text-violet-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Wrench className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Build</span>
                  {activeView === "build" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-black/10 dark:bg-black/20 backdrop-blur-sm">
          <div
            className="absolute inset-x-0 bottom-0 bg-white/90 dark:bg-gray-900/90 rounded-t-2xl shadow-lg backdrop-blur-2xl"
            style={{ maxHeight: "calc(100vh - 4rem)" }}
          >
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200/30 dark:border-white/[0.12]">
              <div className="flex items-center gap-2.5">
                <Rabbit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium">Fluffle Tools</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div
              className="p-2 overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 8rem)" }}
            >
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onViewChange("viewer");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeView === "viewer"
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm dark:from-blue-500/20 dark:to-blue-500/10 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Box className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">3D Viewer</span>
                  {activeView === "viewer" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                  )}
                </button>
                <button
                  onClick={() => {
                    onViewChange("analytics");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeView === "analytics"
                      ? "bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-600 shadow-sm dark:from-purple-500/20 dark:to-purple-500/10 dark:text-purple-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <BarChart3 className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Rarities</span>
                  {activeView === "analytics" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400" />
                  )}
                </button>
                <button
                  onClick={() => {
                    onViewChange("pfp");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeView === "pfp"
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 shadow-sm dark:from-green-500/20 dark:to-green-500/10 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Image className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">PFP Generator</span>
                  {activeView === "pfp" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400" />
                  )}
                </button>
                <button
                  onClick={() => {
                    onViewChange("metaverse");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeView === "metaverse"
                      ? "bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 shadow-sm dark:from-pink-500/20 dark:to-pink-500/10 dark:text-pink-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Globe className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Metaverse</span>
                  {activeView === "metaverse" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500 dark:bg-pink-400" />
                  )}
                </button>
                <button
                  onClick={() => {
                    onViewChange("builder");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeView === "builder"
                      ? "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-600 shadow-sm dark:from-amber-500/20 dark:to-amber-500/10 dark:text-amber-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Rabbit className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Fluffle Builder</span>
                  {activeView === "builder" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
