"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Still } from "@/components/media/still";
import { useVideoPlayer } from "@/components/media/video-player";
import { company, videos } from "@/data/site";
import { EASE, Label, Reveal, cond, mono } from "./shared";

/** Billing-block parts: small connective words, names set large. */
type Billing = { small?: string; big?: string }[];

export function Feature() {
  const film = videos.find((v) => v.id === "ice-road")!;
  const [title, subtitle] = film.title.split(": ");
  const { open } = useVideoPlayer();

  const ref = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  const name = company.founder.name;
  const billing: Billing = [
    { big: film.client },
    { small: "presents" },
    { small: "a", big: company.name },
    { small: "production" },
    { big: `“${title}”` },
    { small: "directed by", big: name },
    { small: "produced by", big: name },
    { small: "director of photography", big: name },
    { small: "filmed on location in", big: "Siberia" },
    { small: "six weeks on the ice at", big: "−40°C" },
    { small: "running time", big: film.runtime.replace("min", "minutes") },
    { small: "©", big: `${film.year} ${film.client}` },
  ];

  return (
    <section className="relative bg-black py-36" aria-label="Feature presentation">
      <div className="mx-auto max-w-[1760px] px-6 md:px-12">
        <Reveal>
          <div className="flex items-center gap-6">
            <span className="h-px flex-1 bg-white/15" />
            <p
              className={cn(
                cond,
                "text-[clamp(1rem,1.3vw,1.3rem)] font-medium tracking-[0.6em] text-[#cfcfcf] uppercase",
              )}
            >
              Feature presentation
            </p>
            <span className="h-px flex-1 bg-white/15" />
          </div>
        </Reveal>

        <button
          ref={ref}
          type="button"
          onClick={() => open(film)}
          className="group relative mt-14 block aspect-[2.39/1] w-full cursor-pointer overflow-hidden bg-[#0d0d0d] text-left"
          aria-label={`Play ${film.title}`}
        >
          <motion.div className="absolute inset-0" style={{ scale, y }}>
            <Still
              src="/images/hero/frozen-river-color-2560.webp"
              alt="The crew of Ice Road with snowmobiles on the frozen river"
              className="size-full object-cover object-[50%_76%] transition-[filter] duration-1000 group-hover:brightness-110"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          <div className="absolute top-8 left-10 flex items-center gap-4">
            <Label className="text-[#e0e0e0]">{film.client}</Label>
            <span className="h-3 w-px bg-white/30" />
            <Label className="text-[#e0e0e0]">{film.year}</Label>
            <span className="h-3 w-px bg-white/30" />
            <Label className="text-[#e0e0e0]">{film.subGenre}</Label>
          </div>

          <div className="absolute inset-x-10 bottom-9 flex items-end justify-between gap-10">
            <div>
              <h2 className={cn(cond, "text-[clamp(4rem,9vw,10rem)] leading-[0.8] font-bold text-white uppercase")}>
                {title}
              </h2>
              <p
                className={cn(
                  cond,
                  "mt-4 text-[clamp(1rem,1.5vw,1.5rem)] font-medium tracking-[0.42em] text-white/85 uppercase",
                )}
              >
                {subtitle}
              </p>
            </div>
            <span className="flex items-center gap-5">
              <span className={cn(mono, "hidden text-[11px] tracking-[0.22em] text-white/80 uppercase sm:block")}>
                Play film · {film.runtime}
              </span>
              <span className="grid size-[88px] place-items-center rounded-full border border-white/60 text-white transition-all duration-500 group-hover:scale-105 group-hover:border-white group-hover:bg-white group-hover:text-black">
                <LuPlay className="ml-1 size-7 fill-current" />
              </span>
            </span>
          </div>
        </button>

        <Reveal delay={0.05}>
          <p
            className={cn(
              cond,
              "mx-auto mt-16 max-w-[64rem] text-center text-[clamp(1.35rem,1.9vw,2rem)] leading-[1.25] font-normal tracking-[0.02em] text-[#bdbdbd] uppercase",
            )}
          >
            {billing.map((b, i) => (
              <Fragment key={i}>
                {b.small ? (
                  <span className="align-[0.12em] text-[0.56em] font-medium tracking-[0.16em] text-[#7a7a7a]">
                    {b.small}{" "}
                  </span>
                ) : null}
                {b.big ? <span className="font-semibold whitespace-nowrap text-[#e8e8e8]">{b.big}</span> : null}{" "}
              </Fragment>
            ))}
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
            className={cn(mono, "mt-8 text-center text-[11px] tracking-[0.24em] text-[#6f6f6f] uppercase")}
          >
            {film.description}
          </motion.p>
        </Reveal>
      </div>
    </section>
  );
}
