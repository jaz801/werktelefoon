// Shared canvas BG color swap for share visual + poster PDF exports.
// Recurring: soft scaled exports — configureCanvasScaling in drawContain/drawCover.
import { configureCanvasScaling } from "./canvasExport";
import { RING_COLORS, type RingColorKey } from "./ringGeometry";

const BG_TOLERANCE = 52;

export type Rgb = { r: number; g: number; b: number };

export function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function colorDistance(a: Rgb, b: Rgb): number {
  return Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
}

export function sampleSourceBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): Rgb {
  const points: [number, number][] = [
    [2, 2],
    [width - 3, 2],
    [2, height - 3],
    [width - 3, height - 3],
    [Math.floor(width / 2), 2],
  ];
  let r = 0;
  let g = 0;
  let b = 0;
  for (const [x, y] of points) {
    const [pr, pg, pb] = ctx.getImageData(x, y, 1, 1).data;
    r += pr;
    g += pg;
    b += pb;
  }
  const n = points.length;
  return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
}

export function applyBackgroundColor(
  imageData: ImageData,
  sourceBg: Rgb,
  colorKey: RingColorKey,
): void {
  const target = hexToRgb(RING_COLORS[colorKey]);
  const pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    const px: Rgb = { r: pixels[i], g: pixels[i + 1], b: pixels[i + 2] };
    if (colorDistance(px, sourceBg) <= BG_TOLERANCE) {
      pixels[i] = target.r;
      pixels[i + 1] = target.g;
      pixels[i + 2] = target.b;
    }
  }
}

export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Afbeelding laden mislukt"));
    img.src = src;
  });
}

export function drawCover(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  srcW: number,
  srcH: number,
  outW: number,
  outH: number,
): void {
  const scale = Math.max(outW / srcW, outH / srcH);
  const drawW = srcW * scale;
  const drawH = srcH * scale;
  const dx = (outW - drawW) / 2;
  const dy = (outH - drawH) / 2;
  configureCanvasScaling(ctx, srcW, srcH, drawW, drawH);
  ctx.drawImage(source, dx, dy, drawW, drawH);
}

/** Bounding box of non-background pixels (text, icons, QR). */
export function getContentBounds(
  imageData: ImageData,
  sourceBg: Rgb,
  tolerance = 40,
): { x: number; y: number; w: number; h: number } {
  const { width, height, data } = imageData;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const px: Rgb = { r: data[i], g: data[i + 1], b: data[i + 2] };
      if (colorDistance(px, sourceBg) > tolerance) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    return { x: 0, y: 0, w: width, h: height };
  }

  const pad = 36;
  const x = Math.max(0, minX - pad);
  const y = Math.max(0, minY - pad);
  const w = Math.min(width - x, maxX - minX + 1 + pad * 2);
  const h = Math.min(height - y, maxY - minY + 1 + pad * 2);
  return { x, y, w, h };
}

/** Fit full image inside frame — nothing cropped (letterbox uses fillColor). */
export function drawContain(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  srcW: number,
  srcH: number,
  outW: number,
  outH: number,
  fillColor: string,
  srcX = 0,
  srcY = 0,
): void {
  ctx.fillStyle = fillColor;
  ctx.fillRect(0, 0, outW, outH);
  const scale = Math.min(outW / srcW, outH / srcH);
  const drawW = srcW * scale;
  const drawH = srcH * scale;
  const dx = (outW - drawW) / 2;
  const dy = (outH - drawH) / 2;
  configureCanvasScaling(ctx, srcW, srcH, drawW, drawH);
  ctx.drawImage(source, srcX, srcY, srcW, srcH, dx, dy, drawW, drawH);
}
