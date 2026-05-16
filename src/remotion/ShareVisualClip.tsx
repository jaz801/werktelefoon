// Bug fix: 7s share clip — animate in first ~1.5s, hold for Stories/Reels/TikTok/Snap.
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";

export const SHARE_CLIP_FPS = 30;
export const SHARE_CLIP_DURATION_SECONDS = 7;
export const SHARE_CLIP_DURATION_FRAMES =
  SHARE_CLIP_FPS * SHARE_CLIP_DURATION_SECONDS;

export type ShareVisualClipProps = {
  imageSrc: string;
  backgroundColor: string;
};

export const ShareVisualClip: React.FC<ShareVisualClipProps> = ({
  imageSrc,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 45], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 50], [0.88, 1], {
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [0, 50], [36, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity,
          transform: `translateY(${translateY}px) scale(${scale})`,
        }}
      >
        <Img
          src={imageSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
