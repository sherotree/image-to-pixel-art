import { similarColor } from './color.ts';
import { assertRgbaImage, cloneRgbaImage } from './image-buffer.ts';
import type { RGB, RgbaImage } from './types.ts';

/**
 * Snap each opaque RGB sample to the nearest palette color (Pixel It `convertPalette`).
 * Alpha is preserved. Mutates `image` in place.
 */
export function convertPaletteInPlace(image: RgbaImage, palette: RGB[]): RgbaImage {
  assertRgbaImage(image);
  if (palette.length === 0) {
    throw new Error('Palette must contain at least one color');
  }
  const d = image.data;
  for (let i = 0; i < d.length; i += 4) {
    const matched = similarColor([d[i] ?? 0, d[i + 1] ?? 0, d[i + 2] ?? 0], palette);
    d[i] = matched[0];
    d[i + 1] = matched[1];
    d[i + 2] = matched[2];
  }
  return image;
}

/** Non-mutating palette snap. */
export function convertPalette(image: RgbaImage, palette: RGB[]): RgbaImage {
  return convertPaletteInPlace(cloneRgbaImage(image), palette);
}
