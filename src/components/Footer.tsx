export function Footer() {
  return (
    <footer className="border-t-4 border-foreground bg-background mt-16 pb-24 lg:pb-6">
      <div className="container mx-auto px-8 py-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
          <div className="editorial-section">
            <h3 className="font-black uppercase tracking-wider text-lg mb-4">
              Fluffle Tools
            </h3>
            <p className="text-muted-foreground max-w-md">
              Utilities for MegaETH explorers and Fluffle holders. Open source and community-driven.
            </p>
          </div>
          
          <div className="flex items-center space-x-8">
            <a
              href="https://github.com/xultradotfun/fluffle-3d"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium uppercase tracking-wide text-sm hover:opacity-70 transition-opacity"
            >
              GitHub
            </a>
            <a
              href="https://opensea.io/collection/megaeth-nft-1"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium uppercase tracking-wide text-sm hover:opacity-70 transition-opacity"
            >
              Collection
            </a>
            <a
              href="https://x.com/intent/follow?screen_name=0x_ultra"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium uppercase tracking-wide text-sm hover:opacity-70 transition-opacity"
            >
              Twitter
            </a>
          </div>
        </div>
        
        <div className="editorial-line mt-8"></div>
        
        <div className="flex items-center justify-between mt-6 text-sm text-muted-foreground">
          <p>© 2024 Fluffle Tools</p>
          <p className="font-medium">Built for the MegaETH community</p>
        </div>
      </div>
    </footer>
  );
}
