/** RGB triplet in 0–255 channel range. */
export type RGB = [number, number, number];

/** RGBA raster buffer (row-major, 4 bytes per pixel). */
export interface RgbaImage {
  width: number;
  height: number;
  /** Length must be `width * height * 4`. */
  data: Uint8ClampedArray;
}

/** Named built-in or custom palette. */
export interface NamedPalette {
  name: string;
  colors: RGB[];
}

/**
 * Options for the high-level `imageToPixelArt` pipeline.
 * Mirrors the hosted tool controls (block size, grayscale, palette snap, max size).
 */
export interface ImageToPixelArtOptions {
  /**
   * Block size / pixelation scale control, same as Pixel It `scale` (1–50).
   * Internally mapped to `scale * 0.01`. Defaults to `8`.
   */
  blockSize?: number;
  /** When true, convert to grayscale after pixelation. */
  grayscale?: boolean;
  /** When true, snap each pixel to the nearest palette color after pixelation. */
  usePalette?: boolean;
  /** Palette used when `usePalette` is true. Defaults to Pixel It default palette. */
  palette?: RGB[];
  /** Optional max width (px); applied after pixelation / color steps. */
  maxWidth?: number | null;
  /** Optional max height (px); applied after pixelation / color steps. Height wins when both are set. */
  maxHeight?: number | null;
}
