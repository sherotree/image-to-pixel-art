/**
 * Browser/DOM helper mirroring the hosted tool `Pixelit` class
 * (port of giventofly/pixelit — MIT).
 *
 * Prefer the portable `imageToPixelArt` API when you already have RGBA buffers
 * (Deno, Node, workers). Use this class when wiring `<img>` + `<canvas>`.
 * Consumers need DOM lib types (browsers, or Deno `compilerOptions.lib` including `dom`).
 */

import { DEFAULT_PALETTE } from '../palette.ts';
import type { RGB } from '../types.ts';
import { similarColor } from '../color.ts';

export interface PixelitConfig {
  to: HTMLCanvasElement;
  from: HTMLImageElement;
  /** Block size 1–50 (mapped to scale * 0.01). */
  scale?: number;
  palette?: RGB[];
  maxHeight?: number | null;
  maxWidth?: number | null;
}

export class Pixelit {
  private drawto: HTMLCanvasElement;
  private drawfrom: HTMLImageElement;
  private scale: number;
  private palette: RGB[];
  private maxHeight: number | null;
  private maxWidth: number | null;
  private ctx: CanvasRenderingContext2D;

  constructor(config: PixelitConfig) {
    this.drawto = config.to;
    this.drawfrom = config.from;
    this.scale =
      config.scale && config.scale > 0 && config.scale <= 50 ? config.scale * 0.01 : 0.08;
    this.palette = config.palette ?? DEFAULT_PALETTE;
    this.maxHeight = config.maxHeight ?? null;
    this.maxWidth = config.maxWidth ?? null;
    const ctx = this.drawto.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    this.ctx = ctx;
  }

  setFromImgSource(src: string): this {
    this.drawfrom.src = src;
    return this;
  }

  setPalette(p: RGB[]): this {
    this.palette = p;
    return this;
  }

  setMaxWidth(v: number | null): this {
    this.maxWidth = v;
    return this;
  }

  setMaxHeight(v: number | null): this {
    this.maxHeight = v;
    return this;
  }

  setScale(v: number): this {
    this.scale = v > 0 && v <= 50 ? v * 0.01 : 0.08;
    return this;
  }

  getPalette(): RGB[] {
    return this.palette;
  }

  pixelate(): this {
    const w = this.drawfrom.naturalWidth || this.drawfrom.width;
    const h = this.drawfrom.naturalHeight || this.drawfrom.height;
    this.drawto.width = w;
    this.drawto.height = h;
    let scale = this.scale;
    let sw = w * scale;
    let sh = h * scale;

    const tmp = document.createElement('canvas');
    tmp.width = w;
    tmp.height = h;

    if (w > 900 || h > 900) {
      scale = scale * 0.5;
      sw = w * scale;
      sh = h * scale;
      tmp.width = Math.max(sw, sh) + 50;
      tmp.height = Math.max(sw, sh) + 50;
    }

    const tctx = tmp.getContext('2d');
    if (!tctx) return this;
    tctx.drawImage(this.drawfrom, 0, 0, sw, sh);

    this.ctx.imageSmoothingEnabled = false;
    // Legacy vendor flags (Pixel It / older browsers)
    (this.ctx as CanvasRenderingContext2D & { mozImageSmoothingEnabled?: boolean })
      .mozImageSmoothingEnabled = false;
    (this.ctx as CanvasRenderingContext2D & { webkitImageSmoothingEnabled?: boolean })
      .webkitImageSmoothingEnabled = false;

    let dw = w;
    if (w > 300) {
      dw += w > h ? Math.floor(w / (w * scale)) / 1.5 : Math.floor(w / (w * scale));
    }
    let dh = h;
    if (h > 300) {
      dh += h > w ? Math.floor(h / (h * scale)) / 1.5 : Math.floor(h / (h * scale));
    }

    this.ctx.drawImage(tmp, 0, 0, sw, sh, 0, 0, dw, dh);
    return this;
  }

  convertGrayscale(): this {
    const { width, height } = this.drawto;
    const img = this.ctx.getImageData(0, 0, width, height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const avg = ((d[i] ?? 0) + (d[i + 1] ?? 0) + (d[i + 2] ?? 0)) / 3;
      d[i] = avg;
      d[i + 1] = avg;
      d[i + 2] = avg;
    }
    this.ctx.putImageData(img, 0, 0);
    return this;
  }

  convertPalette(): this {
    const { width, height } = this.drawto;
    const img = this.ctx.getImageData(0, 0, width, height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const m = similarColor([d[i] ?? 0, d[i + 1] ?? 0, d[i + 2] ?? 0], this.palette);
      d[i] = m[0];
      d[i + 1] = m[1];
      d[i + 2] = m[2];
    }
    this.ctx.putImageData(img, 0, 0);
    return this;
  }

  resizeImage(): this {
    if (!this.maxWidth && !this.maxHeight) return this;
    const tmp = document.createElement('canvas');
    const tctx = tmp.getContext('2d');
    if (!tctx) return this;
    let ratio = 1;
    if (this.maxWidth && this.drawto.width > this.maxWidth) {
      ratio = this.maxWidth / this.drawto.width;
    }
    if (this.maxHeight && this.drawto.height > this.maxHeight) {
      ratio = this.maxHeight / this.drawto.height;
    }
    tmp.width = this.drawto.width;
    tmp.height = this.drawto.height;
    tctx.drawImage(this.drawto, 0, 0);
    this.drawto.width = Math.max(1, this.drawto.width * ratio);
    this.drawto.height = Math.max(1, this.drawto.height * ratio);
    this.ctx.drawImage(tmp, 0, 0, tmp.width, tmp.height, 0, 0, this.drawto.width, this.drawto.height);
    return this;
  }

  draw(): this {
    const w = this.drawfrom.naturalWidth || this.drawfrom.width;
    const h = this.drawfrom.naturalHeight || this.drawfrom.height;
    this.drawto.width = w;
    this.drawto.height = h;
    this.ctx.drawImage(this.drawfrom, 0, 0);
    this.resizeImage();
    return this;
  }

  /**
   * Download the current canvas as PNG (`pxArt.png` by default).
   * Same behavior as the hosted tool download button.
   */
  saveImage(filename = 'pxArt.png'): void {
    const a = document.createElement('a');
    a.download = filename;
    a.href = this.drawto.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /** Read the current canvas as an RGBA buffer for portable post-processing. */
  toRgbaImage(): {
    width: number;
    height: number;
    data: Uint8ClampedArray;
  } {
    const { width, height } = this.drawto;
    const img = this.ctx.getImageData(0, 0, width, height);
    return { width, height, data: new Uint8ClampedArray(img.data) };
  }
}
