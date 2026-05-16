// Bug fix: Print button — koffiezetapparaat / WC poster with BG color picker (poster.pdf).
"use client";

import { useEffect, useState } from "react";
import {
  POSTER_OPTIONS,
  type PosterType,
} from "@/lib/posterVisualExport";
import { OutlineButton } from "./OutlineButton";
import { PosterVisualPanel } from "./PosterVisualPanel";

type PrintShareModalProps = {
  onClose: () => void;
};

type PrintStep = "choose" | "visual";

const POSTER_TYPES = Object.keys(POSTER_OPTIONS) as PosterType[];

export function PrintShareModal({ onClose }: PrintShareModalProps) {
  const [step, setStep] = useState<PrintStep>("choose");
  const [posterType, setPosterType] = useState<PosterType | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (step === "visual") setStep("choose");
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, onClose]);

  const title =
    step === "choose" ? "Print" : POSTER_OPTIONS[posterType!].label;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-share-title"
      onClick={onClose}
    >
      <div
        className={`flex max-h-[min(92dvh,90vh)] w-full flex-col gap-4 overflow-y-auto rounded-t-3xl border-2 border-black bg-[var(--bg)] p-4 shadow-lg sm:max-h-[90vh] sm:rounded-3xl sm:p-6 ${
          step === "visual" ? "sm:max-w-xl" : "sm:max-w-lg"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2
            id="print-share-title"
            className="font-[family-name:var(--font-newake)] text-2xl text-[var(--text)]"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sluiten"
            className="shrink-0 rounded-full border-2 border-black px-3 py-1 font-[family-name:var(--font-indivisible)] text-lg leading-none hover:bg-black/5"
          >
            ×
          </button>
        </div>

        {step === "choose" ? (
          <div className="flex flex-col gap-3">
            {POSTER_TYPES.map((type) => (
              <OutlineButton
                key={type}
                type="button"
                onClick={() => {
                  setPosterType(type);
                  setStep("visual");
                }}
                className="w-full"
              >
                {POSTER_OPTIONS[type].label}
              </OutlineButton>
            ))}
          </div>
        ) : posterType ? (
          <PosterVisualPanel
            posterType={posterType}
            onBack={() => setStep("choose")}
          />
        ) : null}
      </div>
    </div>
  );
}
