/**
 * Browser-only helpers for `<img>` + `<canvas>` workflows.
 * Subpath export: `./browser` (see `deno.json` / package exports).
 * Requires DOM lib types in the consumer TypeScript config.
 */

export { Pixelit, type PixelitConfig } from './pixelit.ts';
export { DEFAULT_PALETTE, PALETTES } from '../palette.ts';
export type { RGB, NamedPalette } from '../types.ts';
