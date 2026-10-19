"use client";

import { cn } from "@/lib/utils";
import { formatDuration, tr } from "@/content/format";
import type { Work } from "@/content/schema";
import { EText } from "@/components/content/editable";
import { useSite } from "@/components/content/site-context";
import { PartnerMark } from "./partner-mark";

/**
 * "[KBS logo] · 2016 · 52 min", then the role. The broadcaster or client shows as its logo
 * when it's a partner, otherwise as text.
 */
export function CreditLine({
  work,
  withRole = true,
  className,
  logoHeight = 13,
}: {
  work: Work;
  withRole?: boolean;
  className?: string;
  logoHeight?: number;
}) {
  const { content, lang } = useSite();
  const partner = work.partnerId ? content.partners.find((p) => p.id === work.partnerId) : undefined;
  const runtime = formatDuration(work.duration, lang);
  const client = partner ? null : tr(work.client, lang);
  const dot = <span aria-hidden className="text-neutral-700">·</span>;

  return (
    <div className={cn("text-[13px] text-neutral-400", className)}>
      <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 tracking-[0.06em]">
        {partner ? <PartnerMark partner={partner} lang={lang} height={logoHeight} /> : null}
        {client ? <span>{client}</span> : null}
        {(partner || client) && work.year ? dot : null}
        {work.year ? <span className="tabular-nums">{work.year}</span> : null}
        {runtime ? dot : null}
        {runtime ? <span className="tabular-nums">{runtime}</span> : null}
      </p>
      {withRole ? (
        <EText path={["works", `#${work.id}`, "role"]} value={work.role} as="p" className="mt-1.5 text-neutral-500" />
      ) : null}
    </div>
  );
}
