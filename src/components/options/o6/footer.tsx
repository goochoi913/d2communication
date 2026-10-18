"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { LuArrowUp, LuArrowUpRight, LuCheck, LuCopy, LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import { FaYoutube } from "react-icons/fa6";

import { cn } from "@/lib/utils";
import { D2Mark } from "@/components/brand/d2-mark";
import { company, copy, publicCategories } from "@/data/site";
import { Mono, SeoulClock, Tally, tileBase, tileIn } from "./shared";

export function Footer() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(company.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${company.email}`;
    }
  };

  return (
    <footer id="contact" className="mx-auto max-w-[1600px] scroll-mt-16 px-2.5 pt-28 pb-2.5 md:pt-36">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        className="grid grid-cols-2 gap-2.5 lg:grid-cols-12 lg:grid-rows-[repeat(2,minmax(190px,auto))]"
      >
        <motion.div
          variants={tileIn}
          className={cn(tileBase, "col-span-2 flex flex-col justify-between bg-neutral-950 p-7 text-white lg:col-span-8 lg:row-span-2 xl:p-10")}
        >
          <div className="flex items-center justify-between gap-4">
            <Mono className="flex items-center gap-2 text-[#A6A6A6]">
              <Tally live pulse /> 06 — Contact
            </Mono>
            <Mono className="text-[#6C6F6F]">
              Seoul <SeoulClock className="text-neutral-300" /> KST
            </Mono>
          </div>
          <div className="pt-16">
            <h2 className="text-[clamp(3rem,6.2vw,6.6rem)] leading-[0.92] font-semibold tracking-[-0.06em]">
              {copy.contactCta}
            </h2>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-neutral-400">
              Documentary, brand film or performance — send a few lines about the project and Jin Sam Choi will reply
              personally within two working days.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <a
                href={`mailto:${company.email}`}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#CC0606] px-6 text-[15px] font-medium text-white transition-colors hover:bg-[#b00505]"
              >
                <LuMail className="size-4" /> Email the studio
              </a>
              <a
                href={`tel:${company.phone.replace(/\s/g, "")}`}
                className="inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-medium text-white ring-1 ring-white/25 transition-colors ring-inset hover:bg-white/10"
              >
                <LuPhone className="size-4" /> Call
              </a>
            </div>
          </div>
        </motion.div>

        <motion.button
          variants={tileIn}
          type="button"
          onClick={copyEmail}
          className={cn(tileBase, "group col-span-2 flex cursor-pointer flex-col justify-between bg-white p-6 text-left lg:col-span-4")}
        >
          <div className="flex items-center justify-between">
            <Mono className="text-neutral-400">Email</Mono>
            <span className={cn("inline-flex items-center gap-1.5 text-[12px] font-medium", copied ? "text-[#CC0606]" : "text-neutral-400")}>
              {copied ? <LuCheck className="size-3.5" /> : <LuCopy className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </span>
          </div>
          <p className="pt-8 text-[clamp(1.2rem,1.7vw,1.75rem)] font-semibold tracking-[-0.035em] break-all">
            {company.email}
          </p>
        </motion.button>

        <motion.a
          variants={tileIn}
          href={`tel:${company.phone.replace(/\s/g, "")}`}
          className={cn(tileBase, "group col-span-1 flex flex-col justify-between bg-white p-6 lg:col-span-2")}
        >
          <div className="flex items-center justify-between">
            <Mono className="text-neutral-400">Telephone</Mono>
            <LuPhone className="size-4 text-neutral-400 transition-colors group-hover:text-neutral-950" />
          </div>
          <p className="pt-8 text-[16px] font-semibold tracking-[-0.02em]">{company.phone}</p>
        </motion.a>

        <motion.div variants={tileIn} className={cn(tileBase, "col-span-1 flex flex-col justify-between bg-white p-6 lg:col-span-2")}>
          <div className="flex items-center justify-between">
            <Mono className="text-neutral-400">Studio</Mono>
            <LuMapPin className="size-4 text-neutral-400" />
          </div>
          <p className="pt-8 text-[16px] leading-snug font-semibold tracking-[-0.02em]">{company.location}</p>
        </motion.div>
      </motion.div>

      <div className={cn(tileBase, "mt-2.5 flex flex-col gap-6 bg-white px-6 py-5 lg:flex-row lg:items-center lg:justify-between")}>
        <a href="#top" className="flex items-center gap-2.5" aria-label={`${company.name}, back to top`}>
          <D2Mark title="" className="h-[22px] w-auto" />
          <span className="text-[15px] font-semibold tracking-[-0.02em]">{company.name}</span>
        </a>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-neutral-500">
          {publicCategories.map((c) => (
            <li key={c.slug}>
              <a href={`#${c.slug}`} className="transition-colors hover:text-neutral-950">
                {c.name}
              </a>
            </li>
          ))}
          <li>
            <a href={company.youtube} className="inline-flex items-center gap-1.5 transition-colors hover:text-neutral-950">
              <FaYoutube className="size-4" /> YouTube <LuArrowUpRight className="size-3" />
            </a>
          </li>
        </ul>
        <div className="flex items-center gap-5">
          <Mono className="text-neutral-400">
            © {new Date().getFullYear()} {company.name}
          </Mono>
          <a
            href="#top"
            aria-label="Back to top"
            className="grid size-9 place-items-center rounded-full bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-950 hover:text-white"
          >
            <LuArrowUp className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
