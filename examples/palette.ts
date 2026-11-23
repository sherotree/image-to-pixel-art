/**
 * Pixelate then snap to the NES palette.
 *
 *   deno run examples/palette.ts
 */

import { createRgbaImage, imageToPixelArt, PALETTES, rgbToHex } from '../mod.ts';

const nes = PALETTES.find(p => p.name === 'NES');
if (!nes) throw new Error('NES palette missing');

const source = createRgbaImage(32, 32);
for (let i = 0; i < source.data.length; i += 4) {
  source.data[i] = 200;
  source.data[i + 1] = 40;
  source.data[i + 2] = 60;
  source.data[i + 3] = 255;
}

const out = imageToPixelArt(source, {
  blockSize: 10,
  usePalette: true,
  palette: nes.colors,
});

const r = out.data[0] ?? 0;
const g = out.data[1] ?? 0;
const b = out.data[2] ?? 0;
console.log('snapped color', rgbToHex([r, g, b]));
console.log('palette size', nes.colors.length);
