"use client";

import type { ContentSnapshot, Lang } from "@/content/schema";
import type { CategorySlug } from "@/content/schema";
import { SiteProvider } from "@/components/content/site-context";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Toaster } from "@/components/ui/sonner";
import { Contact } from "./contact";
import { Nav } from "./nav";
import { CategoryPage } from "./pages/category-page";
import { HomePage } from "./pages/home-page";
import { PhotographyPage } from "./pages/photography-page";
import { PhotoLightboxProvider } from "./photo-lightbox";
import { WorkPlayerProvider } from "./work-player";

export type PageSpec = { kind: "home" } | { kind: "category"; slug: Exclude<CategorySlug, "photography"> } | { kind: "photography" };

/** Everything around a page: content, smooth scrolling, the shared player and lightbox, nav and footer. */
export function SiteShell({ snapshot, lang, page }: { snapshot: ContentSnapshot; lang: Lang; page: PageSpec }) {
  const slug = page.kind === "category" ? page.slug : page.kind === "photography" ? "photography" : undefined;
  return (
    <SiteProvider snapshot={snapshot} lang={lang}>
      <SmoothScroll>
        <WorkPlayerProvider>
          <PhotoLightboxProvider>
            <div
              lang={lang}
              className="min-h-dvh bg-neutral-950 font-sans text-neutral-50 antialiased selection:bg-[#CC0606] selection:text-white"
            >
              <Nav slug={slug} />
              <main>
                {page.kind === "home" ? <HomePage /> : null}
                {page.kind === "category" ? <CategoryPage slug={page.slug} /> : null}
                {page.kind === "photography" ? <PhotographyPage /> : null}
              </main>
              <Contact slug={slug} />
            </div>
            <Toaster position="bottom-center" />
          </PhotoLightboxProvider>
        </WorkPlayerProvider>
      </SmoothScroll>
    </SiteProvider>
  );
}
