// Bug fix: LinkedIn GIF — ring-color swatches + HD Remotion GIF per color.
"use client";

import { ShareColoredMediaPanel } from "./ShareColoredMediaPanel";

type ShareGifPanelProps = {
  onBack: () => void;
};

export function ShareGifPanel({ onBack }: ShareGifPanelProps) {
  return (
    <ShareColoredMediaPanel format="linkedin" media="gif" onBack={onBack} />
  );
}
