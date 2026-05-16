// Maps between natural image pixels and object-contain preview coordinates.
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
