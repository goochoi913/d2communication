/* eslint-disable @next/next/no-img-element -- logos are single SVG/PNG files */
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import { tr } from "@/content/format";
import type { Lang, Partner } from "@/content/schema";

/** CSS filter per mode: every logo becomes one tone that sits quietly on the dark page. */
const MONO = {
  silhouette: "brightness(0) invert(1)",
  invert: "grayscale(1) invert(1) brightness(1.08)",
} as const;

/**
 * A partner's logo in monochrome, or its name when there's no logo yet. `height` sets the
 * logo's height; wide logos are capped so a long wordmark doesn't dominate a row.
 */
export function PartnerMark({
  partner,
  lang,
  height,
  className,
  interactive = false,
}: {
  partner: Partner;
  lang: Lang;
  height: number;
  className?: string;
  /** Brighten on hover of the nearest `group/partner` (and show colour when the partner allows it). */
  interactive?: boolean;
}) {
  const name = tr(partner.name, lang);
  if (!partner.logo) {
    return <span className={cn("leading-none whitespace-nowrap text-neutral-300", className)}>{name}</span>;
  }
  const ratio = partner.logo.width / partner.logo.height;
  // Compensate for shape: a square emblem gets a little more height than a long wordmark.
  const h = Math.round(height * (ratio < 1.6 ? 1.35 : ratio > 4.5 ? 0.82 : 1));
  const w = Math.min(Math.round(h * ratio), height * 7);

  return (
    <img
      src={partner.logo.src}
      alt={name}
      width={w}
      height={Math.round(w / ratio)}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn(
        "block h-auto max-w-full object-contain [filter:var(--mono)]",
        interactive &&
          "opacity-60 transition-[opacity,filter] duration-500 group-hover/partner:opacity-100 group-focus-visible/partner:opacity-100",
        interactive && partner.hoverColor && "group-hover/partner:[filter:none]",
        className,
      )}
      style={{ "--mono": MONO[partner.mono ?? "silhouette"], width: w } as CSSProperties}
    />
  );
}
