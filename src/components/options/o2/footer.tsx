"use client";

import { useRef } from "react";
import { useScroll } from "motion/react";
import { FaYoutube } from "react-icons/fa6";
import { LuArrowUpRight } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { D2Mark } from "@/components/brand/d2-mark";
import { D2LogoScroll } from "@/components/brand/d2-logo-animated";
import { company, publicCategories } from "@/data/site";
import { BlockRise, Label, Unfold, container, foldBlock, redBlock, wide } from "./shared";

/** The real logo on white, assembling once more as the page reaches its end. */
function LogoPanel() {
  const ref = useRef<HTMLDivElement>(null);
  // Complete as soon as the whole panel is on screen, well before the page can run out.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  return (
    <div ref={ref} className="col-span-12 grid place-items-center border border-neutral-200 bg-white p-12 lg:col-span-4">
      <D2LogoScroll progress={scrollYProgress} effect="assemble" className="w-full max-w-[300px]" />
    </div>
  );
}

/** Contact as the last composition: a red block, the real logo on white, grey tails below. */
export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-20 pt-32 md:pt-40">
      <div className={container}>
        <div className="grid grid-cols-12">
          <BlockRise
            style={redBlock}
            className="col-span-12 lg:col-span-8"
            innerClassName="flex min-h-[460px] flex-col justify-between p-8 text-white md:p-14"
          >
            <Label tone="light">Contact</Label>
            <div>
              <h2 className={cn(wide, "text-[clamp(2.6rem,5.3vw,5.8rem)] leading-[0.86] font-black tracking-[-0.015em] uppercase")}>
                Tell us about
                <br />
                your film.
              </h2>
              <a
                href={`mailto:${company.email}`}
                className={cn(
                  wide,
                  "group mt-10 inline-flex items-center gap-4 border-b-2 border-white/40 pb-2 text-[clamp(1.1rem,1.9vw,1.9rem)] font-bold transition-colors hover:border-white",
                )}
              >
                {company.email}
                <LuArrowUpRight className="size-[1.1em] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
              <p className="mt-6 text-[15px] leading-relaxed text-white/90">
                Write to {company.founder.name}, {company.founder.role}, directly. Replies within two working days.
              </p>
            </div>
          </BlockRise>

          <LogoPanel />

          {/* Grey tails under the red block, the last one ending in the hook's rounded corner. */}
          <Unfold delay={0.2} style={foldBlock(30)} className="col-span-12 sm:col-span-4 lg:col-span-3" innerClassName="p-8 md:p-10">
            <p className="text-[10px] font-semibold tracking-[0.24em] text-neutral-800 uppercase">Telephone</p>
            <a href={`tel:${company.phone.replace(/\s/g, "")}`} className={cn(wide, "mt-3 block text-[17px] font-bold")}>
              {company.phone}
            </a>
          </Unfold>
          <Unfold delay={0.3} style={foldBlock(30)} className="col-span-12 sm:col-span-4 lg:col-span-3" innerClassName="p-8 md:p-10">
            <p className="text-[10px] font-semibold tracking-[0.24em] text-neutral-800 uppercase">Studio</p>
            <p className={cn(wide, "mt-3 text-[17px] font-bold")}>{company.location}</p>
          </Unfold>
          <Unfold
            delay={0.4}
            style={foldBlock(30)}
            className="col-span-12 sm:col-span-4 lg:col-span-2"
            innerClassName="rounded-br-[56px] p-8 md:p-10"
          >
            <p className="text-[10px] font-semibold tracking-[0.24em] text-neutral-800 uppercase">Films</p>
            <a href={company.youtube} className={cn(wide, "mt-3 inline-flex items-center gap-2 text-[17px] font-bold")}>
              <FaYoutube className="size-5" /> YouTube
            </a>
          </Unfold>
        </div>

        <div className="mt-24 grid gap-8 border-t-2 border-neutral-950 py-10 text-[12px] md:grid-cols-12">
          <div className="flex items-center gap-3 md:col-span-4">
            <D2Mark title="" className="h-6 w-auto" />
            <span className={cn(wide, "font-extrabold tracking-[0.06em] uppercase")}>{company.name}</span>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-semibold tracking-[0.16em] text-neutral-600 uppercase md:col-span-5">
            {publicCategories.map((c) => (
              <li key={c.slug}>
                <a href={`#${c.slug}`} className="hover:text-neutral-950">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-neutral-500 md:col-span-3 md:text-right">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
