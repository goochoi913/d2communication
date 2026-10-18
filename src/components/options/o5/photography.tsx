"use client";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { useVideoPlayer } from "@/components/media/video-player";
import { categoryBySlug } from "@/data/site";
import { Plate as PlateImage, ROMAN, frame, serif } from "./shared";
import { SectionHead } from "./section";
import { plates } from "./stills";

/** Section IV: a proof sheet of stills, each with its figure number. */
export function Photography({ index }: { index: number }) {
  const category = categoryBySlug("photography");
  const { open } = useVideoPlayer();
  const [first, ...others] = plates;

  return (
    <section id="photography" aria-labelledby="photography-title" className={cn(frame, "mt-32 scroll-mt-20 md:mt-40")}>
      <SectionHead
        numeral={ROMAN[index]}
        id="photography-title"
        title={category.name}
        tagline={category.tagline}
        description={category.description}
        count={plates.length}
        indexLink={false}
      />

      <div className="mt-12 grid grid-cols-2 border-t border-l border-(--o5-rule) md:grid-cols-4">
        {[first, ...others].map((plate, i) => {
          const big = i === 0;
          const body = (
            <>
              <PlateImage
                src={plate.src}
                alt={plate.caption}
                className={big ? "aspect-[3/2] md:aspect-auto md:min-h-[24rem] md:flex-1" : "aspect-[3/2]"}
                imgClassName="saturate-[0.85] group-hover:saturate-100"
                sizes={big ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
              />
              <figcaption className="mt-3 flex items-baseline gap-3 text-[12px] leading-snug">
                <span className="shrink-0 font-semibold tracking-[0.1em] text-(--o5-red) tabular-nums">
                  {String(i + 2).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className={cn(serif, "block truncate text-[15px] text-(--o5-ink)")}>{plate.caption}</span>
                  <span className="block truncate text-(--o5-muted)">{plate.credit}</span>
                </span>
              </figcaption>
            </>
          );
          return (
            <Reveal
              key={plate.src}
              delay={(i % 4) * 0.06}
              className={cn(
                "border-r border-b border-(--o5-rule) p-4 md:p-5",
                big && "col-span-2 md:row-span-2 md:flex md:flex-col",
              )}
            >
              {plate.video ? (
                <button
                  type="button"
                  onClick={() => open(plate.video!)}
                  className={cn("group block w-full cursor-pointer text-left", big && "md:flex md:flex-1 md:flex-col")}
                >
                  {body}
                </button>
              ) : (
                <figure className={cn("group", big && "md:flex md:flex-1 md:flex-col")}>{body}</figure>
              )}
            </Reveal>
          );
        })}
      </div>
      <p className="mt-4 text-[12px] text-(--o5-muted)">
        Figures 02–{String(plates.length + 1).padStart(2, "0")}. Photographs from location and production; film stills
        open the film.
      </p>
    </section>
  );
}
