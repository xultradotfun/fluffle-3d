import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ViewSwitcherProps {
  activeView:
    | "viewer"
    | "analytics"
    | "pfp"
    | "ecosystem"
    | "testnet"
    | "build"
    | "builder"
    | "guides"
    | "bingo"
    | "mints";
  onViewChange: (
    view:
      | "viewer"
      | "analytics"
      | "pfp"
      | "ecosystem"
      | "testnet"
      | "build"
      | "builder"
      | "guides"
      | "bingo"
      | "mints"
  ) => void;
}

export function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const sections = [
    { id: 'ecosystem', label: 'Ecosystem', description: 'Community projects and tools', new: false },
    { id: 'testnet', label: 'Testnet', description: 'MegaETH testnet resources', new: true },
    { id: 'mints', label: 'NFT Mints', description: 'Latest mint opportunities', new: true },
    { id: 'guides', label: 'Guides', description: 'Step-by-step tutorials', new: true },
    { id: 'bingo', label: 'Bingo', description: 'Community challenges', new: true },
    { id: 'build', label: 'Build', description: 'Developer resources', new: false },
    { id: 'viewer', label: '3D Viewer', description: 'View your NFTs in 3D', new: false },
    { id: 'analytics', label: 'Rarities', description: 'Trait rarity analysis', new: false },
    { id: 'pfp', label: 'PFP Generator', description: 'Generate profile pictures', new: false },
    { id: 'builder', label: 'Fluffle Builder', description: 'Create custom Fluffles', new: false },
  ];

  return (
    <>
      {/* Editorial Navigation - Desktop */}
      <nav className="hidden lg:block border-t-4 border-foreground bg-background">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-editorial-medium">
              EXPLORE
            </h2>
            <div className="editorial-line flex-1 mx-8"></div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  if (section.id === 'guides') {
                    router.push('/explore');
                  } else if (section.id === 'mints') {
                    router.push('/mints');
                  } else {
                    onViewChange(section.id as any);
                  }
                }}
                className={`group relative text-left p-4 border-2 transition-all duration-200 ${
                  activeView === section.id
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground border-foreground hover:bg-foreground hover:text-background"
                }`}
              >
                {section.new && (
                  <div className="absolute -top-2 -right-2 bg-foreground text-background text-xs font-bold px-2 py-1">
                    NEW
                  </div>
                )}
                <div className="mb-2">
                  <h3 className="font-black uppercase tracking-wide text-sm">
                    {section.label}
                  </h3>
                </div>
                <p className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">
                  {section.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t-4 border-foreground">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-full btn-brutalist text-center"
          >
            Explore Tools
          </button>
        </div>
      </div>

      {/* Mobile Menu Modal */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/95">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-editorial-medium">EXPLORE</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-foreground hover:text-background transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="grid gap-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    if (section.id === 'guides') {
                      router.push('/explore');
                    } else if (section.id === 'mints') {
                      router.push('/mints');
                    } else {
                      onViewChange(section.id as any);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left p-6 border-2 transition-all duration-200 ${
                    activeView === section.id
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-foreground hover:bg-foreground hover:text-background"
                  }`}
                >
                  {section.new && (
                    <div className="inline-block bg-foreground text-background text-xs font-bold px-2 py-1 mb-2">
                      NEW
                    </div>
                  )}
                  <h3 className="font-black uppercase tracking-wide text-lg mb-2">
                    {section.label}
                  </h3>
                  <p className="text-sm opacity-70">
                    {section.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
