// Bug fix: CSS @keyframes jiggle missed on mobile Safari — use Web Animations API instead.
// Recurring: prefers-reduced-motion skips jiggle (iOS accessibility setting).

const JIGGLE_KEYFRAMES: Keyframe[] = [
  { transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)" },
  {
    transform: "translate3d(0, -4px, 0) rotate(-6deg) scale(1.03)",
    offset: 0.15,
  },
  {
    transform: "translate3d(0, 2px, 0) rotate(5deg) scale(0.98)",
    offset: 0.3,
  },
  {
    transform: "translate3d(0, -2px, 0) rotate(-4deg) scale(1.02)",
    offset: 0.45,
  },
  {
    transform: "translate3d(0, 1px, 0) rotate(3deg) scale(1)",
    offset: 0.6,
  },
  {
    transform: "translate3d(0, -1px, 0) rotate(-2deg) scale(1)",
    offset: 0.75,
  },
  { transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)", offset: 1 },
];

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** One-time wiggle on the donate CTA (works on mobile Safari). */
export function playDonateCtaJiggle(element: HTMLElement): Animation | null {
  if (prefersReducedMotion()) return null;
  if (typeof element.animate !== "function") return null;

  element.getAnimations().forEach((a) => a.cancel());

  const previousTransition = element.style.transitionProperty;
  element.style.transitionProperty = "background-color";

  const animation = element.animate(JIGGLE_KEYFRAMES, {
    duration: 850,
    easing: "cubic-bezier(0.36, 0.07, 0.19, 0.97)",
    fill: "none",
  });

  animation.addEventListener(
    "finish",
    () => {
      element.style.transitionProperty = previousTransition;
    },
    { once: true },
  );

  return animation;
}
