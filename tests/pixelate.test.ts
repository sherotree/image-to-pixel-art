import { assertEquals, assertThrows } from 'jsr:@std/assert@1';
import {
  computePixelateGeometry,
  createRgbaImage,
  normalizeScale,
  pixelateImage,
} from '../mod.ts';

Deno.test('normalizeScale: 1..50 maps to *0.01; invalid → 0.08', () => {
  assertEquals(normalizeScale(7), 0.07);
  assertEquals(normalizeScale(50), 0.5);
  assertEquals(normalizeScale(1), 0.01);
  assertEquals(normalizeScale(0), 0.08);
  assertEquals(normalizeScale(51), 0.08);
  assertEquals(normalizeScale(undefined), 0.08);
});

Deno.test('computePixelateGeometry: small image keeps final size', () => {
  const g = computePixelateGeometry(100, 80, 8);
  assertEquals(g.workScale, 0.08);
  assertEquals(g.finalWidth, 100);
  assertEquals(g.finalHeight, 80);
});

Deno.test('computePixelateGeometry: >300 adds border compensation', () => {
  const g = computePixelateGeometry(400, 200, 10);
  // workScale 0.1; width>height → floor(1/0.1)/1.5 = 10/1.5
  assertEquals(g.workScale, 0.1);
  assertEquals(g.finalWidth, 400 + 10 / 1.5);
  assertEquals(g.finalHeight, 200); // height ≤ 300 → unchanged
});

Deno.test('computePixelateGeometry: >900 halves work scale', () => {
  const g = computePixelateGeometry(1000, 500, 8);
  assertEquals(g.workScale, 0.04);
});

Deno.test('pixelateImage: rejects empty / mismatched buffer', () => {
  assertThrows(
    () => pixelateImage({ width: 0, height: 1, data: new Uint8ClampedArray(0) }),
    Error,
  );
  assertThrows(
    () => pixelateImage({ width: 2, height: 2, data: new Uint8ClampedArray(4) }),
    Error,
  );
});

Deno.test('pixelateImage: 1×1 stays 1×1', () => {
  const src = createRgbaImage(1, 1);
  src.data[0] = 12;
  src.data[1] = 34;
  src.data[2] = 56;
  src.data[3] = 255;
  const out = pixelateImage(src, 8);
  assertEquals(out.width, 1);
  assertEquals(out.height, 1);
  assertEquals(out.data[0], 12);
  assertEquals(out.data[3], 255);
});

Deno.test('pixelateImage: output length matches width*height*4', () => {
  const src = createRgbaImage(64, 48);
  const out = pixelateImage(src, 7);
  assertEquals(out.data.length, out.width * out.height * 4);
});
