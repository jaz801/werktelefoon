// Copies repo-root design files into public/ (then run npm run render:clips + bump VISUAL_ASSET_VERSION).
// Sources: Whatsapp Visual.png, Banner LinkedIn .png, poster.png
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const ASSETS = [
  {
    src: "Whatsapp Visual.png",
    dest: path.join(ROOT, "public", "share-visual.png"),
  },
  {
    src: "Banner LinkedIn .png",
    dest: path.join(ROOT, "public", "linkedin-banner.png"),
  },
  {
    src: "poster.png",
    dest: path.join(ROOT, "public", "posters", "poster.png"),
  },
] as const;

function main() {
  for (const { src, dest } of ASSETS) {
    const from = path.join(ROOT, src);
    if (!fs.existsSync(from)) {
      console.error(`Missing source: ${from}`);
      process.exit(1);
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(from, dest);
    console.log(`${src} → ${path.relative(ROOT, dest)}`);
  }

  const posterSrc = path.join(ROOT, "poster.png");
  const posterPdf = path.join(ROOT, "public", "poster.pdf");
  if (process.platform === "darwin") {
    execSync(`sips -s format pdf "${posterSrc}" --out "${posterPdf}"`, {
      stdio: "inherit",
    });
    console.log(`poster.png → public/poster.pdf`);
  } else {
    console.warn(
      "sync-visual-assets: on macOS run: sips -s format pdf poster.png --out public/poster.pdf",
    );
  }

  console.log(
    "Done. Bump VISUAL_ASSET_VERSION and run: npm run render:clips",
  );
}

main();
