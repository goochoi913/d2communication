"use client";

import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { LuChevronLeft, LuChevronRight, LuX } from "react-icons/lu";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { tr } from "@/content/format";
import type { Photo } from "@/content/schema";
import { useText } from "@/components/content/editable";
import { useSite } from "@/components/content/site-context";
import { Picture } from "@/components/media/picture";

type LightboxApi = { open: (photos: Photo[], id: string) => void };
const LightboxContext = createContext<LightboxApi | null>(null);

export function usePhotoLightbox() {
  const api = use(LightboxContext);
  if (!api) throw new Error("usePhotoLightbox must be used inside <PhotoLightboxProvider>");
  return api;
}

/** Full-screen photographs in colour: arrows or swipe to move through the set, Esc to close. */
export function PhotoLightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ photos: Photo[]; index: number } | null>(null);
  const open = useCallback((photos: Photo[], id: string) => {
    const index = Math.max(0, photos.findIndex((p) => p.id === id));
    setState({ photos, index });
  }, []);
  const api = useMemo(() => ({ open }), [open]);
  const step = useCallback(
    (delta: number) =>
      setState((s) => (s ? { ...s, index: (s.index + delta + s.photos.length) % s.photos.length } : s)),
    [],
  );

  return (
    <LightboxContext value={api}>
      {children}
      <Dialog open={!!state} onOpenChange={(o) => !o && setState(null)}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-black/95"
          className="h-svh max-h-none w-screen max-w-none gap-0 rounded-none bg-transparent p-0 ring-0 sm:max-w-none"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
        >
          {state ? <Slide photo={state.photos[state.index]} count={state.photos.length} index={state.index} onStep={step} /> : null}
        </DialogContent>
      </Dialog>
    </LightboxContext>
  );
}

function Slide({ photo, count, index, onStep }: { photo: Photo; count: number; index: number; onStep: (d: number) => void }) {
  const { lang } = useSite();
  const t = useText();
  const touch = useRef<number | null>(null);
  const caption = tr(photo.caption, lang);

  useEffect(() => {
    touch.current = null;
  }, [photo.id]);

  return (
    <div
      className="relative flex h-full w-full flex-col"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <div className="relative min-h-0 flex-1">
        <Picture
          key={photo.id}
          image={photo.image}
          alt={caption}
          sizes="100vw"
          className="absolute inset-0 bg-transparent"
          imgClassName="object-contain"
          style={{ backgroundImage: "none" }}
        />
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-4 text-neutral-200 md:px-8">
        <div className="min-w-0">
          <DialogTitle className="truncate text-[15px] font-normal">{caption}</DialogTitle>
          <DialogDescription className="text-xs text-neutral-500 tabular-nums">
            {index + 1} / {count}
          </DialogDescription>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" onClick={() => onStep(-1)} aria-label={t("photography.previous")} className="grid size-11 place-items-center rounded-full hover:bg-white/10">
            <LuChevronLeft className="size-6" />
          </button>
          <button type="button" onClick={() => onStep(1)} aria-label={t("photography.next")} className="grid size-11 place-items-center rounded-full hover:bg-white/10">
            <LuChevronRight className="size-6" />
          </button>
          <DialogClose aria-label={t("nav.close")} className="ml-2 grid size-11 cursor-pointer place-items-center rounded-full hover:bg-white/10">
            <LuX className="size-6" />
          </DialogClose>
        </div>
      </div>
    </div>
  );
}
