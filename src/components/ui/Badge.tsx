interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  const variants = {
    default: "bg-white/[0.03] border-white/5 text-white",
    primary: "bg-blue-500/20 border-blue-500/30 text-blue-400",
    secondary: "bg-white/5 border-white/10 text-gray-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
