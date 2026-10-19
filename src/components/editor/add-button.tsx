"use client";

import { useEffect, useRef, useState } from "react";
import { LuImagePlus, LuLoaderCircle, LuPlus } from "react-icons/lu";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { newId, parseYouTubeId, youtubeThumbnail } from "@/content/format";
import { insertAfter, updateList } from "@/content/paths";
import type { ImageAsset, LogoAsset, Partner, Photo, SiteContent, Work } from "@/content/schema";
import type { AddButtonProps } from "@/components/content/bridge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useEditor, useUi } from "./context";
import { UnreadableImageError } from "./media/image";
import { uploadImage, uploadLogo } from "./media/upload";

const blank = { en: "", ko: "" };

/** The "+" for a list in edit mode: a dashed tile in grids, a small pill inline. */
export function AddButton({ kind, listPath, preset, afterId, label, variant = "tile", className }: AddButtonProps) {
  const { store } = useEditor();
  const t = useUi();
  const [dialog, setDialog] = useState<"work" | "partner" | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const files = useRef<HTMLInputElement>(null);

  const text = label ?? (kind === "work" ? t("addFilm") : kind === "photo" ? t("addPhotos") : kind === "partner" ? t("addPartner") : kind === "stat" ? t("addNumber") : t("addCraft"));

  const add = <T extends { id: string }>(item: T) =>
    store.mutate((c) => updateList<SiteContent, T>(c, listPath, (items) => insertAfter(items, item, afterId)));

  const onClick = () => {
    if (kind === "work") setDialog("work");
    else if (kind === "partner") setDialog("partner");
    else if (kind === "photo") files.current?.click();
    else if (kind === "stat") add({ id: newId("s"), value: "10+", label: { en: "New number", ko: "새 숫자" } });
    else if (kind === "craft") add({ id: newId("c"), label: { en: "New", ko: "새 항목" } });
  };

  const addPhotos = async (list: FileList) => {
    const chosen = [...list].filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    if (!chosen.length) return;
    let added = 0;
    setBusy(0);
    for (const [i, file] of chosen.entries()) {
      try {
        const image = await uploadImage(file, "photo", { onProgress: (p) => setBusy((i + p) / chosen.length) });
        const photo: Photo = { id: newId("p"), image, caption: blank, group: (preset?.group as Photo["group"]) ?? "portfolio" };
        // Each photo is its own undo step, appended after the previous one.
        store.mutate((c) => updateList<SiteContent, Photo>(c, listPath, (items) => [...items, photo]));
        added++;
      } catch (error) {
        toast.error(`${file.name}: ${error instanceof UnreadableImageError ? t("unreadableImage") : t("uploadFailed")}`);
      }
    }
    setBusy(null);
    if (added) toast.success(t("photosAdded", { n: added }));
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={busy !== null}
        className={cn(
          "group/add text-neutral-300 transition-colors hover:text-white",
          variant === "tile"
            ? "flex min-h-32 flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-white/25 p-6 text-sm hover:border-white/60 hover:bg-white/[0.03]"
            : "inline-flex h-9 items-center gap-1.5 rounded-full border border-dashed border-white/30 px-3 text-xs tracking-normal normal-case hover:border-white/70",
          className,
        )}
      >
        {busy !== null ? (
          <>
            <LuLoaderCircle className="size-6 animate-spin" />
            <span className="tabular-nums">{Math.round(busy * 100)}%</span>
          </>
        ) : (
          <>
            {kind === "photo" ? (
              <LuImagePlus className={variant === "tile" ? "size-7" : "size-4"} />
            ) : (
              <span className={cn("grid place-items-center rounded-full bg-white/10 transition-colors group-hover/add:bg-white group-hover/add:text-neutral-950", variant === "tile" ? "size-11" : "size-5")}>
                <LuPlus className={variant === "tile" ? "size-5" : "size-3.5"} />
              </span>
            )}
            <span>{text}</span>
          </>
        )}
      </button>
      {kind === "photo" ? (
        <input
          ref={files}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void addPhotos(e.target.files);
            e.target.value = "";
          }}
        />
      ) : null}
      {dialog === "work" ? (
        <AddWorkDialog
          onClose={() => setDialog(null)}
          onAdd={(work) => {
            add({ ...work, ...(preset as Partial<Work>) });
            toast.success(t("filmAdded"));
          }}
        />
      ) : null}
      {dialog === "partner" ? <AddPartnerDialog onClose={() => setDialog(null)} onAdd={add} /> : null}
    </>
  );
}

