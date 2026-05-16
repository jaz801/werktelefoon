// Bug fix: clip step shows pre-rendered 7s MP4 (autoplay) + download next to visual flow.
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getPreRenderedClipDownloadName,
  getPreRenderedClipUrl,
  getShareClipVariant,
} from "@/lib/shareClipAssets";
import type {
  InstagramAspectRatio,
  ShareVisualFormat,
} from "@/lib/shareVisualExport";
import { InstagramAspectPicker } from "./InstagramAspectPicker";
import { OutlineButton } from "./OutlineButton";

type ShareClipPanelProps = {
  format: ShareVisualFormat;
  onBack: () => void;
};

export function ShareClipPanel({ format, onBack }: ShareClipPanelProps) {
  const [instagramAspect, setInstagramAspect] =
    useState<InstagramAspectRatio>("4:5");
  const [downloading, setDownloading] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const isInstagram = format === "instagram";
  const variant = useMemo(
    () => getShareClipVariant(format, instagramAspect),
    [format, instagramAspect],
  );
  const clipUrl = getPreRenderedClipUrl(variant);

  useEffect(() => {
    setVideoError(false);
  }, [clipUrl]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const response = await fetch(clipUrl);
      if (!response.ok) throw new Error("Clip niet gevonden");
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = getPreRenderedClipDownloadName(variant);
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      setVideoError(true);
    } finally {
      setDownloading(false);
    }
  }, [clipUrl, variant]);

  return (
    <div className="flex flex-col gap-4">
      {isInstagram ? (
        <InstagramAspectPicker
          value={instagramAspect}
          onChange={setInstagramAspect}
        />
      ) : null}

      <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-2xl border-2 border-black bg-white p-2">
        {videoError ? (
          <p className="px-4 text-center font-[family-name:var(--font-indivisible)] text-sm text-red-700">
            Clip kon niet laden. Voer lokaal{" "}
            <code className="text-xs">npm run render:clips</code> uit.
          </p>
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
            onError={() => setVideoError(true)}
            aria-label="Voorbeeld Werktelefoon clip"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <OutlineButton type="button" onClick={onBack} className="w-full">
          Terug
        </OutlineButton>
        <OutlineButton
          type="button"
          onClick={() => void handleDownload()}
          disabled={downloading || videoError}
          className="w-full"
        >
          {downloading ? "Bezig…" : "Download clip"}
        </OutlineButton>
      </div>
    </div>
  );
}
