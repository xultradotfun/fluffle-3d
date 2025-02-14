import { ButtonHTMLAttributes } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "relative overflow-hidden rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary hover:bg-primary/90 text-primary-foreground before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-[1.5s]",
    secondary:
      "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-[1.5s]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const spinnerSizes = {
    sm: "sm",
    md: "md",
    lg: "lg",
  } as const;

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      <span
        className={`flex items-center justify-center gap-2 ${
          isLoading ? "opacity-0" : ""
        }`}
      >
        {children}
      </span>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner
            variant={variant === "primary" ? "white" : "primary"}
            size={spinnerSizes[size]}
          />
        </div>
      )}
    </button>
  );
}
