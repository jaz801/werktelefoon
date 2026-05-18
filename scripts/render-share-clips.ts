// Pre-render 7s MP4 clips into public/clips/ via Remotion CLI (CRF 16, full composition size).
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SHARE_CLIP_VARIANTS } from "../src/lib/shareClipAssets";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CLIPS_DIR = path.join(ROOT, "public", "clips");

function main() {
  fs.mkdirSync(CLIPS_DIR, { recursive: true });

  for (const variant of SHARE_CLIP_VARIANTS) {
    const output = path.join(CLIPS_DIR, `${variant}.mp4`);
    console.log(`Rendering ${variant}…`);
    execSync(
      `npx remotion render ${variant} "${output}" --codec=h264 --crf=16 --pixel-format=yuv420p`,
      { cwd: ROOT, stdio: "inherit" },
    );
  }

  console.log("All clips rendered to public/clips/");
}

main();
