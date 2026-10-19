import type { Metadata } from "next";

import { imageUrl, tr } from "./format";
import { loadPublishedContent } from "./load";
import type { CategorySlug, ImageAsset, Lang } from "./schema";
import { pagePath } from "./select";

export const SITE_URL = "https://d2communication.com";

const absolute = (url: string) => (url.startsWith("http") ? url : `${SITE_URL}${url}`);

/**
 * Title, description, language alternates, search-engine rules and the link-preview image
 * for a page, from the content baked into this build.
 */
export function pageMetadata(lang: Lang, slug?: CategorySlug): Metadata {
  const { content } = loadPublishedContent();
  const category = slug ? content.categories.find((c) => c.slug === slug) : undefined;
  const siteTitle = tr(content.text["meta.title"], lang);
  const title = category ? tr(category.name, lang) : siteTitle;
  const description = category ? tr(category.description, lang) : tr(content.text["meta.description"], lang);
  const image: ImageAsset = category?.cover ?? content.images.hero;
  const indexable = content.settings.searchVisible && (!category || category.visibility === "public");

  return {
    title: category ? title : { absolute: siteTitle },
    description,
    alternates: {
      canonical: pagePath(lang, slug),
      languages: content.settings.koEnabled
        ? { en: pagePath("en", slug), ko: pagePath("ko", slug), "x-default": pagePath("en", slug) }
        : undefined,
    },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: "D2 Communication",
      title: category ? `${title} — D2 Communication` : siteTitle,
      description,
      url: pagePath(lang, slug),
      locale: lang === "ko" ? "ko_KR" : "en_US",
      images: [{ url: absolute(imageUrl(image, 1600)), width: 1600, height: Math.round((1600 * image.height) / image.width) }],
    },
    twitter: { card: "summary_large_image" },
  };
}
