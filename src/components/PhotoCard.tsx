// Bug fix: N/A — upload card (#A4CAE7) transforms into photo editor with ring + export.
"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { exportComposedImage } from "@/lib/exportImage";
import {
  RING_COLORS,
  RING_COPY,
  type RingColorKey,
  type RingCopyKey,
} from "@/lib/ringGeometry";
import { OutlineButton } from "./OutlineButton";
import { RingControls } from "./RingControls";
import { RingOverlay } from "./RingOverlay";

const PREVIEW_WIDTH = 360;
const PREVIEW_HEIGHT = 420;

export function PhotoCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [displayLayout, setDisplayLayout] = useState({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  });
  const [ringPosition, setRingPosition] = useState({ x: 180, y: 140 });
  const [ringColor, setRingColor] = useState<RingColorKey>("blue");
  const [ringCopy, setRingCopy] = useState<RingCopyKey>("question");
  const [downloading, setDownloading] = useState(false);

  const ringRadius = Math.round(
    Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.34,
  );

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const onFile = useCallback((file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  }, []);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      const { naturalWidth: w, naturalHeight: h } = img;
      setNaturalSize({ w, h });
      const scale = Math.min(PREVIEW_WIDTH / w, PREVIEW_HEIGHT / h);
      const offsetX = (PREVIEW_WIDTH - w * scale) / 2;
      const offsetY = (PREVIEW_HEIGHT - h * scale) / 2;
      setDisplayLayout({ scale, offsetX, offsetY });
      setRingPosition({
        x: PREVIEW_WIDTH / 2,
        y: offsetY + h * scale * 0.32,
      });
    },
    [],
  );

  const handleDownload = useCallback(async () => {
    if (!imageUrl || !naturalSize.w) return;
    setDownloading(true);
    try {
      const { scale, offsetX, offsetY } = displayLayout;
      const blob = await exportComposedImage({
        imageSrc: imageUrl,
        width: naturalSize.w,
        height: naturalSize.h,
        ringCenterX: (ringPosition.x - offsetX) / scale,
        ringCenterY: (ringPosition.y - offsetY) / scale,
        ringRadius: ringRadius / scale,
        ringColor: RING_COLORS[ringColor],
        text: RING_COPY[ringCopy],
        fontFamily: "Newake, system-ui, sans-serif",
        fontSize: Math.max(14, Math.round((ringRadius / scale) * 0.2)),
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "werktelefoon.png";
      link.click();
      URL.revokeObjectURL(link.href);
    } finally {
      setDownloading(false);
    }
  }, [
    imageUrl,
    naturalSize,
    displayLayout,
    ringColor,
    ringCopy,
    ringPosition,
    ringRadius,
  ]);

  if (!imageUrl) {
    return (
      <div
        className="flex min-h-[320px] w-full max-w-md flex-col items-center justify-center rounded-3xl border-2 border-dashed border-black p-8"
        style={{ backgroundColor: "#A4CAE7" }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <OutlineButton
          onClick={() => inputRef.current?.click()}
          className="font-[family-name:var(--font-newake)] text-base"
        >
          upload foto
        </OutlineButton>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center">
      <div
        className="relative overflow-hidden rounded-3xl border-2 border-black bg-white"
        style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
      >
        <Image
          src={imageUrl}
          alt="Jouw profielfoto"
          fill
          className="object-contain"
          unoptimized
          onLoad={onImageLoad}
        />
        <RingOverlay
          width={PREVIEW_WIDTH}
          height={PREVIEW_HEIGHT}
          ringRadius={ringRadius}
          ringColor={RING_COLORS[ringColor]}
          text={RING_COPY[ringCopy]}
          position={ringPosition}
          onPositionChange={setRingPosition}
        />
      </div>
      <RingControls
        activeColor={ringColor}
        activeCopy={ringCopy}
        onColorChange={setRingColor}
        onCopyChange={setRingCopy}
        onDownload={handleDownload}
        downloading={downloading}
      />
    </div>
  );
}
