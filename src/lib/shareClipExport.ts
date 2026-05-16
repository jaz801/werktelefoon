// Optional live clip export via Remotion web-renderer (pre-rendered MP4s preferred).
import {
  SHARE_CLIP_DURATION_FRAMES,
  SHARE_CLIP_FPS,
  ShareVisualClip,
  type ShareVisualClipProps,
} from "@/remotion/ShareVisualClip";

export async function exportShareClipBlob(
  width: number,
  height: number,
  inputProps: ShareVisualClipProps,
): Promise<Blob> {
  const { renderMediaOnWeb } = await import("@remotion/web-renderer");

  const { getBlob } = await renderMediaOnWeb({
    composition: {
      id: "werktelefoon-share-clip",
      component: ShareVisualClip,
      durationInFrames: SHARE_CLIP_DURATION_FRAMES,
      fps: SHARE_CLIP_FPS,
      width,
      height,
      defaultProps: inputProps,
    },
    inputProps,
    muted: true,
  });

  return getBlob();
}
