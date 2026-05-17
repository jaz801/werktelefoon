// Bug fix: placeholder icon pinned to ring center (not flex-centered in full frame).
// Bug fix: placeholder grey inside ring at 10% opacity (was 30% / solid neutral-800).
// Bug fix: mobile portrait — preview scales to card width so ring stays centered, not clipped.
// Bug fix: ring centered in upload card (was biased toward top at 40% height).
// Bug fix: empty upload preview — profile placeholder + ring colors cycle every 2s.
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getRingCenter,
  getRingLayout,
  RING_COLOR_ORDER,
  RING_COLORS,
  type RingColorKey,
} from "@/lib/ringGeometry";
import {
  PhotoPreviewFrame,
  PREVIEW_HEIGHT,
  PREVIEW_WIDTH,
} from "./PhotoPreviewFrame";
import { RingStroke } from "./RingStroke";

const COLOR_CYCLE_MS = 2000;

function ProfilePlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

export function ProfileRingDemo() {
  const [colorIndex, setColorIndex] = useState(0);
  const layout = useMemo(
    () => getRingLayout(PREVIEW_WIDTH, PREVIEW_HEIGHT),
    [],
  );
  const ringCenter = getRingCenter(PREVIEW_WIDTH, PREVIEW_HEIGHT);

  useEffect(() => {
    const id = window.setInterval(() => {
      setColorIndex((i) => (i + 1) % RING_COLOR_ORDER.length);
    }, COLOR_CYCLE_MS);
    return () => window.clearInterval(id);
  }, []);

  const activeKey: RingColorKey = RING_COLOR_ORDER[colorIndex]!;
  const ringColor = RING_COLORS[activeKey];

  return (
    <PhotoPreviewFrame>
      <div
        className="absolute inset-0 bg-black/10"
        style={{
          clipPath: `circle(${layout.ringRadius}px at ${ringCenter.x}px ${ringCenter.y}px)`,
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          left: ringCenter.x,
          top: ringCenter.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <ProfilePlaceholderIcon className="h-24 w-24 text-neutral-500 sm:h-28 sm:w-28" />
      </div>
      <RingStroke
        width={PREVIEW_WIDTH}
        height={PREVIEW_HEIGHT}
        cx={ringCenter.x}
        cy={ringCenter.y}
        ringRadius={layout.ringRadius}
        strokeWidth={layout.strokeWidth}
        ringColor={ringColor}
        colorTransition
      />
    </PhotoPreviewFrame>
  );
}
