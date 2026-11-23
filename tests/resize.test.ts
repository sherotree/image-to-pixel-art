import { assertEquals } from 'jsr:@std/assert@1';
import { createRgbaImage, resizeImage } from '../mod.ts';

Deno.test('resizeImage: no caps returns same reference semantics (unchanged size)', () => {
  const img = createRgbaImage(10, 10);
  const out = resizeImage(img, null, null);
  assertEquals(out.width, 10);
  assertEquals(out.height, 10);
});

Deno.test('resizeImage: maxWidth only', () => {
  const img = createRgbaImage(100, 50);
  const out = resizeImage(img, 50, null);
  assertEquals(out.width, 50);
  assertEquals(out.height, 25);
});

Deno.test('resizeImage: maxHeight overwrites ratio when both would apply (Pixel It)', () => {
  const img = createRgbaImage(100, 100);
  // width would want 0.5, height wants 0.25 → height wins
  const out = resizeImage(img, 50, 25);
  assertEquals(out.width, 25);
  assertEquals(out.height, 25);
});

Deno.test('resizeImage: already within caps is no-op size', () => {
  const img = createRgbaImage(20, 20);
  const out = resizeImage(img, 100, 100);
  assertEquals(out.width, 20);
  assertEquals(out.height, 20);
});
