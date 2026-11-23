import { assertRgbaImage, resizeNearest } from './image-buffer.ts';
import type { RgbaImage } from './types.ts';

/**
 * Proportional resize with max width / max height caps (Pixel It `resizeImage`).
 * When both caps apply, height ratio overwrites width ratio (same precedence as Pixel It).
 */
export function resizeImage(
  image: RgbaImage,
  maxWidth?: number | null,
  maxHeight?: number | null,
): RgbaImage {
  assertRgbaImage(image);
  if (!maxWidth && !maxHeight) return image;

  let ratio = 1;
  if (maxWidth && image.width > maxWidth) {
    ratio = maxWidth / image.width;
  }
  if (maxHeight && image.height > maxHeight) {
    ratio = maxHeight / image.height;
  }
  if (ratio === 1) return image;

  const w = Math.max(1, Math.round(image.width * ratio));
  const h = Math.max(1, Math.round(image.height * ratio));
  return resizeNearest(image, w, h);
}
