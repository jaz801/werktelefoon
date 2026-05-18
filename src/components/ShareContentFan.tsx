// Bug fix: fan stack colors roze / geel / blauw (middle card yellow, not green).
// Bug fix: vertical offset applied in PhotoCard companion wrapper (inline marginTop).
// Bug fix: fan stack height matches upload preview aspect so it centers on the foto card.
"use client";

import { ShareClipCard } from "./ShareClipCard";
import { ShareVisualCard } from "./ShareVisualCard";
import {
  PREVIEW_HEIGHT,
  PREVIEW_WIDTH,
} from "./PhotoPreviewFrame";

const CARD_W =
  "w-[min(240px,calc(100vw-3rem))] sm:w-[min(260px,42vw)] md:w-[min(280px,32vw)]";

export function ShareContentFan() {
  return (
    <div
      className="relative mx-auto flex w-full max-w-[min(100%,420px)] items-center justify-center overflow-visible"
      style={{
        aspectRatio: `${PREVIEW_WIDTH} / ${PREVIEW_HEIGHT}`,
        minHeight: `min(${PREVIEW_HEIGHT}px, calc((100vw - 3rem) * ${PREVIEW_HEIGHT} / ${PREVIEW_WIDTH}))`,
      }}
      aria-label="Voorbeelden: roze visual, gele visual en blauwe animatie"
    >
      <div
        className={`absolute left-1/2 top-1/2 ${CARD_W}`}
        style={{
          transform:
            "translate(calc(-50% - 2.75rem), calc(-50% + 0.35rem)) rotate(-7deg)",
          transformOrigin: "50% 88%",
          zIndex: 10,
        }}
      >
        <ShareVisualCard color="pink" />
      </div>

      <div
        className={`absolute left-1/2 top-1/2 ${CARD_W}`}
        style={{
          transform: "translate(-50%, calc(-50% - 0.65rem)) rotate(0deg)",
          transformOrigin: "50% 88%",
          zIndex: 20,
        }}
      >
        <ShareVisualCard color="yellow" />
      </div>

      <div
        className={`absolute left-1/2 top-1/2 ${CARD_W}`}
        style={{
          transform:
            "translate(calc(-50% + 2.75rem), calc(-50% + 0.35rem)) rotate(7deg)",
          transformOrigin: "50% 88%",
          zIndex: 30,
        }}
      >
        <ShareClipCard />
      </div>
    </div>
  );
}
