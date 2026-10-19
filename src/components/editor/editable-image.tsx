"use client";

import { useRef, useState, type PointerEvent } from "react";
import { LuCrosshair, LuImageUp, LuLoaderCircle } from "react-icons/lu";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import type { EditableImageProps } from "@/components/content/bridge";
import { useEditor, useUi } from "./context";
import { UnreadableImageError } from "./media/image";
import { uploadImage, type ImageKind } from "./media/upload";

const KIND: Record<EditableImageProps["slot"], ImageKind> = {
  hero: "hero",
  poster: "poster",
  photo: "photo",
  cover: "cover",
  portrait: "portrait",
  background: "background",
};

/** Upload and replace the image at `path`. Returns false when the file couldn't be used. */
export function useImageReplace() {
  const { store } = useEditor();
  const t = useUi();
  const [progress, setProgress] = useState<number | null>(null);

  const replace = async (file: File, path: EditableImageProps["path"], kind: ImageKind) => {
    setProgress(0);
    try {
      // A new hero photo gets the site's look: deep black and white, reds kept in colour.
      const asset = await uploadImage(file, kind, { redline: kind === "hero", onProgress: setProgress });
      store.update(path, asset);
      return true;
    } catch (error) {
      toast.error(error instanceof UnreadableImageError ? t("unreadableImage") : t("uploadFailed"));
      console.error(error);
      return false;
    } finally {
      setProgress(null);
    }
  };
  return { replace, progress };
}

/** An image with "Replace photo" and "Set focus" on hover (always visible on touch screens). */
export function EditableImage({ path, image, slot, className, children }: EditableImageProps) {
  const { store } = useEditor();
  const t = useUi();
  const input = useRef<HTMLInputElement>(null);
  const [focusMode, setFocusMode] = useState(false);
  const { replace, progress } = useImageReplace();

  const setFocus = (e: PointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - box.left) / box.width) * 100);
    const y = Math.round(((e.clientY - box.top) / box.height) * 100);
    store.update([...path, "focus"], { x, y });
    setFocusMode(false);
  };

  return (
    <div className={cn("group/eimg relative", className)}>
      {children}
      {focusMode ? (
        <div
          className="absolute inset-0 z-20 cursor-crosshair bg-black/30 ring-2 ring-[#EA4E4E] ring-inset"
          onPointerDown={setFocus}
        >
          <p className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70 px-4 py-2 text-sm whitespace-nowrap text-white">
            {t("focusHint")}
          </p>
        </div>
      ) : null}
      <div
        className={cn(
          "absolute z-20 flex gap-2 transition-opacity",
          slot === "hero" ? "top-20 right-4 md:top-24 md:right-8" : "top-3 right-3",
          "opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/eimg:opacity-100",
          progress !== null && "opacity-100",
        )}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            input.current?.click();
          }}
          disabled={progress !== null}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-neutral-950 shadow-lg"
        >
          {progress !== null ? <LuLoaderCircle className="size-4 animate-spin" /> : <LuImageUp className="size-4" />}
          {progress !== null ? `${Math.round(progress * 100)}%` : t("replacePhoto")}
        </button>
        {image ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFocusMode((v) => !v);
            }}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-black/70 px-4 text-sm text-white shadow-lg backdrop-blur"
          >
            <LuCrosshair className="size-4" />
            {t("setFocus")}
          </button>
        ) : null}
      </div>
      {image?.focus && focusMode ? (
        <span
          className="pointer-events-none absolute z-20 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#CC0606]"
          style={{ left: `${image.focus.x}%`, top: `${image.focus.y}%` }}
        />
      ) : null}
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void replace(file, path, KIND[slot]);
        }}
      />
    </div>
  );
}
