// Bug fix: static PNG visual only; clip lives on separate ShareClipPanel step.
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  exportShareVisualBlob,
  getShareVisualDimensions,
  renderShareVisual,
  type InstagramAspectRatio,
  type ShareVisualFormat,
} from "@/lib/shareVisualExport";
import { type RingColorKey } from "@/lib/ringGeometry";
import { InstagramAspectPicker } from "./InstagramAspectPicker";
import { OutlineButton } from "./OutlineButton";
import { RingColorSwatches } from "./RingControls";

type ShareVisualPanelProps = {
  format: ShareVisualFormat;
  onBack: () => void;
};

const PREVIEW_MAX: Record<ShareVisualFormat, string> = {
  whatsapp: "max-w-[320px]",
  instagram: "max-w-[320px]",
  linkedin: "max-w-[320px]",
  tiktok: "max-w-[220px]",
};

export function ShareVisualPanel({ format, onBack }: ShareVisualPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState<RingColorKey>("blue");
  const [instagramAspect, setInstagramAspect] =
    useState<InstagramAspectRatio>("4:5");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInstagram = format === "instagram";
  const visualOptions = useMemo(
    () => (isInstagram ? { instagramAspect } : {}),
    [isInstagram, instagramAspect],
  );

  const dimensions = useMemo(
    () => getShareVisualDimensions(format, visualOptions),
    [format, visualOptions],
  );

  const previewAspect = {
    aspectRatio: `${dimensions.width} / ${dimensions.height}`,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    void renderShareVisual(format, color, canvas, visualOptions)
      .catch(() => {
        if (!cancelled) setError("Visual laden mislukt.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [format, color, visualOptions]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    setError(null);
    try {
      const blob = await exportShareVisualBlob(format, color, visualOptions);
      const aspectSuffix =
        isInstagram && instagramAspect === "1:1" ? "-1-1" : "";
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `werktelefoon-${format}${aspectSuffix}-${color}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      setError("Download mislukt. Probeer het opnieuw.");
    } finally {
      setDownloading(false);
    }
  }, [format, color, visualOptions, isInstagram, instagramAspect]);

  return (
    <div className="flex flex-col gap-4">
      {isInstagram ? (
        <InstagramAspectPicker
          value={instagramAspect}
          onChange={setInstagramAspect}
        />
      ) : null}

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

      <div className="grid grid-cols-2 gap-3">
        <OutlineButton
          type="button"
          onClick={onBack}
          className="w-full"
        >
          Terug
        </OutlineButton>
        <OutlineButton
          type="button"
          onClick={() => void handleDownload()}
          disabled={loading || downloading}
          className="w-full"
        >
          {downloading ? "Bezig…" : "Download visual"}
        </OutlineButton>
      </div>
    </div>
  );
}
