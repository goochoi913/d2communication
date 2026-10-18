"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/* Minimal typings for the YouTube IFrame API (https://developers.google.com/youtube/iframe_api_reference). */
type YTPlayer = { destroy(): void; mute(): void; playVideo(): void };
type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      host?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (e: { target: YTPlayer }) => void;
        onStateChange?: (e: { data: number }) => void;
      };
    },
  ) => YTPlayer;
  PlayerState: { PLAYING: number };
};

let apiPromise: Promise<YTNamespace> | null = null;

function loadYouTubeApi(): Promise<YTNamespace> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const w = window as unknown as { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void };
    if (w.YT?.Player) return resolve(w.YT);
    const previous = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(w.YT!);
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }
  });
  return apiPromise;
}

/**
 * Muted, looping, chrome-less YouTube video that covers its container, for showreel
 * backgrounds. The poster stays up until the video has been playing for `holdMs`, so
 * YouTube's own start-up overlay (title, play/skip buttons) has faded before the reveal.
 * The poster is all that shows when motion is reduced or autoplay is blocked.
 */
export function YouTubeBackground({
  youtubeId,
  poster,
  start = 0,
  className,
  posterClassName,
  /** Extra zoom that pushes YouTube's own title bar and logo outside the frame. */
  overscan = 1.25,
  holdMs = 4000,
}: {
  youtubeId: string;
  poster: string;
  /** Seconds into the video to begin (skips title cards). */
  start?: number;
  className?: string;
  posterClassName?: string;
  overscan?: number;
  /** How long playback must run before the poster gives way to the video. */
  holdMs?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !hostRef.current) return;
    let player: YTPlayer | undefined;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const mount = document.createElement("div");
    hostRef.current.appendChild(mount);

    loadYouTubeApi().then((YT) => {
      if (cancelled) return;
      player = new YT.Player(mount, {
        videoId: youtubeId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: youtubeId,
          playsinline: 1,
          rel: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          start,
        },
        events: {
          onReady: (e) => {
            e.target.mute();
            e.target.playVideo();
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING && !timer) timer = setTimeout(() => setPlaying(true), holdMs);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      player?.destroy();
      mount.remove();
    };
  }, [youtubeId, start, holdMs, reduce]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-black [container-type:size]", className)}>
      <div
        ref={hostRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 left-1/2 transition-opacity duration-[1500ms] ease-out [&>iframe]:size-full",
          // Keep the iframe out of the composite until the reveal (no flash of YouTube UI, no seams at rounded clips).
          playing ? "opacity-100" : "opacity-0",
        )}
        style={{
          width: "max(100cqw, 177.78cqh)",
          height: "max(100cqh, 56.25cqw)",
          transform: `translate(-50%, -50%) scale(${overscan})`,
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-[1500ms] ease-out",
          playing && "opacity-0",
          posterClassName,
        )}
      />
    </div>
  );
}
