"use client";

import { LuArrowUpRight } from "react-icons/lu";
import { FaYoutube } from "react-icons/fa6";

import { cn } from "@/lib/utils";
import { D2Mark } from "@/components/brand/d2-mark";
import { Still } from "@/components/media/still";
import { Reveal } from "@/components/motion/reveal";
import { company, copy, publicCategories } from "@/data/site";
import { Eyebrow, RedLine, serif } from "./shared";

export function Contact() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-white/10">
      <div className="absolute inset-0">
        <Still
          src="/images/hero/frozen-river-bw-1600.webp"
          alt=""
          aria-hidden
          className="size-full object-cover object-[50%_20%] opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/70 to-neutral-950" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 pt-32 pb-10 md:px-10 md:pt-44">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
          <h2 className={cn(serif, "mt-6 text-[clamp(3rem,7vw,7.6rem)] leading-[0.95] font-light")}>
            Tell me about <em className="italic">your film.</em>
          </h2>
          <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-neutral-300">
            Documentary, brand film or performance — I reply to every enquiry personally, usually within two working
            days.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href={`mailto:${company.email}`}
            className={cn(
              serif,
              "group mt-14 inline-flex items-center gap-4 text-[clamp(1.8rem,3.8vw,3.8rem)] leading-none text-white",
            )}
          >
            <span className="border-b border-white/25 pb-2 transition-colors group-hover:border-white">{company.email}</span>
            <LuArrowUpRight className="size-[0.8em] text-[#e5484d] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </Reveal>

        <RedLine className="mt-20" />

        <div className="mt-12 grid gap-10 text-sm sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Eyebrow>Telephone</Eyebrow>
            <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="mt-3 block text-neutral-200 hover:text-white">
              {company.phone}
            </a>
          </div>
          <div>
            <Eyebrow>Studio</Eyebrow>
            <p className="mt-3 text-neutral-200">{company.location}</p>
          </div>
          <div>
            <Eyebrow>Films</Eyebrow>
            <a href={company.youtube} className="mt-3 inline-flex items-center gap-2 text-neutral-200 hover:text-white">
              <FaYoutube className="size-4" /> D2 Communication on YouTube
            </a>
          </div>
          <div>
            <Eyebrow>Work</Eyebrow>
            <ul className="mt-3 space-y-1.5 text-neutral-200">
              {publicCategories.map((c) => (
                <li key={c.slug}>
                  <a href={`#${c.slug}`} className="hover:text-white">
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-28 flex flex-col gap-6 border-t border-white/10 pt-8 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <D2Mark title="" className="h-5 w-auto" />
            <span className="tracking-[0.28em] text-neutral-300 uppercase">{company.name}</span>
          </div>
          <p>{copy.crafts.join(" · ")}</p>
          <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
