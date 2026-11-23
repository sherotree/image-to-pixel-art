import { assertEquals } from 'jsr:@std/assert@1';
import { hexToRgb, parsePaletteText, rgbToHex } from '../mod.ts';

Deno.test('hexToRgb: #rrggbb and rrggbb', () => {
  assertEquals(hexToRgb('#ff7755'), [255, 119, 85]);
  assertEquals(hexToRgb('ff7755'), [255, 119, 85]);
});

Deno.test('hexToRgb: invalid → null', () => {
  assertEquals(hexToRgb(''), null);
  assertEquals(hexToRgb('#fff'), null);
  assertEquals(hexToRgb('notahex'), null);
});

Deno.test('rgbToHex: pads channels', () => {
  assertEquals(rgbToHex([0, 15, 255]), '#000fff');
});

Deno.test('parsePaletteText: commas, newlines, comments, trailing hex', () => {
  const text = `; Paint.NET Palette
FF112233
; skip
aabbcc, #ddeeff
garbage
`;
  assertEquals(parsePaletteText(text), [
    [0x11, 0x22, 0x33],
    [0xaa, 0xbb, 0xcc],
    [0xdd, 0xee, 0xff],
  ]);
});

Deno.test('parsePaletteText: empty / comments only → []', () => {
  assertEquals(parsePaletteText('; only\n; comments'), []);
  assertEquals(parsePaletteText(''), []);
});
