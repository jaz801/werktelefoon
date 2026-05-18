// Remotion entry — compositions per variant × ring color (npm run render:clips).
import { Composition } from "remotion";
import { staticFile } from "remotion";
import { RING_COLOR_ORDER, RING_COLORS } from "../lib/ringGeometry";
import {
  SHARE_CLIP_DURATION_FRAMES,
  SHARE_CLIP_FPS,
  ShareVisualClip,
} from "./ShareVisualClip";

const CLIP_COMPOSITIONS = [
  { id: "instagram-4-5", width: 1080, height: 1350 },
  { id: "instagram-1-1", width: 1080, height: 1080 },
  { id: "tiktok", width: 1080, height: 1920 },
] as const;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {CLIP_COMPOSITIONS.flatMap((clip) =>
        RING_COLOR_ORDER.map((color) => (
          <Composition
            key={`${clip.id}-${color}`}
            id={`${clip.id}-${color}`}
            component={ShareVisualClip}
            durationInFrames={SHARE_CLIP_DURATION_FRAMES}
            fps={SHARE_CLIP_FPS}
            width={clip.width}
            height={clip.height}
            defaultProps={{
              imageSrc: staticFile(`clips/frames/${clip.id}-${color}.png`),
              backgroundColor: RING_COLORS[color],
            }}
          />
        )),
      )}
    </>
  );
};
