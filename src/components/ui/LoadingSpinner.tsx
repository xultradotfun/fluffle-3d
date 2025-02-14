interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "white";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  variant = "default",
  className = "",
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const variants = {
    default: "text-gray-400",
    primary: "text-blue-400",
    white: "text-white",
  };

  return (
    <div className="relative">
      <svg
        className={`animate-spin ${sizes[size]} ${variants[variant]} ${className}`}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <div className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-current opacity-20" />
    </div>
  );
}
