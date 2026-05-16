// Export: matches preview — black frame, photo inside ring circle, ring + label on top.
import type { DisplayLayout } from "./imageLayout";
import {
  buildTopArcPath,
  getRingTextStyle,
  RING_LABEL_FONT_EXPORT,
  RING_STROKE_WIDTH_MIN,
  RING_TEXT_COLORS,
  type RingFontWeightKey,
  type RingTextColorKey,
} from "./ringGeometry";

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
  fontWeightKey?: RingFontWeightKey;
  textColorKey?: RingTextColorKey;
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
    text,
    fontFamily,
    fontSize = 14,
    fontWeightKey = "medium",
    textColorKey = "black",
    strokeWidth = RING_STROKE_WIDTH_MIN,
    displayLayout,
  } = options;

  const textFill = RING_TEXT_COLORS[textColorKey];
  const textStyle = getRingTextStyle(fontWeightKey, fontSize);
  const textStrokeAttrs = textStyle.textStroke
    ? `stroke="${textFill}" stroke-width="${textStyle.textStroke}" paint-order="stroke fill"`
    : "";

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

  const textPathD = buildTopArcPath(ringCenterX, ringCenterY, ringRadius);
  const fontUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/fonts/indivisible.otf`
      : "/fonts/indivisible.otf";
  const labelFont = fontFamily || RING_LABEL_FONT_EXPORT;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><style>@font-face{font-family:Indivisible;src:url("${fontUrl}") format("opentype");font-weight:400 900;font-style:normal;}</style><path id="ring" d="${textPathD}" fill="none"/></defs><circle cx="${ringCenterX}" cy="${ringCenterY}" r="${ringRadius}" fill="none" stroke="${ringColor}" stroke-width="${strokeWidth}"/><text fill="${textFill}" dominant-baseline="central" font-family="${labelFont}" font-size="${fontSize}" font-weight="${textStyle.fontWeight}" letter-spacing="0" ${textStrokeAttrs}><textPath href="#ring" startOffset="50%" text-anchor="middle">${escapeXml(text)}</textPath></text></svg>`;

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
