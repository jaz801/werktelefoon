// Layout: copy options in a column right of the preview; colors below the image.
"use client";

import {
  RING_COLORS,
  RING_COPY,
  RING_TEXT_COLORS,
  type RingColorKey,
  type RingCopyKey,
  type RingFontWeightKey,
  type RingTextColorKey,
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
const WEIGHT_OPTIONS = ["medium", "bold"] as const satisfies readonly RingFontWeightKey[];
const TEXT_COLOR_KEYS = Object.keys(RING_TEXT_COLORS) as RingTextColorKey[];

export function RingColorSwatches({
  activeColor,
  onColorChange,
}: Pick<RingControlsProps, "activeColor" | "onColorChange">) {
  return (
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
  );
}

type RingCopySidebarProps = Pick<RingControlsProps, "activeCopy" | "onCopyChange"> & {
  activeWeight: RingFontWeightKey;
  onWeightChange: (key: RingFontWeightKey) => void;
  activeTextColor: RingTextColorKey;
  onTextColorChange: (key: RingTextColorKey) => void;
};

export function RingCopySidebar({
  activeCopy,
  onCopyChange,
  activeWeight,
  onWeightChange,
  activeTextColor,
  onTextColorChange,
}: RingCopySidebarProps) {
  return (
    <div className="flex w-full max-w-[280px] shrink-0 flex-col gap-3 sm:w-[220px] sm:max-w-none">
      {COPY_KEYS.map((key) => (
        <OutlineButton
          key={key}
          onClick={() => onCopyChange(key)}
          className={`w-full px-4 text-center font-[family-name:var(--font-newake)] leading-tight ${
            activeCopy === key ? "bg-black/10" : ""
          }`}
        >
          {RING_COPY[key]}
        </OutlineButton>
      ))}
      <div className="flex justify-center gap-3">
        {TEXT_COLOR_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            aria-label={key === "black" ? "Zwarte tekst" : "Witte tekst"}
            onClick={() => onTextColorChange(key)}
            className={`h-10 w-10 rounded-full border-2 transition ${
              activeTextColor === key
                ? "scale-110 border-black"
                : key === "white"
                  ? "border-black/25"
                  : "border-transparent"
            }`}
            style={{ backgroundColor: RING_TEXT_COLORS[key] }}
          />
        ))}
      </div>
      <div className="flex gap-2">
        {WEIGHT_OPTIONS.map((key) => (
          <OutlineButton
            key={key}
            onClick={() => onWeightChange(key)}
            className={`flex-1 px-3 text-center font-[family-name:var(--font-indivisible)] capitalize ${
              activeWeight === key ? "bg-black/10" : ""
            }`}
          >
            {key}
          </OutlineButton>
        ))}
      </div>
    </div>
  );
}
