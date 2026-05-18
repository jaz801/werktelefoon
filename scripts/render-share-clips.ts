// Pre-render HQ MP4 (CRF 12, PNG frames) + HD LinkedIn GIFs per ring color via Remotion CLI.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  LINKEDIN_GIF_COMPOSITION,
  RING_CLIP_COLORS,
  SHARE_CLIP_VARIANTS,
} from "../src/lib/shareClipAssets";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CLIPS_DIR = path.join(ROOT, "public", "clips");
const GIFS_DIR = path.join(CLIPS_DIR, "gifs");

/** HQ H.264: low CRF + lossless PNG frame pipeline (sharp text/QR). */
const MP4_RENDER_FLAGS =
  "--codec=h264 --crf=12 --pixel-format=yuv420p --image-format=png";

/** HD GIF: full 30fps at composition resolution. */
const GIF_RENDER_FLAGS = "--codec=gif";

function renderComposition(
  compositionId: string,
  output: string,
  extraFlags: string,
): void {
  execSync(
    `npx remotion render ${compositionId} "${output}" ${extraFlags}`,
    { cwd: ROOT, stdio: "inherit" },
  );
}

function main() {
  const mp4Only = process.argv.includes("--mp4-only");
  fs.mkdirSync(CLIPS_DIR, { recursive: true });
  fs.mkdirSync(GIFS_DIR, { recursive: true });

  for (const variant of SHARE_CLIP_VARIANTS) {
    for (const color of RING_CLIP_COLORS) {
      const compositionId = `${variant}-${color}`;
      const output = path.join(CLIPS_DIR, `${variant}-${color}.mp4`);
      console.log(`Rendering ${compositionId}…`);
      renderComposition(compositionId, output, MP4_RENDER_FLAGS);
    }
  }

  if (!mp4Only) {
    for (const color of RING_CLIP_COLORS) {
      const compositionId = `${LINKEDIN_GIF_COMPOSITION}-${color}`;
      const output = path.join(GIFS_DIR, `linkedin-${color}.gif`);
      console.log(`Rendering ${compositionId} (HD GIF)…`);
      renderComposition(compositionId, output, GIF_RENDER_FLAGS);
    }
  }

  console.log(
    mp4Only
      ? "All HQ MP4 clips rendered."
      : "All per-color clips and LinkedIn GIFs rendered.",
  );
}

main();
