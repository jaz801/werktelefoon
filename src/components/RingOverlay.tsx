// Bug fix: N/A — draggable SVG ring with curved Newake text over uploaded photo.
"use client";

import { useCallback, useRef } from "react";
import { buildCirclePath, clamp } from "@/lib/ringGeometry";

type RingOverlayProps = {
  width: number;
  height: number;
  ringRadius: number;
  ringColor: string;
  text: string;
  position: { x: number; y: number };
  onPositionChange: (pos: { x: number; y: number }) => void;
};

export function RingOverlay({
  width,
  height,
  ringRadius,
  ringColor,
  text,
  position,
  onPositionChange,
}: RingOverlayProps) {
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

  const pathD = buildCirclePath(position.x, position.y, ringRadius);
  const fontSize = Math.max(13, Math.round(ringRadius * 0.2));

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
        <path id="ring-text-path" d={pathD} fill="none" />
      </defs>
      <circle
        cx={position.x}
        cy={position.y}
        r={ringRadius}
        fill="none"
        stroke={ringColor}
        strokeWidth={10}
      />
      <text
        fill="#191919"
        style={{ fontFamily: "var(--font-newake), system-ui, sans-serif" }}
        fontSize={fontSize}
        letterSpacing="0.5"
        pointerEvents="none"
      >
        <textPath href="#ring-text-path" startOffset="22%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  );
}
