import type { Category, CategorySlug, FilmCategory, Lang, SiteContent, Work } from "./schema";

/** Site paths: English at the root, Korean under /ko. */
export const pagePath = (lang: Lang, slug?: CategorySlug) => {
  const base = lang === "ko" ? "/ko" : "";
  return slug ? `${base}/${slug}` : base || "/";
};

/** The same page in the other language. */
export const otherLangPath = (lang: Lang, slug?: CategorySlug) => pagePath(lang === "ko" ? "en" : "ko", slug);

/** Categories in the navigation: public ones for visitors; in edit mode every one, so they can be switched back on. */
export const navCategories = (content: SiteContent, editing: boolean) =>
  content.categories.filter((c) => editing || c.visibility === "public");

export const categoryBySlug = (content: SiteContent, slug: CategorySlug): Category =>
  content.categories.find((c) => c.slug === slug)!;

/** Works in a category, in their saved order. Hidden works only appear in edit mode. */
export function worksIn(content: SiteContent, slug: FilmCategory, editing: boolean, placement?: Work["placement"]) {
  return content.works.filter(
    (w) => w.category === slug && (editing || !w.hidden) && (!placement || w.placement === placement),
  );
}

export function featuredWork(content: SiteContent): Work | undefined {
  return (
    content.works.find((w) => w.id === content.settings.featuredWorkId && !w.hidden) ??
    content.works.find((w) => w.placement === "selected" && !w.hidden)
  );
}
