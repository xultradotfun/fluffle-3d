interface ProjectLinksProps {
  website?: string;
  discord?: string;
  telegram?: string;
}

export function ProjectLinks({
  website,
  discord,
  telegram,
}: ProjectLinksProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all group/link"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover/link:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          <span>Website</span>
        </a>
      )}
      {discord && (
        <a
          href={discord}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-[#5865F2]/5 hover:bg-[#5865F2]/10 text-[#5865F2] hover:text-[#5865F2] border border-[#5865F2]/20 hover:border-[#5865F2]/30 transition-all group/link"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover/link:scale-110"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
          <span>Discord</span>
        </a>
      )}
      {telegram && (
        <a
          href={telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-[#229ED9]/5 hover:bg-[#229ED9]/10 text-[#229ED9] hover:text-[#229ED9] border border-[#229ED9]/20 hover:border-[#229ED9]/30 transition-all group/link"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover/link:scale-110"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M22.265 2.428a2.048 2.048 0 0 0-2.078-.324L2.266 9.339a2.043 2.043 0 0 0-.104 3.818l3.625 1.261c.215.074.445.075.66 0l6.73-2.345-5.379 3.205a1.058 1.058 0 0 0-.463.901v3.182c0 .89 1.037 1.375 1.725.808l2.274-1.864 3.038 1.057a2.039 2.039 0 0 0 2.44-.974l5.99-11.772a2.048 2.048 0 0 0-.537-2.188z" />
          </svg>
          <span>Telegram</span>
        </a>
      )}
    </div>
  );
}
