// Instagram visual: 4:5 (default) or 1:1 square crop.
"use client";

import type { InstagramAspectRatio } from "@/lib/shareVisualExport";
import { OutlineButton } from "./OutlineButton";

type InstagramAspectPickerProps = {
  value: InstagramAspectRatio;
  onChange: (value: InstagramAspectRatio) => void;
};

const OPTIONS: { value: InstagramAspectRatio; label: string }[] = [
  { value: "4:5", label: "4:5" },
  { value: "1:1", label: "1:1" },
];

export function InstagramAspectPicker({
  value,
  onChange,
}: InstagramAspectPickerProps) {
  return (
    <div className="flex flex-col gap-2" role="group" aria-label="Instagram formaat">
      <span className="text-center font-[family-name:var(--font-indivisible)] text-sm font-semibold text-[var(--text)]">
        Formaat
      </span>
      <div className="flex justify-center gap-2">
        {OPTIONS.map((opt) => (
          <OutlineButton
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`min-w-[5.5rem] px-4 text-base ${
              value === opt.value ? "bg-black/10" : ""
            }`}
          >
            {opt.label}
          </OutlineButton>
        ))}
      </div>
    </div>
  );
}
