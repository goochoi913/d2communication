"use client";

import { useState } from "react";
import { LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { tr, youtubeThumbnail } from "@/content/format";
import type { ImageAsset, Work } from "@/content/schema";
import { EItem, EText, useText } from "@/components/content/editable";
import { useSite } from "@/components/content/site-context";
import { ColorReveal, revealMedia } from "@/components/media/color-reveal";
import { LoopVideo } from "@/components/media/loop-video";
import { Picture } from "@/components/media/picture";
import { CreditLine } from "./credit-line";
import { serif } from "./typography";
import { useWorkPlayer } from "./work-player";

/** The poster for a work: its own still, or the YouTube thumbnail while there isn't one. */
export function workPoster(work: Work): ImageAsset | null {
  if (work.poster) return work.poster;
  if (!work.youtubeId) return null;
  return { src: youtubeThumbnail(work.youtubeId, "maxresdefault"), width: 1280, height: 720 };
}

const SIZES = {
  lead: "(min-width: 1024px) 66vw, 100vw",
  standard: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  compact: "(min-width: 1024px) 25vw, 50vw",
} as const;

/**
 * A film in a grid: a black-and-white still that comes into colour (on hover, or in the
 * middle of the screen on phones), with its title and credits. Clicking plays it; in edit
 * mode clicking opens its settings instead.
 */
export function WorkCard({
  work,
  variant = "standard",
  scopeIds,
  className,
}: {
  work: Work;
  variant?: "lead" | "standard" | "compact";
  /** Ids of the works shown alongside this one, in order (for moving it in edit mode). */
  scopeIds: string[];
  className?: string;
}) {
  const { lang, editing, bridge } = useSite();
  const t = useText();
  const { open } = useWorkPlayer();
  const [active, setActive] = useState(false);
  const poster = workPoster(work);
  const title = tr(work.title, lang);

  const activate = () => (editing && bridge ? bridge.openPanel({ kind: "work", id: work.id }) : open(work));

  return (
    <EItem
      kind="work"
      listPath={["works"]}
      id={work.id}
      scopeIds={scopeIds}
      label={title}
      onEdit={() => bridge?.openPanel({ kind: "work", id: work.id })}
      className={className}
    >
      <ColorReveal as="article" onActiveChange={setActive} className="relative">
        <button
          type="button"
          onClick={activate}
          aria-label={`${t("work.watch")}: ${title}`}
          className="relative block w-full cursor-pointer overflow-hidden bg-neutral-900 text-left"
        >
          <div className={cn("relative", variant === "lead" ? "aspect-[16/9] md:aspect-[1.9/1]" : "aspect-video")}>
            {poster ? (
              <Picture
                image={poster}
                alt=""
                sizes={SIZES[variant]}
                className="absolute inset-0"
                imgClassName={cn(revealMedia, "group-hover/reveal:scale-[1.03]")}
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-xs tracking-[0.24em] text-neutral-500 uppercase">
                {t("work.comingSoon")}
              </div>
            )}
            {work.loop ? <LoopVideo loop={work.loop} active={active && !editing} className={revealMedia} /> : null}
            <span className="absolute inset-0 bg-black/15 transition-colors duration-700 group-hover/reveal:bg-black/0 group-data-[color=on]/reveal:bg-black/0" />
            <span
              className={cn(
                "absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/45 py-1.5 pr-3.5 pl-1.5 text-xs tracking-[0.12em] text-white uppercase backdrop-blur-md transition-opacity duration-500 md:bottom-4 md:left-4",
                variant === "lead" ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover/reveal:opacity-100",
              )}
            >
              <span className="grid size-7 place-items-center rounded-full bg-white text-neutral-950">
                <LuPlay className="ml-0.5 size-3 fill-current" />
              </span>
              {t("work.watch")}
            </span>
          </div>
        </button>

        <div className={cn(variant === "compact" ? "mt-3" : "mt-5")}>
          <EText
            path={["works", `#${work.id}`, "title"]}
            value={work.title}
            as="h4"
            className={cn(
              serif,
              "leading-[1.12] text-neutral-50",
              variant === "lead" && "text-[clamp(1.9rem,2.6vw,2.6rem)]",
              variant === "standard" && "text-[1.6rem]",
              variant === "compact" && "text-[1.2rem]",
            )}
          />
          <CreditLine work={work} className={variant === "compact" ? "mt-1.5 text-xs" : "mt-2.5"} withRole={variant !== "compact"} />
          {variant === "lead" ? (
            <EText
              path={["works", `#${work.id}`, "description"]}
              value={work.description}
              as="p"
              multiline
              className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-400"
            />
          ) : null}
        </div>
      </ColorReveal>
    </EItem>
  );
}
