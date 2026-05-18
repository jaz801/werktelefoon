// Bug fix: clip download with ring-color swatches + Remotion preview (per-color HD MP4).
"use client";

import type { ShareVisualFormat } from "@/lib/shareVisualExport";
import { ShareColoredMediaPanel } from "./ShareColoredMediaPanel";

type ShareClipPanelProps = {
  format: ShareVisualFormat;
  onBack: () => void;
};

export function ShareClipPanel({ format, onBack }: ShareClipPanelProps) {
  return (
    <ShareColoredMediaPanel format={format} media="clip" onBack={onBack} />
  );
}
