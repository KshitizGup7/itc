#!/usr/bin/env node
/**
 * Turns a folder of already-exported catalog page images (JPG or PNG,
 * one file per page, named so they sort in order — e.g. page-01.jpg,
 * page-02.jpg, ...) into what CatalogGallery.tsx needs:
 *   - public/catalog-images/page-NN.webp        (fast-loading display copy)
 *   - public/catalog-images/page-NN-zoom.webp   (high-res, loads on click)
 *   - app/catalog/catalog-manifest.json
 *
 * No PDF library, no Poppler, no native build tools — just "sharp".
 *
 * Setup (once):
 *   npm i -D sharp
 *
 * Usage:
 *   node scripts/build-catalog-manifest.mjs ./raw-pages
 *
 * ("./raw-pages" = the folder where you dropped your exported page images)
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const [, , inputDir] = process.argv;
if (!inputDir) {
  console.error("Usage: node scripts/build-catalog-manifest.mjs <folder-of-page-images>");
  process.exit(1);
}

const OUT_IMG_DIR = "./public/catalog-images";
const OUT_MANIFEST = "./app/catalog/catalog-manifest.json";
const DISPLAY_WIDTH = 1600;
const ZOOM_WIDTH = 3200; // capped per-image below if the source is smaller
const WEBP_QUALITY = 78;
const ZOOM_QUALITY = 88;

mkdirSync(OUT_IMG_DIR, { recursive: true });
mkdirSync(dirname(OUT_MANIFEST), { recursive: true });

const files = readdirSync(inputDir)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort(); // relies on zero-padded filenames (page-01, page-02, ...)

if (files.length === 0) {
  console.error(`No image files found in ${inputDir}`);
  process.exit(1);
}

console.log(`Found ${files.length} page image(s). Processing in this order:`);
files.forEach((f) => console.log(`  ${f}`));

const pages = [];

for (const [i, file] of files.entries()) {
  const num = String(i + 1).padStart(2, "0");
  const srcPath = join(inputDir, file);
  const srcMeta = await sharp(srcPath).metadata();

  // Display tier
  const displayFile = `page-${num}.webp`;
  const displayBuffer = await sharp(srcPath)
    .resize({ width: Math.min(DISPLAY_WIDTH, srcMeta.width) })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
  writeFileSync(join(OUT_IMG_DIR, displayFile), displayBuffer);
  const displayMeta = await sharp(displayBuffer).metadata();

  // Zoom tier — never upscale past the source's real resolution,
  // that would just be blur dressed up as "high-res".
  const zoomWidth = Math.min(ZOOM_WIDTH, srcMeta.width);
  const zoomFile = `page-${num}-zoom.webp`;
  const zoomBuffer = await sharp(srcPath)
    .resize({ width: zoomWidth })
    .webp({ quality: ZOOM_QUALITY })
    .toBuffer();
  writeFileSync(join(OUT_IMG_DIR, zoomFile), zoomBuffer);
  const zoomMeta = await sharp(zoomBuffer).metadata();

  // Tiny blur-up placeholder
  const blurBuffer = await sharp(srcPath).resize({ width: 24 }).webp({ quality: 40 }).toBuffer();

  pages.push({
    src: `/catalog-images/${displayFile}`,
    width: displayMeta.width,
    height: displayMeta.height,
    zoomSrc: `/catalog-images/${zoomFile}`,
    zoomWidth: zoomMeta.width,
    zoomHeight: zoomMeta.height,
    blurDataURL: `data:image/webp;base64,${blurBuffer.toString("base64")}`,
  });

  const note = srcMeta.width < ZOOM_WIDTH ? "  (source is smaller than 3200px — zoom capped to source size)" : "";
  console.log(
    `  \u2713 page ${num}: display ${(displayBuffer.length / 1024).toFixed(0)}KB, ` +
      `zoom ${(zoomBuffer.length / 1024).toFixed(0)}KB${note}`
  );
}

writeFileSync(OUT_MANIFEST, JSON.stringify({ pages }, null, 2));
console.log(`\nDone. ${pages.length} page(s) written to ${OUT_IMG_DIR}`);
console.log(`Manifest written to ${OUT_MANIFEST}`);
