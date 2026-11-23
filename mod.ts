/**
 * Portable image → pixel-art core (Pixel It algorithm + hosted tool palettes).
 *
 * Source tool page: https://www.uwarp.design/image-to-pixel-art
 * Upstream algorithm: https://github.com/giventofly/pixelit (MIT)
 */

export type { RGB, RgbaImage, NamedPalette, ImageToPixelArtOptions } from './src/types.ts';

export { colorSim, similarColor } from './src/color.ts';
export { DEFAULT_PALETTE, PALETTES } from './src/palette.ts';
export { hexToRgb, rgbToHex, parsePaletteText } from './src/palette-utils.ts';
export {
  createRgbaImage,
  cloneRgbaImage,
  assertRgbaImage,
  resizeBilinear,
  resizeNearest,
} from './src/image-buffer.ts';
export { normalizeScale, computePixelateGeometry, pixelateImage } from './src/pixelate.ts';
export { convertGrayscale, convertGrayscaleInPlace } from './src/grayscale.ts';
export { convertPalette, convertPaletteInPlace } from './src/convert-palette.ts';
export { resizeImage } from './src/resize.ts';
export { imageToPixelArt, imageToPixelArtCopy } from './src/process.ts';
