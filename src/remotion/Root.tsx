// Remotion entry for pre-rendering share clips (npm run render:clips).
// Bug fix: compositions match Instagram 4:5, 1:1, and TikTok 9:16 from public/clips/frames/.
import { Composition } from "remotion";
import { staticFile } from "remotion";
import {
  SHARE_CLIP_DURATION_FRAMES,
  SHARE_CLIP_FPS,
  ShareVisualClip,
} from "./ShareVisualClip";

const BLUE = "#A4CAE7";

const CLIP_COMPOSITIONS = [
  {
    id: "instagram-4-5",
    width: 1080,
    height: 1350,
    frame: "instagram-4-5.png",
  },
  {
    id: "instagram-1-1",
    width: 1080,
    height: 1080,
    frame: "instagram-1-1.png",
  },
  {
    id: "tiktok",
    width: 1080,
    height: 1920,
    frame: "tiktok.png",
  },
] as const;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {CLIP_COMPOSITIONS.map((clip) => (
        <Composition
          key={clip.id}
          id={clip.id}
          component={ShareVisualClip}
          durationInFrames={SHARE_CLIP_DURATION_FRAMES}
          fps={SHARE_CLIP_FPS}
          width={clip.width}
          height={clip.height}
          defaultProps={{
            imageSrc: staticFile(`clips/frames/${clip.frame}`),
            backgroundColor: BLUE,
          }}
        />
      ))}
    </>
  );
};
