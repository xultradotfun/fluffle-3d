"use client";

import { ButtonHTMLAttributes } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-background border-2 border-foreground hover:bg-transparent hover:text-foreground hover:shadow-[4px_4px_0_hsl(var(--foreground))] active:translate-x-1 active:translate-y-1 active:shadow-none",
        secondary:
          "bg-background text-foreground border-2 border-foreground hover:bg-foreground hover:text-background",
        destructive:
          "bg-red-600 text-white border-2 border-red-600 hover:bg-transparent hover:text-red-600 hover:shadow-[4px_4px_0_rgb(220,38,38)]",
        outline:
          "border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
        ghost: "hover:bg-foreground/10 text-foreground",
        link: "text-foreground underline-offset-4 hover:underline font-medium normal-case tracking-normal",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 py-2 text-xs",
        lg: "h-16 px-8 py-4 text-base",
        icon: "h-12 w-12",
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
}

export function Button({
  className,
  variant = "default",
  size = "default",
  isLoading = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <LoadingSpinner className="w-4 h-4" /> : children}
    </button>
  );
}
