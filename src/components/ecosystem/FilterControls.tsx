interface FilterControlsProps {
    selectedCategory: string | null
    setSelectedCategory: (category: string | null) => void
    showMegaMafiaOnly: boolean
    setShowMegaMafiaOnly: (show: boolean) => void
    showNativeOnly: boolean
    setShowNativeOnly: (show: boolean) => void
    showMyVotesOnly: boolean
    setShowMyVotesOnly: (show: boolean) => void
    categories: string[]
    getCategoryCount: (
        category: string,
        megaMafiaOnly?: boolean,
        nativeOnly?: boolean,
        showMyVotesOnly?: boolean,
    ) => number
    getMegaMafiaCount: () => number
    getNativeCount: () => number
    getUserVotedCount: () => number
    totalProjects: number
}

export function FilterControls({
    selectedCategory,
    setSelectedCategory,
    showMegaMafiaOnly,
    setShowMegaMafiaOnly,
    showNativeOnly,
    setShowNativeOnly,
    showMyVotesOnly,
    setShowMyVotesOnly,
    categories,
    getCategoryCount,
    getMegaMafiaCount,
    getNativeCount,
    getUserVotedCount,
    totalProjects,
}: FilterControlsProps) {
    return (
        <div className="flex flex-col gap-4">
            {/* Project Type Filters */}
            <div className="flex flex-wrap items-center gap-2">
                {/* MegaMafia Filter */}
                <button
                    onClick={() => {
                        setShowMegaMafiaOnly(!showMegaMafiaOnly)
                        setShowNativeOnly(false)
                        setShowMyVotesOnly(false)
                    }}
                    className={`group relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        showMegaMafiaOnly
                            ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg ring-1 ring-white/20"
                            : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10"
                    }`}
                >
                    <div className="relative flex items-center gap-2">
                        {showMegaMafiaOnly && (
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent)] rounded-lg"></div>
                        )}
                        <img
                            src="/icons/logo-02.png"
                            alt="MegaMafia"
                            className={`w-4 h-4 object-contain ${
                                showMegaMafiaOnly ? "brightness-0 invert" : "dark:invert opacity-75"
                            }`}
                        />
                        <span className={showMegaMafiaOnly ? "font-semibold" : ""}>MegaMafia</span>
                        <span
                            className={`text-xs px-1.5 py-0.5 rounded-md ${
                                showMegaMafiaOnly
                                    ? "bg-white/20"
                                    : "bg-indigo-50 dark:bg-white/10 text-indigo-600 dark:text-indigo-400"
                            }`}
                        >
                            {getMegaMafiaCount()}
                        </span>
                    </div>
                </button>

                {/* Native Filter */}
                <button
                    onClick={() => {
                        setShowNativeOnly(!showNativeOnly)
                        setShowMegaMafiaOnly(false)
                        setShowMyVotesOnly(false)
                    }}
                    className={`group relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        showNativeOnly
                            ? "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg ring-1 ring-white/20"
                            : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10"
                    }`}
                >
                    <div className="relative flex items-center gap-2">
                        {showNativeOnly && (
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent)] rounded-lg"></div>
                        )}
                        <svg
                            className={`w-4 h-4 ${
                                showNativeOnly
                                    ? "text-white"
                                    : "text-emerald-600 dark:text-emerald-400"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        <span className={showNativeOnly ? "font-semibold" : ""}>Native</span>
                        <span
                            className={`text-xs px-1.5 py-0.5 rounded-md ${
                                showNativeOnly
                                    ? "bg-white/20"
                                    : "bg-emerald-50 dark:bg-white/10 text-emerald-600 dark:text-emerald-400"
                            }`}
                        >
                            {getNativeCount()}
                        </span>
                    </div>
                </button>

                <button
                    onClick={() => {
                        setShowMyVotesOnly(!showMyVotesOnly)
                        setShowMegaMafiaOnly(false)
                        setShowNativeOnly(false)
                    }}
                    className={`group relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        showMyVotesOnly
                            ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg ring-1 ring-white/20"
                            : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-blue-50/50 dark:hover:bg-blue-500/10"
                    }`}
                >
                    <div className="relative flex items-center gap-2">
                        {showMyVotesOnly && (
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent)] rounded-lg"></div>
                        )}
                        <svg
                            className={`w-4 h-4 ${
                                showMyVotesOnly ? "text-white" : "text-blue-600 dark:text-blue-400"
                            }`}
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

                        <span className={showMyVotesOnly ? "font-semibold" : ""}>MyVote</span>
                        <span
                            className={`text-xs px-1.5 py-0.5 rounded-md ${
                                showMyVotesOnly
                                    ? "bg-white/20"
                                    : "bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-blue-400"
                            }`}
                        >
                            {getUserVotedCount()}
                        </span>
                    </div>
                </button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`group relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === null
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
                            : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                    }`}
                >
                    <div className="relative flex items-center gap-2">
                        <span>All</span>
                        <span
                            className={`text-xs px-1.5 py-0.5 rounded-md ${
                                selectedCategory === null
                                    ? "bg-white/20"
                                    : "bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-blue-400"
                            }`}
                        >
                            {showMegaMafiaOnly
                                ? getMegaMafiaCount()
                                : showNativeOnly
                                ? getNativeCount()
                                : showMyVotesOnly
                                ? getUserVotedCount()
                                : totalProjects}
                        </span>
                    </div>
                </button>

                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`group relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedCategory === category
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
                                : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                        }`}
                    >
                        <div className="relative flex items-center gap-2">
                            <span>{category}</span>
                            <span
                                className={`text-xs px-1.5 py-0.5 rounded-md ${
                                    selectedCategory === category
                                        ? "bg-white/20"
                                        : "bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-blue-400"
                                }`}
                            >
                                {getCategoryCount(
                                    category,
                                    showMegaMafiaOnly,
                                    showNativeOnly,
                                    showMyVotesOnly,
                                )}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
