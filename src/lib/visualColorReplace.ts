// Shared canvas BG color swap for share visual + poster PDF exports.
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
  ctx.drawImage(source, dx, dy, drawW, drawH);
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
): void {
  ctx.fillStyle = fillColor;
  ctx.fillRect(0, 0, outW, outH);
  const scale = Math.min(outW / srcW, outH / srcH);
  const drawW = srcW * scale;
  const drawH = srcH * scale;
  const dx = (outW - drawW) / 2;
  const dy = (outH - drawH) / 2;
  ctx.drawImage(source, dx, dy, drawW, drawH);
}
