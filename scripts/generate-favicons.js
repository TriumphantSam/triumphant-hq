const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const blue = "#075ee5";
const white = "#ffffff";

function svg(size) {
  const r = Math.round(size * 0.22);
  const barY = Math.round(size * 0.22);
  const barH = Math.round(size * 0.14);
  const barX = Math.round(size * 0.2);
  const barW = Math.round(size * 0.6);
  const stemW = Math.round(size * 0.16);
  const stemX = Math.round((size - stemW) / 2);
  const stemY = barY;
  const stemH = Math.round(size * 0.56);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="${blue}"/>
  <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" fill="${white}"/>
  <rect x="${stemX}" y="${stemY}" width="${stemW}" height="${stemH}" fill="${white}"/>
</svg>`;
}

async function writePng(file, size) {
  await sharp(Buffer.from(svg(size))).png().toFile(file);
}

async function main() {
  const pub = path.join(process.cwd(), "public");
  const app = path.join(process.cwd(), "app");

  await writePng(path.join(pub, "favicon-48x48.png"), 48);
  await writePng(path.join(pub, "favicon-96x96.png"), 96);
  await writePng(path.join(pub, "android-chrome-192x192.png"), 192);
  await writePng(path.join(pub, "android-chrome-512x512.png"), 512);
  await writePng(path.join(pub, "apple-touch-icon.png"), 180);
  await writePng(path.join(app, "icon.png"), 48);
  await writePng(path.join(app, "apple-icon.png"), 180);

  // Multi-resolution ICO (16/32/48) via png buffers packed with toFormat if supported
  const png48 = await sharp(Buffer.from(svg(48))).png().toBuffer();
  await sharp(png48).toFile(path.join(pub, "favicon.ico"));

  fs.writeFileSync(path.join(app, "icon.svg"), svg(512));
  fs.writeFileSync(path.join(pub, "icon.svg"), svg(512));

  // Organization / schema logo (clear square PNG)
  await writePng(path.join(pub, "brand-logo.png"), 512);

  console.log("Favicons generated");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
