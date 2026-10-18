"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/*
 * Option 1's showreel background: same approach as the shared YouTubeBackground, but the
 * poster is held for a few seconds after playback actually starts, so YouTube's own
 * start-up overlay (play/skip buttons) has faded before the reel is revealed.
 */

type Player = { destroy(): void; mute(): void; playVideo(): void };
type YTApi = {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      host?: string;
      playerVars?: Record<string, string | number>;
      events?: { onReady?: (e: { target: Player }) => void; onStateChange?: (e: { data: number }) => void };
    },
  ) => Player;
  PlayerState: { PLAYING: number };
};

let api: Promise<YTApi> | null = null;
function loadApi(): Promise<YTApi> {
  if (api) return api;
  api = new Promise((resolve) => {
    const w = window as unknown as { YT?: YTApi; onYouTubeIframeAPIReady?: () => void };
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
  return api;
}

export function ReelBackground({
  youtubeId,
  poster,
  start = 0,
  holdMs = 4800,
  overscan = 1.25,
  className,
}: {
  youtubeId: string;
  poster: string;
  /** Seconds into the video to begin (skips title cards). */
  start?: number;
  holdMs?: number;
  /** Extra zoom: hides YouTube's chrome and any letterbox bars baked into the footage. */
  overscan?: number;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !hostRef.current) return;
    let player: Player | undefined;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const mount = document.createElement("div");
    hostRef.current.appendChild(mount);

    loadApi().then((YT) => {
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
            if (e.data === YT.PlayerState.PLAYING && !timer) timer = setTimeout(() => setRevealed(true), holdMs);
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
          "pointer-events-none absolute top-1/2 left-1/2 transition-opacity duration-[1800ms] ease-out [&>iframe]:size-full",
          // Keep the iframe out of the composite until the reveal (avoids a 1px seam at rounded clips).
          revealed ? "opacity-100" : "opacity-0",
        )}
        style={{
          width: "max(100cqw, 177.78cqh)",
          height: "max(100cqh, 56.25cqw)",
          transform: `translate(-50%, -50%) scale(${overscan})`,
        }}
      />
      {/* The poster drifts slowly (Ken Burns) while the player warms up behind it. */}
      <motion.img
        src={poster}
        alt=""
        initial={{ scale: reduce ? 1 : 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 9, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-[1800ms] ease-out",
          revealed && "opacity-0",
        )}
      />
    </div>
  );
}
