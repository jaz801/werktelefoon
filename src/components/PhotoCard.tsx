// Bug fix: share fan offset 50px up via inline marginTop (Tailwind translate was not shifting layout).
// Bug fix: upload/download sit under preview column, not below preview+fan row.
// Bug fix: companion (share fan) aligns to preview frame center via md:flex-row items-center.
// Bug fix: download uses full photo resolution (exportScale), not 360×420 preview pixels.
// Bug fix: mobile portrait — preview scales to card width so ring stays centered, not clipped.
// Bug fix: ring centered in upload card; face detect still offsets when a face is found.
// Bug fix: empty state — animated profile ring demo; hero example photos removed.
// Bug fix: removed ring text controls; ring has black outline inside + outside.
// Editor: photo visible inside ring circle only; black fill outside (preview + export).
"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { detectFaceFromUrl } from "@/lib/detectFace";
import { exportComposedImage } from "@/lib/exportImage";
import {
  capExportScale,
  computeObjectContainLayout,
  getExportScaleFactor,
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
import {
  PhotoPreviewFrame,
  PREVIEW_HEIGHT,
  PREVIEW_WIDTH,
} from "./PhotoPreviewFrame";
import { ProfileRingDemo } from "./ProfileRingDemo";
import { RingColorSwatches } from "./RingControls";
import { RingOverlay } from "./RingOverlay";

/** Pixels to shift the share fan stack upward (inline style — reliable in flex layout). */
export const SHARE_FAN_OFFSET_Y_PX = 50;

type PhotoCardProps = {
  /** Shown beside the preview frame (e.g. fanned share cards), vertically centered on it. */
  companion?: ReactNode;
};

function PhotoCardShell({
  companion,
  preview,
  belowPreview,
  footer,
}: {
  companion?: ReactNode;
  preview: ReactNode;
  belowPreview?: ReactNode;
  footer?: ReactNode;
}) {
  const paired = Boolean(companion);

  return (
    <div
      className={`flex w-full flex-col items-center px-1 ${paired ? "max-w-6xl" : "max-w-md"}`}
    >
      <div
        className={`flex w-full flex-col items-center gap-10 ${
          paired
            ? "md:flex-row md:items-center md:justify-center md:gap-8 lg:gap-12"
            : ""
        }`}
      >
        <div className="flex w-full max-w-[360px] shrink-0 flex-col items-center">
          {preview}
          {belowPreview ? (
            <div className="mt-3 w-full">{belowPreview}</div>
          ) : null}
        </div>
        {companion ? (
          <div
            className="relative z-10 flex w-full flex-1 items-center justify-center px-2 md:w-auto md:min-w-0"
            style={{ marginTop: `-${SHARE_FAN_OFFSET_Y_PX}px` }}
          >
            {companion}
          </div>
        ) : null}
      </div>
      {footer}
    </div>
  );
}

export function PhotoCard({ companion }: PhotoCardProps) {
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
      const fullScale = getExportScaleFactor(displayLayout, naturalSize.w);
      const exportScale = capExportScale(
        fullScale,
        PREVIEW_WIDTH,
        PREVIEW_HEIGHT,
      );
      const blob = await exportComposedImage({
        imageSrc: imageUrl,
        width: PREVIEW_WIDTH,
        height: PREVIEW_HEIGHT,
        exportScale,
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
      <PhotoCardShell
        companion={companion}
        preview={
          <>
            <ProfileRingDemo />
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </>
        }
        belowPreview={
          <OutlineButton
            onClick={() => inputRef.current?.click()}
            className="w-full font-[family-name:var(--font-newake)]"
          >
            upload foto
          </OutlineButton>
        }
      />
    );
  }

  return (
    <PhotoCardShell
      companion={companion}
      preview={
        <PhotoPreviewFrame>
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
        </PhotoPreviewFrame>
      }
      belowPreview={
        <OutlineButton
          onClick={handleDownload}
          disabled={downloading}
          className="w-full font-[family-name:var(--font-indivisible)]"
        >
          {downloading ? "Bezig…" : "Download"}
        </OutlineButton>
      }
      footer={
        <RingColorSwatches
          activeColor={ringColor}
          onColorChange={setRingColor}
        />
      }
    />
  );
}
