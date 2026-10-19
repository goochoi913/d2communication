"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LuArrowUp, LuArrowUpRight, LuCheck, LuCopy } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { tr } from "@/content/format";
import type { CategorySlug } from "@/content/schema";
import { navCategories, otherLangPath, pagePath } from "@/content/select";
import { D2Mark } from "@/components/brand/d2-mark";
import { EImage, EPlain, Txt, useText } from "@/components/content/editable";
import { useSite } from "@/components/content/site-context";
import { Picture } from "@/components/media/picture";
import { Reveal } from "@/components/motion/reveal";
import { RED, RedLine, serif } from "./typography";

/**
 * Contact and footer, on every page. The address is assembled in the browser rather than
 * written into the HTML, which keeps it away from most spam harvesters.
 */
export function Contact({ slug }: { slug?: CategorySlug }) {
  const { content, lang, editing } = useSite();
  const t = useText();
  const email = content.settings.contactEmail;
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- reveal the address only after hydration
  useEffect(() => setShown(true), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked
    }
  };

  return (
    <footer id="contact" className="relative overflow-hidden border-t border-white/10">
      <EImage path={["images", "contact"]} image={content.images.contact} slot="background" className="absolute inset-0">
        <Picture image={content.images.contact} alt="" sizes="100vw" className="absolute inset-0 bg-transparent opacity-30" imgClassName="grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/70 to-neutral-950" />
      </EImage>

      <div className="relative mx-auto max-w-[1600px] px-5 pt-28 pb-8 md:px-10 md:pt-44 md:pb-10">
        <Reveal>
          <Txt k="contact.eyebrow" as="p" className="text-xs font-medium tracking-[0.28em] text-neutral-400 uppercase" />
          <Txt
            k="contact.title"
            as="h2"
            rich
            multiline
            className={cn(serif, "mt-6 text-[clamp(2.7rem,7vw,7.6rem)] leading-[0.98] font-light")}
          />
          <Txt k="contact.body" as="p" multiline className="mt-8 max-w-xl text-[17px] leading-relaxed text-neutral-300" />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4 md:mt-14">
            {editing ? (
              <EPlain
                path={["settings", "contactEmail"]}
                value={email}
                className={cn(serif, "text-[clamp(1.6rem,3.8vw,3.8rem)] leading-tight text-white")}
              />
            ) : (
              <a
                href={shown ? `mailto:${email}` : undefined}
                className={cn(serif, "group inline-flex max-w-full items-center gap-3 text-[clamp(1.6rem,3.8vw,3.8rem)] leading-tight text-white md:gap-4")}
              >
                <span className="min-w-0 border-b border-white/25 pb-1.5 break-all transition-colors group-hover:border-white">
                  {shown ? email : " "}
                </span>
                <LuArrowUpRight
                  className="size-[0.8em] shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  style={{ color: RED }}
                />
              </a>
            )}
            <button
              type="button"
              onClick={copy}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-[13px] text-neutral-200 transition-colors hover:border-white hover:text-white"
            >
              {copied ? <LuCheck className="size-4" /> : <LuCopy className="size-4" />}
              {copied ? t("contact.copied") : t("contact.copy")}
            </button>
          </div>
        </Reveal>

        <RedLine className="mt-20 md:mt-24" />

        <div className="mt-10 flex flex-col gap-10 text-sm md:flex-row md:items-start md:justify-between">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-1 text-neutral-300 sm:flex sm:flex-wrap sm:gap-x-8">
            {navCategories(content, editing).map((c) => (
              <li key={c.slug}>
                <Link href={pagePath(lang, c.slug)} className="inline-flex min-h-11 items-center hover:text-white">
                  {tr(c.name, lang)}
                </Link>
              </li>
            ))}
            <li>
              <Link href={`${pagePath(lang) === "/" ? "" : pagePath(lang)}/#about`} className="inline-flex min-h-11 items-center hover:text-white">
                <Txt k="nav.about" />
              </Link>
            </li>
          </ul>
          <div className="flex items-center gap-2">
            {content.settings.koEnabled || editing ? (
              <Link
                href={otherLangPath(lang, slug)}
                hrefLang={lang === "ko" ? "en" : "ko"}
                className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-4 text-neutral-300 hover:border-white/40 hover:text-white"
              >
                {tr(content.text["lang.self"], lang === "ko" ? "en" : "ko")}
              </Link>
            ) : null}
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-neutral-400 hover:text-white"
            >
              <Txt k="footer.top" />
              <LuArrowUp className="size-4" />
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-8 text-xs text-neutral-500 md:mt-20 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <D2Mark title="" className="h-5 w-auto" />
            <span className="tracking-[0.26em] text-neutral-300 uppercase">D2 Communication</span>
          </div>
          <p>
            © {new Date().getFullYear()} D2 Communication. <Txt k="footer.rights" />
          </p>
        </div>
      </div>
    </footer>
  );
}
