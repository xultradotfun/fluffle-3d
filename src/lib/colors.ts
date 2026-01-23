/**
 * Centralized color system for the Fluffle Tools design system.
 *
 * These colors match the Tailwind config in tailwind.config.ts.
 * Use these constants for:
 * - Inline styles where Tailwind classes aren't practical
 * - Dynamic color calculations
 * - SVG fills/strokes
 * - Canvas/chart colors
 *
 * For static styles, prefer Tailwind classes:
 * - text-foreground, text-background, text-pink, text-green
 * - bg-foreground, bg-background, bg-pink, bg-green
 * - border-foreground, border-background, border-pink, border-green
 */

// Core palette
export const colors = {
  // Primary colors
  foreground: "#19191a",
  background: "#dfd9d9",

  // Accent colors
  pink: "#f380cd",
  green: "#058d5e",
  red: "#b21840",

  // Semantic colors
  accent: "#f380cd",
  secondary: "#058d5e",
  destructive: "#b21840",

  // Status colors
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  info: "#2196f3",

  // Neutrals
  white: "#ffffff",
  black: "#000000",
  muted: "#666666",
  mutedLight: "#999999",
  light: "#e0e0e0",
  border: "#333333",

  // Social media brand colors
  twitter: "#1DA1F2",
  discord: "#5865F2",
  telegram: "#229ED9",

  // Gray scale (matching Tailwind config)
  gray: {
    50: "#ebe8e8",
    100: "#e1dede",
    200: "#dfd9d8",
    300: "#999999",
    400: "#848484",
    500: "#666666",
    600: "#555555",
    700: "#444444",
    800: "#19191a",
    900: "#19191a",
  },
} as const;

// Shorthand aliases for common use cases
export const c = colors;

// Type for color keys
export type ColorKey = keyof typeof colors;
export type GrayKey = keyof typeof colors.gray;

/**
 * Get a color value by key with optional alpha
 * @example getColor('pink') // "#f380cd"
 * @example getColor('pink', 0.5) // "rgba(243, 128, 205, 0.5)"
 */
export function getColor(key: ColorKey, alpha?: number): string {
  const color = colors[key];
  if (typeof color === 'object') {
    throw new Error(`Cannot get color for nested key: ${key}`);
  }

  if (alpha !== undefined) {
    return hexToRgba(color, alpha);
  }
  return color;
}

/**
 * Get a gray color value
 * @example getGray(500) // "#666666"
 */
export function getGray(shade: GrayKey): string {
  return colors.gray[shade];
}

/**
 * Convert hex color to rgba
 * @example hexToRgba("#f380cd", 0.5) // "rgba(243, 128, 205, 0.5)"
 */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Common color combinations used throughout the app
 */
export const colorCombos = {
  // Text on dark background
  lightOnDark: {
    color: colors.background,
    backgroundColor: colors.foreground,
  },
  // Text on light background
  darkOnLight: {
    color: colors.foreground,
    backgroundColor: colors.background,
  },
  // Pink accent button
  pinkButton: {
    color: colors.foreground,
    backgroundColor: colors.pink,
  },
  // Green accent button
  greenButton: {
    color: colors.foreground,
    backgroundColor: colors.green,
  },
  // Status boxes
  successBox: {
    borderColor: colors.success,
    backgroundColor: colors.foreground,
    color: colors.background,
  },
  warningBox: {
    borderColor: colors.warning,
    backgroundColor: colors.foreground,
    color: colors.background,
  },
  errorBox: {
    borderColor: colors.error,
    backgroundColor: colors.foreground,
    color: colors.background,
  },
} as const;

// Default export for convenience
export default colors;
