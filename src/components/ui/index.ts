// Design System Components
// ========================

// Colors - Centralized color system
export { colors, c, getColor, getGray, hexToRgba, colorCombos } from "@/lib/colors";
export type { ColorKey, GrayKey } from "@/lib/colors";

// Bordered Box - 3-layer brutalist border pattern
export {
  BorderedBox,
  BorderedIcon,
  getClipPath,
  bgColors,
  borderColors,
  type BorderedBoxProps,
  type BorderedIconProps,
} from "./BorderedBox";

// Button - Extended with brutalist variants
export { Button, buttonVariants } from "./Button";

// Icon Button - For icon-only actions
export { IconButton, type IconButtonProps } from "./IconButton";

// Copy/Download Buttons - Action buttons with built-in functionality
export {
  CopyButton,
  DownloadButton,
  CopyIcon,
  CheckIcon,
  DownloadIcon,
  type CopyButtonProps,
  type DownloadButtonProps,
} from "./CopyButton";

// Other UI Components
export { Badge } from "./Badge";
export { Card } from "./Card";
export { Input } from "./Input";
export { LoadingSpinner } from "./LoadingSpinner";
export { default as CountUp } from "./CountUp";
