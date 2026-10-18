import { categories, photos, videos, type Video } from "@/data/site";

export type Plate = { src: string; caption: string; credit: string; video?: Video };

/** Photographs for the contact sheet: the studio's own stills first, then covers and film stills. */
export const plates: Plate[] = (() => {
  const seen = new Set<string>();
  const list: Plate[] = [];
  const push = (p: Plate) => {
    if (!p.src || seen.has(p.src)) return;
    seen.add(p.src);
    list.push(p);
  };
  photos.forEach((p) => push({ src: p.src, caption: p.caption, credit: "Jin Sam Choi" }));
  categories.forEach((c) => push({ src: c.cover, caption: c.title, credit: "Production still" }));
  videos
    .filter((v) => v.poster)
    .forEach((v) => push({ src: v.poster!, caption: v.title, credit: `${v.client}, ${v.year}`, video: v }));
  return list.slice(0, 9);
})();
