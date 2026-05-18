// Bug fix: LinkedIn banner — 1584×396 PNG download; preview canvas matches export resolution.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  exportLinkedInBannerBlob,
  getLinkedInBannerDimensions,
  renderLinkedInBanner,
} from "@/lib/shareBannerExport";
import { type RingColorKey } from "@/lib/ringGeometry";
import { OutlineButton } from "./OutlineButton";
import { RingColorSwatches } from "./RingControls";

type ShareBannerPanelProps = {
  onBack: () => void;
};

export function ShareBannerPanel({ onBack }: ShareBannerPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState<RingColorKey>("blue");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dimensions = getLinkedInBannerDimensions();
  const previewAspect = {
    aspectRatio: `${dimensions.width} / ${dimensions.height}`,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    void renderLinkedInBanner(color, canvas)
      .catch(() => {
        if (!cancelled) setError("Banner laden mislukt.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [color]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    setError(null);
    try {
      const blob = await exportLinkedInBannerBlob(color);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `werktelefoon-linkedin-banner-${color}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      setError("Download mislukt. Probeer het opnieuw.");
    } finally {
      setDownloading(false);
    }
  }, [color]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex min-h-[120px] items-center justify-center rounded-2xl border-2 border-black bg-white p-3">
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className={`max-h-[min(28vh,200px)] w-full max-w-full object-contain transition-opacity ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          style={previewAspect}
          aria-label="Voorbeeld LinkedIn banner"
        />
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-indivisible)] text-[var(--text)]">
            Laden…
          </div>
        ) : null}
      </div>

      <RingColorSwatches activeColor={color} onColorChange={setColor} />

      {error ? (
        <p className="text-center font-[family-name:var(--font-indivisible)] text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <OutlineButton type="button" onClick={onBack} className="w-full">
          Terug
        </OutlineButton>
        <OutlineButton
          type="button"
          onClick={() => void handleDownload()}
          disabled={loading || downloading}
          className="w-full"
        >
          {downloading ? "Bezig…" : "Download banner"}
        </OutlineButton>
      </div>
    </div>
  );
}
