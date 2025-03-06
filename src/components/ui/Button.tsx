"use client";

import { ButtonHTMLAttributes } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 active:from-blue-700 active:to-purple-700 disabled:from-gray-500 disabled:to-gray-600",
        secondary:
          "bg-gradient-to-r from-gray-50 to-white dark:from-white/10 dark:to-white/5 text-gray-700 dark:text-white hover:from-gray-100 hover:to-gray-50 dark:hover:from-white/15 dark:hover:to-white/10 active:from-gray-200 active:to-gray-100 dark:active:from-white/20 dark:active:to-white/15 border border-gray-200 dark:border-white/10",
        destructive:
          "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600",
        outline:
          "border border-white/10 hover:border-white/20 hover:bg-white/5",
        ghost: "hover:bg-white/5 hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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
