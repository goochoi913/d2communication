"use client";

import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { LuArrowUpRight, LuCheck, LuLink, LuPlay, LuX } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { formatDuration, parseYouTubeId, tr, youtubeEmbedUrl } from "@/content/format";
import type { Work } from "@/content/schema";
import { useText } from "@/components/content/editable";
import { useSite } from "@/components/content/site-context";
import { Picture } from "@/components/media/picture";
import { CreditLine } from "./credit-line";
import { serif } from "./typography";

type PlayerApi = { open: (work: Work, mode?: "highlights" | "full") => void };
const PlayerContext = createContext<PlayerApi | null>(null);

export function useWorkPlayer() {
  const api = use(PlayerContext);
  if (!api) throw new Error("useWorkPlayer must be used inside <WorkPlayerProvider>");
  return api;
}

function setWorkParam(id: string | null) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("work", id);
  else url.searchParams.delete("work");
  window.history.replaceState(window.history.state, "", url);
}

/**
 * One shared player for every work on the page. It plays the ~1 minute highlight cut from
 * YouTube, can switch to the full-length film, and gives each work a shareable link
 * (`?work=<id>`) that opens it directly.
 */
export function WorkPlayerProvider({ children }: { children: ReactNode }) {
  const { content } = useSite();
  const [work, setWork] = useState<Work | null>(null);
  const [mode, setMode] = useState<"highlights" | "full">("highlights");

  const open = useCallback((w: Work, startWith: "highlights" | "full" = "highlights") => {
    setMode(startWith);
    setWork(w);
    setWorkParam(w.id);
  }, []);
  const close = useCallback(() => {
    setWork(null);
    setWorkParam(null);
  }, []);

  // Shared links: /broadcast?work=ice-road opens that film on arrival.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("work");
    const found = id ? content.works.find((w) => w.id === id && !w.hidden) : undefined;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL once on arrival
    if (found) setWork(found);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const api = useMemo(() => ({ open }), [open]);

  return (
    <PlayerContext value={api}>
      {children}
      <Dialog open={!!work} onOpenChange={(o) => !o && close()}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-black/90 supports-backdrop-filter:backdrop-blur-sm"
          className="max-h-[96svh] w-[min(96vw,calc(76svh*16/9))] max-w-none gap-0 overflow-y-auto rounded-none bg-neutral-950 p-0 text-neutral-50 ring-1 ring-white/10 sm:max-w-none md:rounded-sm"
        >
          {work ? <PlayerBody work={work} mode={mode} onMode={setMode} /> : null}
        </DialogContent>
      </Dialog>
    </PlayerContext>
  );
}

function PlayerBody({ work, mode, onMode }: { work: Work; mode: "highlights" | "full"; onMode: (m: "highlights" | "full") => void }) {
  const { lang } = useSite();
  const t = useText();
  const [copied, setCopied] = useState(false);
  const title = tr(work.title, lang);
  const fullId = parseYouTubeId(work.fullUrl);
  const playingId = mode === "full" && fullId ? fullId : work.youtubeId;
  const fullRuntime = formatDuration(work.duration, lang);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // clipboard blocked: the address bar already holds the link
    }
  };

  return (
    <>
      <div className="relative aspect-video w-full bg-black">
        {playingId ? (
          <iframe
            key={playingId}
            src={youtubeEmbedUrl(playingId)}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <div className="absolute inset-0">
            {work.poster ? <Picture image={work.poster} alt="" className="size-full opacity-40" imgClassName="grayscale" /> : null}
            <p className="absolute inset-0 grid place-items-center text-[13px] tracking-[0.24em] text-neutral-300 uppercase">
              {t("work.comingSoon")}
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-5 px-5 pt-5 pb-6 md:grid-cols-[1fr_auto] md:items-start md:gap-10 md:px-8 md:pt-6 md:pb-7">
        <div className="min-w-0">
          <DialogTitle className={cn(serif, "text-[1.7rem] leading-tight font-normal md:text-[2rem]")}>{title}</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-3 space-y-2">
              <CreditLine work={work} />
              {tr(work.description, lang) ? (
                <p className="max-w-2xl text-[15px] leading-relaxed text-neutral-400">{tr(work.description, lang)}</p>
              ) : null}
            </div>
          </DialogDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          {work.fullUrl ? (
            fullId ? (
              <button
                type="button"
                onClick={() => onMode(mode === "full" ? "highlights" : "full")}
                className="inline-flex h-11 items-center gap-2.5 rounded-full border border-white/25 pr-5 pl-4 text-[13px] text-white transition-colors hover:border-white hover:bg-white hover:text-neutral-950"
              >
                <LuPlay className="size-3.5 fill-current" />
                {mode === "full" ? t("work.highlights") : t("work.full")}
                {mode !== "full" && fullRuntime ? <span className="text-white/50">· {fullRuntime}</span> : null}
              </button>
            ) : (
              <a
                href={work.fullUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 pr-4 pl-5 text-[13px] text-white transition-colors hover:border-white hover:bg-white hover:text-neutral-950"
              >
                {t("work.full")}
                {fullRuntime ? <span className="opacity-50">· {fullRuntime}</span> : null}
                <LuArrowUpRight className="size-4" />
              </a>
            )
          ) : null}
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-[13px] text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            {copied ? <LuCheck className="size-4" /> : <LuLink className="size-4" />}
            {copied ? t("work.linkCopied") : t("work.copyLink")}
          </button>
          <DialogClose
            aria-label={t("work.close")}
            className="grid size-11 cursor-pointer place-items-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LuX className="size-5" />
          </DialogClose>
        </div>
      </div>
    </>
  );
}
