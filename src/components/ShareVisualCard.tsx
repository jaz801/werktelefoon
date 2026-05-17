// Bug fix: card frame was white (bg-white + padding) — black border flush on black fill.
"use client";

import { useEffect, useRef, useState } from "react";
import { getShareVisualDimensions, renderShareVisual } from "@/lib/shareVisualExport";
import { type RingColorKey } from "@/lib/ringGeometry";

const FORMAT = "instagram" as const;

export const SHARE_CARD_CLASS =
  "overflow-hidden rounded-2xl border-2 border-black bg-black shadow-[5px_8px_0_rgba(0,0,0,0.14)]";

type ShareVisualCardProps = {
  color: RingColorKey;
  className?: string;
};

export function ShareVisualCard({ color, className = "" }: ShareVisualCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  const dimensions = getShareVisualDimensions(FORMAT);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    setLoading(true);

    void renderShareVisual(FORMAT, color, canvas)
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [color]);

  return (
    <div className={`${SHARE_CARD_CLASS} ${className}`.trim()}>
      <div className="relative flex w-full items-center justify-center bg-black">
        <canvas
          ref={canvasRef}
          className={`block h-auto w-full max-h-[min(44vh,340px)] object-contain transition-opacity ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          style={{ aspectRatio: `${dimensions.width} / ${dimensions.height}` }}
          aria-hidden={loading}
          aria-label={`Werktelefoon visual ${color}`}
        />
        {loading ? (
          <span className="absolute font-[family-name:var(--font-indivisible)] text-sm text-[var(--text)]/60">
            …
          </span>
        ) : null}
      </div>
    </div>
  );
}
