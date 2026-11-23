# image-to-pixel-art

**Web tool:** [Image to Pixel Art](https://www.uwarp.design/image-to-pixel-art) — free browser editor for converting images to pixel art (the reference UI for this library).

Portable TypeScript library that turns RGBA image buffers into pixel art (Pixel It algorithm, MIT).

Package: **`@sherotree/image-to-pixel-art`** on [JSR](https://jsr.io/@sherotree/image-to-pixel-art) (`0.1.0`).

## Install

```bash
deno add jsr:@sherotree/image-to-pixel-art
# or
npx jsr add @sherotree/image-to-pixel-art
```

## Quick start (portable, no DOM)

```ts
import {
  createRgbaImage,
  imageToPixelArt,
  PALETTES,
} from '@sherotree/image-to-pixel-art';

// Build or decode an RGBA buffer somehow (width × height × 4).
const source = createRgbaImage(64, 64);
// …fill source.data…

const nes = PALETTES.find(p => p.name === 'NES');
const out = imageToPixelArt(source, {
  blockSize: 7,
  grayscale: false,
  usePalette: true,
  palette: nes?.colors,
  maxWidth: 128,
  maxHeight: 128,
});

console.log(out.width, out.height, out.data.length);
```

Pipeline order: **pixelate → optional grayscale → optional palette snap → optional max width/height**.

## API

| Export | Role |
| --- | --- |
| `imageToPixelArt(source, options?)` | Full pipeline on `RgbaImage` |
| `pixelateImage(source, blockSize?)` | Block-size pixelation only |
| `convertGrayscale` / `convertPalette` | Color steps |
| `resizeImage(image, maxWidth?, maxHeight?)` | Proportional caps |
| `DEFAULT_PALETTE`, `PALETTES` | Built-in palettes |
| `hexToRgb`, `rgbToHex`, `parsePaletteText` | Palette file / hex helpers |
| `colorSim`, `similarColor` | Euclidean nearest-color match |
| `createRgbaImage`, `cloneRgbaImage`, … | Buffer helpers |

### Options (`ImageToPixelArtOptions`)

- `blockSize` — 1–50 (Pixel It scale; default 8)
- `grayscale` — average RGB after pixelation
- `usePalette` — snap to nearest palette color
- `palette` — `RGB[]` (defaults to Pixel It default)
- `maxWidth` / `maxHeight` — optional output caps (height applied before width when both set)

## Browser helper (optional)

Canvas + `<img>` chainable class:

```ts
import { Pixelit } from '@sherotree/image-to-pixel-art/browser';

const px = new Pixelit({ to: canvas, from: img });
px.setScale(7).draw().pixelate();
px.convertPalette();
px.saveImage('pxArt.png');
```

## Examples

- `examples/basic.ts` — pixelate a solid buffer
- `examples/palette.ts` — snap to NES palette
- `examples/grayscale.ts` — grayscale after pixelation

```bash
deno run examples/basic.ts
```

## Checks

```bash
deno task check
deno task test
deno task publish:dry-run
```

## License

MIT. Algorithm credit: [giventofly/pixelit](https://github.com/giventofly/pixelit). See [NOTICE](./NOTICE) and [LICENSE](./LICENSE).
