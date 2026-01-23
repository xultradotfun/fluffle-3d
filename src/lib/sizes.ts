/**
 * Centralized sizing system for the Fluffle Tools design system.
 *
 * Corner sizes are used for clip-path polygons throughout the app.
 * These create the brutalist angled corner aesthetic.
 */

// Corner sizes for clip-path polygons (in pixels)
export const cornerSizes = {
  xs: 4,   // Small elements: icon badges, tiny buttons
  sm: 6,   // Inputs, small buttons
  md: 8,   // Medium elements, token buttons
  lg: 12,  // Cards, sections (most common)
  xl: 16,  // Large containers, preview boxes
  "2xl": 20, // Main containers, outer wrappers
  "3xl": 24, // Hero sections, major containers
} as const;

export type CornerSize = keyof typeof cornerSizes;

// Border thickness presets
export const borderWidths = {
  thin: 1,
  default: 2,
  medium: 3,
  thick: 4,
} as const;

export type BorderWidth = keyof typeof borderWidths;

// Spacing presets (matches Tailwind's spacing scale)
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

/**
 * Generate a clip-path polygon for the brutalist angled corner style.
 * Creates a polygon with cut corners at top-left and bottom-right.
 *
 * @param size - Corner size in pixels or a preset name
 * @returns CSS clip-path polygon string
 *
 * @example
 * // Using pixel value
 * getClipPath(12) // "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)"
 *
 * @example
 * // Using preset name
 * getClipPath("lg") // Same as getClipPath(12)
 */
export function getClipPath(size: number | CornerSize): string {
  const px = typeof size === "number" ? size : cornerSizes[size];
  return `polygon(${px}px 0, 100% 0, 100% calc(100% - ${px}px), calc(100% - ${px}px) 100%, 0 100%, 0 ${px}px)`;
}

/**
 * Generate a clip-path for elements with only top-left corner cut.
 * Useful for headers or elements at the top of a container.
 */
export function getClipPathTopLeft(size: number | CornerSize): string {
  const px = typeof size === "number" ? size : cornerSizes[size];
  return `polygon(${px}px 0, 100% 0, 100% 100%, 0 100%, 0 ${px}px)`;
}

/**
 * Generate a clip-path for elements with only bottom-right corner cut.
 * Useful for footers or elements at the bottom of a container.
 */
export function getClipPathBottomRight(size: number | CornerSize): string {
  const px = typeof size === "number" ? size : cornerSizes[size];
  return `polygon(0 0, 100% 0, 100% calc(100% - ${px}px), calc(100% - ${px}px) 100%, 0 100%)`;
}

/**
 * Generate a clip-path with custom corner configuration.
 * Allows specifying which corners to cut.
 */
export function getClipPathCustom(
  size: number | CornerSize,
  corners: { topLeft?: boolean; topRight?: boolean; bottomLeft?: boolean; bottomRight?: boolean }
): string {
  const px = typeof size === "number" ? size : cornerSizes[size];
  const { topLeft = true, topRight = false, bottomLeft = false, bottomRight = true } = corners;

  // Build polygon points clockwise from top-left
  const points: string[] = [];

  // Top-left corner
  if (topLeft) {
    points.push(`${px}px 0`);
  } else {
    points.push("0 0");
  }

  // Top-right corner
  if (topRight) {
    points.push(`calc(100% - ${px}px) 0`);
    points.push(`100% ${px}px`);
  } else {
    points.push("100% 0");
  }

  // Bottom-right corner
  if (bottomRight) {
    points.push(`100% calc(100% - ${px}px)`);
    points.push(`calc(100% - ${px}px) 100%`);
  } else {
    points.push("100% 100%");
  }

  // Bottom-left corner
  if (bottomLeft) {
    points.push(`${px}px 100%`);
    points.push(`0 calc(100% - ${px}px)`);
  } else {
    points.push("0 100%");
  }

  // Close back to top-left
  if (topLeft) {
    points.push(`0 ${px}px`);
  }

  return `polygon(${points.join(", ")})`;
}

// Shorthand alias
export const s = cornerSizes;

// Default export for convenience
export default cornerSizes;
