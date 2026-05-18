// Bug fix: banner PNG export at LinkedIn size 1584×396 with high-quality upscale.
// Recurring: soft downloads — export via exportCanvasToPngBlob, not preview canvas.
import { configureCanvasScaling, exportCanvasToPngBlob } from "./canvasExport";
import { VISUAL_ASSET_VERSION } from "./visualAssetVersion";
import { type RingColorKey } from "./ringGeometry";
import {
  applyBackgroundColor,
  loadImageElement,
  sampleSourceBackground,
} from "./visualColorReplace";

export const LINKEDIN_BANNER_SRC = `/linkedin-banner.png?v=${VISUAL_ASSET_VERSION}`;

/** LinkedIn profile banner recommended size (px). */
export const LINKEDIN_BANNER_EXPORT_WIDTH = 1584;
export const LINKEDIN_BANNER_EXPORT_HEIGHT = 396;

let cachedAssetVersion: string | null = null;
let cachedImage: HTMLImageElement | null = null;
let cachedSourceBg: ReturnType<typeof sampleSourceBackground> | null = null;

function ensureBannerAssetCache(): void {
  if (cachedAssetVersion === VISUAL_ASSET_VERSION) return;
  cachedAssetVersion = VISUAL_ASSET_VERSION;
  cachedImage = null;
  cachedSourceBg = null;
}

async function getColoredBannerCanvas(
  colorKey: RingColorKey,
): Promise<HTMLCanvasElement> {
  ensureBannerAssetCache();
  if (!cachedImage) {
    cachedImage = await loadImageElement(LINKEDIN_BANNER_SRC);
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

function drawBannerAtExportSize(
  source: HTMLCanvasElement,
  canvas: HTMLCanvasElement,
): void {
  const outW = LINKEDIN_BANNER_EXPORT_WIDTH;
  const outH = LINKEDIN_BANNER_EXPORT_HEIGHT;
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar");

  configureCanvasScaling(ctx, source.width, source.height, outW, outH);
  ctx.drawImage(source, 0, 0, outW, outH);
}

export function getLinkedInBannerDimensions(): {
  width: number;
  height: number;
} {
  return {
    width: LINKEDIN_BANNER_EXPORT_WIDTH,
    height: LINKEDIN_BANNER_EXPORT_HEIGHT,
  };
}

export async function renderLinkedInBanner(
  colorKey: RingColorKey,
  canvas: HTMLCanvasElement,
): Promise<void> {
  const source = await getColoredBannerCanvas(colorKey);
  drawBannerAtExportSize(source, canvas);
}

export async function exportLinkedInBannerBlob(
  colorKey: RingColorKey,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  await renderLinkedInBanner(colorKey, canvas);
  return exportCanvasToPngBlob(canvas);
}
