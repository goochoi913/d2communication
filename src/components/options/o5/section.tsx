"use client";

import { LuArrowRight } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { useVideoPlayer } from "@/components/media/video-player";
import { categoryBySlug, videosIn, type Video } from "@/data/site";
import { DoubleRule, FilmFigure, Kicker, Label, Plate, PlayTag, ROMAN, frame, posterFor, serif } from "./shared";

type Layout = "lead-left" | "lead-right" | "lead-wide";

/** A magazine section: numbered header, a lead film, then a row of three. */
export function Section({ slug, index, layout }: { slug: Video["category"]; index: number; layout: Layout }) {
  const category = categoryBySlug(slug);
  // "Ice Road" is the cover story; the sections lead with other work.
  const all = videosIn(slug);
  const pool = all.filter((v) => v.id !== "ice-road");
  const lead = pool.find((v) => v.featured) ?? pool[0];
  const rest = pool.filter((v) => v !== lead).slice(0, 3);

  return (
    <section id={slug} aria-labelledby={`${slug}-title`} className={cn(frame, "mt-32 scroll-mt-20 md:mt-40")}>
      <SectionHead
        numeral={ROMAN[index]}
        id={`${slug}-title`}
        title={category.name}
        tagline={category.tagline}
        description={category.description}
        count={all.length}
      />
      <LeadFilm video={lead} layout={layout} />
      <div className="mt-16 grid gap-x-8 gap-y-14 border-t border-(--o5-rule) pt-10 md:grid-cols-3">
        {rest.map((v, i) => (
          <Reveal key={v.id} delay={i * 0.08}>
            <FilmFigure video={v} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function SectionHead({
  numeral,
  id,
  title,
  tagline,
  description,
  count,
  indexLink = true,
}: {
  numeral: string;
  id: string;
  title: string;
  tagline: string;
  description: string;
  count: number;
  /** Link to the film index; off for sections that hold no films. */
  indexLink?: boolean;
}) {
  return (
    <header>
      <DoubleRule />
      <div className="grid gap-8 pt-6 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-8">
          <Kicker>Section {numeral}</Kicker>
          <h2
            id={id}
            className={cn(serif, "mt-3 text-[clamp(3.2rem,6.4vw,6.6rem)] leading-[0.92] font-normal tracking-[-0.03em]")}
          >
            <span className="mr-[0.22em] font-light text-(--o5-ink)/30 italic">{numeral}</span>
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-4 lg:pt-8">
          <p className={cn(serif, "text-[1.35rem] leading-snug italic")}>{tagline}.</p>
          <p className="mt-3 text-[15px] leading-relaxed text-(--o5-muted)">{description}</p>
          {indexLink ? (
            <a
              href="#index"
              className="group mt-5 inline-flex items-center gap-2 border-b border-(--o5-ink) pb-0.5 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors hover:border-(--o5-red) hover:text-(--o5-red)"
            >
              All {count} films in the index
              <LuArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          ) : (
            <p className="mt-5 text-[11px] font-semibold tracking-[0.14em] text-(--o5-muted) uppercase">
              {count} plates in this section
            </p>
          )}
        </Reveal>
      </div>
    </header>
  );
}

function LeadFilm({ video, layout }: { video: Video; layout: Layout }) {
  const { open } = useVideoPlayer();

  const plate = (
    <button
      type="button"
      onClick={() => open(video)}
      aria-label={`Play ${video.title}`}
      className="group relative block w-full cursor-pointer"
    >
      <Plate
        src={posterFor(video, "lg")}
        alt={video.title}
        className={layout === "lead-wide" ? "aspect-[21/9]" : "aspect-[16/10]"}
        sizes={layout === "lead-wide" ? "100vw" : "(min-width: 1024px) 62vw, 100vw"}
      />
      <PlayTag runtime={video.runtime} />
    </button>
  );

  const text = (
    <div className="flex h-full flex-col gap-y-0 [&>button:last-child]:mt-10 lg:[&>button:last-child]:mt-auto">
      <div className="flex items-center gap-3">
        <Label className="text-(--o5-red)">{video.subGenre}</Label>
        <span className="h-px flex-1 bg-(--o5-rule)" />
        <Label>Lead film</Label>
      </div>
      <button type="button" onClick={() => open(video)} className="group mt-4 cursor-pointer text-left">
        <h3
          className={cn(
            serif,
            "text-[clamp(2rem,2.9vw,2.9rem)] leading-[1.04] font-medium tracking-[-0.02em] text-balance decoration-1 underline-offset-[6px] group-hover:underline",
          )}
        >
          {video.title}
        </h3>
      </button>
      <p className={cn(serif, "mt-4 text-[1.22rem] leading-[1.45] font-light text-(--o5-ink)/80 italic")}>
        {video.description}
      </p>
      <dl className="mt-7 grid grid-cols-2 gap-x-6 border-t border-(--o5-rule) text-[13px]">
        {[
          [video.category === "broadcast" ? "Broadcaster" : "Client", video.client],
          ["Year", String(video.year)],
          ["Runtime", video.runtime],
          ["Role", video.role],
        ].map(([k, v]) => (
          <div key={k} className="border-b border-(--o5-rule) py-3">
            <dt className="text-[10.5px] font-medium tracking-[0.14em] text-(--o5-muted) uppercase">{k}</dt>
            <dd className="mt-1 leading-snug">{v}</dd>
          </div>
        ))}
      </dl>
      <button
        type="button"
        onClick={() => open(video)}
        className="group mt-auto flex cursor-pointer items-center justify-between gap-6 border-t-[3px] border-(--o5-ink) pt-4 text-left"
      >
        <span className="text-[11px] font-semibold tracking-[0.14em] uppercase">
          <span className="text-(--o5-red)">Watch the film</span>
          <span className="ml-2 text-(--o5-muted)">{video.runtime}</span>
        </span>
        <LuArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1.5" />
      </button>
    </div>
  );

  if (layout === "lead-wide") {
    return (
      <div className="mt-12">
        <Reveal>{plate}</Reveal>
        <Reveal delay={0.08} className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <Label className="text-(--o5-red)">{video.subGenre}</Label>
              <span className="h-px flex-1 bg-(--o5-rule)" />
            </div>
            <button type="button" onClick={() => open(video)} className="group mt-4 cursor-pointer text-left">
              <h3
                className={cn(
                  serif,
                  "text-[clamp(2.2rem,3.4vw,3.3rem)] leading-[1.02] font-medium tracking-[-0.02em] decoration-1 underline-offset-[6px] group-hover:underline",
                )}
              >
                {video.title}
              </h3>
            </button>
          </div>
          <p
            className={cn(
              serif,
              "text-[1.22rem] leading-[1.45] font-light text-(--o5-ink)/80 italic lg:col-span-4 lg:col-start-6 lg:pt-12",
            )}
          >
            {video.description}
          </p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-[13px] lg:col-span-3 lg:pt-12">
            {[
              ["Client", video.client],
              ["Year", String(video.year)],
              ["Runtime", video.runtime],
              ["Role", video.role],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10.5px] font-medium tracking-[0.14em] text-(--o5-muted) uppercase">{k}</dt>
                <dd className="mt-1 leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    );
  }

  const flip = layout === "lead-right";
  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
      <Reveal className={cn("lg:col-span-8", flip && "lg:order-2")}>{plate}</Reveal>
      <Reveal
        delay={0.08}
        className={cn(
          "flex flex-col lg:col-span-4 [&>*]:flex-1",
          flip ? "lg:order-1 lg:border-r lg:border-(--o5-rule) lg:pr-8" : "lg:border-l lg:border-(--o5-rule) lg:pl-8",
        )}
      >
        {text}
      </Reveal>
    </div>
  );
}
