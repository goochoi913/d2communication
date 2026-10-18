"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { LuArrowUpRight, LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Still } from "@/components/media/still";
import { useVideoPlayer } from "@/components/media/video-player";
import { Reveal } from "@/components/motion/reveal";
import { photos, publicCategories, smallPoster, videosIn, type Category } from "@/data/site";
import { Em, SectionLabel, container } from "./shared";

/** Four chapters that pin and stack; each one settles back as the next slides over it. */
export function Categories() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const total = publicCategories.length;

  return (
    <section className="relative bg-[#f4f3ef] text-[#0a0a0a]">
      <div className={cn(container, "grid gap-10 border-t border-black/10 pt-10 pb-6 md:grid-cols-12")}>
        <div className="md:col-span-12">
          <SectionLabel index="03">The work</SectionLabel>
        </div>
        <Reveal className="md:col-span-8">
          <h2 className="text-[clamp(3rem,6.6vw,7.4rem)] leading-[0.9] font-medium tracking-[-0.055em]">
            Four kinds of film. <Em>One standard.</Em>
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="flex items-end md:col-span-3 md:col-start-10">
          <p className="text-[17px] leading-relaxed text-black/60">
            The rigour of broadcast documentary, applied to everything we make — for networks, companies and the stage.
          </p>
        </Reveal>
      </div>

      <div ref={ref} className="relative pb-[8svh]">
        {publicCategories.map((category, i) => (
          <StackCard key={category.slug} category={category} index={i} total={total} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

function StackCard({
  category,
  index,
  total,
  progress,
}: {
  category: Category;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const { open } = useVideoPlayer();
  const isLast = index === total - 1;
  const scale = useTransform(progress, [index / total, 1], [1, isLast ? 1 : 1 - (total - 1 - index) * 0.045]);
  const shade = useTransform(progress, [index / total, (index + 1) / total], [0, isLast ? 0 : 0.55]);

  const films = category.slug === "photography" ? [] : videosIn(category.slug);
  const rows =
    category.slug === "photography"
      ? photos.slice(0, 3).map((p) => ({
          key: p.src,
          src: p.src,
          title: p.caption,
          credit: "Photography · Jin Sam Choi",
          role: undefined as string | undefined,
          onClick: undefined as (() => void) | undefined,
        }))
      : films.slice(0, 3).map((v) => ({
          key: v.id,
          src: v.poster ? smallPoster(v.poster) : "",
          title: v.title,
          credit: `${v.client} · ${v.year} · ${v.runtime}`,
          role: v.role as string | undefined,
          onClick: (() => open(v)) as (() => void) | undefined,
        }));

  return (
    <div
      id={category.slug}
      className="sticky top-0 h-svh scroll-mt-0"
      style={{ paddingTop: `calc(10svh + ${index * 16}px)` }}
    >
      <div className={container}>
        <motion.article
          style={{ scale }}
          className="relative h-[80svh] origin-top overflow-hidden rounded-[28px] bg-neutral-900 text-white"
        >
          <Still
            src={category.cover}
            alt=""
            sizes="100vw"
            className="absolute inset-0 size-full object-cover transition-transform duration-[2000ms] ease-out hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />
          <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: shade }} />

          <div className="relative flex h-full flex-col justify-between p-6 md:p-10 xl:p-12">
            <div className="flex items-start justify-between gap-6 text-[12px] font-medium tracking-[0.16em] uppercase">
              <span className="tabular-nums text-white/80">
                {String(index + 1).padStart(2, "0")}{" "}
                <span className="text-white/40">/ {String(total).padStart(2, "0")}</span>
              </span>
              <span className="flex flex-wrap justify-end gap-2">
                {category.subGenres.map((g) => (
                  <Badge
                    key={g}
                    variant="outline"
                    className="h-7 rounded-full border-white/25 bg-white/5 px-3 text-[12px] font-medium tracking-normal text-white normal-case backdrop-blur-md"
                  >
                    {g}
                  </Badge>
                ))}
              </span>
            </div>

            <div>
              <p className="text-[15px] font-medium text-white/70">
                {films.length ? `${films.length} films` : "Stills"} · {category.tagline}
              </p>
              <h3 className="mt-3 text-[clamp(3.2rem,6.6vw,8rem)] leading-[0.86] font-medium tracking-[-0.058em] whitespace-nowrap">
                {category.name}
              </h3>
              <div className="mt-8 grid items-end gap-10 lg:grid-cols-12">
                <div className="lg:col-span-6">
                  <p className="max-w-[34rem] text-[16px] leading-relaxed text-white/70">{category.description}</p>
                  <a
                    href={`#${category.slug}`}
                    className="group mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-white pr-2 pl-6 text-[15px] font-medium text-neutral-950 transition-colors hover:bg-white/85"
                  >
                    View {category.slug === "photography" ? "photography" : "work"}
                    <span className="grid size-8 place-items-center rounded-full bg-neutral-950 text-white transition-transform duration-300 group-hover:rotate-45">
                      <LuArrowUpRight className="size-4" />
                    </span>
                  </a>
                </div>

                <div className="hidden rounded-[20px] border border-white/10 bg-black/40 p-5 backdrop-blur-xl lg:col-span-6 lg:block xl:col-span-5 xl:col-start-8">
                  <p className="text-[12px] font-medium tracking-[0.16em] text-white/55 uppercase">
                    {category.slug === "photography" ? "Selected stills" : "Selected films"}
                  </p>
                  <ul className="mt-3 divide-y divide-white/10">
                    {rows.map((r) => (
                      <li key={r.key}>
                        <button
                          type="button"
                          onClick={r.onClick}
                          disabled={!r.onClick}
                          className="group flex w-full cursor-pointer items-center gap-4 py-3 text-left disabled:cursor-default"
                        >
                          <span className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-[8px] bg-white/10 ring-1 ring-white/10">
                            {r.src ? (
                              <Still
                                src={r.src}
                                alt=""
                                sizes="112px"
                                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            ) : null}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[15px] font-medium tracking-[-0.01em]">{r.title}</span>
                            <span className="mt-0.5 block truncate text-[13px] text-white/65 tabular-nums">
                              {r.credit}
                            </span>
                            {r.role ? <span className="block truncate text-[13px] text-white/45">{r.role}</span> : null}
                          </span>
                          {r.onClick ? (
                            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/25 text-white/80 transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-neutral-950">
                              <LuPlay className="ml-0.5 size-3.5 fill-current" />
                            </span>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
