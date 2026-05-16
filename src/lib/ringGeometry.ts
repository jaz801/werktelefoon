// Bug fix: N/A — shared ring path math for SVG preview and canvas export.
export const RING_COPY = {
  question: "hoe gaat het echt met je?",
  brand: "Werktelefoon.",
} as const;

export type RingCopyKey = keyof typeof RING_COPY;

export const RING_COLORS = {
  yellow: "#FCF968",
  pink: "#EAA5C2",
  blue: "#A4CAE7",
  green: "#BFDFC1",
  orange: "#FCC955",
} as const;

export type RingColorKey = keyof typeof RING_COLORS;

export function buildCirclePath(cx: number, cy: number, radius: number): string {
  return `M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx + radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx - radius} ${cy}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
