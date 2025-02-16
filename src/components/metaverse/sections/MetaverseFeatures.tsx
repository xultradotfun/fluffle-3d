interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  borderHoverColor: string;
  iconColor: string;
}

function FeatureCard({
  title,
  description,
  icon,
  gradientFrom,
  gradientTo,
  borderHoverColor,
  iconColor,
}: FeatureCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 hover:border-${borderHoverColor}/30 dark:hover:border-${borderHoverColor}/20 transition-all shadow-sm`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br from-${gradientFrom}-50/50 to-${gradientTo}-50/50 dark:from-${gradientFrom}-500/[0.08] dark:to-${gradientTo}-500/[0.05]`}
      />
      <div
        className={`absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(${iconColor},0.08),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(${iconColor},0.05),transparent)]`}
      />
      <div className="relative p-4">
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${gradientFrom}-50 to-${gradientTo}-50 dark:from-${gradientFrom}-500/20 dark:to-${gradientTo}-500/20 border border-${gradientFrom}-100 dark:border-${gradientFrom}-500/20 p-2 mb-3 shadow-sm group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export function MetaverseFeatures() {
  const features = [
    {
      title: "Play Mini-Games",
      description:
        "Challenge other Fluffles in exciting mini-games and compete for the top spot on the leaderboard.",
      icon: (
        <svg
          className="w-full h-full text-pink-600 dark:text-pink-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      gradientFrom: "pink",
      gradientTo: "purple",
      borderHoverColor: "pink",
      iconColor: "236,72,153",
    },
    {
      title: "Meet Friends",
      description:
        "Join the vibrant Fluffle community in immersive 3D spaces and make lasting connections.",
      icon: (
        <svg
          className="w-full h-full text-purple-600 dark:text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      gradientFrom: "purple",
      gradientTo: "indigo",
      borderHoverColor: "purple",
      iconColor: "147,51,234",
    },
    {
      title: "Explore Worlds",
      description:
        "Discover breathtaking 3D environments and embark on adventures with your Fluffle.",
      icon: (
        <svg
          className="w-full h-full text-blue-600 dark:text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      gradientFrom: "blue",
      gradientTo: "indigo",
      borderHoverColor: "blue",
      iconColor: "59,130,246",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
      {features.map((feature) => (
        <FeatureCard key={feature.title} {...feature} />
      ))}
    </div>
  );
}
