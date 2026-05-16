// Bug fix: no helper copy above swatches; LinkedIn preview shows full visual (contain).
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  exportShareVisualBlob,
  renderShareVisual,
  SHARE_FORMAT_SPECS,
  type ShareVisualFormat,
} from "@/lib/shareVisualExport";
import { type RingColorKey } from "@/lib/ringGeometry";
import { OutlineButton } from "./OutlineButton";
import { RingColorSwatches } from "./RingControls";

type ShareVisualPanelProps = {
  format: ShareVisualFormat;
  onBack: () => void;
};

const PREVIEW_MAX: Record<ShareVisualFormat, string> = {
  whatsapp: "max-w-[320px]",
  instagram: "max-w-[320px]",
  linkedin: "max-w-full",
  tiktok: "max-w-[220px]",
};

export function ShareVisualPanel({ format, onBack }: ShareVisualPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState<RingColorKey>("blue");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    void renderShareVisual(format, color, canvas)
      .catch(() => {
        if (!cancelled) setError("Visual laden mislukt.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [format, color]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    setError(null);
    try {
      const blob = await exportShareVisualBlob(format, color);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `werktelefoon-${format}-${color}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      setError("Download mislukt. Probeer het opnieuw.");
    } finally {
      setDownloading(false);
    }
  }, [format, color]);

  const spec = SHARE_FORMAT_SPECS[format];
  const previewAspect = {
    aspectRatio: `${spec.width} / ${spec.height}`,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex min-h-[200px] items-center justify-center rounded-2xl border-2 border-black bg-white p-3">
        <canvas
          ref={canvasRef}
          className={`max-h-[min(50vh,360px)] w-full ${PREVIEW_MAX[format]} object-contain transition-opacity ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          style={previewAspect}
          aria-label="Voorbeeld Werktelefoon visual"
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

      <div className="flex flex-col gap-3 sm:flex-row">
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
          {downloading ? "Bezig…" : "Download visual"}
        </OutlineButton>
      </div>
    </div>
  );
}
