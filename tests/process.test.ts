import { assertEquals, assertThrows } from 'jsr:@std/assert@1';
import {
  createRgbaImage,
  DEFAULT_PALETTE,
  imageToPixelArt,
  PALETTES,
} from '../mod.ts';

function solid(w: number, h: number, r: number, g: number, b: number, a = 255) {
  const img = createRgbaImage(w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    img.data[i] = r;
    img.data[i + 1] = g;
    img.data[i + 2] = b;
    img.data[i + 3] = a;
  }
  return img;
}

Deno.test('imageToPixelArt: grayscale makes R=G=B', () => {
  const out = imageToPixelArt(solid(16, 16, 255, 0, 0), { blockSize: 4, grayscale: true });
  assertEquals(out.data[0], out.data[1]);
  assertEquals(out.data[1], out.data[2]);
});

Deno.test('imageToPixelArt: palette snap lands on palette entry', () => {
  const palette = DEFAULT_PALETTE;
  const out = imageToPixelArt(solid(16, 16, 140, 143, 174), {
    blockSize: 4,
    usePalette: true,
    palette,
  });
  const first = palette[0];
  if (!first) throw new Error('missing palette');
  assertEquals([out.data[0], out.data[1], out.data[2]], first);
});

Deno.test('imageToPixelArt: empty palette throws when usePalette', () => {
  assertThrows(
    () => imageToPixelArt(solid(8, 8, 1, 2, 3), { usePalette: true, palette: [] }),
    Error,
  );
});

Deno.test('imageToPixelArt: maxWidth / maxHeight caps', () => {
  const out = imageToPixelArt(solid(200, 100, 10, 20, 30), {
    blockSize: 8,
    maxWidth: 50,
    maxHeight: 40,
  });
  // Height pass first (ratio 40/h), then width pass if still over 50.
  assertEquals(out.width <= 50, true);
  assertEquals(out.height <= 40, true);
});

Deno.test('imageToPixelArt: preserves alpha on palette snap', () => {
  const src = solid(8, 8, 200, 50, 50, 128);
  const out = imageToPixelArt(src, {
    blockSize: 8,
    usePalette: true,
    palette: [[255, 0, 0], [0, 0, 0]],
  });
  assertEquals(out.data[3], 128);
});

Deno.test('PALETTES: includes Pixelit Default and NES', () => {
  const names = PALETTES.map(p => p.name);
  assertEquals(names.includes('Pixelit Default'), true);
  assertEquals(names.includes('NES'), true);
  assertEquals(names.includes('Endesga 16'), true);
});
