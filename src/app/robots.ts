import type { MetadataRoute } from "next";

import { loadPublishedContent } from "@/content/load";
import { SITE_URL } from "@/content/metadata";

export const dynamic = "force-static";

/** Search engines are kept out until "Let search engines find the site" is switched on in edit mode. */
export default function robots(): MetadataRoute.Robots {
  const { content } = loadPublishedContent();
  if (!content.settings.searchVisible) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/edit" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
