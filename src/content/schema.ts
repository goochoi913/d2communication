/**
 * The shape of everything on the site. The whole site renders from one `SiteContent`
 * object: baked into the static HTML at build time, refreshed from Firestore in the
 * browser, and edited in place in edit mode. Bump `CONTENT_SCHEMA` and extend
 * `normalizeContent` when the shape changes, so older drafts and versions still load.
 */

import type { TextKey } from "./text-defaults";

export const CONTENT_SCHEMA = 1;

export type Lang = "en" | "ko";
export const LANGS: readonly Lang[] = ["en", "ko"];

/** Every visible string exists in both languages. An empty Korean string falls back to English. */
export type L10n = { en: string; ko: string };

export type CategorySlug = "broadcast" | "promo" | "performance" | "photography";
export type FilmCategory = Exclude<CategorySlug, "photography">;
export const CATEGORY_SLUGS: readonly CategorySlug[] = ["broadcast", "promo", "performance", "photography"];
export const FILM_CATEGORIES: readonly FilmCategory[] = ["broadcast", "promo", "performance"];

/**
 * - `public`: in the navigation, sitemap and search results.
 * - `link-only`: reachable by its URL, but kept out of the navigation, sitemap and search.
 * - `hidden`: not shown anywhere; its URL says the page doesn't exist.
 */
export type Visibility = "public" | "link-only" | "hidden";

/** A responsive image, shipped with the site or uploaded in edit mode. */
export type ImageAsset = {
  /** URL of the image. A `{w}` in it is replaced by one of `widths` to pick a size. */
  src: string;
  /** Available widths in pixels, ascending. Absent when `src` is a single file. */
  widths?: number[];
  /** Intrinsic size of the largest variant. */
  width: number;
  height: number;
  /** Tiny blurred preview (data URL) shown while the image loads. */
  lqip?: string;
  /** Focal point in percent, used when the image is cropped to fit its frame. */
  focus?: { x: number; y: number };
  /** Colour treatment baked into the file: `redline` keeps only the reds in colour. */
  treatment?: "redline" | "mono";
  /** Whether the bottom edge is light or dark, so text laid over it can pick a readable colour. */
  bottomTone?: "light" | "dark";
};

/** A partner logo: one SVG or PNG file, drawn in monochrome. */
export type LogoAsset = { src: string; width: number; height: number };

/** A short, muted, self-hosted preview loop (~3 MB). Everything else plays from YouTube. */
export type LoopAsset = {
  src: string;
  width: number;
  height: number;
  /** Still frame shown before the loop plays, and instead of it when autoplay is blocked. */
  poster?: string;
  bytes?: number;
  /** Seconds. */
  duration?: number;
};

export type Partner = {
  id: string;
  name: L10n;
  logo?: LogoAsset;
  url?: string;
  /**
   * How the logo is drawn on the dark page: `silhouette` turns every shape white (best for
   * wordmarks); `invert` keeps inner detail such as emblems, as light and dark greys.
   */
  mono?: "silhouette" | "invert";
  /** Show the logo's own colours on hover (only for logos made to sit on dark backgrounds). */
  hoverColor?: boolean;
  hidden?: boolean;
  /** Placeholder content to be replaced (shown as "Sample" in edit mode only). */
  sample?: boolean;
};

export type Work = {
  id: string;
  category: FilmCategory;
  title: L10n;
  subGenre: L10n;
  /** Free text so ranges work, e.g. "2018–19". */
  year: string;
  /** The credited broadcaster or client, shown as its logo. */
  partnerId?: string;
  /** Broadcaster or client as text, used when there is no partner logo. */
  client: L10n;
  role: L10n;
  /** Length of the full film in seconds (0 when unknown). */
  duration: number;
  description: L10n;
  /** YouTube ID of the ~1 minute highlight cut that plays on click ("" until it's uploaded). */
  youtubeId: string;
  /** The full-length film: a YouTube link, or any other URL (opened in a new tab). */
  fullUrl?: string;
  poster?: ImageAsset;
  /** Muted preview that plays on hover, or in view on phones. */
  loop?: LoopAsset;
  /** `selected` works are the 5–6 shown up front; the rest sit under "Other works". */
  placement: "selected" | "other";
  hidden?: boolean;
  sample?: boolean;
};

export type Photo = {
  id: string;
  image: ImageAsset;
  caption: L10n;
  /** `portfolio`: the photography itself. `location`: behind the scenes on a shoot. */
  group: "portfolio" | "location";
  hidden?: boolean;
  sample?: boolean;
};

export type Stat = {
  id: string;
  /** Shown big; the leading number counts up, e.g. "50+". */
  value: string;
  label: L10n;
  sample?: boolean;
};

export type Craft = { id: string; label: L10n };

export type Category = {
  slug: CategorySlug;
  name: L10n;
  tagline: L10n;
  description: L10n;
  visibility: Visibility;
  cover?: ImageAsset;
};

export type SiteImages = {
  /** The frozen river: the homepage hero. */
  hero: ImageAsset;
  /** Portrait in the About section. */
  about: ImageAsset;
  /** Faint background behind the contact section. */
  contact: ImageAsset;
};

export type SiteSettings = {
  contactEmail: string;
  /** Shows the 한국어 / English toggle to visitors. */
  koEnabled: boolean;
  /** Lets search engines index the site. Off while the placeholder content is being replaced. */
  searchVisible: boolean;
  /** The film given the large featured block on the homepage. */
  featuredWorkId: string;
  /** Optional muted loop that plays over the hero photograph. */
  heroLoop?: LoopAsset;
};

export type SiteContent = {
  schema: number;
  settings: SiteSettings;
  text: Record<TextKey, L10n>;
  images: SiteImages;
  stats: Stat[];
  crafts: Craft[];
  categories: Category[];
  works: Work[];
  photos: Photo[];
  partners: Partner[];
};

/** Published content plus its version, as baked into the build and stored in Firestore. */
export type ContentSnapshot = {
  /** 0 = the built-in placeholder content, never published. */
  version: number;
  publishedAt: string | null;
  content: SiteContent;
};
