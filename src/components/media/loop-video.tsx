"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { LoopAsset } from "@/content/schema";

/** No autoplay for visitors who ask for less motion or less data. */
function autoplayAllowed() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !connection?.saveData;
}

/**
 * A short, muted, self-hosted preview loop laid over its poster image. Nothing downloads
 * until the loop is first `active`; it fades in once frames are actually playing, and if
 * the browser refuses to autoplay (low-power mode, data saver) the still simply stays.
 */
export function LoopVideo({
  loop,
  active,
  className,
}: {
  loop: LoopAsset;
  /** Play while true (hover, in view, or always for a hero). */
  active: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (!active) {
      video.pause();
      return;
    }
    if (!autoplayAllowed()) return;
    // Attach the file only on first use, so idle cards cost nothing.
    if (video.getAttribute("src") !== loop.src) video.src = loop.src;
    video.muted = true;
    video.play().catch(() => setPlaying(false));
  }, [active, loop.src]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      className={cn(
        "pointer-events-none absolute inset-0 size-full object-cover transition-opacity duration-700",
        playing ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  );
}
