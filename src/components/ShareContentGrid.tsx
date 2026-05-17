// Bug fix: share fan vertically centered on upload preview frame (companion on PhotoCard).
import { PhotoCard } from "./PhotoCard";
import { ShareContentFan } from "./ShareContentFan";

export function ShareContentGrid() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <PhotoCard companion={<ShareContentFan />} />
    </div>
  );
}
