"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Still } from "@/components/media/still";
import { useVideoPlayer } from "@/components/media/video-player";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { company, copy, showreel, stats, videos } from "@/data/site";
import { SectionLabel, container, serif } from "./shared";

const EMPHASIS = new Set(["fifty", "documentaries"]);
const iceRoad = videos.find((v) => v.id === "ice-road")!;

/** Paper sheet that slides up over the pinned reel. */
export function Intro() {
  const { open } = useVideoPlayer();

  return (
    <section
      id="about"
      className="relative z-10 -mt-[100svh] scroll-mt-0 rounded-t-[2.5rem] bg-[#f4f3ef] text-[#0a0a0a] shadow-[0_-30px_80px_-20px_rgba(0,0,0,0.45)]"
    >
      <div className={cn(container, "pt-28 md:pt-40")}>
        <div className="flex items-center justify-between gap-6">
          <SectionLabel index="01">Who we are</SectionLabel>
          <p className="hidden text-[12px] font-medium tracking-[0.16em] text-black/45 uppercase md:block">
            {company.location}
          </p>
        </div>

        <WordReveal
          text={copy.intro}
          className="mt-14 max-w-[1500px] text-[clamp(2.3rem,4.5vw,5.4rem)] leading-[1.02] font-medium tracking-[-0.045em]"
        />

        <dl className="mt-24 grid grid-cols-2 border-t border-black/10 md:mt-32 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.08}
              className={cn(
                "border-black/10 pt-8 pb-10 md:pt-10",
                i % 2 === 1 && "border-l pl-6",
                i >= 1 && "md:border-l md:pl-8",
              )}
            >
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <CountUp
                  value={s.value}
                  suffix={s.suffix}
                  className="block text-[clamp(4.5rem,8.4vw,9.5rem)] leading-[0.82] font-medium tracking-[-0.065em] tabular-nums"
                />
                <span className="mt-5 block text-[14px] text-black/55">{s.label}</span>
              </dd>
            </Reveal>
          ))}
        </dl>

        <div className="grid gap-12 border-t border-black/10 pt-16 pb-28 md:grid-cols-12 md:pt-20 md:pb-40">
          <Reveal className="md:col-span-4">
            <figure>
              <button
                type="button"
                onClick={() => open(iceRoad)}
                className="group relative block aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-[20px] bg-neutral-300"
                aria-label={`Play ${iceRoad.title}`}
              >
                <Still
                  src="/images/hero/frozen-river-color-1600.webp"
                  alt="The crew prepares snowmobiles on a frozen Siberian river"
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="size-full scale-[1.02] object-cover object-[38%_62%] transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                <span className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full bg-white/90 py-1.5 pr-4 pl-1.5 text-[13px] font-medium text-neutral-950 backdrop-blur-md">
                  <span className="grid size-7 place-items-center rounded-full bg-neutral-950 text-white">
                    <LuPlay className="ml-0.5 size-3 fill-current" />
                  </span>
                  Watch {iceRoad.title.split(":")[0]}
                </span>
              </button>
              <figcaption className="mt-4 text-[14px] leading-snug text-black/55">
                <span className="font-medium text-black/80">On location for {iceRoad.title.split(":")[0]}</span> —{" "}
                {iceRoad.description}
                <span className="mt-1 block text-[12px] font-medium tracking-[0.12em] text-black/40 uppercase">
                  {iceRoad.client} · {iceRoad.year} · {iceRoad.runtime} · {iceRoad.role}
                </span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col md:col-span-6 md:col-start-7">
            <p className="text-[clamp(1.15rem,1.45vw,1.45rem)] leading-[1.55] tracking-[-0.01em] text-black/75">
              {copy.about}
            </p>
            <ul className="mt-12 flex flex-wrap gap-2">
              {copy.crafts.map((craft) => (
                <li
                  key={craft}
                  className="rounded-full border border-black/15 px-4 py-2 text-[14px] font-medium tracking-[-0.01em]"
                >
                  {craft}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => open(showreel)}
              className="group mt-auto flex cursor-pointer items-center gap-4 self-start pt-14 text-[17px] font-medium tracking-[-0.015em]"
            >
              <span className="grid size-12 place-items-center rounded-full bg-[#0a0a0a] text-white transition-transform duration-300 group-hover:scale-110">
                <LuPlay className="ml-0.5 size-4 fill-current" />
              </span>
              <span className="border-b border-black/20 pb-0.5 transition-colors group-hover:border-black">
                Watch the showreel
              </span>
              <span className="text-black/40 tabular-nums">{showreel.runtime}</span>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Words brighten from 15% to full ink as the paragraph moves up through the viewport. */
function WordReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.88", "end 0.42"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        const plain = word.toLowerCase().replace(/[^a-z]/g, "");
        return (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[start, end]}
            className={EMPHASIS.has(plain) ? serif : undefined}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  className,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className={cn("inline-block", className)}>
        {children}
      </motion.span>{" "}
    </>
  );
}
