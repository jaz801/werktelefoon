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
  } = options;

  const outlineStroke = strokeWidth + RING_OUTLINE_WIDTH * 2;

  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar");

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.beginPath();
  ctx.arc(ringCenterX, ringCenterY, ringRadius, 0, Math.PI * 2);
  ctx.clip();

  if (displayLayout) {
    ctx.drawImage(
      image,
      displayLayout.offsetX,
      displayLayout.offsetY,
      displayLayout.displayWidth,
      displayLayout.displayHeight,
    );
  } else {
    ctx.drawImage(image, 0, 0, width, height);
  }
  ctx.restore();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><circle cx="${ringCenterX}" cy="${ringCenterY}" r="${ringRadius}" fill="none" stroke="${RING_OUTLINE_COLOR}" stroke-width="${outlineStroke}"/><circle cx="${ringCenterX}" cy="${ringCenterY}" r="${ringRadius}" fill="none" stroke="${ringColor}" stroke-width="${strokeWidth}"/></svg>`;

  const overlay = await loadImage(
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
  );
  ctx.drawImage(overlay, 0, 0, width, height);

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
