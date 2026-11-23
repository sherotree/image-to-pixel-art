/**
 * Pixelate then convert to grayscale.
 *
 *   deno run examples/grayscale.ts
 */

import { createRgbaImage, imageToPixelArt } from '../mod.ts';

const source = createRgbaImage(16, 16);
for (let i = 0; i < source.data.length; i += 4) {
  source.data[i] = 255;
  source.data[i + 1] = 0;
  source.data[i + 2] = 0;
  source.data[i + 3] = 255;
}

const out = imageToPixelArt(source, { blockSize: 4, grayscale: true });
const r = out.data[0] ?? 0;
const g = out.data[1] ?? 0;
const b = out.data[2] ?? 0;

console.log('grayscale channels', { r, g, b });
console.log('equal?', r === g && g === b);
