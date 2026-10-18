"use client";

import { FaYoutube } from "react-icons/fa6";
import { LuArrowUp, LuArrowUpRight } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { D2Mark } from "@/components/brand/d2-mark";
import { Reveal } from "@/components/motion/reveal";
import { company, publicCategories } from "@/data/site";
import { Em, SectionLabel, container } from "./shared";

const LABEL = "text-[12px] font-medium tracking-[0.16em] text-white/40 uppercase";

export function Contact() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-white/10 bg-[#0a0a0a] text-[#f5f5f4]">
      <div className={cn(container, "pt-28 md:pt-40")}>
        <SectionLabel index="06">Contact</SectionLabel>

        <Reveal>
          <h2 className="mt-10 text-[clamp(4rem,10.4vw,12.6rem)] leading-[0.84] font-medium tracking-[-0.06em]">
            Tell us about
            <br />
            <Em className="tracking-[-0.035em]">your film.</Em>
          </h2>
        </Reveal>

        <div className="mt-16 grid items-end gap-14 md:mt-24 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="max-w-md text-[17px] leading-relaxed text-white/55">
              Documentary, brand film or performance — write to {company.founder.name},{" "}
              {company.founder.role.toLowerCase()}, directly.
            </p>
            <a
              href={`mailto:${company.email}`}
              className="group mt-8 inline-flex items-center gap-5 text-[clamp(1.8rem,3.7vw,4rem)] leading-none font-medium tracking-[-0.04em]"
            >
              <span className="border-b-2 border-white/20 pb-2 transition-colors duration-300 group-hover:border-white">
                {company.email}
              </span>
              <span className="grid size-[1.15em] shrink-0 place-items-center rounded-full bg-white text-neutral-950 transition-transform duration-500 group-hover:rotate-45">
                <LuArrowUpRight className="size-[0.55em]" />
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-8 text-[15px]">
              <div>
                <dt className={LABEL}>Contact</dt>
                <dd className="mt-2">
                  {company.founder.name}
                  <span lang="ko" className="ml-2 text-white/45">
                    {company.founder.nameKo}
                  </span>
                  <span className="block text-white/50">{company.founder.role}</span>
                </dd>
              </div>
              <div>
                <dt className={LABEL}>Telephone</dt>
                <dd className="mt-2">
                  <a
                    href={`tel:${company.phone.replace(/\s/g, "")}`}
                    className="underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white"
                  >
                    {company.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className={LABEL}>Studio</dt>
                <dd className="mt-2">{company.location}</dd>
              </div>
              <div>
                <dt className={LABEL}>Reply time</dt>
                <dd className="mt-2">Replies within two working days</dd>
              </div>
              <div className="col-span-2">
                <dt className={LABEL}>Films</dt>
                <dd className="mt-2">
                  <a
                    href={company.youtube}
                    className="inline-flex items-center gap-2 transition-colors hover:text-white/70"
                  >
                    <FaYoutube className="size-4" /> D2 Communication on YouTube
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <div className="mt-28 flex flex-col gap-8 border-t border-white/10 py-8 text-[14px] md:mt-36 md:flex-row md:items-center md:justify-between">
          <a href="#top" className="flex items-center gap-3" aria-label="D2 Communication, back to top">
            <D2Mark title="" className="h-6 w-auto" />
            <span className="font-medium tracking-[-0.01em]">{company.name}</span>
          </a>
          <ul className="flex flex-wrap gap-x-7 gap-y-2 text-white/55">
            {publicCategories.map((c) => (
              <li key={c.slug}>
                <a href={`#${c.slug}`} className="transition-colors hover:text-white">
                  {c.name}
                </a>
              </li>
            ))}
            <li>
              <a href="#about" className="transition-colors hover:text-white">
                About
              </a>
            </li>
          </ul>
          <div className="flex items-center gap-8 text-white/40">
            <span>
              © {new Date().getFullYear()} {company.name}
            </span>
            <a
              href="#top"
              className="group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
            >
              Back to top
              <LuArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>

      <p
        aria-hidden
        className="pointer-events-none -mb-[3.2vw] text-center text-[12.4vw] leading-[0.8] font-semibold tracking-[-0.07em] whitespace-nowrap text-white/[0.06] select-none"
      >
        D2 Communication
      </p>
    </footer>
  );
}
