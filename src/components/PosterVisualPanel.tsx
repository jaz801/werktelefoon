// Bug fix: poster preview uses scaled canvas so PDF loads on mobile Safari.
// Print flow — poster.pdf with brand BG color picker + download/print.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  exportPosterVisualBlob,
  POSTER_OPTIONS,
  renderPosterVisual,
  type PosterType,
} from "@/lib/posterVisualExport";
import { type RingColorKey } from "@/lib/ringGeometry";
import { OutlineButton } from "./OutlineButton";
import { RingColorSwatches } from "./RingControls";

type PosterVisualPanelProps = {
  posterType: PosterType;
  onBack: () => void;
};

export function PosterVisualPanel({
  posterType,
  onBack,
}: PosterVisualPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState<RingColorKey>("blue");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const option = POSTER_OPTIONS[posterType];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    void renderPosterVisual(posterType, color, canvas)
      .catch(() => {
        if (!cancelled) setError("Poster laden mislukt.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [posterType, color]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    setError(null);
    try {
      const blob = await exportPosterVisualBlob(posterType, color);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${option.downloadName}-${color}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      setError("Download mislukt. Probeer het opnieuw.");
    } finally {
      setDownloading(false);
    }
  }, [posterType, color, option.downloadName]);

  const handlePrint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || loading) return;
    const dataUrl = canvas.toDataURL("image/png");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<html><head><title>${option.label}</title></head><body style="margin:0;display:flex;justify-content:center;"><img src="${dataUrl}" style="max-width:100%;height:auto;" onload="window.print();window.close();" /></body></html>`,
    );
    win.document.close();
  }, [loading, option.label]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex min-h-[240px] justify-center rounded-2xl border-2 border-black bg-white p-3">
        <canvas
          ref={canvasRef}
          className={`h-auto w-full max-w-[320px] transition-opacity ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          aria-label={`Voorbeeld ${option.label}`}
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

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <OutlineButton
          type="button"
          onClick={onBack}
          className="w-full sm:flex-1"
        >
          Terug
        </OutlineButton>
        <OutlineButton
          type="button"
          onClick={() => void handleDownload()}
          disabled={loading || downloading}
          className="w-full sm:flex-1"
        >
          {downloading ? "Bezig…" : "Download"}
        </OutlineButton>
        <OutlineButton
          type="button"
          onClick={handlePrint}
          disabled={loading}
          className="w-full sm:flex-1"
        >
          Print
        </OutlineButton>
      </div>
    </div>
  );
}
