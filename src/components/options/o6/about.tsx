"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { IconType } from "react-icons";
import { LuAperture, LuArrowUpRight, LuClapperboard, LuScissors, LuSparkles, LuVideo } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Still } from "@/components/media/still";
import { broadcasters, company, copy, services } from "@/data/site";
import { EASE, Mono, SectionHeader, Umd, tileBase, tileIn } from "./shared";

const CRAFT_ICONS: Record<string, IconType> = {
  Directing: LuClapperboard,
  Cinematography: LuVideo,
  Photography: LuAperture,
  Editing: LuScissors,
  VFX: LuSparkles,
};

/** A grid whose tiles stagger in once it scrolls into view. */
function Wall({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function About() {
  const reduce = useReducedMotion();
  const lift = reduce ? undefined : { y: -3, transition: { duration: 0.35, ease: EASE } };

  return (
    <section id="about" className="mx-auto max-w-[1600px] scroll-mt-16 px-2.5">
      <SectionHeader
        index="04"
        label="Studio"
        title={
          <>
            One director, <span className="text-neutral-400">every craft.</span>
          </>
        }
      />

      <Wall className="grid grid-cols-2 gap-2.5 lg:auto-rows-[minmax(200px,auto)] lg:grid-cols-12">
        <motion.div variants={tileIn} className={cn(tileBase, "col-span-2 flex flex-col bg-white p-6 lg:col-span-6 lg:row-span-2 xl:p-8")}>
          <div className="flex items-center justify-between gap-4">
            <Mono className="text-neutral-400">About</Mono>
            <Mono className="text-neutral-400">
              {company.founder.name} · <span lang="ko">{company.founder.nameKo}</span>
            </Mono>
          </div>
          <h3 className="mt-6 max-w-xl text-[clamp(1.6rem,2.15vw,2.3rem)] leading-[1.08] font-semibold tracking-[-0.04em] text-balance">
            A broadcast director&apos;s standards, brought to every film.
          </h3>
          <p className="mt-5 max-w-2xl text-[15.5px] leading-[1.7] text-neutral-600">{copy.about}</p>
          <a
            href="#contact"
            className="mt-auto inline-flex w-fit items-center gap-1.5 pt-8 text-[14px] font-medium text-neutral-950 underline-offset-4 hover:underline"
          >
            Work with {company.founder.name.split(" ")[0]} <LuArrowUpRight className="size-4" />
          </a>
        </motion.div>

        <motion.figure variants={tileIn} className={cn(tileBase, "col-span-2 min-h-72 bg-neutral-800 sm:col-span-1 lg:col-span-3 lg:row-span-2")}>
          <Still
            src="/images/hero/frozen-river-color-1600.webp"
            alt="The crew with snowmobiles on a frozen Siberian river"
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="absolute inset-0 size-full object-cover object-[40%_65%]"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <figcaption className="absolute top-3 left-3">
            <Umd>On location · Siberia</Umd>
          </figcaption>
        </motion.figure>

        <motion.figure
          variants={tileIn}
          className={cn(tileBase, "col-span-2 flex flex-col justify-between gap-8 bg-neutral-950 p-6 text-white sm:col-span-1 lg:col-span-3 lg:row-span-2 xl:p-7")}
        >
          <span aria-hidden className="block h-10 text-[5rem] leading-none font-semibold text-[#CC0606]">
            “
          </span>
          <blockquote className="text-[clamp(1.1rem,1.4vw,1.4rem)] leading-[1.35] font-medium tracking-[-0.02em]">
            {copy.quote.text}
          </blockquote>
          <figcaption>
            <Mono className="text-[#A6A6A6]">{copy.quote.by}, Director & Producer</Mono>
          </figcaption>
        </motion.figure>
      </Wall>

      <Wall className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        {copy.crafts.map((craft, i) => {
          const Icon = CRAFT_ICONS[craft] ?? LuSparkles;
          return (
            <motion.div
              key={craft}
              variants={tileIn}
              whileHover={lift}
              className={cn(tileBase, "flex min-h-36 flex-col justify-between bg-white p-5")}
            >
              <div className="flex items-start justify-between">
                <Icon className="size-6 text-neutral-900" />
                <Mono className="text-neutral-400">{String(i + 1).padStart(2, "0")}</Mono>
              </div>
              <p className="text-[17px] font-semibold tracking-[-0.02em]">{craft}</p>
            </motion.div>
          );
        })}
      </Wall>

      <Wall className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <motion.div key={s.key} variants={tileIn} className={cn(tileBase, "flex min-h-52 flex-col bg-white p-6")}>
            <Mono className="text-neutral-400">Service {String(i + 1).padStart(2, "0")}</Mono>
            <h4 className="mt-auto pt-10 text-[19px] font-semibold tracking-[-0.025em]">{s.title}</h4>
            <p className="mt-2 text-[14px] leading-relaxed text-neutral-500">{s.body}</p>
          </motion.div>
        ))}
      </Wall>

      <Wall className="mt-2.5">
        <motion.div
          variants={tileIn}
          className={cn(tileBase, "flex flex-col gap-6 bg-white px-6 py-7 lg:flex-row lg:items-center lg:justify-between xl:px-8")}
        >
          <Mono className="shrink-0 text-neutral-400">Broadcast on</Mono>
          <ul className="flex flex-1 flex-wrap items-center justify-between gap-x-10 gap-y-4 lg:pl-16">
            {broadcasters.map((b) => (
              <li
                key={b}
                className="text-[clamp(1.2rem,1.7vw,1.75rem)] font-semibold tracking-[-0.04em] text-neutral-300 transition-colors duration-300 hover:text-neutral-950"
              >
                {b}
              </li>
            ))}
          </ul>
        </motion.div>
      </Wall>
    </section>
  );
}
