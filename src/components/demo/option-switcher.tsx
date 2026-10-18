"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LuChevronLeft, LuChevronRight, LuLayoutGrid, LuMinus, LuPlus } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { designOptions } from "@/data/options";

/**
 * Review-only overlay for the design demos: shows which option is open and steps between
 * them (also with the ← / → keys). Not part of any design.
 */
export function OptionSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Stay out of the way: fade out while the page scrolls, return when it settles or the
  // pointer comes near the corner.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      setHidden(true);
      clearTimeout(timer);
      timer = setTimeout(() => setHidden(false), 1400);
    };
    const onMove = (e: PointerEvent) => {
      if (window.innerWidth - e.clientX < 260 && window.innerHeight - e.clientY < 120) setHidden(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const current = Number(pathname.split("/").filter(Boolean)[1]);
  const index = designOptions.findIndex((o) => o.id === current);
  const option = designOptions[index];
  const prev = designOptions[(index - 1 + designOptions.length) % designOptions.length];
  const next = designOptions[(index + 1) % designOptions.length];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      if (document.querySelector("[role=dialog]")) return;
      if (e.key === "ArrowLeft") router.push(`/options/${prev.id}`);
      if (e.key === "ArrowRight") router.push(`/options/${next.id}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, prev.id, next.id]);

  if (!option) return null;

  return (
    <div
      className={cn(
        "group/switcher fixed right-3 bottom-3 z-[100] flex items-center gap-0.5 rounded-full border border-white/10 bg-neutral-950/75 p-0.5 text-[11px] text-neutral-200 shadow-xl shadow-black/30 backdrop-blur-md transition-[opacity,translate] duration-300 hover:opacity-100",
        hidden ? "pointer-events-none translate-y-2 opacity-0" : "opacity-70",
      )}
      style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
    >
      {collapsed ? (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="flex h-7 items-center gap-1.5 rounded-full px-2.5 hover:bg-white/10"
          aria-label="Show design option switcher"
        >
          <LuPlus className="size-3.5" /> Option {option.id}
        </button>
      ) : (
        <>
          <Link href="/" className="grid size-6 place-items-center rounded-full hover:bg-white/10" aria-label="All options">
            <LuLayoutGrid className="size-3.5" />
          </Link>
          <Link
            href={`/options/${prev.id}`}
            className="grid size-6 place-items-center rounded-full hover:bg-white/10"
            aria-label={`Option ${prev.id}: ${prev.name}`}
          >
            <LuChevronLeft className="size-4" />
          </Link>
          <span className="px-1 whitespace-nowrap tabular-nums">
            {option.id}
            <span className="text-neutral-500">/{designOptions.length}</span>
            <span className="hidden group-hover/switcher:inline">
              <span className="mx-1.5 text-neutral-600">·</span>
              {option.name}
            </span>
          </span>
          <Link
            href={`/options/${next.id}`}
            className="grid size-6 place-items-center rounded-full hover:bg-white/10"
            aria-label={`Option ${next.id}: ${next.name}`}
          >
            <LuChevronRight className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className={cn("grid size-6 place-items-center rounded-full text-neutral-400 hover:bg-white/10")}
            aria-label="Minimise"
          >
            <LuMinus className="size-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
