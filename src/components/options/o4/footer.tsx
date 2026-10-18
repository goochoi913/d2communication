"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { LuArrowUp, LuArrowUpRight } from "react-icons/lu";
import { FaYoutube } from "react-icons/fa6";

import { cn } from "@/lib/utils";
import { D2Mark } from "@/components/brand/d2-mark";
import { company, copy, publicCategories, type CategorySlug } from "@/data/site";
import { Label, cond, mono } from "./shared";

/** The closing card: the contact set like a title, the small print like end credits. */
export function Footer({ onCategory }: { onCategory: (slug: CategorySlug) => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const tracking = useTransform(scrollYProgress, [0, 0.7], ["0.12em", "-0.005em"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.25, 1]);

  return (
    <footer id="contact" ref={ref} className="relative bg-black pt-40 pb-10" aria-label="Contact">
      <div className="mx-auto max-w-[1760px] px-6 md:px-12">
        <div className="text-center">
          <Label className="text-[#6f6f6f]">— End of programme —</Label>
          <motion.h2
            style={{ letterSpacing: tracking, opacity }}
            className={cn(
              cond,
              "mt-10 text-[clamp(6rem,21vw,25rem)] leading-[0.78] font-bold text-[#f2f2f2] uppercase",
            )}
          >
            Contact
          </motion.h2>
          <p
            className={cn(
              cond,
              "mt-10 text-[clamp(1rem,1.3vw,1.3rem)] font-medium tracking-[0.36em] text-[#8a8a8a] uppercase",
            )}
          >
            {copy.contactCta.replace(/\.$/, "")} — documentary, brand film or performance
          </p>
          <p className={cn(cond, "mt-5 text-[clamp(1.1rem,1.4vw,1.4rem)] text-[#cfcfcf]")}>
            Write to {company.founder.name}, {company.founder.role.toLowerCase()} — replies within two working days.
          </p>
          <a
            href={`mailto:${company.email}`}
            className={cn(
              cond,
              "group mt-12 inline-flex items-center gap-4 border-b border-white/30 pb-3 text-[clamp(2rem,4.2vw,4.6rem)] leading-none font-semibold tracking-[0.03em] text-white transition-colors hover:border-white",
            )}
          >
            {company.email}
            <LuArrowUpRight className="size-[0.7em] text-[#8a8a8a] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
          </a>
        </div>

        <div className="mt-24 grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <ContactItem label="Telephone">
            <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-white">
              {company.phone}
            </a>
          </ContactItem>
          <ContactItem label="Studio">{company.location}</ContactItem>
          <ContactItem label="Films">
            <a href={company.youtube} className="inline-flex items-center gap-2.5 hover:text-white">
              <FaYoutube className="size-[0.9em]" /> D2 Communication
            </a>
          </ContactItem>
          <ContactItem label="Programme">
            <ul className="space-y-1">
              {publicCategories.map((c) => (
                <li key={c.slug}>
                  <a
                    href={c.slug === "photography" ? "#stills" : "#programme"}
                    onClick={() => onCategory(c.slug)}
                    className="hover:text-white"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </ContactItem>
        </div>

        <div className="mt-28 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <a href="#top" className="flex items-center gap-3.5" aria-label={`${company.name}, back to top`}>
            <D2Mark title="" className="h-6 w-auto" />
            <span className={cn(cond, "text-[14px] font-semibold tracking-[0.32em] text-[#ededed] uppercase")}>
              {company.name}
            </span>
          </a>
          <p className={cn(mono, "text-[10px] tracking-[0.2em] text-[#5f5f5f] uppercase")}>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <a
            href="#top"
            className={cn(
              mono,
              "group flex items-center gap-2 text-[10px] tracking-[0.22em] text-[#8a8a8a] uppercase hover:text-white",
            )}
          >
            Back to the top
            <LuArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function ContactItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label className="text-[10px]">{label}</Label>
      <div
        className={cn(cond, "mt-4 text-[1.35rem] leading-snug font-medium tracking-[0.06em] text-[#cfcfcf] uppercase")}
      >
        {children}
      </div>
    </div>
  );
}
