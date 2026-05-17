// Bug fix: subtler arrow — thinner stroke, lower opacity, smaller head/ball (was too prominent).
// Bug fix: arrow static on load; blue ball runs path once then hides at arrowhead (no line draw-in).
// Recurring: arrowhead overlapped donate CTA when y2 used donateRect.bottom - gap (marker extends past path end).
// L-shaped arrow beside intro copy; smooth bend points at doneer CTA with gap.
"use client";

import { useEffect, useId, useRef, useState } from "react";

/** Whitespace between button bottom and where the stroke ends (arrowhead sits above this point). */
const GAP_BELOW_BUTTON = 32;
const START_AFTER_TEXT = 12;
const CORNER_RADIUS = 32;

/** Horizontal leg, quadratic rounded corner, vertical leg — end stops short of CTA. */
function buildElbowPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cornerRadius = CORNER_RADIUS,
): string {
  const dx = x2 - x1;
  const rise = y1 - y2;
  if (dx < 16 || rise < 16) return "";

  const r = Math.min(cornerRadius, dx * 0.45, rise * 0.45);
  return [
    `M ${x1} ${y1}`,
    `L ${x2 - r} ${y1}`,
    `Q ${x2} ${y1}, ${x2} ${y1 - r}`,
    `L ${x2} ${y2}`,
  ].join(" ");
}

export function DonateArrow() {
  const markerId = useId();
  const pathRef = useRef<SVGPathElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const hasAnimatedRef = useRef(false);
  const [geometry, setGeometry] = useState<{
    path: string;
    box: { left: number; top: number; width: number; height: number };
  } | null>(null);

  useEffect(() => {
    const update = () => {
      const section = document.getElementById("intro-section");
      const intro = document.getElementById("intro-copy");
      const donate = document.getElementById("donate-cta");
      if (!section || !intro || !donate) return;

      const sectionRect = section.getBoundingClientRect();
      const introRect = intro.getBoundingClientRect();
      const donateRect = donate.getBoundingClientRect();

      const x1 = introRect.right - sectionRect.left + START_AFTER_TEXT;
      const y1 = introRect.top - sectionRect.top + introRect.height * 0.5;

      const x2 = donateRect.left - sectionRect.left + donateRect.width / 2;
      const y2 =
        donateRect.bottom - sectionRect.top + GAP_BELOW_BUTTON;

      const path = buildElbowPath(x1, y1, x2, y2);
      if (!path) return;

      setGeometry({
        path,
        box: {
          left: sectionRect.left,
          top: sectionRect.top,
          width: sectionRect.width,
          height: Math.max(
            sectionRect.height,
            donateRect.bottom - sectionRect.top + 16,
          ),
        },
      });
    };

    const t = window.setTimeout(update, 200);
    window.addEventListener("resize", update);
    window.addEventListener("load", update);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", update);
      window.removeEventListener("load", update);
    };
  }, []);

  useEffect(() => {
    const pathEl = pathRef.current;
    const circleEl = circleRef.current;
    if (!pathEl || !circleEl || !geometry) return;

    const pathLength = pathEl.getTotalLength();
    const placeBall = (t: number) => {
      const point = pathEl.getPointAtLength(t * pathLength);
      circleEl.setAttribute("cx", String(point.x));
      circleEl.setAttribute("cy", String(point.y));
    };

    const hideBall = () => {
      circleEl.setAttribute("opacity", "0");
    };

    const showBall = () => {
      circleEl.setAttribute("opacity", "1");
    };

    if (hasAnimatedRef.current) {
      hideBall();
      return;
    }

    let progress = 0;
    const speed = 0.006;
    let raf = 0;

    const startAnimation = () => {
      showBall();
      placeBall(0);

      const animate = () => {
        progress += speed;
        if (progress >= 1) {
          hideBall();
          hasAnimatedRef.current = true;
          return;
        }

        placeBall(progress);
        raf = requestAnimationFrame(animate);
      };

      raf = requestAnimationFrame(animate);
    };

    const delay = window.setTimeout(startAnimation, 400);
    return () => {
      window.clearTimeout(delay);
      cancelAnimationFrame(raf);
    };
  }, [geometry]);

  if (!geometry) return null;

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-visible"
      width={geometry.box.width}
      height={geometry.box.height}
      style={{
        width: geometry.box.width,
        height: geometry.box.height,
      }}
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="7"
          markerHeight="7"
          refX="1.5"
          refY="3.5"
          orient="auto"
        >
          <path
            d="M0,0 L7,3.5 L0,7 L1.75,3.5 Z"
            fill="var(--text)"
            fillOpacity={0.45}
          />
        </marker>
      </defs>
      <path
        ref={pathRef}
        d={geometry.path}
        fill="none"
        stroke="var(--text)"
        strokeOpacity={0.45}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={`url(#${markerId})`}
      />
      <circle
        ref={circleRef}
        r={4}
        fill="var(--blue)"
        fillOpacity={0.85}
        stroke="var(--text)"
        strokeOpacity={0.45}
        strokeWidth={1}
        opacity={0}
      />
    </svg>
  );
}
