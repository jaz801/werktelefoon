// Bug fix: removed ring copy/weight/text-color controls; color swatches only.
"use client";

import { RING_COLORS, type RingColorKey } from "@/lib/ringGeometry";

type RingColorSwatchesProps = {
  activeColor: RingColorKey;
  onColorChange: (key: RingColorKey) => void;
};

const COLOR_KEYS = Object.keys(RING_COLORS) as RingColorKey[];

export function RingColorSwatches({
  activeColor,
  onColorChange,
}: RingColorSwatchesProps) {
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
