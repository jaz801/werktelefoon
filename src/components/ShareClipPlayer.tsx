// Bug fix: autoplaying Remotion preview for share clip in social modals.
"use client";

import { Player } from "@remotion/player";
import {
  SHARE_CLIP_DURATION_FRAMES,
  SHARE_CLIP_FPS,
  ShareVisualClip,
  type ShareVisualClipProps,
} from "@/remotion/ShareVisualClip";

type ShareClipPlayerProps = ShareVisualClipProps & {
  width: number;
  height: number;
};

export function ShareClipPlayer({
  imageSrc,
  backgroundColor,
  width,
  height,
}: ShareClipPlayerProps) {
  return (
    <Player
      component={ShareVisualClip}
      inputProps={{ imageSrc, backgroundColor }}
      durationInFrames={SHARE_CLIP_DURATION_FRAMES}
      fps={SHARE_CLIP_FPS}
      compositionWidth={width}
      compositionHeight={height}
      style={{
        width: "100%",
        maxHeight: "min(50vh, 360px)",
        aspectRatio: `${width} / ${height}`,
      }}
      className="mx-auto"
      autoPlay
      loop
      controls={false}
      clickToPlay={false}
      initiallyMuted
      showVolumeControls={false}
    />
  );
}
