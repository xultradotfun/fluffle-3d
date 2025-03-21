interface ActionButtonsProps {
  onRandomize: () => void;
  onCopy: () => void;
  onDownload: () => void;
  isCopied: boolean;
}

export default function ActionButtons({
  onRandomize,
  onCopy,
  onDownload,
  isCopied,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={onRandomize}
        className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
      >
        Randomize
      </button>
      <div className="flex gap-3">
        <button
          onClick={onCopy}
          className="px-4 py-2.5 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors relative group"
          title="Copy to clipboard"
        >
          {isCopied ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
          )}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {isCopied ? "Copied!" : "Copy to clipboard"}
          </span>
        </button>
        <button
          onClick={onDownload}
          className="px-4 py-2.5 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors relative group"
          title="Download"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Download
          </span>
        </button>
      </div>
    </div>
  );
}
