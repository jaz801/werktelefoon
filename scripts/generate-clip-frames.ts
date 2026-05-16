// Generates PNG frames for Remotion clip pre-render (blue theme, per platform size).
import { createCanvas, loadImage } from "@napi-rs/canvas";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RING_COLORS } from "../src/lib/ringGeometry";
import {
  applyBackgroundColor,
  drawContain,
  getContentBounds,
  sampleSourceBackground,
  type Rgb,
} from "../src/lib/visualColorReplace";
import {
  INSTAGRAM_SQUARE_SIZE,
  INSTAGRAM_VISUAL_HEIGHT,
  INSTAGRAM_VISUAL_WIDTH,
  TIKTOK_VISUAL_HEIGHT,
  TIKTOK_VISUAL_WIDTH,
} from "../src/lib/shareVisualExport";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const FRAMES_DIR = path.join(ROOT, "public", "clips", "frames");
const SOURCE_PATH = path.join(ROOT, "public", "share-visual.png");
const COLOR_KEY = "blue" as const;

function renderContentFit(
  source: ReturnType<typeof createCanvas>,
  sourceBg: Rgb,
  outW: number,
  outH: number,
): ReturnType<typeof createCanvas> {
  const srcCtx = source.getContext("2d")!;
  const data = srcCtx.getImageData(0, 0, source.width, source.height);
  const bounds = getContentBounds(data, sourceBg);

  const canvas = createCanvas(outW, outH);
  const ctx = canvas.getContext("2d")!;
  drawContain(
    ctx,
    source as unknown as CanvasImageSource,
    bounds.w,
    bounds.h,
    outW,
    outH,
    RING_COLORS[COLOR_KEY],
    bounds.x,
    bounds.y,
  );
  return canvas;
}

async function getColoredSource() {
  const image = await loadImage(SOURCE_PATH);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, 0, 0);
  const sourceBg = sampleSourceBackground(ctx, image.width, image.height);
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  applyBackgroundColor(imageData, sourceBg, COLOR_KEY);
  ctx.putImageData(imageData, 0, 0);
  return { canvas, sourceBg };
}

async function main() {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
  const { canvas: source, sourceBg } = await getColoredSource();

  const exports: { name: string; canvas: ReturnType<typeof createCanvas> }[] = [
    {
      name: "instagram-4-5.png",
      canvas: createCanvas(INSTAGRAM_VISUAL_WIDTH, INSTAGRAM_VISUAL_HEIGHT),
    },
    {
      name: "instagram-1-1.png",
      canvas: renderContentFit(
        source,
        sourceBg,
        INSTAGRAM_SQUARE_SIZE,
        INSTAGRAM_SQUARE_SIZE,
      ),
    },
    {
      name: "tiktok.png",
      canvas: renderContentFit(
        source,
        sourceBg,
        TIKTOK_VISUAL_WIDTH,
        TIKTOK_VISUAL_HEIGHT,
      ),
    },
  ];

  const nativeCtx = exports[0].canvas.getContext("2d")!;
  nativeCtx.drawImage(source as unknown as CanvasImageSource, 0, 0);

  for (const item of exports) {
    const outPath = path.join(FRAMES_DIR, item.name);
    const buffer = item.canvas.toBuffer("image/png");
    fs.writeFileSync(outPath, buffer);
    console.log(`Wrote ${outPath}`);
  }
}

void main();
