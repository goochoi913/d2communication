"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { LuArrowUpRight, LuMenu, LuX } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { tr } from "@/content/format";
import type { CategorySlug } from "@/content/schema";
import { navCategories, otherLangPath, pagePath } from "@/content/select";
import { D2Mark } from "@/components/brand/d2-mark";
import { Txt, useText } from "@/components/content/editable";
import { useSite } from "@/components/content/site-context";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { EASE, RED, serif } from "./typography";

export function Nav({ slug }: { slug?: CategorySlug }) {
  const { content, lang, editing } = useSite();
  const t = useText();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > window.innerHeight * 0.6));

  const categories = navCategories(content, editing);
  const showLang = content.settings.koEnabled || editing;
  const home = pagePath(lang);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: EASE }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        solid ? "border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-5 md:h-[72px] md:px-10">
        <Link href={home} className="-ml-1 flex min-h-11 items-center gap-3 px-1" aria-label="D2 Communication">
          <D2Mark title="" className="h-6 w-auto" />
          <span className="text-[12px] font-medium tracking-[0.26em] text-white uppercase">D2 Communication</span>
        </Link>

        <ul className="hidden items-center gap-7 text-sm text-neutral-200 lg:flex">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={pagePath(lang, c.slug)}
                aria-current={c.slug === slug ? "page" : undefined}
                className={cn(
                  "relative py-2 transition-colors hover:text-white aria-[current=page]:text-white",
                  c.visibility !== "public" && "opacity-50",
                )}
              >
                {tr(c.name, lang)}
                {c.slug === slug ? (
                  <span aria-hidden className="absolute inset-x-0 -bottom-0.5 h-px" style={{ backgroundColor: RED }} />
                ) : null}
              </Link>
            </li>
          ))}
          <li>
            <Link href={`${home === "/" ? "" : home}/#about`} className="py-2 transition-colors hover:text-white">
              <Txt k="nav.about" />
            </Link>
          </li>
          {showLang ? (
            <li>
              <Link
                href={otherLangPath(lang, slug)}
                hrefLang={lang === "ko" ? "en" : "ko"}
                className="py-2 text-neutral-400 transition-colors hover:text-white"
              >
                {tr(content.text["lang.self"], lang === "ko" ? "en" : "ko")}
              </Link>
            </li>
          ) : null}
          <li>
            <a
              href="#contact"
              className="rounded-full border border-white/30 px-4 py-2 text-white transition-colors hover:border-white hover:bg-white hover:text-neutral-950"
            >
              <Txt k="nav.contact" />
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="-mr-2 grid size-11 place-items-center rounded-full text-white lg:hidden"
          aria-label={t("nav.menu")}
        >
          <LuMenu className="size-6" />
        </button>
      </nav>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="border-none bg-neutral-950 p-0 text-neutral-50 data-[side=right]:w-full data-[side=right]:sm:max-w-md"
        >
          <SheetTitle className="sr-only">{t("nav.menu")}</SheetTitle>
          <div className="flex h-16 items-center justify-between px-5">
            <D2Mark title="" className="h-6 w-auto" />
            <SheetClose className="-mr-2 grid size-11 place-items-center rounded-full" aria-label={t("nav.close")}>
              <LuX className="size-6" />
            </SheetClose>
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-between overflow-y-auto px-6 pt-6 pb-10">
            <ul className="space-y-1">
              {categories.map((c, i) => (
                <li key={c.slug}>
                  <Link
                    href={pagePath(lang, c.slug)}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline gap-4 py-2.5"
                  >
                    <span className="w-6 text-xs text-neutral-500 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className={cn(serif, "text-[2.4rem] leading-none font-light")}>{tr(c.name, lang)}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`${home === "/" ? "" : home}/#about`} onClick={() => setMenuOpen(false)} className="flex items-baseline gap-4 py-2.5">
                  <span className="w-6" />
                  <span className={cn(serif, "text-[2.4rem] leading-none font-light text-neutral-300")}>
                    <Txt k="nav.about" />
                  </span>
                </Link>
              </li>
            </ul>
            <div className="mt-12 space-y-6 border-t border-white/10 pt-8">
              <a
                href={`mailto:${content.settings.contactEmail}`}
                className="flex items-center justify-between gap-4 text-lg text-white"
              >
                {content.settings.contactEmail}
                <LuArrowUpRight className="size-5 shrink-0" style={{ color: RED }} />
              </a>
              {showLang ? (
                <Link
                  href={otherLangPath(lang, slug)}
                  hrefLang={lang === "ko" ? "en" : "ko"}
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-5 text-sm text-neutral-200"
                >
                  {tr(content.text["lang.self"], lang === "ko" ? "en" : "ko")}
                </Link>
              ) : null}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </motion.header>
  );
}
