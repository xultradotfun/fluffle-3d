interface CardProps {
  children: React.ReactNode;
  className?: string;
  isInteractive?: boolean;
}

export function Card({
  children,
  className = "",
  isInteractive = false,
}: CardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#111] border border-white/10 ${
        isInteractive
          ? "transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div
      className={`absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent ${className}`}
    >
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
