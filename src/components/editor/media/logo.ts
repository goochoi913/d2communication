/**
 * Logo preparation: SVGs are cleaned of anything executable and cropped to their artwork;
 * PNG/JPG logos lose a plain white background and empty margins, so every logo sits on the
 * dark page the same way whatever file it came from.
 */

export type ProcessedLogo = { blob: Blob; ext: "svg" | "png"; mime: string; width: number; height: number };

const SVG_NS = "http://www.w3.org/2000/svg";

function sanitizeSvg(text: string): SVGSVGElement {
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  const svg = doc.documentElement;
  if (svg.nodeName.toLowerCase() !== "svg" || doc.querySelector("parsererror")) throw new Error("not an svg");
  doc.querySelectorAll("script, foreignObject, iframe, object, embed").forEach((n) => n.remove());
  doc.querySelectorAll("*").forEach((el) => {
    for (const attr of [...el.attributes]) {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();
      if (name.startsWith("on")) el.removeAttribute(attr.name);
      if ((name === "href" || name === "xlink:href") && !value.startsWith("#") && !value.startsWith("data:image/")) {
        el.removeAttribute(attr.name);
      }
    }
  });
  return svg as unknown as SVGSVGElement;
}

/** Measures the drawn artwork and tightens the viewBox around it. */
function cropSvg(svg: SVGSVGElement): { width: number; height: number } {
  const host = document.createElement("div");
  host.style.cssText = "position:absolute;left:-10000px;top:0;width:1000px;height:1000px;visibility:hidden";
  const live = document.importNode(svg, true) as SVGSVGElement;
  host.appendChild(live);
  document.body.appendChild(host);
  try {
    const box = live.getBBox();
    if (box.width > 0 && box.height > 0) {
      const pad = Math.max(box.width, box.height) * 0.01;
      const vb = [box.x - pad, box.y - pad, box.width + pad * 2, box.height + pad * 2].map((n) => +n.toFixed(3));
      svg.setAttribute("viewBox", vb.join(" "));
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      return { width: vb[2], height: vb[3] };
    }
    const [, , w, h] = (svg.getAttribute("viewBox") ?? "0 0 100 100").split(/[\s,]+/).map(Number);
    return { width: w || 100, height: h || 100 };
  } finally {
    host.remove();
  }
}

async function processSvg(file: Blob): Promise<ProcessedLogo> {
  const svg = sanitizeSvg(await file.text());
  if (!svg.getAttribute("xmlns")) svg.setAttribute("xmlns", SVG_NS);
  const { width, height } = cropSvg(svg);
  const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
  return { blob, ext: "svg", mime: "image/svg+xml", width, height };
}

async function processRaster(file: Blob): Promise<ProcessedLogo> {
  const bitmap = await createImageBitmap(file);
  const c = document.createElement("canvas");
  c.width = bitmap.width;
  c.height = bitmap.height;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const image = ctx.getImageData(0, 0, c.width, c.height);
  const px = image.data;

  // A logo with no transparency at all probably sits on white: make the white transparent.
  let opaque = true;
  for (let i = 3; i < px.length; i += 4 * 7) if (px[i] < 250) { opaque = false; break; }
  if (opaque) {
    for (let i = 0; i < px.length; i += 4) {
      const min = Math.min(px[i], px[i + 1], px[i + 2]);
      const max = Math.max(px[i], px[i + 1], px[i + 2]);
      // Near-white, near-grey pixels fade out; anti-aliased edges keep partial alpha.
      if (max - min < 24) px[i + 3] = Math.round(255 * (1 - Math.min(1, Math.max(0, (min - 205) / 45))));
    }
  }

  // Crop to the visible pixels.
  let top = c.height, left = c.width, right = -1, bottom = -1;
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      if (px[(y * c.width + x) * 4 + 3] > 12) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  if (right < 0) throw new Error("empty logo");
  ctx.putImageData(image, 0, 0);
  const w = right - left + 1;
  const h = bottom - top + 1;
  const scale = Math.min(1, 1200 / w);
  const out = document.createElement("canvas");
  out.width = Math.round(w * scale);
  out.height = Math.round(h * scale);
  const octx = out.getContext("2d")!;
  octx.imageSmoothingQuality = "high";
  octx.drawImage(c, left, top, w, h, 0, 0, out.width, out.height);
  const blob = await new Promise<Blob>((resolve, reject) => out.toBlob((b) => (b ? resolve(b) : reject(new Error("encode"))), "image/png"));
  return { blob, ext: "png", mime: "image/png", width: out.width, height: out.height };
}

export function processLogo(file: File): Promise<ProcessedLogo> {
  const isSvg = file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
  return isSvg ? processSvg(file) : processRaster(file);
}
