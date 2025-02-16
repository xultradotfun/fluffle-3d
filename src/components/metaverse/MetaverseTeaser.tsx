import { MetaverseHeader } from "./sections/MetaverseHeader";
import { MetaversePreview } from "./sections/MetaversePreview";
import { MetaverseFeatures } from "./sections/MetaverseFeatures";

export function MetaverseTeaser() {
  return (
    <div className="space-y-12 animate-fade-in">
      <MetaverseHeader />
      <MetaversePreview />
      <MetaverseFeatures />
    </div>
  );
}
