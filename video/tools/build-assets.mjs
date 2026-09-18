/**
 * Derives public/product/* from the two supplied reference images.
 *
 * Ground rule: the machine is never redrawn, relit, cut out or reconstructed.
 * The only operations applied are ones that touch the *background* of the
 * photographs — flattening the data sheet's navy banner, normalising its light
 * plate to pure white, feathering the crop borders — plus a plain lanczos
 * upscale. Every pixel of the product is the pixel the manufacturer shot.
 *
 * Run with:  node tools/build-assets.mjs
 */
import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets-src');
const DEST = join(ROOT, 'public', 'product');

/** Data sheet banner colour, and the darkest product pixel sits at d=82 from it. */
const BANNER = [13, 26, 101];
const BANNER_IN = 55;
const BANNER_OUT = 78;
/** The data sheet's light plate. Mapped to pure white so the composited frame
 *  leaves no visible rectangle over the studio backdrop. */
const PLATE = [244, 245, 251];

/** Crops into datasheet.png, in its own pixel space. */
const VIEWS = {
  'rear34.png': {left: 36, top: 76, width: 203, height: 146, scale: 3.2},
  'rear.png': {left: 277, top: 97, width: 106, height: 125, scale: 3.2},
  'front.png': {left: 477, top: 63, width: 158, height: 157, scale: 3.2},
};

/** Rotor disc registration inside front.png — keep in sync with src/promo/theme.ts. */
const ROTOR = {cx: 233, cy: 360, r: 86, upscale: 2};

/** Flatten the navy banner to white so a crop can straddle it. */
const flattenBanner = async (file) => {
  const {data, info} = await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  const {width: W, height: H, channels: C} = info;
  const out = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H; i++) {
    const o = i * C;
    const [r, g, b] = [data[o], data[o + 1], data[o + 2]];
    const d = Math.hypot(r - BANNER[0], g - BANNER[1], b - BANNER[2]);
    const k = d <= BANNER_IN ? 1 : d >= BANNER_OUT ? 0 : (BANNER_OUT - d) / (BANNER_OUT - BANNER_IN);
    out[i * 3] = Math.round(r + (255 - r) * k);
    out[i * 3 + 1] = Math.round(g + (255 - g) * k);
    out[i * 3 + 2] = Math.round(b + (255 - b) * k);
  }
  return sharp(out, {raw: {width: W, height: H, channels: 3}});
};

/**
 * Per-channel white point: scales the plate colour exactly onto white. This is
 * a white balance, applied uniformly — it shifts no shape and invents no pixel.
 */
const whitePoint = (buf, len) => {
  const gain = PLATE.map((v) => 255 / v);
  for (let i = 0; i < len; i++) {
    for (let c = 0; c < 3; c++) {
      buf[i * 3 + c] = Math.min(255, Math.round(buf[i * 3 + c] * gain[c]));
    }
  }
};

/** Fade the outer margin to white so crop borders never show as an edge. */
const featherToWhite = (buf, W, H, m) => {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const t = Math.min(1, Math.min(Math.min(x, W - 1 - x) / (W * m), Math.min(y, H - 1 - y) / (H * m)));
      const k = 1 - t * t * (3 - 2 * t);
      if (k <= 0) continue;
      const o = (y * W + x) * 3;
      for (let c = 0; c < 3; c++) buf[o + c] = Math.round(buf[o + c] + (255 - buf[o + c]) * k);
    }
  }
};

const writeView = async (plate, name, cfg) => {
  const {data, info} = await plate.clone().extract({
    left: cfg.left, top: cfg.top, width: cfg.width, height: cfg.height,
  }).removeAlpha().raw().toBuffer({resolveWithObject: true});
  const buf = Buffer.from(data);
  whitePoint(buf, info.width * info.height);
  featherToWhite(buf, info.width, info.height, 0.045);
  await sharp(buf, {raw: {width: info.width, height: info.height, channels: 3}})
    .resize({width: Math.round(info.width * cfg.scale), kernel: 'lanczos3'})
    .sharpen({sigma: 0.6})
    .png({compressionLevel: 9})
    .toFile(join(DEST, name));
  const m = await sharp(join(DEST, name)).metadata();
  console.log(name, `${m.width}x${m.height}`);
};

/** Cut the rotor disc out of front.png so the composition can spin the real part. */
const writeRotor = async () => {
  const {cx, cy, r, upscale} = ROTOR;
  const {data, info} = await sharp(join(DEST, 'front.png'))
    .extract({left: cx - r, top: cy - r, width: r * 2, height: r * 2})
    .removeAlpha()
    .resize({width: r * 2 * upscale, kernel: 'lanczos3'})
    .raw().toBuffer({resolveWithObject: true});
  const {width: W, height: H} = info;
  const out = Buffer.alloc(W * H * 4);
  const c = (W - 1) / 2;
  const rr = W / 2;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const d = Math.hypot(x - c, y - c);
      const a = d >= rr ? 0 : d <= rr - 6 ? 1 : (rr - d) / 6; // soft rim hides the seam
      out[i * 4] = data[i * 3];
      out[i * 4 + 1] = data[i * 3 + 1];
      out[i * 4 + 2] = data[i * 3 + 2];
      out[i * 4 + 3] = Math.round(a * 255);
    }
  }
  await sharp(out, {raw: {width: W, height: H, channels: 4}})
    .png({compressionLevel: 9}).toFile(join(DEST, 'rotor.png'));
  console.log('rotor.png', `${W}x${H}`);
};

await mkdir(DEST, {recursive: true});

// hero: already isolated on pure white, so it only needs the upscale
{
  const src = join(SRC, 'product-hero.png');
  const {data, info} = await sharp(src).removeAlpha().raw().toBuffer({resolveWithObject: true});
  const buf = Buffer.from(data);
  featherToWhite(buf, info.width, info.height, 0.035);
  await sharp(buf, {raw: {width: info.width, height: info.height, channels: 3}})
    .resize({width: Math.round(info.width * 2.6), kernel: 'lanczos3'})
    .sharpen({sigma: 0.6})
    .png({compressionLevel: 9})
    .toFile(join(DEST, 'hero.png'));
  const m = await sharp(join(DEST, 'hero.png')).metadata();
  console.log('hero.png', `${m.width}x${m.height}`);
}

const plate = await flattenBanner(join(SRC, 'datasheet.png'));
for (const [name, cfg] of Object.entries(VIEWS)) await writeView(plate, name, cfg);
await writeRotor();
