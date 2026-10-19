/**
 * Image preparation in the browser, before upload: decode (respecting the camera's
 * orientation), optionally apply the site's black-and-white "red line" treatment, resize to
 * a few widths, encode as WebP (JPEG where the browser can't write WebP), and compute the
 * tiny blur preview. The editor never has to think about file sizes.
 */

export type ProcessedImage = {
  variants: { width: number; blob: Blob }[];
  ext: "webp" | "jpg";
  mime: "image/webp" | "image/jpeg";
  width: number;
  height: number;
  lqip: string;
  bottomTone: "light" | "dark";
};

export type ImageOptions = {
  widths: number[];
  /** Keep only the reds in colour, the rest deep black and white (the hero's look). */
  redline?: boolean;
  quality?: number;
};

export class UnreadableImageError extends Error {}

async function decode(file: Blob): Promise<ImageBitmap | HTMLImageElement> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // Older Safari: fall back to an <img>, which also applies EXIF orientation.
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return img;
    } catch {
      throw new UnreadableImageError("unreadable");
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

function canvas(width: number, height: number) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d", { willReadFrequently: false })!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return { c, ctx };
}

/** Downscale in halving steps so large reductions stay sharp instead of aliased. */
function resize(source: CanvasImageSource, sw: number, sh: number, width: number) {
  let w = sw;
  let h = sh;
  let current: CanvasImageSource = source;
  while (w / 2 > width) {
    const step = canvas(Math.round(w / 2), Math.round(h / 2));
    step.ctx.drawImage(current, 0, 0, step.c.width, step.c.height);
    current = step.c;
    w = step.c.width;
    h = step.c.height;
  }
  const out = canvas(width, Math.round((sh / sw) * width));
  out.ctx.drawImage(current, 0, 0, out.c.width, out.c.height);
  return out.c;
}

let webpSupported: boolean | null = null;
function canWriteWebp() {
  if (webpSupported === null) {
    const { c } = canvas(2, 2);
    webpSupported = c.toDataURL("image/webp").startsWith("data:image/webp");
  }
  return webpSupported;
}

function toBlob(c: HTMLCanvasElement, mime: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error("encode failed"))), mime, quality));
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * The hero treatment, as in the original frozen-river photograph: a deep-red-filter black
 * and white (dark skies, bright snow) with saturated reds left in colour.
 */
function applyRedline(c: HTMLCanvasElement) {
  const ctx = c.getContext("2d")!;
  const { width: w, height: h } = c;
  const image = ctx.getImageData(0, 0, w, h);
  const px = image.data;
  const mask = new Float32Array(w * h);

  for (let i = 0, p = 0; i < px.length; i += 4, p++) {
    const r = px[i] / 255;
    const g = px[i + 1] / 255;
    const b = px[i + 2] / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const s = max === 0 ? 0 : (max - min) / max;
    let hue = 0;
    if (max !== min) {
      if (max === r) hue = ((g - b) / (max - min)) % 6;
      else if (max === g) hue = (b - r) / (max - min) + 2;
      else hue = (r - g) / (max - min) + 4;
      hue *= 60;
      if (hue < 0) hue += 360;
    }
    const distance = Math.min(Math.abs(hue - 357), 360 - Math.abs(hue - 357));
    mask[p] = (1 - smoothstep(14, 30, distance)) * smoothstep(0.35, 0.55, s) * smoothstep(0.18, 0.3, max);
  }

  // Soften the mask so colour edges don't look cut out.
  const radius = Math.max(1, Math.round(w / 1200));
  const tmp = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let n = 0;
      for (let k = -radius; k <= radius; k++) {
        const xx = x + k;
        if (xx >= 0 && xx < w) {
          sum += mask[y * w + xx];
          n++;
        }
      }
      tmp[y * w + x] = sum / n;
    }
  }
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let sum = 0;
      let n = 0;
      for (let k = -radius; k <= radius; k++) {
        const yy = y + k;
        if (yy >= 0 && yy < h) {
          sum += tmp[yy * w + x];
          n++;
        }
      }
      mask[y * w + x] = sum / n;
    }
  }

  for (let i = 0, p = 0; i < px.length; i += 4, p++) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    // Deep red filter: reds bright, blues (the sky) dark; then a little extra contrast.
    const grey = Math.min(255, Math.max(0, (0.95 * r + 0.15 * g - 0.1 * b) * 1.12 - 14));
    const m = mask[p];
    px[i] = grey + (r - grey) * m;
    px[i + 1] = grey + (g - grey) * m;
    px[i + 2] = grey + (b - grey) * m;
  }
  ctx.putImageData(image, 0, 0);
}

function measureBottomTone(c: HTMLCanvasElement): "light" | "dark" {
  const small = resize(c, c.width, c.height, 64);
  const ctx = small.getContext("2d")!;
  const rows = Math.max(1, Math.round(small.height * 0.15));
  const data = ctx.getImageData(0, small.height - rows, small.width, rows).data;
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  return sum / (data.length / 4) > 120 ? "light" : "dark";
}

export async function processImage(file: Blob, { widths, redline = false, quality = 0.82 }: ImageOptions): Promise<ProcessedImage> {
  const source = await decode(file);
  const sw = "naturalWidth" in source ? source.naturalWidth : source.width;
  const sh = "naturalHeight" in source ? source.naturalHeight : source.height;
  if (!sw || !sh) throw new UnreadableImageError("empty");

  const largest = Math.min(sw, Math.max(...widths));
  const base = resize(source, sw, sh, largest);
  if ("close" in source) source.close();
  if (redline) applyRedline(base);

  const webp = canWriteWebp();
  const mime = webp ? "image/webp" : "image/jpeg";
  const targets = [...new Set([...widths.filter((w) => w < largest), largest])].sort((a, b) => a - b);
  const variants = [];
  for (const w of targets) {
    const c = w === largest ? base : resize(base, base.width, base.height, w);
    variants.push({ width: w, blob: await toBlob(c, mime, quality) });
  }

  const preview = resize(base, base.width, base.height, 24);
  return {
    variants,
    ext: webp ? "webp" : "jpg",
    mime,
    width: base.width,
    height: base.height,
    lqip: preview.toDataURL(webp ? "image/webp" : "image/jpeg", 0.5),
    bottomTone: measureBottomTone(base),
  };
}

/** A still frame from a video file (for a loop's poster), as an image Blob. */
export async function videoFrame(file: Blob, at = 0.5): Promise<{ blob: Blob; width: number; height: number; duration: number }> {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;
    await new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => resolve();
      video.onerror = () => reject(new Error("unreadable video"));
    });
    video.currentTime = Math.min(at, Math.max(0, video.duration - 0.1));
    await new Promise<void>((resolve) => (video.onseeked = () => resolve()));
    const { c, ctx } = canvas(video.videoWidth, video.videoHeight);
    ctx.drawImage(video, 0, 0);
    return { blob: await toBlob(c, "image/jpeg", 0.85), width: video.videoWidth, height: video.videoHeight, duration: video.duration };
  } finally {
    URL.revokeObjectURL(url);
  }
}
