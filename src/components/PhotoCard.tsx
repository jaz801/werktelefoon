// Bug fix: ring centered in upload card; face detect still offsets when a face is found.
// Bug fix: empty state — animated profile ring demo; hero example photos removed.
// Bug fix: removed ring text controls; ring has black outline inside + outside.
// Editor: photo visible inside ring circle only; black fill outside (preview + export).
"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { detectFaceFromUrl } from "@/lib/detectFace";
import { exportComposedImage } from "@/lib/exportImage";
import {
  computeObjectContainLayout,
  mapImagePointToPreview,
  type DisplayLayout,
} from "@/lib/imageLayout";
import {
  clamp,
  getRingCenter,
  getRingLayout,
  RING_COLORS,
  type RingColorKey,
} from "@/lib/ringGeometry";
import { OutlineButton } from "./OutlineButton";
import { ProfileRingDemo } from "./ProfileRingDemo";
import { RingColorSwatches } from "./RingControls";
import { RingOverlay } from "./RingOverlay";

const PREVIEW_WIDTH = 360;
const PREVIEW_HEIGHT = 420;

export function PhotoCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [displayLayout, setDisplayLayout] = useState<DisplayLayout>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    displayWidth: 0,
    displayHeight: 0,
  });
  const [ringPosition, setRingPosition] = useState(() =>
    getRingCenter(PREVIEW_WIDTH, PREVIEW_HEIGHT),
  );
  const [ringColor, setRingColor] = useState<RingColorKey>("blue");
  const [downloading, setDownloading] = useState(false);

  const ringLayout = useMemo(
    () => getRingLayout(PREVIEW_WIDTH, PREVIEW_HEIGHT),
    [],
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

  const placeRingFromImage = useCallback(
    async (url: string, fallbackW: number, fallbackH: number) => {
      const detected = await detectFaceFromUrl(url);
      const w = detected?.width ?? fallbackW;
      const h = detected?.height ?? fallbackH;
      setNaturalSize({ w, h });

      const layout = computeObjectContainLayout(
        w,
        h,
        PREVIEW_WIDTH,
        PREVIEW_HEIGHT,
      );
      setDisplayLayout(layout);

      const ring = getRingLayout(PREVIEW_WIDTH, PREVIEW_HEIGHT);
      const r = ring.ringRadius;
      const center = getRingCenter(PREVIEW_WIDTH, PREVIEW_HEIGHT);
      let x = center.x;
      let y = center.y;

      if (detected?.face) {
        const mapped = mapImagePointToPreview(
          detected.face.centerX,
          detected.face.centerY,
          layout,
        );
        x = mapped.x;
        y = mapped.y;
      }

      setRingPosition({
        x: clamp(x, r, PREVIEW_WIDTH - r),
        y: clamp(y, r, PREVIEW_HEIGHT - r),
      });
    },
    [],
  );

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      if (!imageUrl) return;
      void placeRingFromImage(
        imageUrl,
        img.naturalWidth,
        img.naturalHeight,
      );
    },
    [imageUrl, placeRingFromImage],
  );

  const handleDownload = useCallback(async () => {
    if (!imageUrl || !naturalSize.w) return;
    setDownloading(true);
    try {
      const blob = await exportComposedImage({
        imageSrc: imageUrl,
        width: PREVIEW_WIDTH,
        height: PREVIEW_HEIGHT,
        ringCenterX: ringPosition.x,
        ringCenterY: ringPosition.y,
        ringRadius: ringLayout.ringRadius,
        displayLayout,
        ringColor: RING_COLORS[ringColor],
        strokeWidth: ringLayout.strokeWidth,
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
    ringPosition,
    ringLayout,
  ]);

  if (!imageUrl) {
    return (
      <div className="flex w-full max-w-md flex-col items-center px-1">
        <div className="relative w-full max-w-[360px] shrink-0">
          <ProfileRingDemo />
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </div>
        <OutlineButton
          onClick={() => inputRef.current?.click()}
          className="mt-3 w-full font-[family-name:var(--font-newake)]"
        >
          upload foto
        </OutlineButton>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center px-1">
      <div className="relative w-full max-w-[360px] shrink-0">
        <div
          className="relative mx-auto overflow-hidden rounded-3xl border-2 border-black bg-black"
          style={{
            width: "min(100%, 360px)",
            height: PREVIEW_HEIGHT,
            maxWidth: PREVIEW_WIDTH,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              clipPath: `circle(${ringLayout.ringRadius}px at ${ringPosition.x}px ${ringPosition.y}px)`,
            }}
          >
            <Image
              src={imageUrl}
              alt="Jouw profielfoto"
              fill
              className="object-contain"
              unoptimized
              onLoad={onImageLoad}
            />
          </div>
          <RingOverlay
            width={PREVIEW_WIDTH}
            height={PREVIEW_HEIGHT}
            ringRadius={ringLayout.ringRadius}
            strokeWidth={ringLayout.strokeWidth}
            ringColor={RING_COLORS[ringColor]}
            position={ringPosition}
            onPositionChange={setRingPosition}
          />
        </div>
        <OutlineButton
          onClick={handleDownload}
          disabled={downloading}
          className="mt-3 w-full font-[family-name:var(--font-indivisible)]"
        >
          {downloading ? "Bezig…" : "Download"}
        </OutlineButton>
      </div>
      <RingColorSwatches
        activeColor={ringColor}
        onColorChange={setRingColor}
      />
    </div>
  );
}
