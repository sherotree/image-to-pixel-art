import { assertRgbaImage, resizeBilinear, resizeNearest } from './image-buffer.ts';
import type { RgbaImage } from './types.ts';

/**
 * Normalize Pixel It block-size control (1–50) to the internal scale factor.
 * Invalid values fall back to `0.08` (block size 8), matching Pixel It.
 */
export function normalizeScale(blockSize: number | undefined): number {
  if (typeof blockSize === 'number' && blockSize > 0 && blockSize <= 50) {
    return blockSize * 0.01;
  }
  return 0.08;
}

/**
 * Compute working scale and destination size using the same rules as Pixel It
 * (`pixelate()` in giventofly/pixelit and the hosted tool port).
 */
export function computePixelateGeometry(
  width: number,
  height: number,
  blockSize?: number,
): {
  workScale: number;
  scaledWidth: number;
  scaledHeight: number;
  finalWidth: number;
  finalHeight: number;
} {
  let workScale = normalizeScale(blockSize);
  let scaledWidth = width * workScale;
  let scaledHeight = height * workScale;

  if (width > 900 || height > 900) {
    workScale = workScale * 0.5;
    scaledWidth = width * workScale;
    scaledHeight = height * workScale;
  }

  let finalWidth = width;
  if (width > 300) {
    finalWidth +=
      width > height
        ? Math.floor(width / (width * workScale)) / 1.5
        : Math.floor(width / (width * workScale));
  }

  let finalHeight = height;
  if (height > 300) {
    finalHeight +=
      height > width
        ? Math.floor(height / (height * workScale)) / 1.5
        : Math.floor(height / (height * workScale));
  }

  return { workScale, scaledWidth, scaledHeight, finalWidth, finalHeight };
}

/**
 * Portable pixelation: bilinear downsample → nearest-neighbor upsample.
 * Geometry matches Pixel It; filtering approximates canvas `drawImage` (smooth down, crisp up).
 */
export function pixelateImage(source: RgbaImage, blockSize?: number): RgbaImage {
  assertRgbaImage(source, 'source');
  const { scaledWidth, scaledHeight, finalWidth, finalHeight } = computePixelateGeometry(
    source.width,
    source.height,
    blockSize,
  );

  const sw = Math.max(1, Math.round(scaledWidth));
  const sh = Math.max(1, Math.round(scaledHeight));
  const dw = Math.max(1, Math.round(finalWidth));
  const dh = Math.max(1, Math.round(finalHeight));

  const small = resizeBilinear(source, sw, sh);
  return resizeNearest(small, dw, dh);
}
