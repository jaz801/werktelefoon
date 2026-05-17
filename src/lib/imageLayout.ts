// Maps between natural image pixels and object-contain preview coordinates.
// Recurring: export must scale preview coords by naturalWidth/displayWidth — not preview size only.
export type DisplayLayout = {
  scale: number;
  offsetX: number;
  offsetY: number;
  displayWidth: number;
  displayHeight: number;
};

export function computeObjectContainLayout(
  naturalWidth: number,
  naturalHeight: number,
  containerWidth: number,
  containerHeight: number,
): DisplayLayout {
  const scale = Math.min(
    containerWidth / naturalWidth,
    containerHeight / naturalHeight,
  );
  const displayWidth = naturalWidth * scale;
  const displayHeight = naturalHeight * scale;
  const offsetX = (containerWidth - displayWidth) / 2;
  const offsetY = (containerHeight - displayHeight) / 2;
  return { scale, offsetX, offsetY, displayWidth, displayHeight };
}

export function mapImagePointToPreview(
  x: number,
  y: number,
  layout: DisplayLayout,
): { x: number; y: number } {
  return {
    x: layout.offsetX + x * layout.scale,
    y: layout.offsetY + y * layout.scale,
  };
}

export function mapPreviewPointToImage(
  x: number,
  y: number,
  layout: DisplayLayout,
): { x: number; y: number } {
  return {
    x: (x - layout.offsetX) / layout.scale,
    y: (y - layout.offsetY) / layout.scale,
  };
}

/** Scale factor from preview frame pixels to full-resolution export (1:1 photo pixels). */
export function getExportScaleFactor(
  layout: DisplayLayout,
  naturalWidth: number,
): number {
  if (layout.displayWidth <= 0 || naturalWidth <= 0) return 1;
  return naturalWidth / layout.displayWidth;
}

/** Safari/mobile reject huge canvases — cap export while keeping max practical quality. */
export function capExportScale(
  scale: number,
  previewWidth: number,
  previewHeight: number,
  maxSide = 4096,
): number {
  if (scale <= 1) return 1;
  const maxByWidth = maxSide / previewWidth;
  const maxByHeight = maxSide / previewHeight;
  return Math.min(scale, maxByWidth, maxByHeight);
}
