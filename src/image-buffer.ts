import type { RgbaImage } from './types.ts';

/** Create an empty opaque black buffer. */
export function createRgbaImage(width: number, height: number): RgbaImage {
  const w = Math.max(1, Math.floor(width));
  const h = Math.max(1, Math.floor(height));
  return { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) };
}

/** Shallow-validate buffer dimensions vs data length. */
export function assertRgbaImage(image: RgbaImage, label = 'image'): void {
  if (!Number.isFinite(image.width) || !Number.isFinite(image.height)) {
    throw new Error(`${label}: width/height must be finite numbers`);
  }
  if (image.width < 1 || image.height < 1) {
    throw new Error(`${label}: width and height must be >= 1`);
  }
  const expected = image.width * image.height * 4;
  if (image.data.length !== expected) {
    throw new Error(`${label}: data length ${image.data.length} !== ${expected}`);
  }
}

/** Deep-copy an RGBA buffer. */
export function cloneRgbaImage(image: RgbaImage): RgbaImage {
  assertRgbaImage(image);
  return {
    width: image.width,
    height: image.height,
    data: new Uint8ClampedArray(image.data),
  };
}

/** Sample a pixel with nearest-neighbor and clamp coordinates. */
export function sampleNearest(
  image: RgbaImage,
  x: number,
  y: number,
): [number, number, number, number] {
  const sx = Math.max(0, Math.min(image.width - 1, Math.floor(x)));
  const sy = Math.max(0, Math.min(image.height - 1, Math.floor(y)));
  const i = (sy * image.width + sx) * 4;
  return [image.data[i] ?? 0, image.data[i + 1] ?? 0, image.data[i + 2] ?? 0, image.data[i + 3] ?? 0];
}

/**
 * Bilinear sample (used for the downscale pass to approximate canvas `drawImage` smoothing).
 */
export function sampleBilinear(
  image: RgbaImage,
  x: number,
  y: number,
): [number, number, number, number] {
  const maxX = image.width - 1;
  const maxY = image.height - 1;
  const x0 = Math.max(0, Math.min(maxX, Math.floor(x)));
  const y0 = Math.max(0, Math.min(maxY, Math.floor(y)));
  const x1 = Math.min(maxX, x0 + 1);
  const y1 = Math.min(maxY, y0 + 1);
  const fx = x - x0;
  const fy = y - y0;

  const i00 = (y0 * image.width + x0) * 4;
  const i10 = (y0 * image.width + x1) * 4;
  const i01 = (y1 * image.width + x0) * 4;
  const i11 = (y1 * image.width + x1) * 4;

  const out: [number, number, number, number] = [0, 0, 0, 0];
  for (let c = 0; c < 4; c++) {
    const v00 = image.data[i00 + c] ?? 0;
    const v10 = image.data[i10 + c] ?? 0;
    const v01 = image.data[i01 + c] ?? 0;
    const v11 = image.data[i11 + c] ?? 0;
    const top = v00 * (1 - fx) + v10 * fx;
    const bottom = v01 * (1 - fx) + v11 * fx;
    out[c] = top * (1 - fy) + bottom * fy;
  }
  return out;
}

/** Resize with bilinear filtering (downscale-friendly). */
export function resizeBilinear(source: RgbaImage, width: number, height: number): RgbaImage {
  assertRgbaImage(source, 'source');
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  const out = createRgbaImage(w, h);
  const xRatio = source.width / w;
  const yRatio = source.height / h;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const [r, g, b, a] = sampleBilinear(source, (x + 0.5) * xRatio - 0.5, (y + 0.5) * yRatio - 0.5);
      const i = (y * w + x) * 4;
      out.data[i] = r;
      out.data[i + 1] = g;
      out.data[i + 2] = b;
      out.data[i + 3] = a;
    }
  }
  return out;
}

/** Resize with nearest-neighbor (pixel-art upscale). */
export function resizeNearest(source: RgbaImage, width: number, height: number): RgbaImage {
  assertRgbaImage(source, 'source');
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  const out = createRgbaImage(w, h);
  const xRatio = source.width / w;
  const yRatio = source.height / h;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const [r, g, b, a] = sampleNearest(source, x * xRatio, y * yRatio);
      const i = (y * w + x) * 4;
      out.data[i] = r;
      out.data[i + 1] = g;
      out.data[i + 2] = b;
      out.data[i + 3] = a;
    }
  }
  return out;
}
