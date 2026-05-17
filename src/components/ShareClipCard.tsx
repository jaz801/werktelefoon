// Bug fix: matches share cards — black fill under video (no white letterbox gutter).
"use client";

import { useState } from "react";
import { getPreRenderedClipUrl } from "@/lib/shareClipAssets";
import { SHARE_CARD_CLASS } from "./ShareVisualCard";

const CLIP_VARIANT = "instagram-4-5" as const;

type ShareClipCardProps = {
  className?: string;
};

export function ShareClipCard({ className = "" }: ShareClipCardProps) {
  const [videoError, setVideoError] = useState(false);
  const clipUrl = getPreRenderedClipUrl(CLIP_VARIANT);

  return (
    <div className={`${SHARE_CARD_CLASS} ${className}`.trim()}>
      <div className="relative flex min-h-[200px] w-full items-center justify-center bg-black">
        {videoError ? (
          <p className="px-3 text-center font-[family-name:var(--font-indivisible)] text-sm text-red-700">
            Video kon niet laden.
          </p>
        ) : (
          <video
            src={clipUrl}
            className="block h-auto w-full max-h-[min(44vh,340px)] object-contain bg-black"
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
            aria-label="Werktelefoon video animatie"
          />
        )}
      </div>
    </div>
  );
}
