// Bug fix: poster download uses public/poster.pdf + PNG fallback; bump VISUAL_ASSET_VERSION on asset swap.
// Recurring: poster PDF at scale 2 (3310×4680) breaks iOS; koffiezetapparaat + WC share poster.pdf page 1.
import { VISUAL_ASSET_VERSION } from "./visualAssetVersion";
import type { RingColorKey } from "./ringGeometry";
import {
  applyBackgroundColor,
  loadImageElement,
  sampleSourceBackground,
} from "./visualColorReplace";

export const POSTER_PDF_SRC = `/poster.pdf?v=${VISUAL_ASSET_VERSION}`;
export const POSTER_PNG_FALLBACK_SRC = `/posters/poster.png?v=${VISUAL_ASSET_VERSION}`;

/** Safari / mobile browsers reject canvases larger than this on one side. */
const MAX_CANVAS_SIDE = 4096;
const MOBILE_MAX_CANVAS_SIDE = 2048;

export type PosterType = "koffiezetapparaat" | "wc";

export const POSTER_OPTIONS: Record<
  PosterType,
  { label: string; downloadName: string }
> = {
  koffiezetapparaat: {
    label: "Koffiezetapparaat",
    downloadName: "werktelefoon-poster-koffiezetapparaat",
  },
  wc: {
    label: "WC poster",
    downloadName: "werktelefoon-poster-wc",
  },
};

let pdfWorkerReady = false;
let cachedAssetVersion: string | null = null;
let cachedSourceCanvas: HTMLCanvasElement | null = null;
let cachedSourceBg: ReturnType<typeof sampleSourceBackground> | null = null;

function ensurePosterAssetCache(): void {
  if (cachedAssetVersion === VISUAL_ASSET_VERSION) return;
  cachedAssetVersion = VISUAL_ASSET_VERSION;
  pdfWorkerReady = false;
  cachedSourceCanvas = null;
  cachedSourceBg = null;
}

function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

function getPdfRenderScale(pageWidth: number, pageHeight: number): number {
  const maxSide = isMobileViewport() ? MOBILE_MAX_CANVAS_SIDE : MAX_CANVAS_SIDE;
  const desired = isMobileViewport() ? 1.15 : 1.75;
  return Math.min(
    desired,
    maxSide / pageWidth,
    maxSide / pageHeight,
  );
}

async function ensurePdfWorker(pdfjs: typeof import("pdfjs-dist")): Promise<void> {
  if (pdfWorkerReady) return;
  const workerPath = "/pdf.worker.min.mjs";
  pdfjs.GlobalWorkerOptions.workerSrc =
    typeof window !== "undefined"
      ? `${window.location.origin}${workerPath}`
      : workerPath;
  pdfWorkerReady = true;
}

function applyColorToCanvas(
  source: HTMLCanvasElement,
  colorKey: RingColorKey,
): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = source.width;
  out.height = source.height;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar");

  ctx.drawImage(source, 0, 0);
  const imageData = ctx.getImageData(0, 0, out.width, out.height);
  if (!cachedSourceBg) {
    cachedSourceBg = sampleSourceBackground(ctx, out.width, out.height);
  }
  applyBackgroundColor(imageData, cachedSourceBg, colorKey);
  ctx.putImageData(imageData, 0, 0);
  return out;
}

async function renderPdfToCanvas(): Promise<HTMLCanvasElement> {
  const pdfjs = await import("pdfjs-dist");
  await ensurePdfWorker(pdfjs);

  const loadingTask = pdfjs.getDocument({
    url: POSTER_PDF_SRC,
    standardFontDataUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
  });

  const doc = await loadingTask.promise;
  const page = await doc.getPage(1);
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = getPdfRenderScale(baseViewport.width, baseViewport.height);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Canvas niet beschikbaar");

  await page.render({ canvas, canvasContext: ctx, viewport }).promise;
  cachedSourceBg = sampleSourceBackground(ctx, canvas.width, canvas.height);
  return canvas;
}

async function renderPngFallbackToCanvas(): Promise<HTMLCanvasElement> {
  const image = await loadImageElement(POSTER_PNG_FALLBACK_SRC);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar");
  ctx.drawImage(image, 0, 0);
  cachedSourceBg = sampleSourceBackground(ctx, canvas.width, canvas.height);
  return canvas;
}

async function getPosterSourceCanvas(): Promise<HTMLCanvasElement> {
  ensurePosterAssetCache();
  if (cachedSourceCanvas) return cachedSourceCanvas;

  try {
    cachedSourceCanvas = await renderPdfToCanvas();
    return cachedSourceCanvas;
  } catch {
    pdfWorkerReady = false;
    cachedSourceCanvas = null;
    cachedSourceBg = null;
    cachedSourceCanvas = await renderPngFallbackToCanvas();
    return cachedSourceCanvas;
  }
}

async function getColoredPosterCanvas(
  colorKey: RingColorKey,
): Promise<HTMLCanvasElement> {
  const source = await getPosterSourceCanvas();
  return applyColorToCanvas(source, colorKey);
}

function drawScaled(
  target: HTMLCanvasElement,
  source: HTMLCanvasElement,
  maxPreviewSide: number,
): void {
  const longest = Math.max(source.width, source.height);
  const previewScale = longest > maxPreviewSide ? maxPreviewSide / longest : 1;
  target.width = Math.max(1, Math.round(source.width * previewScale));
  target.height = Math.max(1, Math.round(source.height * previewScale));
  const ctx = target.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar");
  ctx.drawImage(source, 0, 0, target.width, target.height);
}

export async function renderPosterVisual(
  _posterType: PosterType,
  colorKey: RingColorKey,
  canvas: HTMLCanvasElement,
): Promise<void> {
  const colored = await getColoredPosterCanvas(colorKey);
  const maxPreview = isMobileViewport() ? 1200 : 2400;
  drawScaled(canvas, colored, maxPreview);
}

export async function exportPosterVisualBlob(
  posterType: PosterType,
  colorKey: RingColorKey,
): Promise<Blob> {
  const colored = await getColoredPosterCanvas(colorKey);
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = colored.width;
  exportCanvas.height = colored.height;
  const ctx = exportCanvas.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar");
  ctx.drawImage(colored, 0, 0);

  return new Promise((resolve, reject) => {
    exportCanvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export mislukt"))),
      "image/png",
      1,
    );
  });
}