/** Paste the YouTube link, type the title (filled in from YouTube when possible), optionally a thumbnail. */
function AddWorkDialog({ onClose, onAdd }: { onClose: () => void; onAdd: (work: Work) => void }) {
  const { lang } = useEditor();
  const t = useUi();
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [titleTouched, setTitleTouched] = useState(false);
  const [poster, setPoster] = useState<ImageAsset | null>(null);
  const [uploading, setUploading] = useState<number | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const id = parseYouTubeId(link);
  const invalid = link.trim().length > 0 && !id;

  // Fill in YouTube's own title, unless one has been typed already.
  useEffect(() => {
    if (!id || titleTouched) return;
    const controller = new AbortController();
    fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { title?: string } | null) => data?.title && setTitle(data.title))
      .catch(() => {});
    return () => controller.abort();
  }, [id, titleTouched]);

  const submit = () => {
    if (!id || !title.trim()) return;
    const name = title.trim();
    onAdd({
      id: newId("w"),
      category: "broadcast",
      title: lang === "ko" ? { en: name, ko: name } : { en: name, ko: "" },
      subGenre: blank,
      year: String(new Date().getFullYear()),
      client: blank,
      role: { en: "Director", ko: "연출" },
      duration: 0,
      description: blank,
      youtubeId: id,
      poster: poster ?? undefined,
      placement: "other",
    });
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="dark max-w-md sm:max-w-md" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle>{t("addFilmTitle")}</DialogTitle>
          <DialogDescription>{t("youtubeHint")}</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="add-link">{t("youtubeLink")}</Label>
            <Input
              id="add-link"
              autoFocus
              inputMode="url"
              placeholder="https://youtu.be/…"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              aria-invalid={invalid}
              className="h-11"
            />
            {invalid ? <p className="text-sm text-[#EA4E4E]">{t("youtubeInvalid")}</p> : null}
            {id ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster ? poster.src.replace("{w}", String(poster.widths?.[0] ?? "")) : youtubeThumbnail(id)} alt="" className="mt-1 aspect-video w-full rounded-sm object-cover" />
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="add-title">{t("title")}</Label>
            <Input
              id="add-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleTouched(true);
              }}
              className="h-11"
            />
          </div>
          <div className="grid gap-2">
            <Label>{t("thumbnailOptional")}</Label>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" className="h-11" onClick={() => file.current?.click()} disabled={uploading !== null}>
                {uploading !== null ? <LuLoaderCircle className="size-4 animate-spin" /> : <LuImagePlus className="size-4" />}
                {t("uploadThumbnail")}
              </Button>
              {uploading !== null ? <Progress value={uploading * 100} className="flex-1" /> : null}
            </div>
            <input
              ref={file}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (!f) return;
                setUploading(0);
                try {
                  setPoster(await uploadImage(f, "poster", { onProgress: setUploading }));
                } catch (error) {
                  toast.error(error instanceof UnreadableImageError ? t("unreadableImage") : t("uploadFailed"));
                } finally {
                  setUploading(null);
                }
              }}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" className="h-11" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button type="submit" className="h-11" disabled={!id || !title.trim() || uploading !== null}>
              {t("addFilm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddPartnerDialog({ onClose, onAdd }: { onClose: () => void; onAdd: (partner: Partner) => void }) {
  const t = useUi();
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<LogoAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="dark max-w-md sm:max-w-md" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle>{t("addPartner")}</DialogTitle>
          <DialogDescription>{t("logoHint")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="partner-name">{t("partnerName")}</Label>
            <Input id="partner-name" autoFocus value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
          </div>
          <div className="grid gap-3">
            <Button type="button" variant="outline" className="h-11 justify-self-start" onClick={() => file.current?.click()} disabled={uploading}>
              {uploading ? <LuLoaderCircle className="size-4 animate-spin" /> : <LuImagePlus className="size-4" />}
              {t("uploadLogo")}
            </Button>
            {logo ? (
              <div className="grid h-28 place-items-center rounded-sm bg-neutral-950 ring-1 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} alt="" className="max-h-14 max-w-[70%] [filter:brightness(0)_invert(1)]" />
              </div>
            ) : null}
            <input
              ref={file}
              type="file"
              accept="image/svg+xml,image/png,image/jpeg,image/webp,.svg"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (!f) return;
                setUploading(true);
                try {
                  setLogo(await uploadLogo(f));
                  if (!name) setName(f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
                } catch {
                  toast.error(t("uploadFailed"));
                } finally {
                  setUploading(false);
                }
              }}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button type="button" variant="ghost" className="h-11" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            type="button"
            className="h-11"
            disabled={!name.trim() || uploading}
            onClick={() => {
              onAdd({ id: newId("pt"), name: { en: name.trim(), ko: name.trim() }, logo: logo ?? undefined, mono: "silhouette", hoverColor: false });
              onClose();
            }}
          >
            {t("addPartner")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
