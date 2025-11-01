import Image from "next/image";
import { FlaskConical } from "lucide-react";
import { memo } from "react";

interface ProjectHeaderProps {
  name: string;
  twitter: string;
  category: string;
  megaMafia: boolean;
  live: boolean;
  img?: string;
}

function ProjectHeaderComponent({
  name,
  twitter,
  category,
  megaMafia,
  live,
  img,
}: ProjectHeaderProps) {
  return (
    <div className="flex items-start gap-4 mb-6">
      {/* Logo */}
      <div className="w-16 h-16 flex-shrink-0 border-3 border-white bg-[#e0e0e0]">
        <Image
          src={img || `/avatars/${twitter}.jpg`}
          alt={`${name} Logo`}
          width={64}
          height={64}
          className="w-full h-full object-cover"
          priority={false}
          loading="lazy"
        />
      </div>

      {/* Name and Badges */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <h3 className="text-2xl font-black uppercase truncate text-white">
              {name}
            </h3>
            {megaMafia && (
            <div className="w-6 h-6 border-2 border-white bg-pink flex items-center justify-center">
                  <Image
                    src="/icons/logo-02.png"
                    alt="MegaMafia"
                    title="MegaMafia Project"
                width={16}
                height={16}
                className="w-4 h-4 object-contain"
                    priority={false}
                  />
              </div>
            )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-2 py-1 border-2 border-white bg-foreground text-white text-xs font-black uppercase">
            {category}
          </span>
          <a
            href={`https://x.com/${twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 border-2 border-white bg-transparent hover:bg-pink text-white text-xs font-bold uppercase"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>@{twitter}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export const ProjectHeader = memo(ProjectHeaderComponent);
