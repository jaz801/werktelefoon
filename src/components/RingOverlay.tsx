// Label on the ring midline (top arc) so copy sits inside the colored stroke band.
"use client";

import { useCallback, useRef } from "react";
import {
  buildTopArcPath,
  clamp,
  getRingTextStyle,
  RING_LABEL_FONT,
  RING_TEXT_COLORS,
  type RingFontWeightKey,
  type RingTextColorKey,
} from "@/lib/ringGeometry";

type RingOverlayProps = {
  width: number;
  height: number;
  ringRadius: number;
  fontSize: number;
  strokeWidth: number;
  ringColor: string;
  text: string;
  fontWeightKey: RingFontWeightKey;
  textColorKey: RingTextColorKey;
  position: { x: number; y: number };
  onPositionChange: (pos: { x: number; y: number }) => void;
};

export function RingOverlay({
  width,
  height,
  ringRadius,
  fontSize,
  strokeWidth,
  ringColor,
  text,
  fontWeightKey,
  textColorKey,
  position,
  onPositionChange,
}: RingOverlayProps) {
  const textFill = RING_TEXT_COLORS[textColorKey];
  const textStyle = getRingTextStyle(fontWeightKey, fontSize);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const toLocal = useCallback((clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: position.x, y: position.y };
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, [position.x, position.y]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      e.preventDefault();
      const local = toLocal(e.clientX, e.clientY);
      dragging.current = true;
      offset.current = { x: local.x - position.x, y: local.y - position.y };
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    },
    [position.x, position.y, toLocal],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!dragging.current) return;
      const local = toLocal(e.clientX, e.clientY);
      const minX = ringRadius;
      const maxX = width - ringRadius;
      const minY = ringRadius;
      const maxY = height - ringRadius;
      onPositionChange({
        x: clamp(local.x - offset.current.x, minX, maxX),
        y: clamp(local.y - offset.current.y, minY, maxY),
      });
    },
    [height, onPositionChange, ringRadius, toLocal, width],
  );

  const onPointerUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    dragging.current = false;
    (e.currentTarget as Element).releasePointerCapture(e.pointerId);
  }, []);

  const textPathD = buildTopArcPath(position.x, position.y, ringRadius);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 touch-none"
      width={width}
      height={height}
      style={{ cursor: "grab" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <defs>
        <path id="ring-text-path" d={textPathD} fill="none" />
      </defs>
      <circle
        cx={position.x}
        cy={position.y}
        r={ringRadius}
        fill="none"
        stroke={ringColor}
        strokeWidth={strokeWidth}
      />
      <text
        fill={textFill}
        stroke={textStyle.textStroke ? textFill : undefined}
        strokeWidth={textStyle.textStroke}
        paintOrder={textStyle.textStroke ? "stroke fill" : undefined}
        dominantBaseline="central"
        style={{ fontFamily: RING_LABEL_FONT, fontWeight: textStyle.fontWeight }}
        fontSize={fontSize}
        letterSpacing="0"
        pointerEvents="none"
      >
        <textPath href="#ring-text-path" startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  );
}
