import type { RGB } from './types.ts';

/**
 * Euclidean distance between two RGB colors (lower is closer).
 * Range roughly `[0, ~441.67]`.
 */
export function colorSim(a: RGB, b: RGB): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    const d = ai - bi;
    s += d * d;
  }
  return Math.sqrt(s);
}

/**
 * Pick the palette color closest to `color` (ties prefer later entries, matching Pixel It).
 */
export function similarColor(color: RGB, palette: RGB[]): RGB {
  const first = palette[0];
  if (!first) {
    throw new Error('Palette must contain at least one color');
  }
  let best = first;
  let bestD = colorSim(color, best);
  for (let i = 1; i < palette.length; i++) {
    const cur = palette[i];
    if (!cur) continue;
    const d = colorSim(color, cur);
    if (d <= bestD) {
      best = cur;
      bestD = d;
    }
  }
  return best;
}
