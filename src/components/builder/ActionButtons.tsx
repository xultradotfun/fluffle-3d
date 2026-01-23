import { Button } from "@/components/ui/Button";
import { BorderedBox } from "@/components/ui/BorderedBox";
import { IconButton } from "@/components/ui/IconButton";

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
      <Button
        variant="pink"
        onClick={onRandomize}
        className="flex-1 px-4 py-3 text-sm"
      >
        Randomize
      </Button>

      {/* Icon buttons container with 3-layer border */}
      <BorderedBox cornerSize={8} className="p-1.5">
        <div className="flex items-center gap-2">
          <IconButton
            variant="pink"
            onClick={onCopy}
            title={isCopied ? "Copied!" : "Copy to clipboard"}
          >
            {isCopied ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
          </IconButton>

          <IconButton
            variant="green"
            onClick={onDownload}
            title="Download"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </IconButton>
        </div>
      </BorderedBox>
    </div>
  );
}
