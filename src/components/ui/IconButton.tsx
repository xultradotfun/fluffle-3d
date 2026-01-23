"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { colors } from "@/lib/colors";
import { cva, type VariantProps } from "class-variance-authority";
import { getClipPath } from "./BorderedBox";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "border-2 border-background bg-transparent hover:bg-pink",
        pink: "border-2 border-background bg-transparent hover:bg-pink",
        green: "border-2 border-background bg-transparent hover:bg-green",
        ghost: "hover:bg-white/10",
        solid: "bg-pink border-3 border-foreground hover:bg-foreground hover:text-background",
      },
      size: {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** Corner cut size in pixels (0 for no cut) */
  cornerSize?: number;
}

/**
 * IconButton - A button designed for icon-only actions.
 *
 * @example
 * <IconButton variant="pink" onClick={handleCopy}>
 *   <CopyIcon className="w-5 h-5" />
 * </IconButton>
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, cornerSize = 4, style, children, ...props }, ref) => {
    const clipPath = cornerSize > 0 ? getClipPath(cornerSize) : undefined;

    return (
      <button
        ref={ref}
        className={cn(iconButtonVariants({ variant, size }), className)}
        style={{
          color: colors.background,
          clipPath,
          ...style,
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
