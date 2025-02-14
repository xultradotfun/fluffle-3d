import { Badge } from "@/components/ui/Badge";

interface NFTBadgeProps {
  selectedId?: string;
}

export function NFTBadge({ selectedId }: NFTBadgeProps) {
  if (selectedId) {
    return (
      <Badge variant="default" size="md" className="animate-fade-in glow">
        NFT #{selectedId} Selected
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" size="md">
      No NFT Selected
    </Badge>
  );
}
