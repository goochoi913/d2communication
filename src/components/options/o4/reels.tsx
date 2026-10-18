"use client";

import { LuArrowRight, LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Still } from "@/components/media/still";
import { useVideoPlayer } from "@/components/media/video-player";
import { youtubeThumbnail } from "@/lib/youtube";
import {
  company,
  photos,
  publicCategories,
  smallPoster,
  videosIn,
  type Category,
  type CategorySlug,
  type Video,
} from "@/data/site";
import { Label, Reveal, cond, hideBroken, mono } from "./shared";

/** Every category as a reel: a scope-format title card over its cover, with a strip of its films. */
export function Reels({ onCategory }: { onCategory: (slug: CategorySlug) => void }) {
  return (
    <section id="reels" className="relative bg-black py-36" aria-label="Sections of work">
      <div className="mx-auto max-w-[1760px] px-6 md:px-12">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6 border-b border-white/15 pb-10">
            <div>
              <Label>Sections · {publicCategories.length} reels</Label>
              <h2
                className={cn(
                  cond,
                  "mt-6 text-[clamp(4.5rem,9.4vw,10.5rem)] leading-[0.82] font-bold text-[#f2f2f2] uppercase",
                )}
              >
                The reels
              </h2>
            </div>
            <p className={cn(cond, "max-w-[30rem] text-[1.35rem] leading-snug text-[#9a9a9a]")}>
              Broadcast documentaries, films for companies, the stage on record — and the stills made alongside them.
            </p>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6">
          {publicCategories.map((c, i) => (
            <Reveal key={c.slug} amount={0.15}>
              <Reel category={c} index={i} total={publicCategories.length} onCategory={onCategory} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

type Thumb = { key: string; src: string; label: string; credit: string; video?: Video };

function Reel({
  category,
  index,
  total,
  onCategory,
}: {
  category: Category;
  index: number;
  total: number;
  onCategory: (slug: CategorySlug) => void;
}) {
  const { open } = useVideoPlayer();
  const isStills = category.slug === "photography";
  const films = isStills ? [] : videosIn(category.slug as Video["category"]);
  const years = films.map((f) => f.year);
  const meta = isStills
    ? `${photos.length} stills`
    : `${films.length} films · ${Math.min(...years)}–${Math.max(...years)}`;
  const thumbs: Thumb[] = isStills
    ? photos.slice(0, 3).map((p) => ({
        key: p.src,
        src: p.src.replace(/-(1600|2560)\.webp$/, "-960.webp"),
        label: p.caption,
        credit: `Photograph · ${company.founder.name}`,
      }))
    : films.slice(0, 3).map((f) => ({
        key: f.id,
        src: f.poster ? smallPoster(f.poster) : youtubeThumbnail(f.youtubeId),
        label: f.title,
        credit: `${f.client} · ${f.year} · ${f.runtime}`,
        video: f,
      }));
  const n = String(index + 1).padStart(2, "0");

  return (
    <article className="group relative aspect-[16/10] w-full overflow-hidden bg-[#0d0d0d] md:aspect-[2.39/1]">
      <a
        href={isStills ? "#stills" : "#programme"}
        onClick={() => onCategory(category.slug)}
        className="absolute inset-0 z-10"
        aria-label={`${category.title}: ${isStills ? "view stills" : `view ${films.length} films in the programme`}`}
      />

      <Still
        src={category.cover}
        alt=""
        sizes="100vw"
        onError={hideBroken}
        className="absolute inset-0 size-full object-cover brightness-[0.5] transition-[transform,filter] duration-[1400ms] ease-out group-hover:scale-[1.07] group-hover:brightness-[0.62] group-hover:duration-[7000ms]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)]" />

      <div className="pointer-events-none absolute inset-x-8 top-7 flex items-center justify-between md:inset-x-10">
        <Label className="text-[#d6d6d6]">
          Reel {n} <span className="text-[#6f6f6f]">/ {String(total).padStart(2, "0")}</span>
          {isStills ? <span className="ml-3 text-[#9a9a9a]">— Stills</span> : null}
        </Label>
        <Label className="text-[#d6d6d6]">{meta}</Label>
      </div>

      <div className="pointer-events-none absolute top-1/2 left-8 -translate-y-1/2 md:left-10">
        <h3
          className={cn(
            cond,
            "text-[clamp(3.5rem,7.6vw,8.6rem)] leading-[0.82] font-bold text-white uppercase transition-[letter-spacing] duration-700 group-hover:tracking-[0.02em]",
          )}
        >
          {category.name}
        </h3>
        <p
          className={cn(
            cond,
            "mt-5 text-[clamp(0.95rem,1.15vw,1.2rem)] font-medium tracking-[0.34em] text-white/75 uppercase",
          )}
        >
          {category.tagline}
        </p>
        <p className={cn(cond, "mt-4 max-w-[30rem] text-[clamp(1.05rem,1.3vw,1.3rem)] leading-snug text-white/70")}>
          {category.description}
        </p>
        <p
          className={cn(
            cond,
            "mt-7 flex items-center gap-3 text-[15px] font-semibold tracking-[0.24em] text-white uppercase",
          )}
        >
          {isStills ? "View stills" : "View in programme"}
          <LuArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1.5" />
        </p>
      </div>

      <ul className="absolute right-8 bottom-8 z-20 hidden gap-3 md:right-10 md:bottom-9 lg:flex">
        {thumbs.map((t) => (
          <li key={t.key} className="w-[clamp(150px,13vw,232px)]">
            {t.video ? (
              <button
                type="button"
                onClick={() => open(t.video!)}
                className="group/thumb block w-full cursor-pointer text-left"
                aria-label={`Play ${t.label}`}
              >
                <ThumbFrame src={t.src} playable />
                <span
                  className={cn(
                    mono,
                    "mt-2 block truncate text-[10px] tracking-[0.16em] text-white/80 uppercase group-hover/thumb:text-white",
                  )}
                >
                  {t.label}
                </span>
                <span className={cn(mono, "mt-1 block truncate text-[9px] tracking-[0.16em] text-white/45 uppercase")}>
                  {t.credit}
                </span>
              </button>
            ) : (
              <div>
                <ThumbFrame src={t.src} />
                <span className={cn(mono, "mt-2 block truncate text-[10px] tracking-[0.16em] text-white/80 uppercase")}>
                  {t.label}
                </span>
                <span className={cn(mono, "mt-1 block truncate text-[9px] tracking-[0.16em] text-white/45 uppercase")}>
                  {t.credit}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}

function ThumbFrame({ src, playable }: { src: string; playable?: boolean }) {
  return (
    <span className="relative block aspect-video overflow-hidden bg-[#161616] ring-1 ring-white/15 transition-shadow duration-300 group-hover/thumb:ring-white/70">
      <Still src={src} alt="" sizes="240px" onError={hideBroken} className="size-full object-cover" />
      {playable ? (
        <span className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover/thumb:opacity-100">
          <LuPlay className="size-5 fill-current text-white" />
        </span>
      ) : null}
    </span>
  );
}
