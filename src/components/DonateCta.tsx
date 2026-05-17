// Bug fix: footnote always visible on mobile portrait (tap opens checkout — no hover).
// Bug fix: Web Animations API jiggle — CSS class toggle failed on mobile Safari portrait.
// Bug fix: tooltip below button, not clipped on right (sm: align to button end; centered on mobile).
"use client";

import { useEffect, useRef } from "react";
import { playDonateCtaJiggle, prefersReducedMotion } from "@/lib/donateCtaJiggle";
import { OutlineButton } from "./OutlineButton";

const CHECKOUT_URL =
  "https://werktelefoonbywerklef.plugandpay.com/checkout/help-mee";

const TOOLTIP =
  "* Slechts € 1,99 voor levenslang toegang tot De Werktelefoon en onze community.";

const JIGGLE_DELAY_MS = 450;

export function DonateCta() {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const timeoutId = window.setTimeout(() => {
      const el = buttonRef.current;
      if (el) playDonateCtaJiggle(el);
    }, JIGGLE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div className="group/donate relative flex w-full max-w-[min(100%,320px)] justify-center overflow-visible sm:ml-auto sm:max-w-[300px] sm:justify-end">
      <OutlineButton
        ref={buttonRef}
        id="donate-cta"
        href={CHECKOUT_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby="donate-cta-tip"
        className="relative z-10 shrink-0 px-4 py-2.5 font-[family-name:var(--font-newake)] text-lg sm:px-5 sm:text-xl"
      >
        Ik doe mee!*
      </OutlineButton>
      <p
        id="donate-cta-tip"
        role="tooltip"
        className="pointer-events-none absolute top-[calc(100%+8px)] left-1/2 z-50 w-[min(300px,calc(100dvw-2rem))] -translate-x-1/2 rounded-2xl border-2 border-black bg-[var(--bg)] px-3 py-2.5 text-center font-[family-name:var(--font-indivisible)] text-[11px] font-normal leading-snug text-[var(--text)] opacity-0 shadow-md transition-opacity duration-200 max-sm:portrait:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover/donate:opacity-100 group-focus-within/donate:opacity-100 sm:left-auto sm:right-0 sm:translate-x-0"
      >
        {TOOLTIP}
      </p>
    </div>
  );
}
