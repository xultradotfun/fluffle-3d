"use client";

import { useState, useCallback } from "react";
import { IconButton, type IconButtonProps } from "./IconButton";
import { cn } from "@/lib/utils";

// Icons
const CopyIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="square"
      strokeLinejoin="miter"
      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
    />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
  >
    <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="square"
      strokeLinejoin="miter"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

export interface CopyButtonProps extends Omit<IconButtonProps, "children"> {
  /** Text or value to copy to clipboard */
  value: string;
  /** Duration to show success state in ms */
  successDuration?: number;
  /** Callback when copy succeeds */
  onCopySuccess?: () => void;
  /** Callback when copy fails */
  onCopyError?: (error: Error) => void;
  /** Icon size class */
  iconClassName?: string;
}

/**
 * CopyButton - A button that copies text to clipboard with visual feedback.
 *
 * @example
 * <CopyButton value={address} variant="pink" />
 */
export function CopyButton({
  value,
  successDuration = 2000,
  onCopySuccess,
  onCopyError,
  iconClassName = "w-5 h-5",
  title,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopySuccess?.();
      setTimeout(() => setCopied(false), successDuration);
    } catch (err) {
      onCopyError?.(err instanceof Error ? err : new Error("Failed to copy"));
    }
  }, [value, successDuration, onCopySuccess, onCopyError]);

  return (
    <IconButton
      onClick={handleCopy}
      title={title ?? (copied ? "Copied!" : "Copy to clipboard")}
      variant="pink"
      {...props}
    >
      {copied ? (
        <CheckIcon className={iconClassName} />
      ) : (
        <CopyIcon className={iconClassName} />
      )}
    </IconButton>
  );
}

export interface DownloadButtonProps extends Omit<IconButtonProps, "children"> {
  /** Icon size class */
  iconClassName?: string;
}

/**
 * DownloadButton - A styled download button.
 *
 * @example
 * <DownloadButton onClick={handleDownload} variant="green" />
 */
export function DownloadButton({
  iconClassName = "w-5 h-5",
  title = "Download",
  ...props
}: DownloadButtonProps) {
  return (
    <IconButton title={title} variant="green" {...props}>
      <DownloadIcon className={iconClassName} />
    </IconButton>
  );
}

// Export icons for reuse
export { CopyIcon, CheckIcon, DownloadIcon };
