// Bug fix: LinkedIn uses contain (no crop); Snapchat uses instagram visual format.
// Export share visual: BG color swap; per-platform dimensions.
import { RING_COLORS, type RingColorKey } from "./ringGeometry";
import {
  applyBackgroundColor,
  drawContain,
  drawCover,
  loadImageElement,
  sampleSourceBackground,
} from "./visualColorReplace";

export const SHARE_VISUAL_SRC = "/share-visual.png";

export const LINKEDIN_VISUAL_WIDTH = 1200;
export const LINKEDIN_VISUAL_HEIGHT = 627;

export const INSTAGRAM_VISUAL_WIDTH = 1080;
export const INSTAGRAM_VISUAL_HEIGHT = 1350;

export const TIKTOK_VISUAL_WIDTH = 1080;
export const TIKTOK_VISUAL_HEIGHT = 1920;

export type ShareVisualFormat =
  | "whatsapp"
  | "linkedin"
  | "instagram"
  | "tiktok";

type FormatSpec = {
  width: number;
  height: number;
  mode: "native" | "cover" | "contain";
};

export const SHARE_FORMAT_SPECS: Record<ShareVisualFormat, FormatSpec> = {
  whatsapp: {
    width: INSTAGRAM_VISUAL_WIDTH,
    height: INSTAGRAM_VISUAL_HEIGHT,
    mode: "native",
  },
  instagram: {
    width: INSTAGRAM_VISUAL_WIDTH,
    height: INSTAGRAM_VISUAL_HEIGHT,
    mode: "native",
  },
  linkedin: {
    width: LINKEDIN_VISUAL_WIDTH,
    height: LINKEDIN_VISUAL_HEIGHT,
    mode: "contain",
  },
  tiktok: {
    width: TIKTOK_VISUAL_WIDTH,
    height: TIKTOK_VISUAL_HEIGHT,
    mode: "cover",
  },
};

let cachedImage: HTMLImageElement | null = null;
let cachedSourceBg: ReturnType<typeof sampleSourceBackground> | null = null;

async function getColoredSourceCanvas(
  colorKey: RingColorKey,
): Promise<HTMLCanvasElement> {
  if (!cachedImage) {
    cachedImage = await loadImageElement(SHARE_VISUAL_SRC);
  }

  const width = cachedImage.naturalWidth;
  const height = cachedImage.naturalHeight;
  const scratch = document.createElement("canvas");
  scratch.width = width;
  scratch.height = height;
  const ctx = scratch.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar");

  ctx.drawImage(cachedImage, 0, 0);
  if (!cachedSourceBg) {
    cachedSourceBg = sampleSourceBackground(ctx, width, height);
  }

  const imageData = ctx.getImageData(0, 0, width, height);
  applyBackgroundColor(imageData, cachedSourceBg, colorKey);
  ctx.putImageData(imageData, 0, 0);
  return scratch;
}

export async function renderShareVisual(
  format: ShareVisualFormat,
  colorKey: RingColorKey,
  canvas: HTMLCanvasElement,
): Promise<void> {
  const source = await getColoredSourceCanvas(colorKey);
  const spec = SHARE_FORMAT_SPECS[format];
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar");

  if (spec.mode === "native") {
    canvas.width = source.width;
    canvas.height = source.height;
    ctx.drawImage(source, 0, 0);
    return;
  }

  canvas.width = spec.width;
  canvas.height = spec.height;

  if (spec.mode === "contain") {
    drawContain(
      ctx,
      source,
      source.width,
      source.height,
      spec.width,
      spec.height,
      RING_COLORS[colorKey],
    );
    return;
  }

  drawCover(ctx, source, source.width, source.height, spec.width, spec.height);
}

export async function exportShareVisualBlob(
  format: ShareVisualFormat,
  colorKey: RingColorKey,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  await renderShareVisual(format, colorKey, canvas);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export mislukt"))),
      "image/png",
      1,
    );
  });
}
