import type { Category, L10n, SiteContent, Work } from "./schema";
import { CATEGORY_SLUGS, CONTENT_SCHEMA, FILM_CATEGORIES } from "./schema";
import { normalizeFonts } from "./fonts";
import { SEED_CONTENT } from "./seed";
import { TEXT_DEFAULTS, type TextKey } from "./text-defaults";

type Loose = Record<string, unknown>;

const isObject = (v: unknown): v is Loose => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

function l10n(v: unknown, fallback: L10n = { en: "", ko: "" }): L10n {
  if (typeof v === "string") return { en: v, ko: "" };
  if (!isObject(v)) return { ...fallback };
  return { en: str(v.en, fallback.en), ko: str(v.ko, fallback.ko) };
}

function list<T>(v: unknown, fix: (item: Loose) => T | null): T[] {
  if (!Array.isArray(v)) return [];
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of v) {
    if (!isObject(item)) continue;
    const fixed = fix(item);
    const id = fixed && (fixed as { id?: string }).id;
    if (!fixed || (id && seen.has(id))) continue;
    if (id) seen.add(id);
    out.push(fixed);
  }
  return out;
}

function fixWork(w: Loose): Work | null {
  if (!str(w.id)) return null;
  const category = FILM_CATEGORIES.includes(w.category as Work["category"]) ? (w.category as Work["category"]) : "broadcast";
  return {
    ...(w as unknown as Work),
    id: str(w.id),
    category,
    title: l10n(w.title),
    subGenre: l10n(w.subGenre),
    year: str(w.year),
    client: l10n(w.client),
    role: l10n(w.role),
    duration: typeof w.duration === "number" && Number.isFinite(w.duration) ? Math.max(0, w.duration) : 0,
    description: l10n(w.description),
    youtubeId: str(w.youtubeId),
    placement: w.placement === "selected" ? "selected" : "other",
  };
}

/**
 * Turns anything loaded from Firestore, a snapshot or an old version into a complete
 * `SiteContent`: missing text falls back to the defaults, the four categories always
 * exist (in the saved order), and malformed items are dropped instead of crashing the page.
 */
export function normalizeContent(raw: unknown): SiteContent {
  const c = isObject(raw) ? raw : {};
  const seed = SEED_CONTENT;

  const text = {} as Record<TextKey, L10n>;
  const savedText = isObject(c.text) ? c.text : {};
  for (const key of Object.keys(TEXT_DEFAULTS) as TextKey[]) {
    text[key] = key in savedText ? l10n(savedText[key], TEXT_DEFAULTS[key]) : { ...TEXT_DEFAULTS[key] };
  }

  const savedCategories = Array.isArray(c.categories) ? (c.categories.filter(isObject) as Loose[]) : [];
  const categories: Category[] = [];
  for (const slug of [...savedCategories.map((x) => x.slug as string), ...CATEGORY_SLUGS]) {
    if (!CATEGORY_SLUGS.includes(slug as Category["slug"]) || categories.some((x) => x.slug === slug)) continue;
    const base = seed.categories.find((x) => x.slug === slug)!;
    const saved = savedCategories.find((x) => x.slug === slug) ?? {};
    categories.push({
      ...base,
      ...(saved as Partial<Category>),
      slug: base.slug,
      name: l10n(saved.name, base.name),
      tagline: l10n(saved.tagline, base.tagline),
      description: l10n(saved.description, base.description),
      visibility: ["public", "link-only", "hidden"].includes(saved.visibility as string)
        ? (saved.visibility as Category["visibility"])
        : base.visibility,
    });
  }

  const settings = isObject(c.settings) ? c.settings : {};
  const images = isObject(c.images) ? c.images : {};

  return {
    schema: CONTENT_SCHEMA,
    settings: {
      ...seed.settings,
      ...(settings as Partial<SiteContent["settings"]>),
      contactEmail: str(settings.contactEmail, seed.settings.contactEmail),
      koEnabled: typeof settings.koEnabled === "boolean" ? settings.koEnabled : seed.settings.koEnabled,
      searchVisible: typeof settings.searchVisible === "boolean" ? settings.searchVisible : seed.settings.searchVisible,
      featuredWorkId: str(settings.featuredWorkId, seed.settings.featuredWorkId),
      fonts: normalizeFonts(settings.fonts),
    },
    text,
    images: {
      hero: isObject(images.hero) ? (images.hero as SiteContent["images"]["hero"]) : seed.images.hero,
      about: isObject(images.about) ? (images.about as SiteContent["images"]["about"]) : seed.images.about,
      contact: isObject(images.contact) ? (images.contact as SiteContent["images"]["contact"]) : seed.images.contact,
    },
    stats: Array.isArray(c.stats)
      ? list(c.stats, (s) => (str(s.id) ? { ...(s as object), id: str(s.id), value: str(s.value), label: l10n(s.label) } : null))
      : seed.stats,
    crafts: Array.isArray(c.crafts) ? list(c.crafts, (x) => (str(x.id) ? { id: str(x.id), label: l10n(x.label) } : null)) : seed.crafts,
    categories,
    works: Array.isArray(c.works) ? list(c.works, fixWork) : seed.works,
    photos: Array.isArray(c.photos)
      ? list(c.photos, (p) =>
          str(p.id) && isObject(p.image)
            ? {
                ...(p as object),
                id: str(p.id),
                image: p.image as SiteContent["photos"][number]["image"],
                caption: l10n(p.caption),
                group: p.group === "location" ? "location" : "portfolio",
              }
            : null,
        )
      : seed.photos,
    partners: Array.isArray(c.partners)
      ? list(c.partners, (p) => (str(p.id) ? { ...(p as object), id: str(p.id), name: l10n(p.name) } : null))
      : seed.partners,
  };
}
