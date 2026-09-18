/**
 * Derives public/wepack/* from the supplied WEPACK product renders.
 *
 * The source WebP files already carry a clean alpha channel, so nothing is
 * keyed, repainted or reconstructed. The single edit is removing the white
 * ground shadow baked into that alpha: on the dark set of this film it would
 * read as a grey smear under each unit. The machines themselves are untouched.
 *
 * Run with:  node tools/build-wepack-assets.mjs
 */
import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets-src', 'wepack');
const DEST = join(ROOT, 'public', 'wepack');

const UNITS = [
  ['k-exploded.webp', 'exploded.png'],
  ['helical-foot.webp', 'helical-foot.png'],
  ['helical-flange.webp', 'helical-flange.png'],
  ['parallel-shaft.webp', 'parallel-shaft.png'],
  ['bevel-helical.webp', 'bevel-helical.png'],
];

/**
 * The renders are solid: every metal, white bar and black plastic part is fully
 * opaque. The baked ground shadow is the only thing in the file that is both
 * near-neutral and translucent, which makes this test separate the two exactly.
 */
const NEUTRAL_SAT = 16;
const SOLID_ALPHA = 250;

/**
 * Part of the ground shadow is baked in fully opaque, so alpha alone misses it.
 * Those patches are flat by nature — a shadow on a featureless floor — while
 * every machined surface carries highlights and edges. Measured on these five
 * renders the gap is unambiguous: the shadows sit at std 0.7 to 1.6, the metal
 * regions at std 16 to 86. Mid-grey only, so white bars and black plastic stay.
 */
const FLAT_STD = 4;
const FLAT_LUM = [100, 200];
const FLAT_MIN_PX = 1500;

/** Clears connected neutral regions that are large, mid-grey and perfectly flat. */
const dropFlatShadows = (buf, W, H) => {
  const neutral = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const o = i * 4;
    const [r, g, b, a] = [buf[o], buf[o + 1], buf[o + 2], buf[o + 3]];
    if (a < 40) continue;
    if (Math.max(r, g, b) - Math.min(r, g, b) < NEUTRAL_SAT) neutral[i] = 1;
  }
  const seen = new Uint8Array(W * H);
  const qx = new Int32Array(W * H);
  const qy = new Int32Array(W * H);
  let dropped = 0;
  for (let sy = 0; sy < H; sy++) {
    for (let sx = 0; sx < W; sx++) {
      const si = sy * W + sx;
      if (!neutral[si] || seen[si]) continue;
      let head = 0, tail = 0, n = 0, sum = 0, sum2 = 0;
      qx[tail] = sx; qy[tail] = sy; tail++; seen[si] = 1;
      const members = [];
      while (head < tail) {
        const x = qx[head], y = qy[head];
        head++;
        const i = y * W + x, o = i * 4;
        const L = (buf[o] + buf[o + 1] + buf[o + 2]) / 3;
        n++; sum += L; sum2 += L * L;
        members.push(i);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          const ni = ny * W + nx;
          if (neutral[ni] && !seen[ni]) { seen[ni] = 1; qx[tail] = nx; qy[tail] = ny; tail++; }
        }
      }
      if (n < FLAT_MIN_PX) continue;
      const mean = sum / n;
      const std = Math.sqrt(Math.max(0, sum2 / n - mean * mean));
      if (std >= FLAT_STD || mean < FLAT_LUM[0] || mean > FLAT_LUM[1]) continue;
      for (const i of members) buf[i * 4 + 3] = 0;
      dropped += n;
    }
  }
  return dropped;
};

const cut = async (file, out) => {
  const {data, info} = await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  const {width: W, height: H, channels: C} = info;
  const buf = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    const o = i * C;
    const [r, g, b] = [data[o], data[o + 1], data[o + 2]];
    let a = data[o + 3];
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    if (sat < NEUTRAL_SAT && a < SOLID_ALPHA) a = 0;
    buf[i * 4] = r;
    buf[i * 4 + 1] = g;
    buf[i * 4 + 2] = b;
    buf[i * 4 + 3] = a;
  }
  const flat = dropFlatShadows(buf, W, H);
  await sharp(buf, {raw: {width: W, height: H, channels: 4}})
    .trim({threshold: 1})
    .png({compressionLevel: 9})
    .toFile(out);
  const m = await sharp(out).metadata();
  console.log(`${out.split('/').pop()} ${m.width}x${m.height} (flat shadow removed: ${flat}px)`);
};

await mkdir(DEST, {recursive: true});
for (const [from, to] of UNITS) await cut(join(SRC, from), join(DEST, to));
