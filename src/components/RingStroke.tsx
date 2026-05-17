// Shared ring circles — black outline inside + outside colored band.
import type { SVGProps } from "react";
import {
  RING_OUTLINE_COLOR,
  RING_OUTLINE_WIDTH,
} from "@/lib/ringGeometry";

type RingStrokeProps = {
  width: number;
  height: number;
  cx: number;
  cy: number;
  ringRadius: number;
  strokeWidth: number;
  ringColor: string;
  className?: string;
  colorTransition?: boolean;
  svgProps?: SVGProps<SVGSVGElement>;
};

export function RingStroke({
  width,
  height,
  cx,
  cy,
  ringRadius,
  strokeWidth,
  ringColor,
  className = "pointer-events-none absolute inset-0",
  colorTransition = false,
  svgProps,
}: RingStrokeProps) {
  const outlineStroke = strokeWidth + RING_OUTLINE_WIDTH * 2;
  const colorStyle = colorTransition
    ? { transition: "stroke 0.5s ease" }
    : undefined;

  return (
    <svg
      aria-hidden
      className={className}
      width={width}
      height={height}
      {...svgProps}
    >
      <circle
        cx={cx}
        cy={cy}
        r={ringRadius}
        fill="none"
        stroke={RING_OUTLINE_COLOR}
        strokeWidth={outlineStroke}
      />
      <circle
        cx={cx}
        cy={cy}
        r={ringRadius}
        fill="none"
        stroke={ringColor}
        strokeWidth={strokeWidth}
        style={colorStyle}
      />
    </svg>
  );
}
