import { SelectedTraits, TraitType } from "@/types/traits";
import { getTraitImageUrl, getTraitBackImageUrl } from "@/utils/traitImageMap";
import { LAYER_ORDER, HAIR_WITH_BACK } from "@/utils/layerOrder";

const CANVAS_SIZE = 1000;

function drawImage(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  src: string,
  isBackground: boolean = false
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (isBackground) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        const baseScale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const scaledWidth = img.width * baseScale;
        const scaledHeight = img.height * baseScale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      }
      resolve();
    };
    img.onerror = reject;
    img.src = src;
  });
}

async function drawLayerGroup(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  selectedTraits: SelectedTraits,
  layerGroup: readonly string[]
): Promise<void> {
  for (const traitType of layerGroup) {
    const key = traitType as TraitType;
    if (selectedTraits[key]) {
      await drawImage(
        ctx,
        canvas,
        getTraitImageUrl(key, selectedTraits[key]!)
      );
    }
  }
}

/**
 * Renders selected traits onto a canvas with zoom/offset applied.
 * Returns the canvas element for further processing (copy, download, etc).
 */
export async function renderTraitsToCanvas(
  selectedTraits: SelectedTraits,
  zoom: number,
  offsetY: number
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  // Draw background before any transformations
  if (selectedTraits.background) {
    await drawImage(
      ctx,
      canvas,
      getTraitImageUrl("background", selectedTraits.background),
      true
    );
  }

  ctx.save();

  // Apply zoom and offset
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(zoom, zoom);
  ctx.translate(
    -canvas.width / 2,
    -canvas.height / 2 + (offsetY * canvas.height) / 100
  );

  // Draw hair back part if applicable
  if (
    selectedTraits.hair &&
    HAIR_WITH_BACK.includes(
      selectedTraits.hair as (typeof HAIR_WITH_BACK)[number]
    )
  ) {
    await drawImage(ctx, canvas, getTraitBackImageUrl("hair", selectedTraits.hair)!);
  }

  // Draw layers in order
  await drawLayerGroup(ctx, canvas, selectedTraits, LAYER_ORDER.BASE);
  await drawLayerGroup(ctx, canvas, selectedTraits, LAYER_ORDER.FACE_FEATURES);
  await drawLayerGroup(ctx, canvas, selectedTraits, LAYER_ORDER.EYE_DETAILS);
  await drawLayerGroup(ctx, canvas, selectedTraits, LAYER_ORDER.CLOTHES);

  // Draw hair front part
  if (selectedTraits.hair) {
    await drawImage(ctx, canvas, getTraitImageUrl("hair", selectedTraits.hair));
  }

  // Draw accessories
  await drawLayerGroup(ctx, canvas, selectedTraits, LAYER_ORDER.ACCESSORIES);

  ctx.restore();

  return canvas;
}

/**
 * Converts a canvas to a PNG blob.
 */
export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob!), "image/png")
  );
}
