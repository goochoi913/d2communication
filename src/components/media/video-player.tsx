"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { LuX } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { Video } from "@/data/site";

type PlayerContext = { open: (video: Video) => void };

const Ctx = createContext<PlayerContext | null>(null);

/** Opens any video in a single shared dialog. `useVideoPlayer().open(video)` from any card. */
export function VideoPlayerProvider({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  /** Extra classes for the dialog panel, so each design can restyle it. */
  className?: string;
}) {
  const [video, setVideo] = useState<Video | null>(null);
  const open = useCallback((v: Video) => setVideo(v), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <Dialog open={!!video} onOpenChange={(o) => !o && setVideo(null)}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-black/85 supports-backdrop-filter:backdrop-blur-sm"
          className={cn(
            "w-[min(94vw,calc(78vh*16/9))] max-w-none gap-0 overflow-hidden rounded-xl p-0 sm:max-w-none",
            tone === "dark" ? "bg-neutral-950 text-neutral-50 ring-white/10" : "bg-white text-neutral-950",
            className,
          )}
        >
          {video ? (
            <>
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  key={video.id}
                  src={youtubeEmbedUrl(video.youtubeId)}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0 size-full"
                />
              </div>
              <div className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <DialogTitle className="text-base font-medium tracking-tight">{video.title}</DialogTitle>
                  <DialogDescription
                    className={cn("text-xs tracking-wide", tone === "dark" ? "text-neutral-400" : "text-neutral-500")}
                  >
                    {video.client} · {video.year} · {video.runtime} · {video.role}
                  </DialogDescription>
                </div>
                <DialogClose
                  className={cn(
                    "grid size-10 shrink-0 cursor-pointer place-items-center rounded-full transition-colors",
                    tone === "dark" ? "text-neutral-300 hover:bg-white/10" : "text-neutral-600 hover:bg-neutral-100",
                  )}
                  aria-label="Close video"
                >
                  <LuX className="size-5" />
                </DialogClose>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </Ctx.Provider>
  );
}

export function useVideoPlayer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useVideoPlayer must be used inside <VideoPlayerProvider>");
  return ctx;
}
