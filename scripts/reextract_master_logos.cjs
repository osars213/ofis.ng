const sharp = require('sharp');
const fs = require('fs');
const { execSync } = require('child_process');

async function processLightLogo() {
  console.log('--- Processing Light Mode Logo from ChatGPT Image Sep 23, 2026, 10_08_27 PM.png ---');
  const { data, info } = await sharp('ChatGPT Image Sep 23, 2026, 10_08_27 PM.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;

  // Background is neutral white canvas (low saturation, high brightness)
  const isBgSeed = (x, y) => {
    const idx = (y * w + x) * 3;
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    const minC = Math.min(r, g, b);
    const diff = Math.max(r, g, b) - minC;
    return minC >= 225 && diff <= 16;
  };

  const bgVisited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let tail = 0;

  // Flood fill seeds from the 4 outer borders
  for (let x = 0; x < w; x++) {
    if (isBgSeed(x, 0)) { queue[tail++] = 0 * w + x; bgVisited[0 * w + x] = 1; }
    if (isBgSeed(x, h - 1)) { queue[tail++] = (h - 1) * w + x; bgVisited[(h - 1) * w + x] = 1; }
  }
  for (let y = 0; y < h; y++) {
    if (isBgSeed(0, y)) { queue[tail++] = y * w + 0; bgVisited[y * w + 0] = 1; }
    if (isBgSeed(w - 1, y)) { queue[tail++] = y * w + w - 1; bgVisited[y * w + w - 1] = 1; }
  }

  // Interior of 'O' hole seed (around x=890, y=390)
  const oIdx = 390 * w + 890;
  if (isBgSeed(890, 390) && !bgVisited[oIdx]) {
    queue[tail++] = oIdx;
    bgVisited[oIdx] = 1;
  }

  let head = 0;
  while (head < tail) {
    const curr = queue[head++];
    const cx = curr % w;
    const cy = Math.floor(curr / w);

    if (cx > 0) {
      const idx = curr - 1;
      if (!bgVisited[idx] && isBgSeed(cx - 1, cy)) { bgVisited[idx] = 1; queue[tail++] = idx; }
    }
    if (cx < w - 1) {
      const idx = curr + 1;
      if (!bgVisited[idx] && isBgSeed(cx + 1, cy)) { bgVisited[idx] = 1; queue[tail++] = idx; }
    }
    if (cy > 0) {
      const idx = curr - w;
      if (!bgVisited[idx] && isBgSeed(cx, cy - 1)) { bgVisited[idx] = 1; queue[tail++] = idx; }
    }
    if (cy < h - 1) {
      const idx = curr + w;
      if (!bgVisited[idx] && isBgSeed(cx, cy + 1)) { bgVisited[idx] = 1; queue[tail++] = idx; }
    }
  }

  console.log('Background flood fill pixels:', tail);

  const out = Buffer.alloc(w * h * 4);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const srcIdx = (y * w + x) * 3;
      const dstIdx = (y * w + x) * 4;
      const r = data[srcIdx], g = data[srcIdx+1], b = data[srcIdx+2];

      const isBg = bgVisited[y * w + x] === 1;
      if (!isBg) {
        // 100% authentic foreground - NO thresholding, NO color alteration
        out[dstIdx] = r;
        out[dstIdx + 1] = g;
        out[dstIdx + 2] = b;
        out[dstIdx + 3] = 255;
      } else {
        // Pixel is in background region. Check for anti-aliased edge transition
        const minC = Math.min(r, g, b);
        const maxC = Math.max(r, g, b);
        const diff = maxC - minC;
        const dist = 254 - minC;

        if (dist > 30 || diff > 12) {
          const alpha = Math.min(1.0, Math.max(0.08, Math.max((dist - 20) / 100, diff / 40)));
          const unmult = (c) => Math.max(0, Math.min(255, Math.round((c - 254 * (1 - alpha)) / alpha)));
          out[dstIdx] = unmult(r);
          out[dstIdx + 1] = unmult(g);
          out[dstIdx + 2] = unmult(b);
          out[dstIdx + 3] = Math.round(alpha * 255);
        } else {
          out[dstIdx + 3] = 0;
        }
      }
    }
  }

  // Find tight bounding box of full logo
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (out[(y * w + x) * 4 + 3] > 15) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  console.log('Light Logo bounds:', { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY });

  const pad = 12;
  const cMinX = Math.max(0, minX - pad);
  const cMaxX = Math.min(w - 1, maxX + pad);
  const cMinY = Math.max(0, minY - pad);
  const cMaxY = Math.min(h - 1, maxY + pad);
  const cropW = cMaxX - cMinX;
  const cropH = cMaxY - cMinY;

  const fullLightBuf = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: cMinX, top: cMinY, width: cropW, height: cropH })
    .png({ compressionLevel: 9 })
    .toBuffer();

  return { fullLightBuf, cropW, cropH };
}

