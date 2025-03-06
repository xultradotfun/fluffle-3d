"use client";

import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30",
        secondary:
          "bg-gradient-to-r from-white/10 to-white/5 text-gray-400 border border-white/10",
        destructive:
          "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30",
        outline: "text-foreground border border-white/10",
      },
      size: {
        default: "px-4 py-1.5 text-sm",
        sm: "px-2.5 py-0.5 text-xs",
        md: "px-6 py-2 text-base",
        lg: "px-8 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}
