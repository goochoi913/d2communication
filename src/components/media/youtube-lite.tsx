"use client";

import { useState, type ReactNode } from "react";
import { LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { youtubeEmbedUrl, youtubeThumbnail } from "@/lib/youtube";

/**
 * Lightweight YouTube embed: shows a poster and loads the real player only on click,
 * so pages stay fast (especially on phones) no matter how many videos they list.
 */
export function YouTubeLite({
  youtubeId,
  title,
  poster,
  className,
  playButton,
}: {
  youtubeId: string;
  title: string;
  poster?: string;
  className?: string;
  /** Custom play affordance; defaults to a round button. */
  playButton?: ReactNode;
}) {
  const [active, setActive] = useState(false);

  return (
    <div className={cn("relative aspect-video w-full overflow-hidden bg-black", className)}>
      {active ? (
        <iframe
          src={youtubeEmbedUrl(youtubeId)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 size-full cursor-pointer"
          aria-label={`Play ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster ?? youtubeThumbnail(youtubeId)}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-black/15 transition-colors duration-500 group-hover:bg-black/5" />
          {playButton ?? (
            <span className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-950 shadow-lg backdrop-blur transition-transform duration-500 group-hover:scale-110">
              <LuPlay className="ml-0.5 size-6 fill-current" />
            </span>
          )}
        </button>
      )}
    </div>
  );
}
