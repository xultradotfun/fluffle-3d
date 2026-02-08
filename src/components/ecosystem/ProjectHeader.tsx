import Image from "next/image";
import { FlaskConical } from "lucide-react";
import { memo } from "react";

import { getProjectImage } from "@/utils/projectUtils";
import type { Project } from "@/types/ecosystem";

interface ProjectHeaderProps {
  name: string;
  twitter: string;
  category: string;
  megaMafia: boolean;
  live: boolean;
  featured?: boolean;
  img?: string;
}

function ProjectHeaderComponent(props: ProjectHeaderProps) {
  return (
    <div className="flex items-start gap-4 mb-6">
      {/* Logo with 3-layer border */}
      <div
        className="w-16 h-16 flex-shrink-0"
        style={{
          clipPath:
            "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
        }}
      >
        <div style={{ backgroundColor: "#fff", padding: "2px", height: "100%" }}>
          <div
            style={{
              clipPath:
                "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
              height: "100%",
            }}
          >
            <Image
              src={getProjectImage({ ...props, img: props.img || undefined } as Project)}
              alt={`${props.name} Logo`}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              priority={false}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Name and Badges */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <h3 className="text-2xl font-black uppercase truncate text-white">
              {props.name}
            </h3>
            {props.megaMafia && (
                  <Image
                src="/ui/pixelmafia.png"
                    alt="MegaMafia"
                    title="MegaMafia Project"
                width={16}
                height={16}
                className="w-4 h-4 object-contain"
                style={{
                  filter: 'brightness(0) invert(1)',
                }}
                    priority={false}
                  />
            )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-2 py-1 border-2 border-white bg-foreground text-white text-xs font-black uppercase">
            {props.category}
          </span>
          <a
            href={`https://x.com/${props.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 border-2 border-white bg-transparent hover:bg-pink text-white text-xs font-bold uppercase"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>@{props.twitter}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export const ProjectHeader = memo(ProjectHeaderComponent);
