// Bug fix: pre-rendered 7s MP4 clips per platform format (no live browser render on download).
import type { InstagramAspectRatio } from "./shareVisualExport";
import type { ShareVisualFormat } from "./shareVisualExport";

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
  return "instagram-4-5";
}

export function getPreRenderedClipUrl(variant: ShareClipVariant): string {
  return `/clips/${variant}.mp4`;
}

export function getPreRenderedClipDownloadName(
  variant: ShareClipVariant,
): string {
  return `werktelefoon-clip-${variant}.mp4`;
}
