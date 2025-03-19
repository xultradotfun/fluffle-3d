import Image from "next/image";
import { FlaskConical } from "lucide-react";

interface ProjectHeaderProps {
  name: string;
  twitter: string;
  category: string;
  megaMafia: boolean;
  testnet: boolean;
}

export function ProjectHeader({
  name,
  twitter,
  category,
  megaMafia,
  testnet,
}: ProjectHeaderProps) {
  return (
    <div className="flex items-start gap-4 mb-6">
      {/* Logo */}
      <div className="relative w-14 h-14 flex-shrink-0">
        <Image
          src={`/avatars/${twitter}.jpg`}
          alt={`${name} Logo`}
          width={56}
          height={56}
          className="rounded-xl bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 group-hover:ring-blue-500/30 dark:group-hover:ring-blue-500/30 transition-all object-cover"
          priority={false}
          loading="lazy"
        />
      </div>

      {/* Name and Badges */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {name}
            </h3>
            {megaMafia && (
              <div className="relative flex-shrink-0">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-sm ring-1 ring-white/20 group-hover:scale-110 transition-transform">
                  <Image
                    src="/icons/logo-02.png"
                    alt="MegaMafia"
                    title="MegaMafia Project"
                    width={20}
                    height={20}
                    className="w-full h-full object-contain brightness-0 invert"
                    priority={false}
                  />
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.3),transparent)] rounded-full blur-sm"></div>
              </div>
            )}
            {testnet && (
              <div className="relative flex-shrink-0">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 p-1 shadow-sm ring-1 ring-white/20 group-hover:scale-110 transition-transform">
                  <FlaskConical
                    className="w-full h-full text-white"
                    strokeWidth={2}
                  />
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.3),transparent)] rounded-full blur-sm"></div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
            {category}
          </span>
          <a
            href={`https://x.com/${twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>@{twitter}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
