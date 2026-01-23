"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { getClipPath } from "./BorderedBox";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 active:from-blue-700 active:to-purple-700 disabled:from-gray-500 disabled:to-gray-600",
        secondary:
          "rounded-lg bg-gradient-to-r from-gray-50 to-white text-gray-700 hover:from-gray-100 hover:to-gray-50 active:from-gray-200 active:to-gray-100 border border-gray-200",
        destructive:
          "rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600",
        outline:
          "rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5",
        ghost: "rounded-lg hover:bg-white/5 hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
        // Brutalist variants (no rounded corners, use clip-path)
        pink: "bg-pink text-foreground border-3 border-foreground hover:bg-foreground hover:text-background font-black uppercase",
        green: "bg-green text-foreground border-3 border-foreground hover:bg-foreground hover:text-background font-black uppercase",
        brutalist:
          "bg-transparent text-foreground border-3 border-foreground hover:bg-pink font-black uppercase",
        "brutalist-active":
          "bg-pink text-foreground border-3 border-foreground font-black uppercase",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  /** Corner cut size for brutalist variants (0 for no cut) */
  cornerSize?: number;
}

const brutalistVariants = ["pink", "green", "brutalist", "brutalist-active"];

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isLoading = false,
      cornerSize = 8,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isBrutalist = brutalistVariants.includes(variant as string);
    const clipPath = isBrutalist && cornerSize > 0 ? getClipPath(cornerSize) : undefined;

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isLoading || props.disabled}
        style={{
          clipPath,
          ...style,
        }}
        {...props}
      >
        {isLoading ? <LoadingSpinner className="w-4 h-4" /> : children}
      </button>
    );
  }
);

Button.displayName = "Button";

// Export variants for external use
export { buttonVariants };
