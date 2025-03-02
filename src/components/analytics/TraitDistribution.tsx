import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { calculateTraitRarity, getRarityColor } from "@/utils/traitsAnalytics";
import type { ExtendedTraitCategory, ExtendedTraitMetadata } from "./types";

interface TraitDistributionProps {
  category: ExtendedTraitCategory;
}

export function TraitDistribution({ category }: TraitDistributionProps) {
  // Helper function to check if a category should show image previews
  const shouldShowImagePreview = (categoryName: string) => {
    return ["Ear", "Face", "Head", "Tribe", "Merch"].includes(categoryName);
  };

  const isMerchCategory = category.name === "Merch";
  const isTribeCategory = category.name === "Tribe";

  return (
    <Card className="lg:col-span-2 bg-card dark:bg-transparent border border-border dark:border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {category.name} {isMerchCategory ? "Items" : "Distribution"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isMerchCategory
                ? "Available wearables for your avatar"
                : category.name === "Tribe"
                ? "Optional item with 2 clothing variations per tribe"
                : category.isOptionalItem
                ? "Optional item with variations"
                : "Required trait with variants"}
            </p>
          </div>
          <Badge variant="secondary">
            {category.traits.length}{" "}
            {isMerchCategory
              ? "items"
              : category.isOptionalItem
              ? "variations"
              : "traits"}
          </Badge>
        </div>

        <div className="space-y-4">
          {(category.traits as ExtendedTraitMetadata[]).map((trait) => {
            const isNoItem = trait.value === "No Item";
            const rarity = calculateTraitRarity(trait);
            const rarityColor = getRarityColor(rarity);

            return (
              <div
                key={trait.value}
                className={`group relative p-4 rounded-xl ${
                  isMerchCategory
                    ? "bg-accent/30 dark:bg-white/[0.02] hover:bg-accent/40 dark:hover:bg-white/[0.04]"
                    : "bg-accent/50 dark:bg-white/[0.02] hover:bg-accent dark:hover:bg-white/[0.04]"
                } border border-border dark:border-white/5 hover:border-blue-500/20 transition-all duration-200`}
              >
                <div className="flex items-center gap-4">
                  {/* Image Preview */}
                  {!isNoItem &&
                    shouldShowImagePreview(category.name) &&
                    !isTribeCategory &&
                    (trait.image || trait.trait_number !== undefined) && (
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-white dark:from-black/40 dark:to-black/60 ring-1 ring-border dark:ring-white/10 group-hover:ring-blue-500/20 transition-all flex-shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img
                            crossOrigin="anonymous"
                            src={`/api/proxy/image?url=${encodeURIComponent(
                              trait.image ||
                                `https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/${
                                  isTribeCategory
                                    ? "clothes"
                                    : category.name.toLowerCase()
                                }/${trait.trait_number}.png`
                            )}`}
                            alt={`${trait.value} preview`}
                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                            style={{
                              imageRendering: "pixelated",
                            }}
                            onLoad={(e) => {
                              const img = e.target as HTMLImageElement;
                              const canvas = document.createElement("canvas");
                              const ctx = canvas.getContext("2d");
                              if (!ctx) return;

                              // Set canvas size to match original image
                              canvas.width = img.naturalWidth;
                              canvas.height = img.naturalHeight;

                              // Draw image to canvas
                              ctx.drawImage(img, 0, 0);

                              try {
                                // Get image data
                                const imageData = ctx.getImageData(
                                  0,
                                  0,
                                  canvas.width,
                                  canvas.height
                                );
                                const data = imageData.data;

                                // Find bounds of non-transparent pixels
                                let minX = canvas.width;
                                let minY = canvas.height;
                                let maxX = 0;
                                let maxY = 0;

                                // Scan through all pixels
                                for (let y = 0; y < canvas.height; y++) {
                                  for (let x = 0; x < canvas.width; x++) {
                                    const alpha =
                                      data[(y * canvas.width + x) * 4 + 3];
                                    if (alpha > 0) {
                                      minX = Math.min(minX, x);
                                      minY = Math.min(minY, y);
                                      maxX = Math.max(maxX, x);
                                      maxY = Math.max(maxY, y);
                                    }
                                  }
                                }

                                // Add some padding
                                const padding = 10;
                                minX = Math.max(0, minX - padding);
                                minY = Math.max(0, minY - padding);
                                maxX = Math.min(canvas.width, maxX + padding);
                                maxY = Math.min(canvas.height, maxY + padding);

                                // Calculate dimensions
                                const width = maxX - minX;
                                const height = maxY - minY;

                                if (width > 0 && height > 0) {
                                  // Create new canvas for cropped image
                                  const croppedCanvas =
                                    document.createElement("canvas");
                                  const croppedCtx =
                                    croppedCanvas.getContext("2d");
                                  if (!croppedCtx) return;

                                  croppedCanvas.width = width;
                                  croppedCanvas.height = height;

                                  // Draw cropped portion
                                  croppedCtx.drawImage(
                                    canvas,
                                    minX,
                                    minY,
                                    width,
                                    height,
                                    0,
                                    0,
                                    width,
                                    height
                                  );

                                  // Replace original image with cropped version
                                  img.src = croppedCanvas.toDataURL();
                                }
                              } catch (error) {
                                console.error("Error processing image:", error);
                              }
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                        {!isMerchCategory &&
                          trait.trait_number !== undefined && (
                            <div className="absolute bottom-2 left-2">
                              <Badge
                                variant="default"
                                size="sm"
                                className="shadow-lg text-xs"
                              >
                                #{trait.trait_number}
                              </Badge>
                            </div>
                          )}
                      </div>
                    )}

                  {/* Trait Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-sm font-medium truncate ${
                          isNoItem ? "text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {trait.value}
                      </span>
                      {!isMerchCategory && (
                        <Badge
                          variant="secondary"
                          className={`${
                            isNoItem ? "text-muted-foreground" : rarityColor
                          } transition-colors shrink-0`}
                        >
                          {isNoItem ? "Base" : rarity}
                        </Badge>
                      )}
                    </div>
                    {!isMerchCategory && (
                      <>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-muted-foreground">
                            {trait.count.toLocaleString()} NFTs
                          </span>
                          <span className="text-sm font-medium text-muted-foreground">
                            {trait.rarity.toFixed(2)}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isNoItem
                                ? "bg-muted-foreground/50"
                                : "bg-gradient-to-r from-blue-500 to-blue-400"
                            }`}
                            style={{ width: `${trait.rarity}%` }}
                          />
                        </div>

                        {/* Outfit Distribution for Tribes */}
                        {isTribeCategory &&
                          trait.outfitDistribution &&
                          trait.outfitDistribution.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-border/50 dark:border-white/5">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-muted-foreground">
                                  Outfit Variations
                                </span>
                                <Badge variant="secondary" size="sm">
                                  {trait.uniqueOutfits} variants
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                {trait.outfitDistribution.map((outfit) => (
                                  <div
                                    key={outfit.outfit}
                                    className="group/outfit relative p-2 rounded-lg bg-accent/50 dark:bg-white/5 hover:bg-accent dark:hover:bg-white/[0.08] transition-all"
                                  >
                                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-white dark:from-black/40 dark:to-black/60 ring-1 ring-border dark:ring-white/10 group-hover/outfit:ring-blue-500/20 transition-all flex-shrink-0">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <img
                                            crossOrigin="anonymous"
                                            src={`/api/proxy/image?url=${encodeURIComponent(
                                              `https://hologramxyz.s3.us-east-1.amazonaws.com/partnerships/MEGAETH/2d/thumbnails/clothes/${outfit.outfit}.png`
                                            )}`}
                                            alt={`Outfit #${outfit.outfit}`}
                                            className="w-full h-full object-contain transition-transform duration-500 group-hover/outfit:scale-110"
                                            style={{
                                              imageRendering: "pixelated",
                                            }}
                                            onLoad={(e) => {
                                              const img =
                                                e.target as HTMLImageElement;
                                              const canvas =
                                                document.createElement(
                                                  "canvas"
                                                );
                                              const ctx =
                                                canvas.getContext("2d");
                                              if (!ctx) return;

                                              // Set canvas size to match original image
                                              canvas.width = img.naturalWidth;
                                              canvas.height = img.naturalHeight;

                                              // Draw image to canvas
                                              ctx.drawImage(img, 0, 0);

                                              try {
                                                // Get image data
                                                const imageData =
                                                  ctx.getImageData(
                                                    0,
                                                    0,
                                                    canvas.width,
                                                    canvas.height
                                                  );
                                                const data = imageData.data;

                                                // Find bounds of non-transparent pixels
                                                let minX = canvas.width;
                                                let minY = canvas.height;
                                                let maxX = 0;
                                                let maxY = 0;

                                                // Scan through all pixels
                                                for (
                                                  let y = 0;
                                                  y < canvas.height;
                                                  y++
                                                ) {
                                                  for (
                                                    let x = 0;
                                                    x < canvas.width;
                                                    x++
                                                  ) {
                                                    const alpha =
                                                      data[
                                                        (y * canvas.width + x) *
                                                          4 +
                                                          3
                                                      ];
                                                    if (alpha > 0) {
                                                      minX = Math.min(minX, x);
                                                      minY = Math.min(minY, y);
                                                      maxX = Math.max(maxX, x);
                                                      maxY = Math.max(maxY, y);
                                                    }
                                                  }
                                                }

                                                // Add some padding
                                                const padding = 10;
                                                minX = Math.max(
                                                  0,
                                                  minX - padding
                                                );
                                                minY = Math.max(
                                                  0,
                                                  minY - padding
                                                );
                                                maxX = Math.min(
                                                  canvas.width,
                                                  maxX + padding
                                                );
                                                maxY = Math.min(
                                                  canvas.height,
                                                  maxY + padding
                                                );

                                                // Calculate dimensions
                                                const width = maxX - minX;
                                                const height = maxY - minY;

                                                if (width > 0 && height > 0) {
                                                  // Create new canvas for cropped image
                                                  const croppedCanvas =
                                                    document.createElement(
                                                      "canvas"
                                                    );
                                                  const croppedCtx =
                                                    croppedCanvas.getContext(
                                                      "2d"
                                                    );
                                                  if (!croppedCtx) return;

                                                  croppedCanvas.width = width;
                                                  croppedCanvas.height = height;

                                                  // Draw cropped portion
                                                  croppedCtx.drawImage(
                                                    canvas,
                                                    minX,
                                                    minY,
                                                    width,
                                                    height,
                                                    0,
                                                    0,
                                                    width,
                                                    height
                                                  );

                                                  // Replace original image with cropped version
                                                  img.src =
                                                    croppedCanvas.toDataURL();
                                                }
                                              } catch (error) {
                                                console.error(
                                                  "Error processing image:",
                                                  error
                                                );
                                              }
                                            }}
                                            onError={(e) => {
                                              (
                                                e.target as HTMLImageElement
                                              ).style.display = "none";
                                            }}
                                          />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                                      </div>
                                      <div className="flex-1 min-w-0 text-center sm:text-left">
                                        <span className="text-sm text-muted-foreground">
                                          Outfit #{outfit.outfit}
                                        </span>
                                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-0.5">
                                          <span className="text-sm font-medium text-foreground">
                                            {outfit.count.toLocaleString()} NFTs
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            {outfit.percentage.toFixed(1)}%
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
