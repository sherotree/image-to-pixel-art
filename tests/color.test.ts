import { assertAlmostEquals, assertEquals, assertThrows } from 'jsr:@std/assert@1';
import { colorSim, similarColor } from '../mod.ts';

Deno.test('colorSim: identical colors → 0', () => {
  assertEquals(colorSim([10, 20, 30], [10, 20, 30]), 0);
});

Deno.test('colorSim: known distance', () => {
  // sqrt(3^2 + 4^2 + 0) = 5
  assertAlmostEquals(colorSim([0, 0, 0], [3, 4, 0]), 5);
});

Deno.test('similarColor: picks nearest; ties prefer later entry (Pixel It)', () => {
  const palette: [number, number, number][] = [
    [0, 0, 0],
    [10, 0, 0],
    [20, 0, 0],
  ];
  assertEquals(similarColor([12, 0, 0], palette), [10, 0, 0]);
  // Exact midpoint between [10] and [20]: distance 5 either way → later wins
  assertEquals(similarColor([15, 0, 0], palette), [20, 0, 0]);
});

Deno.test('similarColor: empty palette throws', () => {
  assertThrows(() => similarColor([1, 2, 3], []), Error, 'Palette must contain at least one color');
});
