// Bug fix: poster PDF export with brand BG color swap (koffiezetapparaat + WC use poster.pdf).
import type { RingColorKey } from "./ringGeometry";
import {
  applyBackgroundColor,
  sampleSourceBackground,
} from "./visualColorReplace";

export const POSTER_PDF_SRC = "/poster.pdf";

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
let cachedPdfCanvas: HTMLCanvasElement | null = null;
let cachedPdfSourceBg: ReturnType<typeof sampleSourceBackground> | null = null;

async function ensurePdfWorker(): Promise<void> {
  if (pdfWorkerReady) return;
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  pdfWorkerReady = true;
}

async function renderPdfToCanvas(): Promise<HTMLCanvasElement> {
  if (cachedPdfCanvas) return cachedPdfCanvas;

  await ensurePdfWorker();
  const pdfjs = await import("pdfjs-dist");
  const doc = await pdfjs.getDocument(POSTER_PDF_SRC).promise;
  const page = await doc.getPage(1);
  const scale = 2;
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar");

  await page.render({ canvas, canvasContext: ctx, viewport }).promise;
  cachedPdfCanvas = canvas;
  cachedPdfSourceBg = sampleSourceBackground(ctx, canvas.width, canvas.height);
  return canvas;
}

async function getColoredPosterCanvas(
  colorKey: RingColorKey,
): Promise<HTMLCanvasElement> {
  const source = await renderPdfToCanvas();
  const out = document.createElement("canvas");
  out.width = source.width;
  out.height = source.height;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar");

  ctx.drawImage(source, 0, 0);
  const imageData = ctx.getImageData(0, 0, out.width, out.height);
  if (!cachedPdfSourceBg) {
    cachedPdfSourceBg = sampleSourceBackground(ctx, out.width, out.height);
  }
  applyBackgroundColor(imageData, cachedPdfSourceBg, colorKey);
  ctx.putImageData(imageData, 0, 0);
  return out;
}

export async function renderPosterVisual(
  _posterType: PosterType,
  colorKey: RingColorKey,
  canvas: HTMLCanvasElement,
): Promise<void> {
  const colored = await getColoredPosterCanvas(colorKey);
  canvas.width = colored.width;
  canvas.height = colored.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar");
  ctx.drawImage(colored, 0, 0);
}

export async function exportPosterVisualBlob(
  posterType: PosterType,
  colorKey: RingColorKey,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  await renderPosterVisual(posterType, colorKey, canvas);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export mislukt"))),
      "image/png",
      1,
    );
  });
}
