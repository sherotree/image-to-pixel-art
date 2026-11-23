/**
 * Pixelate a synthetic gradient without DOM / Canvas.
 *
 *   deno run examples/basic.ts
 */

import { createRgbaImage, imageToPixelArt, computePixelateGeometry } from '../mod.ts';

const W = 120;
const H = 80;
const source = createRgbaImage(W, H);

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    source.data[i] = Math.floor((x / W) * 255);
    source.data[i + 1] = Math.floor((y / H) * 255);
    source.data[i + 2] = 128;
    source.data[i + 3] = 255;
  }
}

const blockSize = 7;
const geom = computePixelateGeometry(W, H, blockSize);
const out = imageToPixelArt(source, { blockSize });

console.log('blockSize', blockSize);
console.log('geometry', geom);
console.log('output', { width: out.width, height: out.height, bytes: out.data.length });
console.log('sample pixel [0]', out.data[0], out.data[1], out.data[2], out.data[3]);
