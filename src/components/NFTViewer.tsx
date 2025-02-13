export function NFTViewer({ id, urls, traits, onRemove }: NFTViewerProps) {
  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-xl">
      {onRemove && (
        <button
          onClick={() => onRemove(id)}
          className="absolute -top-2 -right-2 z-20 w-8 h-8 flex items-center justify-center bg-destructive hover:bg-destructive/90 text-destructive-foreground text-lg rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
          title="Remove NFT"
        >
          ×
        </button>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">NFT #{id}</h2>
          <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20">
            VRM Model
          </span>
        </div>
        <div className="relative bg-background rounded-xl overflow-hidden shadow-inner">
          <VRMViewer modelUrls={urls} />
        </div>
        <NFTTraits id={id} traits={traits} />
      </div>
    </div>
  );
}
