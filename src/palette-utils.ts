import type { RGB } from './types.ts';

/** Parse `#rrggbb` / `rrggbb` into RGB, or `null` if invalid. */
export function hexToRgb(hex: string): RGB | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const r = m?.[1];
  const g = m?.[2];
  const b = m?.[3];
  if (!r || !g || !b) return null;
  return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
}

/** Format RGB as lowercase `#rrggbb`. */
export function rgbToHex(rgb: RGB): string {
  return (
    '#' +
    rgb
      .map(v => {
        const n = Math.max(0, Math.min(255, Math.round(v)));
        return n.toString(16).padStart(2, '0');
      })
      .join('')
  );
}

/**
 * Parse Paint.NET / .hex / .txt palette text.
 * Splits on commas or newlines, skips `;` comments, takes the last 6 hex digits of each token.
 */
export function parsePaletteText(text: string): RGB[] {
  return text
    .split(/[\r\n,]+/)
    .map(s => s.trim())
    .filter(s => s && s[0] !== ';')
    .map(tok => {
      const last6 = tok.slice(-6);
      return hexToRgb(last6);
    })
    .filter((v): v is RGB => v !== null);
}
