"use client";

import { cn } from "@/lib/utils";
import { colors } from "@/lib/colors";
import { getClipPath, cornerSizes, type CornerSize } from "@/lib/sizes";
import { cva, type VariantProps } from "class-variance-authority";

const borderedBoxVariants = cva("", {
  variants: {
    variant: {
      default: "",
      card: "p-4 lg:p-6",
      compact: "p-2",
      tooltip: "p-4 max-w-[280px]",
    },
    bg: {
      dark: "",
      light: "",
      transparent: "",
    },
  },
  defaultVariants: {
    variant: "default",
    bg: "dark",
  },
});

// Color presets using centralized color system
const bgColors = {
  dark: colors.foreground,
  light: colors.light,
  transparent: "transparent",
  pink: colors.pink,
  green: colors.green,
  white: colors.white,
  foreground: colors.foreground,
  background: colors.background,
} as const;

const borderColors = {
  default: colors.background,
  dark: colors.foreground,
  pink: colors.pink,
  green: colors.green,
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
} as const;

export interface BorderedBoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof borderedBoxVariants> {
  /** Corner cut size - use preset name (xs, sm, md, lg, xl, 2xl, 3xl) or pixel value */
  cornerSize?: CornerSize | number;
  /** Border color - use preset name or custom hex */
  borderColor?: keyof typeof borderColors | string;
  /** Background color - use preset name or custom hex */
  bgColor?: keyof typeof bgColors | string;
  /** Border thickness in pixels */
  borderWidth?: number;
  /** Whether to render as a simple box without the 3-layer effect */
  simple?: boolean;
}

/**
 * BorderedBox - Reusable component for the brutalist 3-layer border pattern.
 *
 * Features:
 * - Configurable corner cut size
 * - Multiple background color presets
 * - Support for custom colors
 * - Simple mode for single-layer boxes
 *
 * @example
 * // Default dark box with corner cuts
 * <BorderedBox cornerSize={12}>Content</BorderedBox>
 *
 * @example
 * // Light background box
 * <BorderedBox cornerSize={8} bgColor="light">Content</BorderedBox>
 *
 * @example
 * // Simple single-layer box (no 3-layer effect)
 * <BorderedBox cornerSize={6} simple bgColor="pink">Content</BorderedBox>
 */
export function BorderedBox({
  children,
  className,
  variant,
  cornerSize = 12,
  borderColor = "default",
  bgColor = "dark",
  borderWidth = 2,
  simple = false,
  style,
  ...props
}: BorderedBoxProps) {
  const resolvedCornerSize = typeof cornerSize === "string" ? cornerSizes[cornerSize] : cornerSize;
  const clipPath = getClipPath(resolvedCornerSize);
  const resolvedBorderColor = borderColors[borderColor as keyof typeof borderColors] ?? borderColor;
  const resolvedBgColor = bgColors[bgColor as keyof typeof bgColors] ?? bgColor;

  // Simple mode - just one layer with clip-path
  if (simple) {
    return (
      <div
        className={cn(borderedBoxVariants({ variant }), className)}
        style={{
          backgroundColor: resolvedBgColor,
          clipPath,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }

  // Full 3-layer bordered box
  return (
    <div style={{ clipPath }}>
      <div
        style={{
          backgroundColor: resolvedBorderColor,
          padding: `${borderWidth}px`,
        }}
      >
        <div
          className={cn(borderedBoxVariants({ variant }), className)}
          style={{
            backgroundColor: resolvedBgColor,
            clipPath,
            ...style,
          }}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * BorderedIcon - A small bordered box designed for icons.
 * Commonly used in card headers.
 */
export interface BorderedIconProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Background color for the icon container */
  bgColor?: keyof typeof bgColors | string;
  /** Size of the icon container */
  size?: "sm" | "md" | "lg";
}

const iconSizes = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

export function BorderedIcon({
  children,
  className,
  bgColor = "green",
  size = "md",
  ...props
}: BorderedIconProps) {
  const resolvedBgColor = bgColors[bgColor as keyof typeof bgColors] ?? bgColor;

  return (
    <div style={{ clipPath: getClipPath("xs") }}>
      <div style={{ backgroundColor: colors.background, padding: "2px" }}>
        <div
          className={cn(
            iconSizes[size],
            "flex items-center justify-center",
            className
          )}
          style={{
            backgroundColor: resolvedBgColor,
            clipPath: getClipPath("xs"),
          }}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// Export utilities for custom usage
export { getClipPath, cornerSizes, bgColors, borderColors };
