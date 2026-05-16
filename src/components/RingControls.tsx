// Bug fix: N/A — ring color swatches, copy toggle, and download export.
"use client";

import {
  RING_COLORS,
  RING_COPY,
  type RingColorKey,
  type RingCopyKey,
} from "@/lib/ringGeometry";
import { OutlineButton } from "./OutlineButton";

type RingControlsProps = {
  activeColor: RingColorKey;
  activeCopy: RingCopyKey;
  onColorChange: (key: RingColorKey) => void;
  onCopyChange: (key: RingCopyKey) => void;
  onDownload: () => void;
  downloading?: boolean;
};

const COLOR_KEYS = Object.keys(RING_COLORS) as RingColorKey[];
const COPY_KEYS = Object.keys(RING_COPY) as RingCopyKey[];

export function RingControls({
  activeColor,
  activeCopy,
  onColorChange,
  onCopyChange,
  onDownload,
  downloading = false,
}: RingControlsProps) {
  return (
    <div className="mt-4 flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {COLOR_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            aria-label={`Ringkleur ${key}`}
            onClick={() => onColorChange(key)}
            className={`h-10 w-10 rounded-full border-2 transition ${
              activeColor === key ? "scale-110 border-black" : "border-transparent"
            }`}
            style={{ backgroundColor: RING_COLORS[key] }}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {COPY_KEYS.map((key) => (
          <OutlineButton
            key={key}
            onClick={() => onCopyChange(key)}
            className={`max-w-[200px] text-center font-[family-name:var(--font-newake)] text-xs leading-tight sm:max-w-none sm:text-sm ${
              activeCopy === key ? "bg-black/10" : ""
            }`}
          >
            {RING_COPY[key]}
          </OutlineButton>
        ))}
        <OutlineButton
          onClick={onDownload}
          disabled={downloading}
          className="font-[family-name:var(--font-indivisible)]"
        >
          {downloading ? "Bezig…" : "Download"}
        </OutlineButton>
      </div>
    </div>
  );
}
