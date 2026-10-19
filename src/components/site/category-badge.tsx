"use client";

import { LuEye, LuEyeOff, LuLink, LuSettings2 } from "react-icons/lu";

import type { Category } from "@/content/schema";
import { useSite } from "@/components/content/site-context";

const LABELS = {
  public: { en: "Public", ko: "공개" },
  "link-only": { en: "Link only", ko: "링크로만 공개" },
  hidden: { en: "Hidden", ko: "숨김" },
} as const;

/** Edit mode only: the category's visibility, as a button that opens its settings. */
export function CategoryBadge({ category }: { category: Category }) {
  const { editing, bridge, lang } = useSite();
  if (!editing || !bridge) return null;
  const Icon = category.visibility === "public" ? LuEye : category.visibility === "link-only" ? LuLink : LuEyeOff;
  return (
    <button
      type="button"
      onClick={() => bridge.openPanel({ kind: "category", slug: category.slug })}
      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-dashed border-white/30 px-3 text-xs tracking-normal text-neutral-200 normal-case hover:border-white hover:text-white"
    >
      <Icon className="size-3.5" />
      {LABELS[category.visibility][lang]}
      <LuSettings2 className="size-3.5 opacity-60" />
    </button>
  );
}
