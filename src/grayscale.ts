import { assertRgbaImage, cloneRgbaImage } from './image-buffer.ts';
import type { RgbaImage } from './types.ts';

/**
 * Average RGB → grayscale (Pixel It `convertGrayscale`).
 * Mutates `image` in place and returns it.
 */
export function convertGrayscaleInPlace(image: RgbaImage): RgbaImage {
  assertRgbaImage(image);
  const d = image.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i] ?? 0;
    const g = d[i + 1] ?? 0;
    const b = d[i + 2] ?? 0;
    const avg = (r + g + b) / 3;
    d[i] = avg;
    d[i + 1] = avg;
    d[i + 2] = avg;
  }
  return image;
}

/** Non-mutating grayscale conversion. */
export function convertGrayscale(image: RgbaImage): RgbaImage {
  return convertGrayscaleInPlace(cloneRgbaImage(image));
}
