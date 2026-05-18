// Writes public/posters/poster.png fallback (macOS sips) for mobile when PDF.js fails.
// Source: repo-root poster.png → public/poster.pdf (sips) + public/posters/poster.png (copy).
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "posters");
const PDF_PATH = path.join(ROOT, "public", "poster.pdf");
const OUT_PATH = path.join(OUT_DIR, "poster.png");

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  if (process.platform === "darwin") {
    execSync(`sips -s format png "${PDF_PATH}" --out "${OUT_PATH}"`, {
      stdio: "inherit",
    });
  } else {
    console.warn(
      "generate-poster-png: run manually or on macOS: sips -s format png public/poster.pdf --out public/posters/poster.png",
    );
    process.exit(1);
  }
  console.log(`Wrote ${OUT_PATH}`);
}

main();
