// Shared lossless PNG export + high-quality canvas scaling for share visuals/posters/banners.
// Recurring: soft downloads when scaling without imageSmoothingQuality — use configureCanvasScaling.

/** Enable high-quality smoothing only when the draw size differs from the source. */
export function configureCanvasScaling(
  ctx: CanvasRenderingContext2D,
  srcW: number,
  srcH: number,
  outW: number,
  outH: number,
): void {
  const scaling =
    Math.abs(outW - srcW) > 0.5 || Math.abs(outH - srcH) > 0.5;
  ctx.imageSmoothingEnabled = scaling;
  if (scaling) {
    ctx.imageSmoothingQuality = "high";
  }
}

/** Lossless PNG blob from a canvas at its current pixel dimensions. */
export function exportCanvasToPngBlob(
  canvas: HTMLCanvasElement,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export mislukt"))),
      "image/png",
    );
  });
}
