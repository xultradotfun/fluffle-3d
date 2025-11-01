import { memo } from "react";

interface ProjectLinksProps {
  website?: string;
  discord?: string;
  telegram?: string;
  twitter?: string;
}

function ProjectLinksComponent({
  website,
  discord,
  telegram,
  twitter,
}: ProjectLinksProps) {
  return (
    <div>
      {/* Outer wrapper with clip-path only */}
      <div
        style={{
          clipPath:
            "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
        }}
      >
        {/* Middle border layer - light with padding */}
        <div style={{ backgroundColor: "#dfd9d9", padding: "2px" }}>
          {/* Inner content layer - dark with same clip-path */}
          <div
            className="p-1.5"
            style={{
              backgroundColor: "#19191a",
              clipPath:
                "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            }}
          >
            <div className="flex items-center gap-2">
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 border-2 border-background bg-transparent hover:bg-green transition-colors"
                  style={{
                    color: "#dfd9d9",
                    clipPath:
                      "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                  }}
          title="Website"
        >
          <svg
                    className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
                    strokeWidth={2.5}
          >
            <path
                      strokeLinecap="square"
                      strokeLinejoin="miter"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
        </a>
      )}
      {discord && (
        <a
          href={discord}
          target="_blank"
          rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 border-2 border-background bg-transparent hover:bg-[#5865F2] transition-colors"
                  style={{
                    color: "#dfd9d9",
                    clipPath:
                      "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                  }}
          title="Discord"
        >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        </a>
      )}
      {telegram && (
        <a
          href={telegram}
          target="_blank"
          rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 border-2 border-background bg-transparent hover:bg-[#229ED9] transition-colors"
                  style={{
                    color: "#dfd9d9",
                    clipPath:
                      "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                  }}
          title="Telegram"
        >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99432,2a10,10,0,1,0,10,10A9.99917,9.99917,0,0,0,11.99432,2Zm3.17951,15.15247a.70547.70547,0,0,1-1.002.3515l-2.71467-2.10938L9.71484,17.002a.29969.29969,0,0,1-.285.03894l.334-3.23242,5.90283-5.90283a.31193.31193,0,0,0-.37573-.49219L8.73438,12.552,5.69873,11.4502a.28978.28978,0,0,1,.00361-.54394l12.54718-4.8418a.29832.29832,0,0,1,.39844.41015Z" />
          </svg>
        </a>
      )}
              {twitter && (
        <a
                  href={`https://twitter.com/${twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 border-2 border-background bg-transparent hover:bg-pink transition-colors"
                  style={{
                    color: "#dfd9d9",
                    clipPath:
                      "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                  }}
                  title="Twitter"
        >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ProjectLinks = memo(ProjectLinksComponent);
