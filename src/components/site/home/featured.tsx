"use client";

import { useRef, useState } from "react";
import { motion, useInView, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { LuArrowUpRight, LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { formatDuration, parseYouTubeId, tr } from "@/content/format";
import { featuredWork } from "@/content/select";
import { EText, Txt, useText } from "@/components/content/editable";
import { useSite } from "@/components/content/site-context";
import { LoopVideo } from "@/components/media/loop-video";
import { Picture } from "@/components/media/picture";
import { PartnerMark } from "../partner-mark";
import { eyebrow, RedLine, serif } from "../typography";
import { workPoster } from "../work-card";
import { useWorkPlayer } from "../work-player";

/** "Ice Road: A Winter on the Siberian River" → the name large, the rest as an italic subtitle. */
function splitTitle(title: string) {
  const m = title.match(/^(.+?)(?::\s+|\s+—\s+)(.+)$/);
  return m ? { main: m[1], sub: m[2] } : { main: title, sub: "" };
}

/** The featured film: black-and-white that comes into colour as it reaches the middle of the screen. */
export function Featured() {
  const { content, lang, editing, bridge } = useSite();
  const t = useText();
  const { open } = useWorkPlayer();
  const work = featuredWork(content);
  const frame = useRef<HTMLButtonElement>(null);
  const inView = useInView(frame, { amount: 0.4 });
  const [hover, setHover] = useState(false);
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "center center"] });
  const gray = useTransform(scrollYProgress, [0.45, 1], [1, 0]);
  const filter = useMotionTemplate`grayscale(${gray})`;
  const scale = useTransform(scrollYProgress, [0, 1], [1.14, 1]);

  if (!work) return null;
  const poster = workPoster(work);
  const { main, sub } = splitTitle(tr(work.title, lang));
  const partner = work.partnerId ? content.partners.find((p) => p.id === work.partnerId) : undefined;
  const runtime = formatDuration(work.duration, lang);
  const activate = () => (editing && bridge ? bridge.openPanel({ kind: "work", id: work.id }) : open(work));

  return (
    <section className="bg-neutral-950 py-24 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex items-end justify-between gap-6">
          <Txt k="featured.eyebrow" as="p" className="text-xs font-medium tracking-[0.28em] text-neutral-400 uppercase" />
          {editing && bridge ? (
            <button
              type="button"
              onClick={() => bridge.openPanel({ kind: "settings" })}
              className="rounded-full border border-dashed border-white/30 px-4 py-2 text-xs text-neutral-300 hover:border-white hover:text-white"
            >
              {lang === "ko" ? "대표작 바꾸기" : "Choose another film"}
            </button>
          ) : null}
        </div>
        <RedLine className="mt-5" />

        <button
          ref={frame}
          type="button"
          onClick={activate}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          aria-label={`${t("work.watch")}: ${tr(work.title, lang)}`}
          className="group relative mt-10 block aspect-[4/5] w-full cursor-pointer overflow-hidden bg-neutral-900 text-left sm:aspect-[16/10] md:aspect-[2.25/1]"
        >
          <motion.div className="absolute inset-0" style={editing ? undefined : { scale, filter }}>
            {poster ? <Picture image={poster} alt="" sizes="100vw" className="absolute inset-0" /> : null}
            {work.loop ? <LoopVideo loop={work.loop} active={(inView || hover) && !editing} /> : null}
          </motion.div>
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/5" />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-5 md:inset-x-12 md:bottom-12">
            <div className="min-w-0">
              <h2 className={cn(serif, "text-[clamp(2.6rem,6vw,6.5rem)] leading-[0.92] font-light text-white")}>{main}</h2>
              {sub ? (
                <p className={cn(serif, "mt-2 text-[clamp(1.15rem,1.8vw,1.9rem)] text-white/85 italic md:mt-3")}>{sub}</p>
              ) : null}
            </div>
            <span className="relative grid size-16 shrink-0 place-items-center rounded-full border border-white/50 text-white backdrop-blur-sm transition-all duration-500 group-hover:scale-105 group-hover:border-white group-hover:bg-white group-hover:text-neutral-950 md:size-28">
              <LuPlay className="ml-1 size-5 fill-current md:size-8" />
            </span>
          </div>
        </button>

        <div className="mt-10 grid gap-10 md:mt-12 md:grid-cols-12">
          <div className="md:col-span-6">
            {editing ? (
              <EText
                path={["works", `#${work.id}`, "title"]}
                value={work.title}
                as="p"
                className={cn(serif, "mb-4 text-2xl text-neutral-300")}
              />
            ) : null}
            <EText
              path={["works", `#${work.id}`, "description"]}
              value={work.description}
              as="p"
              multiline
              className={cn(serif, "text-[1.45rem] leading-snug font-light text-neutral-200 md:text-[1.6rem]")}
            />
            {work.fullUrl ? (
              <a
                href={work.fullUrl}
                onClick={(e) => {
                  if (editing || !parseYouTubeId(work.fullUrl)) return;
                  e.preventDefault();
                  open(work, "full");
                }}
                target="_blank"
                rel="noreferrer"
                className="group mt-8 inline-flex min-h-11 items-center gap-3 border-b border-white/25 pb-1 text-[13px] tracking-[0.16em] text-neutral-100 uppercase transition-colors hover:border-white"
              >
                {t("work.full")}
                {runtime ? <span className="text-neutral-500">· {runtime}</span> : null}
                <LuArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : null}
          </div>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 text-[15px] md:col-span-5 md:col-start-8 md:grid-cols-3">
            <div>
              <dt className={cn(eyebrow, "text-[11px]")}>
                <Txt k={work.category === "broadcast" ? "label.broadcaster" : "label.client"} />
              </dt>
              <dd className="mt-2.5 text-neutral-200">
                {partner ? <PartnerMark partner={partner} lang={lang} height={15} /> : tr(work.client, lang)}
              </dd>
            </div>
            <div>
              <dt className={cn(eyebrow, "text-[11px]")}>
                <Txt k="label.year" />
              </dt>
              <dd className="mt-2 text-neutral-200 tabular-nums">{work.year}</dd>
            </div>
            <div>
              <dt className={cn(eyebrow, "text-[11px]")}>
                <Txt k="label.runtime" />
              </dt>
              <dd className="mt-2 text-neutral-200 tabular-nums">{runtime}</dd>
            </div>
            <div className="col-span-2 md:col-span-3">
              <dt className={cn(eyebrow, "text-[11px]")}>
                <Txt k="label.role" />
              </dt>
              <EText path={["works", `#${work.id}`, "role"]} value={work.role} as="dd" className="mt-2 text-neutral-200" />
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
