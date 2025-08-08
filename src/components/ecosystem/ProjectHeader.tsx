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
    <div className="border-b-2 border-foreground pb-4 mb-4">
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="w-16 h-16 flex-shrink-0 border-2 border-foreground">
          <Image
            src={`/avatars/${twitter}.jpg`}
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
          <div className="flex items-start gap-3 mb-3">
            <h3 className="text-xl font-black uppercase tracking-wide">
              {name}
            </h3>
            {megaMafia && (
              <div className="bg-foreground text-background text-xs font-bold px-2 py-1">
                MEGA MAFIA
              </div>
            )}
            {testnet && (
              <div className="bg-foreground text-background text-xs font-bold px-2 py-1">
                TESTNET
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium uppercase tracking-wide">
              {category}
            </span>
            <a
              href={`https://x.com/${twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:opacity-70 transition-opacity"
            >
              @{twitter}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
