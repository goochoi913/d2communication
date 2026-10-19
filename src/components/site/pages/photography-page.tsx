"use client";

import { cn } from "@/lib/utils";
import type { Photo } from "@/content/schema";
import { categoryBySlug } from "@/content/select";
import { EAdd, Txt, useVisible } from "@/components/content/editable";
import { useSite } from "@/components/content/site-context";
import { Reveal } from "@/components/motion/reveal";
import { PhotoCard } from "../photo-card";
import { RedLine, serif } from "../typography";
import { CategoryHeader, NextCategory, Unavailable } from "./category-page";

/**
 * Photographs and behind-the-scenes shots in a masonry of columns, so any mix of portrait
 * and landscape images lines up, and hundreds of them stay light (each loads as it nears
 * the screen).
 */
export function PhotographyPage() {
  const { content, editing } = useSite();
  const category = categoryBySlug(content, "photography");
  const photos = useVisible(content.photos);
  if (category.visibility === "hidden" && !editing) return <Unavailable />;

  const index = content.categories.findIndex((c) => c.slug === "photography");
  const groups: { key: Photo["group"]; title: "photography.portfolio" | "photography.location" }[] = [
    { key: "portfolio", title: "photography.portfolio" },
    { key: "location", title: "photography.location" },
  ];

  return (
    <>
      <CategoryHeader slug="photography" index={index} />
      {groups.map(({ key, title }) => {
        const items = photos.filter((p) => p.group === key);
        if (!items.length && !editing) return null;
        const ids = items.map((p) => p.id);
        return (
          <section key={key} className="mx-auto max-w-[1600px] px-5 pt-16 pb-12 md:px-10 md:pt-24">
            <Reveal className="flex items-baseline justify-between gap-6">
              <Txt k={title} as="h2" className={cn(serif, "text-[clamp(2rem,3.6vw,3.4rem)] leading-none font-light")} />
              <span className="text-sm tracking-[0.2em] text-neutral-500 tabular-nums">{items.length}</span>
            </Reveal>
            <RedLine className="mt-6" />
            <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-10 [&>*]:break-inside-avoid">
              {items.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} set={items} scopeIds={ids} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
              ))}
              <EAdd kind="photo" listPath={["photos"]} preset={{ group: key }} variant="tile" className="aspect-[3/2] w-full" />
            </div>
          </section>
        );
      })}
      <div className="h-12 md:h-24" />
      <NextCategory slug="photography" />
    </>
  );
}
