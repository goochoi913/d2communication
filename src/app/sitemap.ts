import type { MetadataRoute } from "next";

import { loadPublishedContent } from "@/content/load";
import { SITE_URL } from "@/content/metadata";
import { pagePath } from "@/content/select";

export const dynamic = "force-static";

/** Public pages only: link-only and hidden categories stay out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const { content, publishedAt } = loadPublishedContent();
  const langs = content.settings.koEnabled ? (["en", "ko"] as const) : (["en"] as const);
  const slugs = content.categories.filter((c) => c.visibility === "public").map((c) => c.slug);
  const lastModified = publishedAt ? new Date(publishedAt) : undefined;
  return langs.flatMap((lang) =>
    [undefined, ...slugs].map((slug) => ({ url: `${SITE_URL}${pagePath(lang, slug)}`, lastModified })),
  );
}