async function processDarkLogo() {
  console.log('--- Processing Dark Mode Logo from 1788053785893.png ---');
  // Crop the region containing the emblem and the chrome metallic letters
  const { data, info } = await sharp('1788053785893.png')
    .extract({ left: 140, top: 45, width: 1330, height: 415 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;

  const out = Buffer.alloc(w * h * 4);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const srcIdx = (y * w + x) * 3;
      const dstIdx = (y * w + x) * 4;
      const r = data[srcIdx], g = data[srcIdx+1], b = data[srcIdx+2];

      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const diff = maxC - minC;

      let alpha = 0;
      if (x < 460) {
        // Portal emblem area
        if (r > 120 && g > 90 && r > b + 20) {
          // Warm glowing door
          alpha = Math.min(1.0, Math.max(0.2, (r - 60) / 90));
        } else if (g > r + 10 && g > b + 5 && g > 45) {
          // Green foliage arch
          alpha = Math.min(1.0, Math.max(0.2, (g - 35) / 55));
        } else if (lum > 50 && diff > 15) {
          alpha = Math.min(1.0, (lum - 30) / 45);
        } else if (lum > 65) {
          alpha = Math.min(1.0, (lum - 40) / 50);
        }
      } else {
        // Chrome letters area (authentic 3D metallic reflections)
        if (y >= 80 && y <= 350) {
          if (lum > 70) {
            // Authentic chrome highlights and reflections: preserve original chrome pixels
            alpha = Math.min(1.0, Math.max(0.3, (lum - 50) / 45));
          } else if (lum > 42 && diff > 8) {
            // Anti-aliased bevel contours
            alpha = Math.min(1.0, (lum - 32) / 35);
          }
        }
      }

      if (alpha > 0) {
        out[dstIdx] = r;
        out[dstIdx + 1] = g;
        out[dstIdx + 2] = b;
        out[dstIdx + 3] = Math.round(alpha * 255);
      }
    }
  }

  // Find tight bounding box of dark logo
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (out[(y * w + x) * 4 + 3] > 15) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  console.log('Dark Logo bounds:', { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY });

  const pad = 12;
  const cMinX = Math.max(0, minX - pad);
  const cMaxX = Math.min(w - 1, maxX + pad);
  const cMinY = Math.max(0, minY - pad);
  const cMaxY = Math.min(h - 1, maxY + pad);
  const cropW = cMaxX - cMinX;
  const cropH = cMaxY - cMinY;

  const fullDarkBuf = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: cMinX, top: cMinY, width: cropW, height: cropH })
    .png({ compressionLevel: 9 })
    .toBuffer();

  return { fullDarkBuf, cropW, cropH };
}

async function processEmblem() {
  console.log('--- Processing Emblem from file_00000000435081f48b2d8d9820106123.png ---');
  const { data, info } = await sharp('file_00000000435081f48b2d8d9820106123.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;

  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 15) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const cropW = maxX - minX;
  const cropH = maxY - minY;
  const size = Math.max(cropW, cropH) + 24;
  const padX = Math.floor((size - cropW) / 2);
  const padY = Math.floor((size - cropH) / 2);

  const emblemBuf = await sharp('file_00000000435081f48b2d8d9820106123.png')
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .extend({
      top: padY,
      bottom: size - cropH - padY,
      left: padX,
      right: size - cropW - padX,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

  return { emblemBuf, size };
}

function createZipBundle() {
  console.log('Creating zip bundle with authentic master assets via python3...');
  try {
    const pythonCode = `
import zipfile
import os

files = [
  ('public/ofis-logo.png', 'ofis-logo-light.png'),
  ('public/ofis-logo-dark.png', 'ofis-logo-dark.png'),
  ('public/ofis-icon.png', 'ofis-icon.png'),
  ('public/ofis-symbol.png', 'ofis-emblem.png'),
  ('public/ofis-logo.svg', 'ofis-logo-light.svg'),
  ('public/ofis-logo-dark.svg', 'ofis-logo-dark.svg'),
  ('public/ofis-icon.svg', 'ofis-icon.svg'),
]

with zipfile.ZipFile('public/ofis-logo-assets.zip', 'w', zipfile.ZIP_DEFLATED) as z:
  for src, arcname in files:
    if os.path.exists(src):
      z.write(src, arcname)
print('Zip bundle written successfully.')
`;
    execSync(`python3 -c "${pythonCode.replace(/"/g, '\\"')}"`);
    console.log('Zip bundle created successfully.');
  } catch (err) {
    console.error('Error creating zip bundle:', err);
  }
}

async function main() {
  console.log('=== STARTING RE-EXTRACTION OF AUTHENTIC MASTER LOGOS ===');

  const light = await processLightLogo();
  const dark = await processDarkLogo();
  const emblem = await processEmblem();

  // Save public PNGs
  fs.writeFileSync('public/ofis-logo.png', light.fullLightBuf);
  fs.writeFileSync('public/ofis-logo-dark.png', dark.fullDarkBuf);
  fs.writeFileSync('public/ofis-icon.png', emblem.emblemBuf);
  fs.writeFileSync('public/ofis-symbol.png', emblem.emblemBuf);

  // Favicon
  const faviconBuf = await sharp(emblem.emblemBuf).resize(64, 64).png().toBuffer();
  fs.writeFileSync('public/favicon.png', faviconBuf);

  // Generate clean SVGs containing the authentic base64 PNGs
  const lightB64 = light.fullLightBuf.toString('base64');
  const lightSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${light.cropW} ${light.cropH}" width="100%" height="100%">
  <image width="${light.cropW}" height="${light.cropH}" href="data:image/png;base64,${lightB64}" />
</svg>
`;
  fs.writeFileSync('public/ofis-logo.svg', lightSvg);

  const darkB64 = dark.fullDarkBuf.toString('base64');
  const darkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dark.cropW} ${dark.cropH}" width="100%" height="100%">
  <image width="${dark.cropW}" height="${dark.cropH}" href="data:image/png;base64,${darkB64}" />
</svg>
`;
  fs.writeFileSync('public/ofis-logo-dark.svg', darkSvg);

  const iconB64 = emblem.emblemBuf.toString('base64');
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${emblem.size} ${emblem.size}" width="100%" height="100%">
  <image width="${emblem.size}" height="${emblem.size}" href="data:image/png;base64,${iconB64}" />
</svg>
`;
  fs.writeFileSync('public/ofis-icon.svg', iconSvg);

  console.log('Public assets written successfully.');

  // Create Zip bundle
  createZipBundle();
  console.log('=== LOGO RE-EXTRACTION COMPLETE ===');
}

main().catch(console.error);
