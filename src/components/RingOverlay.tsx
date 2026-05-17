// Bug fix: removed ring text; black outline inside + outside colored band.
"use client";

import { useCallback, useRef } from "react";
import { clamp } from "@/lib/ringGeometry";
import { RingStroke } from "./RingStroke";

type RingOverlayProps = {
  width: number;
  height: number;
  ringRadius: number;
  strokeWidth: number;
  ringColor: string;
  position: { x: number; y: number };
  onPositionChange: (pos: { x: number; y: number }) => void;
};

export function RingOverlay({
  width,
  height,
  ringRadius,
  strokeWidth,
  ringColor,
  position,
  onPositionChange,
}: RingOverlayProps) {
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const toLocal = useCallback(
    (clientX: number, clientY: number) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return { x: position.x, y: position.y };
      return { x: clientX - rect.left, y: clientY - rect.top };
    },
    [position.x, position.y],
  );

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

  return (
    <RingStroke
      width={width}
      height={height}
      cx={position.x}
      cy={position.y}
      ringRadius={ringRadius}
      strokeWidth={strokeWidth}
      ringColor={ringColor}
      className="absolute inset-0 touch-none"
      svgProps={{
        ref: svgRef,
        style: { cursor: "grab" },
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerLeave: onPointerUp,
      }}
    />
  );
}
