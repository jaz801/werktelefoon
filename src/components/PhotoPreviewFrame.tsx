// Bug fix: upload card frame uses page bg (--bg), black border kept (was solid black fill).
// Bug fix: ring/canvas centered in card — scale from clientWidth, translate(-50%,-50%) (was top-left + border-box scale).
// Bug fix: thicker card border (border-4) to match CTA buttons.
// Bug fix: mobile portrait — scale 360×420 canvas to fit card so ring stays centered, not clipped.
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export const PREVIEW_WIDTH = 360;
export const PREVIEW_HEIGHT = 420;

type PhotoPreviewFrameProps = {
  children: ReactNode;
  className?: string;
};

export function PhotoPreviewFrame({
  children,
  className = "",
}: PhotoPreviewFrameProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / PREVIEW_WIDTH);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={outerRef}
      className={`relative mx-auto w-full max-w-[360px] overflow-hidden rounded-3xl border-4 border-black bg-[var(--bg)] ${className}`.trim()}
      style={{ aspectRatio: `${PREVIEW_WIDTH} / ${PREVIEW_HEIGHT}` }}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: PREVIEW_WIDTH,
          height: PREVIEW_HEIGHT,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
