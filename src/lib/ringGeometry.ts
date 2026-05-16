// Ring sizing + copy; labels use Indivisible (Newake demo lacks "?").
export const RING_STROKE_WIDTH_MIN = 28;

export const RING_COPY = {
  question: "Hoe gaat het met je?",
  brand: "Werktelefoon",
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

/** Indivisible has full punctuation; Newake demo omits glyphs like "?". */
export const RING_LABEL_FONT =
  "var(--font-indivisible), system-ui, sans-serif";
export const RING_LABEL_FONT_EXPORT = "Indivisible, system-ui, sans-serif";

export const RING_FONT_WEIGHTS = {
  medium: 500,
  bold: 700,
} as const;

export type RingFontWeightKey = keyof typeof RING_FONT_WEIGHTS;

export const RING_TEXT_COLORS = {
  black: "#191919",
  white: "#ffffff",
} as const;

export type RingTextColorKey = keyof typeof RING_TEXT_COLORS;

export const RING_TEXT_FILL = RING_TEXT_COLORS.black;

export type RingTextStyle = {
  fontWeight: number;
  /** Extra SVG stroke so black reads heavier than bold (single OTF has no 900 cut). */
  textStroke?: number;
};

export function getRingTextStyle(
  weight: RingFontWeightKey,
  fontSize: number,
): RingTextStyle {
  switch (weight) {
    case "bold":
      return {
        fontWeight: RING_FONT_WEIGHTS.bold,
        textStroke: fontSize * 0.07,
      };
    default:
      return { fontWeight: RING_FONT_WEIGHTS.medium };
  }
}

export function buildCirclePath(cx: number, cy: number, radius: number): string {
  return `M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx + radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx - radius} ${cy}`;
}

/** Top semicircle (west → east) — label sits on the upper arc inside the ring band. */
export function buildTopArcPath(cx: number, cy: number, radius: number): string {
  return `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 0 ${cx + radius} ${cy}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export type RingLayout = {
  ringRadius: number;
  fontSize: number;
  strokeWidth: number;
};

/** Ring + curved label metrics sized to the copy length and preview bounds. */
export function getRingLayout(
  text: string,
  containerWidth: number,
  containerHeight: number,
): RingLayout {
  const containerMin = Math.min(containerWidth, containerHeight);
  const maxRadius = Math.floor(containerMin * 0.485);
  const arcFraction = 0.55;
  const charWidthFactor = 0.58;

  let fontSize = clamp(Math.round(containerMin * 0.048), 11, 17);
  let ringRadius = Math.round(containerMin * 0.44);

  const radiusForText = (size: number, strokeWidth: number) =>
    (text.length * size * charWidthFactor) / (Math.PI * arcFraction) +
    strokeWidth / 2 +
    4;

  let strokeWidth = Math.max(
    RING_STROKE_WIDTH_MIN,
    Math.round(fontSize * 1.9),
  );
  fontSize = Math.min(fontSize, Math.floor(strokeWidth * 0.56));

  ringRadius = Math.round(
    clamp(
      Math.max(ringRadius, radiusForText(fontSize, strokeWidth)),
      ringRadius,
      maxRadius,
    ),
  );

  fontSize = clamp(
    Math.round(ringRadius * 0.12),
    11,
    Math.floor(strokeWidth * 0.56),
  );
  strokeWidth = Math.max(RING_STROKE_WIDTH_MIN, Math.round(fontSize * 1.9));

  const fitRadius = radiusForText(fontSize, strokeWidth);
  if (fitRadius > ringRadius) {
    ringRadius = Math.min(Math.round(fitRadius + 4), maxRadius);
    fontSize = Math.min(fontSize, Math.floor(strokeWidth * 0.56));
  }

  return {
    ringRadius,
    fontSize,
    strokeWidth,
  };
}
