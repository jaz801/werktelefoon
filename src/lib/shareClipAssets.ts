// Bug fix: pre-rendered 7s MP4 clips per platform format (no live browser render on download).
// Recurring: stale MP4 after share-visual.png swap — bump VISUAL_ASSET_VERSION and npm run render:clips.
import type { InstagramAspectRatio } from "./shareVisualExport";
import type { ShareVisualFormat } from "./shareVisualExport";
import { VISUAL_ASSET_VERSION } from "./visualAssetVersion";

export type ShareClipVariant = "instagram-4-5" | "instagram-1-1" | "tiktok";

export const SHARE_CLIP_VARIANTS: ShareClipVariant[] = [
  "instagram-4-5",
  "instagram-1-1",
  "tiktok",
];

export function getShareClipVariant(
  format: ShareVisualFormat,
  instagramAspect: InstagramAspectRatio = "4:5",
): ShareClipVariant {
  if (format === "tiktok") return "tiktok";
  if (format === "instagram" && instagramAspect === "1:1") {
    return "instagram-1-1";
  }
  // WhatsApp, LinkedIn, and Instagram 4:5 share the same 1080×1350 clip.
  return "instagram-4-5";
}

export function getPreRenderedClipUrl(variant: ShareClipVariant): string {
  return `/clips/${variant}.mp4?v=${VISUAL_ASSET_VERSION}`;
}

export function getPreRenderedClipDownloadName(
  variant: ShareClipVariant,
  format?: ShareVisualFormat,
): string {
  if (format === "whatsapp") return "werktelefoon-clip-whatsapp.mp4";
  if (format === "linkedin") return "werktelefoon-clip-linkedin.mp4";
  return `werktelefoon-clip-${variant}.mp4`;
}
