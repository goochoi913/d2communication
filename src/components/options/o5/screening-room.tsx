"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Still } from "@/components/media/still";
import { YouTubeLite } from "@/components/media/youtube-lite";
import { Reveal } from "@/components/motion/reveal";
import { featuredVideos } from "@/data/site";
import { EASE, frame, posterFor, serif } from "./shared";

// The cover story already has its own film; the screening room shows the rest of the featured work.
const programme = featuredVideos.filter((v) => v.id !== "ice-road");

/** The featured-film presentation: a dark spread with a player and a short programme beside it. */
export function ScreeningRoom() {
  const [current, setCurrent] = useState(programme[0]);

  return (
    <section
      id="screening"
      aria-labelledby="screening-title"
      className="mt-32 scroll-mt-14 bg-(--o5-ink) text-(--o5-paper) md:mt-40"
    >
      <div className={cn(frame, "py-20 md:py-28")}>
        <Reveal>
          <div className="border-t-[3px] border-(--o5-paper)" />
          <div className="mt-[3px] border-t border-(--o5-paper)" />
          <div className="flex flex-wrap items-end justify-between gap-6 pt-6">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-[#ff5a52] uppercase">Screening room</p>
              <h2
                id="screening-title"
                className={cn(serif, "mt-3 text-[clamp(3rem,5.6vw,5.8rem)] leading-[0.92] font-normal tracking-[-0.03em]")}
              >
                Now showing
              </h2>
            </div>
            <p className={cn(serif, "max-w-sm text-[1.25rem] leading-snug text-(--o5-paper)/70 italic")}>
              Selected films from the archive, playable in full. Choose a title from the programme.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-8">
            <YouTubeLite
              key={current.id}
              youtubeId={current.youtubeId}
              title={current.title}
              poster={posterFor(current, "lg")}
              className="bg-white/5"
              playButton={
                <span className="absolute bottom-5 left-5 inline-flex items-center gap-2.5 bg-(--o5-paper) py-2.5 pr-5 pl-3 text-[11px] font-semibold tracking-[0.14em] text-(--o5-ink) uppercase transition-colors duration-300 group-hover:bg-(--o5-red) group-hover:text-white">
                  <LuPlay className="size-3.5 fill-current" />
                  Play · {current.runtime}
                </span>
              }
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="mt-6 grid gap-6 border-t border-white/15 pt-6 md:grid-cols-[1fr_auto]"
              >
                <div>
                  <h3 className={cn(serif, "text-[2.1rem] leading-[1.05] font-medium tracking-[-0.02em]")}>
                    {current.title}
                  </h3>
                  <p className={cn(serif, "mt-2.5 max-w-2xl text-[1.15rem] leading-snug text-(--o5-paper)/70 italic")}>
                    {current.description}
                  </p>
                </div>
                <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-[13px] md:min-w-[16rem]">
                  {[
                    [current.category === "broadcast" ? "Broadcaster" : "Client", current.client],
                    ["Year", String(current.year)],
                    ["Runtime", current.runtime],
                    ["Genre", current.subGenre],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[10.5px] font-medium tracking-[0.14em] text-(--o5-paper)/50 uppercase">{k}</dt>
                      <dd className="mt-0.5">{v}</dd>
                    </div>
                  ))}
                  <div className="col-span-2">
                    <dt className="text-[10.5px] font-medium tracking-[0.14em] text-(--o5-paper)/50 uppercase">Role</dt>
                    <dd className="mt-0.5">{current.role}</dd>
                  </div>
                </dl>
              </motion.div>
            </AnimatePresence>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-(--o5-paper)/50 uppercase">Programme</p>
            <ol className="mt-3 border-t border-white/15">
              {programme.map((v, i) => {
                const active = v.id === current.id;
                return (
                  <li key={v.id} className="border-b border-white/15">
                    <button
                      type="button"
                      onClick={() => setCurrent(v)}
                      aria-current={active}
                      className="group grid w-full cursor-pointer grid-cols-[2rem_6.5rem_1fr] items-center gap-4 py-4 text-left"
                    >
                      <span
                        className={cn(
                          serif,
                          "text-[1.2rem] italic tabular-nums transition-colors",
                          active ? "text-[#ff5a52]" : "text-(--o5-paper)/40",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="relative aspect-video overflow-hidden bg-white/5">
                        <Still
                          src={posterFor(v)}
                          alt=""
                          sizes="120px"
                          className={cn(
                            "size-full object-cover transition-[filter,opacity] duration-500",
                            active ? "opacity-100" : "opacity-60 grayscale group-hover:opacity-90 group-hover:grayscale-0",
                          )}
                        />
                      </span>
                      <span className="min-w-0">
                        <span
                          className={cn(
                            serif,
                            "block text-[1.15rem] leading-tight transition-colors",
                            active ? "text-(--o5-paper)" : "text-(--o5-paper)/75 group-hover:text-(--o5-paper)",
                          )}
                        >
                          {v.title}
                        </span>
                        <span className="mt-1 block truncate text-[10.5px] font-medium tracking-[0.12em] text-(--o5-paper)/45 uppercase">
                          {v.client} · {v.year} · {v.runtime}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
