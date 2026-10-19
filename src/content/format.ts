import type { ImageAsset, L10n, Lang } from "./schema";

/** The string for `lang`, falling back to English while a Korean field is still empty. */
export function tr(value: L10n | undefined, lang: Lang): string {
  if (!value) return "";
  return (lang === "ko" ? value.ko.trim() || value.en : value.en) ?? "";
}

/** Whether a Korean field is missing and showing English instead (flagged in edit mode). */
export const isFallback = (value: L10n | undefined, lang: Lang) => lang === "ko" && !!value?.en && !value.ko.trim();

/** Count + unit: "15 films" in English, "15편" in Korean. */
export const withUnit = (count: number, unit: string, lang: Lang) => (lang === "ko" ? `${count}${unit}` : `${count} ${unit}`);

// ── Durations ─────────────────────────────────────────────────────────────────

/** 52 min · 3:40 · 1 h 48 min (Korean: 52분 · 3:40 · 1시간 48분). */
export function formatDuration(seconds: number, lang: Lang): string {
  if (!seconds || seconds < 1) return "";
  const s = Math.round(seconds);
  if (s < 600) return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  if (lang === "ko") return h ? `${h}시간${m ? ` ${m}분` : ""}` : `${m}분`;
  return h ? `${h} h${m ? ` ${m} min` : ""}` : `${m} min`;
}

/**
 * Reads what someone types into a length field: "52", "52 min", "52분", "3:40",
 * "1:48:00", "1h 48m", "1 h 48 min", "1시간 48분". A bare number means minutes.
 */
export function parseDuration(input: string): number | null {
  const t = input.trim().toLowerCase();
  if (!t) return 0;
  if (/^\d+(:\d{1,2}){1,2}$/.test(t)) {
    const parts = t.split(":").map(Number);
    return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
  }
  if (/^\d+(\.\d+)?$/.test(t)) return Math.round(Number(t) * 60);
  const h = t.match(/(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours|시간)/);
  const m = t.match(/(\d+)\s*(m|min|mins|minute|minutes|분)/);
  const s = t.match(/(\d+)\s*(s|sec|secs|second|seconds|초)/);
  if (!h && !m && !s) return null;
  return Math.round((h ? Number(h[1]) * 3600 : 0) + (m ? Number(m[1]) * 60 : 0) + (s ? Number(s[1]) : 0));
}

// ── YouTube ───────────────────────────────────────────────────────────────────

/** The 11-character video ID from any YouTube link (watch, youtu.be, embed, shorts, live) or a bare ID. */
export function parseYouTubeId(input: string | undefined): string | null {
  const t = (input ?? "").trim();
  if (/^[\w-]{11}$/.test(t)) return t;
  try {
    const url = new URL(t.startsWith("http") ? t : `https://${t}`);
    const host = url.hostname.replace(/^(www\.|m\.|music\.)/, "");
    if (host === "youtu.be") return url.pathname.slice(1, 12) || null;
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const v = url.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;
      const m = url.pathname.match(/^\/(embed|shorts|live|v)\/([\w-]{11})/);
      if (m) return m[2];
    }
  } catch {
    // not a URL
  }
  return null;
}

export const youtubeThumbnail = (id: string, quality: "maxresdefault" | "hqdefault" | "sddefault" = "hqdefault") =>
  `https://i.ytimg.com/vi/${id}/${quality}.jpg`;

export const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export function youtubeEmbedUrl(id: string, params: Record<string, string | number> = {}) {
  const search = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${search}`;
}

// ── Images ────────────────────────────────────────────────────────────────────

/** URL of the variant closest to `width` (the largest when omitted). */
export function imageUrl(image: ImageAsset, width?: number): string {
  if (!image.widths?.length) return image.src;
  const w = width ? (image.widths.find((x) => x >= width) ?? image.widths.at(-1)!) : image.widths.at(-1)!;
  return image.src.replace("{w}", String(w));
}

export function imageSrcSet(image: ImageAsset): string | undefined {
  if (!image.widths?.length) return undefined;
  return image.widths.map((w) => `${image.src.replace("{w}", String(w))} ${w}w`).join(", ");
}

export const objectPosition = (image: ImageAsset) =>
  image.focus ? `${image.focus.x}% ${image.focus.y}%` : undefined;

// ── IDs ───────────────────────────────────────────────────────────────────────

/** Short random ID for new items, e.g. "w-k3j9x2". */
export function newId(prefix: string) {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `${prefix}-${Array.from(bytes, (b) => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36]).join("")}`;
}
