/* SVG kaynaklarından tüm PNG görselleri üretir:
   - assets/icon-only.png (1024)  → @capacitor/assets girdisi
   - assets/splash.png / splash-dark.png (2732) → @capacitor/assets girdisi
   - public/icons/icon-192.png, icon-512.png, public/apple-touch-icon.png (PWA)
   Çalıştır: node scripts/render-assets.mjs && npx @capacitor/assets generate --ios */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const jobs = [
  { src: "assets/icon.svg", out: "assets/icon-only.png", size: 1024 },
  { src: "assets/splash.svg", out: "assets/splash.png", size: 2732 },
  { src: "assets/splash-dark.svg", out: "assets/splash-dark.png", size: 2732 },
  { src: "assets/icon.svg", out: "public/icons/icon-192.png", size: 192 },
  { src: "assets/icon.svg", out: "public/icons/icon-512.png", size: 512 },
  { src: "assets/icon.svg", out: "public/apple-touch-icon.png", size: 180 },
];

await mkdir("public/icons", { recursive: true });

for (const job of jobs) {
  await sharp(job.src, { density: 300 })
    .resize(job.size, job.size)
    .png()
    .toFile(job.out);
  console.log(`✔ ${job.out} (${job.size}px)`);
}
