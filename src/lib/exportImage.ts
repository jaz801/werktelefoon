// Bug fix: N/A — canvas export so downloaded PNG matches on-screen ring overlay.
import { buildCirclePath } from "./ringGeometry";

export type ExportRingOptions = {
  imageSrc: string;
  width: number;
  height: number;
  ringCenterX: number;
  ringCenterY: number;
  ringRadius: number;
  ringColor: string;
  text: string;
  fontFamily: string;
  fontSize?: number;
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
    text,
    fontFamily,
    fontSize = Math.max(14, Math.round(ringRadius * 0.22)),
  } = options;

  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar");

  ctx.drawImage(image, 0, 0, width, height);

  const pathD = buildCirclePath(ringCenterX, ringCenterY, ringRadius);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><path id="ring" d="${pathD}" fill="none"/></defs><circle cx="${ringCenterX}" cy="${ringCenterY}" r="${ringRadius}" fill="none" stroke="${ringColor}" stroke-width="10"/><text fill="#191919" font-family="${fontFamily}" font-size="${fontSize}" letter-spacing="0.5"><textPath href="#ring" startOffset="25%" text-anchor="middle">${escapeXml(text)}</textPath></text></svg>`;

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

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
