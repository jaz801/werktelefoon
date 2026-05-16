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
  getRingLayout,
  RING_COLORS,
  RING_COPY,
  RING_LABEL_FONT_EXPORT,
  type RingColorKey,
  type RingCopyKey,
  type RingFontWeightKey,
  type RingTextColorKey,
} from "@/lib/ringGeometry";
import { OutlineButton } from "./OutlineButton";
import { RingColorSwatches, RingCopySidebar } from "./RingControls";
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
  const [ringPosition, setRingPosition] = useState({ x: 180, y: 140 });
  const [ringColor, setRingColor] = useState<RingColorKey>("blue");
  const [ringCopy, setRingCopy] = useState<RingCopyKey>("question");
  const [ringFontWeight, setRingFontWeight] =
    useState<RingFontWeightKey>("medium");
  const [ringTextColor, setRingTextColor] = useState<RingTextColorKey>("black");
  const [downloading, setDownloading] = useState(false);

  const ringText = RING_COPY[ringCopy];
  const ringLayout = useMemo(
    () => getRingLayout(ringText, PREVIEW_WIDTH, PREVIEW_HEIGHT),
    [ringText],
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

      const ring = getRingLayout(
        RING_COPY[ringCopy],
        PREVIEW_WIDTH,
        PREVIEW_HEIGHT,
      );
      const r = ring.ringRadius;
      let x = PREVIEW_WIDTH / 2;
      let y = layout.offsetY + layout.displayHeight * 0.32;

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
    [ringCopy],
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
        text: ringText,
        fontFamily: RING_LABEL_FONT_EXPORT,
        fontSize: ringLayout.fontSize,
        fontWeightKey: ringFontWeight,
        textColorKey: ringTextColor,
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
    ringCopy,
    ringFontWeight,
    ringTextColor,
    ringPosition,
    ringLayout,
    ringText,
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
          className="font-[family-name:var(--font-newake)]"
        >
          upload foto
        </OutlineButton>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[640px] flex-col items-center px-1">
      <div className="flex w-full flex-col items-center gap-4 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col items-center gap-4">
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
                fontSize={ringLayout.fontSize}
                strokeWidth={ringLayout.strokeWidth}
                ringColor={RING_COLORS[ringColor]}
                text={ringText}
                fontWeightKey={ringFontWeight}
                textColorKey={ringTextColor}
                position={ringPosition}
                onPositionChange={setRingPosition}
              />
            </div>
            <OutlineButton
              onClick={handleDownload}
              disabled={downloading}
              className="mt-3 w-full font-[family-name:var(--font-indivisible)] lg:absolute lg:bottom-0 lg:left-full lg:mt-0 lg:ml-3 lg:w-auto lg:whitespace-nowrap"
            >
              {downloading ? "Bezig…" : "Download"}
            </OutlineButton>
          </div>
          <RingColorSwatches
            activeColor={ringColor}
            onColorChange={setRingColor}
          />
        </div>
        <RingCopySidebar
          activeCopy={ringCopy}
          onCopyChange={setRingCopy}
          activeWeight={ringFontWeight}
          onWeightChange={setRingFontWeight}
          activeTextColor={ringTextColor}
          onTextColorChange={setRingTextColor}
        />
      </div>
    </div>
  );
}
