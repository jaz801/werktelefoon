// Bug fix: clip preview plays HQ pre-rendered MP4; GIF preview + per-color download.
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_CLIP_COLOR,
  getLinkedInGifDownloadName,
  getLinkedInGifUrl,
  getPreRenderedClipDownloadName,
  getPreRenderedClipUrl,
  getShareClipVariant,
} from "@/lib/shareClipAssets";
import type { InstagramAspectRatio, ShareVisualFormat } from "@/lib/shareVisualExport";
import { type RingColorKey } from "@/lib/ringGeometry";
import { InstagramAspectPicker } from "./InstagramAspectPicker";
import { OutlineButton } from "./OutlineButton";
import { RingColorSwatches } from "./RingControls";

type ShareColoredMediaPanelProps = {
  format: ShareVisualFormat;
  media: "clip" | "gif";
  onBack: () => void;
};

export function ShareColoredMediaPanel({
  format,
  media,
  onBack,
}: ShareColoredMediaPanelProps) {
  const [color, setColor] = useState<RingColorKey>(DEFAULT_CLIP_COLOR);
  const [instagramAspect, setInstagramAspect] =
    useState<InstagramAspectRatio>("4:5");
  const [downloading, setDownloading] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  const isInstagram = format === "instagram" && media === "clip";
  const isGif = media === "gif";

  const variant = useMemo(
    () => getShareClipVariant(format, instagramAspect),
    [format, instagramAspect],
  );

  const clipUrl = getPreRenderedClipUrl(variant, color);
  const gifUrl = getLinkedInGifUrl(color);

  useEffect(() => {
    setMediaError(false);
  }, [clipUrl, gifUrl, color]);

  const handleDownload = useCallback(() => {
    setDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = isGif ? gifUrl : clipUrl;
      link.download = isGif
        ? getLinkedInGifDownloadName(color)
        : getPreRenderedClipDownloadName(variant, format, color);
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setMediaError(true);
    } finally {
      setDownloading(false);
    }
  }, [isGif, gifUrl, clipUrl, color, variant, format]);

  return (
    <div className="flex flex-col gap-4">
      {isInstagram ? (
        <InstagramAspectPicker
          value={instagramAspect}
          onChange={setInstagramAspect}
        />
      ) : null}

      <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-2xl border-2 border-black bg-white p-2">
        {mediaError ? (
          <p className="px-4 text-center font-[family-name:var(--font-indivisible)] text-sm text-red-700">
            {isGif ? "GIF" : "Clip"} kon niet laden. Voer lokaal{" "}
            <code className="text-xs">npm run render:clips</code> uit.
          </p>
        ) : isGif ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={gifUrl}
            src={gifUrl}
            alt="Voorbeeld Werktelefoon GIF"
            className="max-h-[min(55vh,420px)] w-full object-contain"
            onError={() => setMediaError(true)}
          />
        ) : (
          <video
            key={clipUrl}
            src={clipUrl}
            className="max-h-[min(55vh,420px)] w-full object-contain"
            autoPlay
            loop
            muted
            playsInline
            controls
            onError={() => setMediaError(true)}
            aria-label="Voorbeeld Werktelefoon clip"
          />
        )}
      </div>

      <RingColorSwatches activeColor={color} onColorChange={setColor} />

      <div className="grid grid-cols-2 gap-3">
        <OutlineButton type="button" onClick={onBack} className="w-full">
          Terug
        </OutlineButton>
        <OutlineButton
          type="button"
          onClick={handleDownload}
          disabled={downloading || mediaError}
          className="w-full"
        >
          {downloading
            ? "Bezig…"
            : isGif
              ? "Download GIF"
              : "Download clip"}
        </OutlineButton>
      </div>
    </div>
  );
}
