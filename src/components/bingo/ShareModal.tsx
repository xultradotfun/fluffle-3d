import { Dialog } from "@headlessui/react";
import { Share2, X, Twitter, ClipboardCopy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: () => void;
  previewRef: React.RefObject<HTMLDivElement>;
  completedCount: number;
  totalTasks: number;
  completedLines: number;
}

export function ShareModal({
  isOpen,
  onClose,
  onShare,
  previewRef,
  completedCount,
  totalTasks,
  completedLines,
}: ShareModalProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const getShareText = () => {
    const percentage = Math.round((completedCount / totalTasks) * 100);
    let text = `${completedCount}/${totalTasks} tasks completed (${percentage}%) on @megaeth_labs Community Bingo!`;

    if (completedLines > 0) {
      text += `\n${completedLines} bingo line${
        completedLines > 1 ? "s" : ""
      } completed ⭐`;
    }

    if (percentage === 100) {
      text += "\nFULL COMPLETION! 🎉";
    } else if (percentage >= 75) {
      text += "\nAlmost there! 🔥";
    } else if (percentage >= 50) {
      text += "\nHalfway there!";
    }

    text += "\n\nGet your own bingo card at fluffle.tools/#bingo";
    return text;
  };

  const handleTwitterShare = () => {
    const tweetText = getShareText();
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;
    window.open(tweetUrl, "_blank", "width=550,height=420");
  };

  const handleCopy = async () => {
    try {
      await onShare();
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          open={isOpen}
          onClose={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <Dialog.Panel
            as={motion.div}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex-shrink-0">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                Share Your Progress
              </Dialog.Title>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-black/20">
                  <div ref={previewRef} className="w-full" />
                </div>

                {/* Instructions */}
                <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    How to Share
                  </h3>
                  <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium">
                        1
                      </span>
                      <p>
                        Click "Copy to Clipboard" to save your bingo card image
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium">
                        2
                      </span>
                      <p>Click "Share on Twitter" to open a pre-filled tweet</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium">
                        3
                      </span>
                      <p>
                        Paste your bingo card image into the tweet and share!
                      </p>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Footer with Buttons */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
              <button
                onClick={handleTwitterShare}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1DA1F2] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a8cd8] transition-colors"
              >
                <Twitter className="h-4 w-4" />
                Share on Twitter
              </button>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 transition-colors"
              >
                {hasCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ClipboardCopy className="h-4 w-4" />
                )}
                {hasCopied ? "Copied!" : "Copy to Clipboard"}
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
