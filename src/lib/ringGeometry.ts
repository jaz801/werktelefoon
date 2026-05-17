// Bug fix: removed ring text/copy; ring has black outline inside + outside colored band.
// Ring sizing for photo upload preview + export.
export const RING_STROKE_WIDTH_MIN = 28;
/** Black stroke peeking past the colored band on inner and outer edge. */
export const RING_OUTLINE_WIDTH = 2;

export const RING_COLORS = {
  yellow: "#FCF968",
  pink: "#EAA5C2",
  blue: "#A4CAE7",
  green: "#BFDFC1",
  orange: "#FCC955",
} as const;

export type RingColorKey = keyof typeof RING_COLORS;

export const RING_COLOR_ORDER = Object.keys(RING_COLORS) as RingColorKey[];

export const RING_OUTLINE_COLOR = "#191919";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export type RingLayout = {
  ringRadius: number;
  strokeWidth: number;
};

/** Center of the ring in the preview frame. */
export function getRingCenter(
  containerWidth: number,
  containerHeight: number,
): { x: number; y: number } {
  return { x: containerWidth / 2, y: containerHeight / 2 };
}

/** Ring metrics sized to the preview frame (no label text). */
export function getRingLayout(
  containerWidth: number,
  containerHeight: number,
): RingLayout {
  const containerMin = Math.min(containerWidth, containerHeight);
  const maxRadius = Math.floor(containerMin * 0.485);
  const ringRadius = clamp(Math.round(containerMin * 0.44), 80, maxRadius);

  return {
    ringRadius,
    strokeWidth: RING_STROKE_WIDTH_MIN,
  };
}
