// Bug fix: HQ per-color MP4 (CRF 12, PNG frames) + LinkedIn GIF. Re-render: npm run render:clips.
// Recurring: stale assets — bump VISUAL_ASSET_VERSION and npm run render:clips.
import type { InstagramAspectRatio } from "./shareVisualExport";
import type { ShareVisualFormat } from "./shareVisualExport";
import {
  RING_COLOR_ORDER,
  RING_COLORS,
  type RingColorKey,
} from "./ringGeometry";
import { VISUAL_ASSET_VERSION } from "./visualAssetVersion";

export type ShareClipVariant = "instagram-4-5" | "instagram-1-1" | "tiktok";

export const SHARE_CLIP_VARIANTS: ShareClipVariant[] = [
  "instagram-4-5",
  "instagram-1-1",
  "tiktok",
];

export const RING_CLIP_COLORS = RING_COLOR_ORDER;

export const DEFAULT_CLIP_COLOR: RingColorKey = "blue";

/** Remotion composition for LinkedIn GIF (4:5, 1080×1350). */
export const LINKEDIN_GIF_COMPOSITION: ShareClipVariant = "instagram-4-5";

export const CLIP_DIMENSIONS: Record<
  ShareClipVariant,
  { width: number; height: number }
> = {
  "instagram-4-5": { width: 1080, height: 1350 },
  "instagram-1-1": { width: 1080, height: 1080 },
  tiktok: { width: 1080, height: 1920 },
};

export function getShareClipVariant(
  format: ShareVisualFormat,
  instagramAspect: InstagramAspectRatio = "4:5",
): ShareClipVariant {
  if (format === "tiktok") return "tiktok";
  if (format === "instagram" && instagramAspect === "1:1") {
    return "instagram-1-1";
  }
  return "instagram-4-5";
}

export function getClipFrameFilename(
  variant: ShareClipVariant,
  color: RingColorKey = DEFAULT_CLIP_COLOR,
): string {
  return `${variant}-${color}.png`;
}

export function getClipFrameUrl(
  variant: ShareClipVariant,
  color: RingColorKey = DEFAULT_CLIP_COLOR,
): string {
  return `/clips/frames/${getClipFrameFilename(variant, color)}?v=${VISUAL_ASSET_VERSION}`;
}

export function getClipBackgroundColor(color: RingColorKey): string {
  return RING_COLORS[color];
}

export function getPreRenderedClipUrl(
  variant: ShareClipVariant,
  color: RingColorKey = DEFAULT_CLIP_COLOR,
): string {
  return `/clips/${variant}-${color}.mp4?v=${VISUAL_ASSET_VERSION}`;
}

export function getPreRenderedClipDownloadName(
  variant: ShareClipVariant,
  format?: ShareVisualFormat,
  color: RingColorKey = DEFAULT_CLIP_COLOR,
): string {
  if (format === "whatsapp") {
    return `werktelefoon-clip-whatsapp-${color}.mp4`;
  }
  if (format === "linkedin") {
    return `werktelefoon-clip-linkedin-${color}.mp4`;
  }
  return `werktelefoon-clip-${variant}-${color}.mp4`;
}

export function getLinkedInGifUrl(
  color: RingColorKey = DEFAULT_CLIP_COLOR,
): string {
  return `/clips/gifs/linkedin-${color}.gif?v=${VISUAL_ASSET_VERSION}`;
}

export function getLinkedInGifDownloadName(
  color: RingColorKey = DEFAULT_CLIP_COLOR,
): string {
  return `werktelefoon-linkedin-${color}.gif`;
}
