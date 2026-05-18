// Bug fix: fan blue card uses looping GIF (not MP4) so mobile shows animation immediately without play overlay.
// Recurring: iOS/Safari blocks muted video autoplay in fan stack — user sees play icon until tap; GIF loops like pink/yellow posters.
"use client";

import { useState } from "react";
import { getLinkedInGifUrl } from "@/lib/shareClipAssets";
import { SHARE_CARD_CLASS } from "./ShareVisualCard";

type ShareClipCardProps = {
  className?: string;
};

export function ShareClipCard({ className = "" }: ShareClipCardProps) {
  const [mediaError, setMediaError] = useState(false);
  const gifUrl = getLinkedInGifUrl("blue");

  return (
    <div className={`${SHARE_CARD_CLASS} ${className}`.trim()}>
      <div className="relative flex min-h-[200px] w-full items-center justify-center bg-black">
        {mediaError ? (
          <p className="px-3 text-center font-[family-name:var(--font-indivisible)] text-sm text-red-700">
            Animatie kon niet laden.
          </p>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gifUrl}
            alt=""
            className="block h-auto w-full max-h-[min(44vh,340px)] object-contain bg-black"
            onError={() => setMediaError(true)}
            aria-label="Werktelefoon animatie"
          />
        )}
      </div>
    </div>
  );
}
