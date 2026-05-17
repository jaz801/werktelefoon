// Bug fix: visual download uses public/share-visual.png (WhatsApp example); bump VISUAL_ASSET_VERSION on asset swap.
// Recurring: platform "cover" crops QR/text — use vertical-fit or instagram-square instead.
// Export share visual: BG color swap; per-platform dimensions.
import { VISUAL_ASSET_VERSION } from "./visualAssetVersion";
import { RING_COLORS, type RingColorKey } from "./ringGeometry";
import {
  applyBackgroundColor,
  drawContain,
  drawCover,
  getContentBounds,
  loadImageElement,
  sampleSourceBackground,
  type Rgb,
} from "./visualColorReplace";

export const SHARE_VISUAL_SRC = `/share-visual.png?v=${VISUAL_ASSET_VERSION}`;

export const INSTAGRAM_VISUAL_WIDTH = 1080;
export const INSTAGRAM_VISUAL_HEIGHT = 1350;

export const INSTAGRAM_SQUARE_SIZE = 1080;

export type InstagramAspectRatio = "4:5" | "1:1";

export type ShareVisualOptions = {
  instagramAspect?: InstagramAspectRatio;
};

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
  mode: "native" | "cover" | "instagram-square" | "vertical-fit";
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
    width: INSTAGRAM_VISUAL_WIDTH,
    height: INSTAGRAM_VISUAL_HEIGHT,
    mode: "native",
  },
  tiktok: {
    width: TIKTOK_VISUAL_WIDTH,
    height: TIKTOK_VISUAL_HEIGHT,
    mode: "vertical-fit",
  },
};

let cachedAssetVersion: string | null = null;
let cachedImage: HTMLImageElement | null = null;
let cachedSourceBg: ReturnType<typeof sampleSourceBackground> | null = null;

function ensureShareVisualAssetCache(): void {
  if (cachedAssetVersion === VISUAL_ASSET_VERSION) return;
  cachedAssetVersion = VISUAL_ASSET_VERSION;
  cachedImage = null;
  cachedSourceBg = null;
}

async function getColoredSourceCanvas(
  colorKey: RingColorKey,
): Promise<HTMLCanvasElement> {
  ensureShareVisualAssetCache();
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

function resolveInstagramSpec(aspect: InstagramAspectRatio): FormatSpec {
  if (aspect === "1:1") {
    return {
      width: INSTAGRAM_SQUARE_SIZE,
      height: INSTAGRAM_SQUARE_SIZE,
      mode: "instagram-square",
    };
  }
  return SHARE_FORMAT_SPECS.instagram;
}

/** Trim empty margins, scale content to fit output without cropping text/QR. */
function renderContentFit(
  source: HTMLCanvasElement,
  sourceBg: Rgb,
  colorKey: RingColorKey,
  canvas: HTMLCanvasElement,
  outW: number,
  outH: number,
): void {
  const srcCtx = source.getContext("2d");
  if (!srcCtx) throw new Error("Canvas niet beschikbaar");

  const data = srcCtx.getImageData(0, 0, source.width, source.height);
  const bounds = getContentBounds(data, sourceBg);

  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar");

  drawContain(
    ctx,
    source,
    bounds.w,
    bounds.h,
    outW,
    outH,
    RING_COLORS[colorKey],
    bounds.x,
    bounds.y,
  );
}

/** 1:1 — trim empty margins, scale content block to fit 1080×1080 without cropping text/QR. */
function renderInstagramSquare(
  source: HTMLCanvasElement,
  sourceBg: Rgb,
  colorKey: RingColorKey,
  canvas: HTMLCanvasElement,
): void {
  renderContentFit(
    source,
    sourceBg,
    colorKey,
    canvas,
    INSTAGRAM_SQUARE_SIZE,
    INSTAGRAM_SQUARE_SIZE,
  );
}

export function getShareVisualSpec(
  format: ShareVisualFormat,
  options: ShareVisualOptions = {},
): FormatSpec {
  if (format === "instagram") {
    return resolveInstagramSpec(options.instagramAspect ?? "4:5");
  }
  return SHARE_FORMAT_SPECS[format];
}

export function getShareVisualDimensions(
  format: ShareVisualFormat,
  options: ShareVisualOptions = {},
): { width: number; height: number } {
  const spec = getShareVisualSpec(format, options);
  return { width: spec.width, height: spec.height };
}

export async function renderShareVisual(
  format: ShareVisualFormat,
  colorKey: RingColorKey,
  canvas: HTMLCanvasElement,
  options: ShareVisualOptions = {},
): Promise<void> {
  const source = await getColoredSourceCanvas(colorKey);
  const spec = getShareVisualSpec(format, options);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar");

  if (spec.mode === "native") {
    canvas.width = source.width;
    canvas.height = source.height;
    ctx.drawImage(source, 0, 0);
    return;
  }

  if (spec.mode === "instagram-square") {
    renderInstagramSquare(source, cachedSourceBg!, colorKey, canvas);
    return;
  }

  if (spec.mode === "vertical-fit") {
    renderContentFit(
      source,
      cachedSourceBg!,
      colorKey,
      canvas,
      spec.width,
      spec.height,
    );
    return;
  }

  canvas.width = spec.width;
  canvas.height = spec.height;
  drawCover(ctx, source, source.width, source.height, spec.width, spec.height);
}

export async function exportShareVisualDataUrl(
  format: ShareVisualFormat,
  colorKey: RingColorKey,
  options: ShareVisualOptions = {},
): Promise<string> {
  const canvas = document.createElement("canvas");
  await renderShareVisual(format, colorKey, canvas, options);
  return canvas.toDataURL("image/png");
}

export async function exportShareVisualBlob(
  format: ShareVisualFormat,
  colorKey: RingColorKey,
  options: ShareVisualOptions = {},
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  await renderShareVisual(format, colorKey, canvas, options);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export mislukt"))),
      "image/png",
      1,
    );
  });
}
