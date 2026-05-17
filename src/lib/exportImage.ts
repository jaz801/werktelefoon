// Bug fix: export at full photo resolution (preview layout × scale), not 360×420 only.
// Recurring: ring export looked soft — canvas was preview-sized; use exportScale from imageLayout.
// Bug fix: removed ring label text; black outline inside + outside colored band on export.
// Export: matches preview — black frame, photo inside ring circle, ring on top.
import type { DisplayLayout } from "./imageLayout";
import {
  RING_OUTLINE_COLOR,
  RING_OUTLINE_WIDTH,
  RING_STROKE_WIDTH_MIN,
} from "./ringGeometry";

export type ExportRingOptions = {
  imageSrc: string;
  width: number;
  height: number;
  ringCenterX: number;
  ringCenterY: number;
  ringRadius: number;
  ringColor: string;
  strokeWidth?: number;
  /** object-contain layout when exporting the preview frame */
  displayLayout?: DisplayLayout;
  /** Multiply preview width/height and layout (1 = preview pixels; use getExportScaleFactor for full res). */
  exportScale?: number;
};

export async function exportComposedImage(
  options: ExportRingOptions,
): Promise<Blob> {
  const {
    imageSrc,
    width,
    height,
    ringCenterX,
    ringCenterY,
    ringRadius,
    ringColor,
    strokeWidth = RING_STROKE_WIDTH_MIN,
    displayLayout,
    exportScale = 1,
  } = options;

  const s = exportScale;
  const outW = Math.round(width * s);
  const outH = Math.round(height * s);
  const cx = ringCenterX * s;
  const cy = ringCenterY * s;
  const r = ringRadius * s;
  const band = strokeWidth * s;
  const outlineStroke = band + RING_OUTLINE_WIDTH * 2 * s;

  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar");

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, outW, outH);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  const drawAtNative =
    displayLayout &&
    Math.abs(displayLayout.displayWidth * s - image.naturalWidth) < 2 &&
    Math.abs(displayLayout.displayHeight * s - image.naturalHeight) < 2;

  ctx.imageSmoothingEnabled = !drawAtNative;
  if (displayLayout) {
    ctx.drawImage(
      image,
      displayLayout.offsetX * s,
      displayLayout.offsetY * s,
      displayLayout.displayWidth * s,
      displayLayout.displayHeight * s,
    );
  } else {
    ctx.drawImage(image, 0, 0, outW, outH);
  }
  ctx.restore();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${outW}" height="${outH}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${RING_OUTLINE_COLOR}" stroke-width="${outlineStroke}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ringColor}" stroke-width="${band}"/></svg>`;

  const overlay = await loadImage(
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
  );
  ctx.drawImage(overlay, 0, 0, outW, outH);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export mislukt"))),
      "image/png",
      1,
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Afbeelding laden mislukt"));
    img.src = src;
  });
}
