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
        className="flex-1 px-4 py-3 bg-pink text-foreground border-3 border-foreground hover:bg-foreground hover:text-background transition-colors font-black uppercase text-sm"
        style={{
          clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
        }}
      >
        Randomize
      </button>
      {/* Icon buttons container with 3-layer border */}
      <div
        style={{
          clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
        }}
      >
        <div style={{ backgroundColor: "#dfd9d9", padding: "2px" }}>
          <div
            className="p-1.5"
            style={{
              backgroundColor: "#19191a",
              clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            }}
          >
            <div className="flex items-center gap-2">
        <button
          onClick={onCopy}
                className="flex items-center justify-center w-10 h-10 border-2 border-background bg-transparent hover:bg-pink transition-colors relative group"
          title="Copy to clipboard"
                style={{
                  color: "#dfd9d9",
                  clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                }}
        >
          {isCopied ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
                    strokeWidth={2.5}
            >
              <path
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
                    strokeWidth={2.5}
            >
              <path
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
          )}
                <div
                  className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                  style={{
                    clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                  }}
                >
                  <div style={{ backgroundColor: "#dfd9d9", padding: "2px" }}>
                    <div
                      className="px-2 py-1 text-xs font-bold uppercase"
                      style={{
                        backgroundColor: "#19191a",
                        color: "#dfd9d9",
                        clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                      }}
                    >
                      {isCopied ? "Copied!" : "Copy"}
                    </div>
                  </div>
                </div>
        </button>
        <button
          onClick={onDownload}
                className="flex items-center justify-center w-10 h-10 border-2 border-background bg-transparent hover:bg-green transition-colors relative group"
          title="Download"
                style={{
                  color: "#dfd9d9",
                  clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
                  strokeWidth={2.5}
          >
            <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
                <div
                  className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                  }}
                >
                  <div style={{ backgroundColor: "#dfd9d9", padding: "2px" }}>
                    <div
                      className="px-2 py-1 text-xs font-bold uppercase"
                      style={{
                        backgroundColor: "#19191a",
                        color: "#dfd9d9",
                        clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                      }}
                    >
            Download
                    </div>
                  </div>
                </div>
        </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
