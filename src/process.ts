import { convertPaletteInPlace } from './convert-palette.ts';
import { convertGrayscaleInPlace } from './grayscale.ts';
import { assertRgbaImage, cloneRgbaImage } from './image-buffer.ts';
import { DEFAULT_PALETTE } from './palette.ts';
import { pixelateImage } from './pixelate.ts';
import { resizeImage } from './resize.ts';
import type { ImageToPixelArtOptions, RgbaImage } from './types.ts';

/**
 * Full pipeline matching the hosted tool render order:
 * pixelate → optional grayscale → optional palette snap → optional max size.
 *
 * Does not require DOM / Canvas; operate on `RgbaImage` buffers.
 */
export function imageToPixelArt(source: RgbaImage, options: ImageToPixelArtOptions = {}): RgbaImage {
  assertRgbaImage(source, 'source');

  let out = pixelateImage(source, options.blockSize);

  if (options.grayscale) {
    convertGrayscaleInPlace(out);
  }

  if (options.usePalette) {
    const palette = options.palette ?? DEFAULT_PALETTE;
    convertPaletteInPlace(out, palette);
  }

  const maxHeight = options.maxHeight ?? null;
  const maxWidth = options.maxWidth ?? null;
  if (maxHeight || maxWidth) {
    // Hosted UI applies height then width as separate passes when both are set.
    if (maxHeight && maxHeight > 0) {
      out = resizeImage(out, null, maxHeight);
    }
    if (maxWidth && maxWidth > 0) {
      out = resizeImage(out, maxWidth, null);
    }
  }

  return out;
}

/**
 * Same as `imageToPixelArt`, but starts from a deep copy so callers can keep the source intact
 * even if future steps mutate intermediate buffers.
 */
export function imageToPixelArtCopy(
  source: RgbaImage,
  options: ImageToPixelArtOptions = {},
): RgbaImage {
  return imageToPixelArt(cloneRgbaImage(source), options);
}
