"use client";

import { useRef, useState } from "react";
import { LuFilm, LuImagePlus, LuLoaderCircle, LuStar, LuTrash2, LuX } from "react-icons/lu";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { formatDuration, parseDuration, parseYouTubeId, tr, youtubeThumbnail } from "@/content/format";
import type { FilmCategory, Work } from "@/content/schema";
import { FILM_CATEGORIES } from "@/content/schema";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditor, useUi } from "../context";
import { deleteItem } from "../editable-item";
import { Choice, Field, L10nField, Panel, SwitchRow, TextInput } from "../fields";
import { UnreadableImageError } from "../media/image";
import { formatBytes, LOOP_MAX_BYTES, uploadImage, uploadLoop } from "../media/upload";

const OTHER = "__other";

/** Everything about one film: its YouTube links, texts in both languages, credits, images. */
export function WorkPanel({ id, onClose }: { id: string; onClose: () => void }) {
  const { state, store, lang, confirm } = useEditor();
  const t = useUi();
  const work = state.draft.works.find((w) => w.id === id);
  const [posterProgress, setPosterProgress] = useState<number | null>(null);
  const [loopProgress, setLoopProgress] = useState<number | null>(null);
  const posterInput = useRef<HTMLInputElement>(null);
  const loopInput = useRef<HTMLInputElement>(null);
  if (!work) return null;

  const at = (...keys: string[]) => ["works", `#${id}`, ...keys];
  const set = (key: keyof Work, value: unknown) => store.update(at(key), value);
  const featured = state.draft.settings.featuredWorkId === id;
  const categories = state.draft.categories.filter((c) => FILM_CATEGORIES.includes(c.slug as FilmCategory));
  const thumb = work.poster
    ? work.poster.src.replace("{w}", String(work.poster.widths?.[0] ?? ""))
    : work.youtubeId
      ? youtubeThumbnail(work.youtubeId)
      : null;

  const remove = async () => {
    const ok = await confirm({ title: t("deleteTitle", { name: tr(work.title, lang) }), body: t("deleteBody"), confirm: t("delete"), destructive: true });
    if (!ok) return;
    store.mutate((c) => deleteItem(c, "work", ["works"], id));
    toast(t("deleted"), { action: { label: t("undo"), onClick: store.undo } });
    onClose();
  };

  return (
    <Panel
      title={tr(work.title, lang) || t("addFilmTitle")}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" className="h-11 text-[#EA4E4E] hover:bg-[#CC0606]/15 hover:text-[#EA4E4E]" onClick={remove}>
            <LuTrash2 className="size-4" />
            {t("deleteFilm")}
          </Button>
          <Button className="h-11 px-6" onClick={onClose}>
            {t("done")}
          </Button>
        </div>
      }
    >
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumb} alt="" className="aspect-video w-full rounded-sm object-cover" />
      ) : null}

      <Field label={t("youtubeLink")} hint={t("youtubeHint")}>
        <TextInput
          value={work.youtubeId ? `https://youtu.be/${work.youtubeId}` : ""}
          inputMode="url"
          placeholder="https://youtu.be/…"
          validate={(v) => (!v || parseYouTubeId(v) ? null : t("youtubeInvalid"))}
          onCommit={(v) => set("youtubeId", parseYouTubeId(v) ?? "")}
        />
      </Field>

      <Field label={t("fullLink")} hint={t("fullHint")}>
        <TextInput value={work.fullUrl ?? ""} inputMode="url" placeholder="https://…" onCommit={(v) => set("fullUrl", v || undefined)} />
      </Field>

      <L10nField label={t("title")} path={at("title")} value={work.title} />
      <L10nField label={t("description")} path={at("description")} value={work.description} multiline />

      <Field label={t("category")}>
        <Select value={work.category} onValueChange={(v) => set("category", v)}>
          <SelectTrigger className="h-11 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark">
            {categories.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {tr(c.name, lang)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label={t("placement")}>
        <Choice
          value={work.placement}
          onChange={(v) => set("placement", v)}
          options={[
            { value: "selected", label: t("placementSelected") },
            { value: "other", label: t("placementOther") },
          ]}
        />
      </Field>

      <SwitchRow
        label={t("featureOnHome")}
        checked={featured}
        onChange={(on) => store.update(["settings", "featuredWorkId"], on ? id : "")}
      />

      <Field label={t("credit")}>
        <Select value={work.partnerId ?? OTHER} onValueChange={(v) => set("partnerId", v === OTHER ? undefined : v)}>
          <SelectTrigger className="h-11 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark">
            {state.draft.partners.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {tr(p.name, lang)}
              </SelectItem>
            ))}
            <SelectItem value={OTHER}>{t("creditOther")}</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      {!work.partnerId ? <L10nField label={t("creditName")} path={at("client")} value={work.client} /> : null}

      <div className="grid grid-cols-2 gap-4">
        <Field label={t("year")}>
          <TextInput value={work.year} inputMode="numeric" onCommit={(v) => set("year", v)} />
        </Field>
        <Field label={t("length")} hint={t("lengthHint")}>
          <TextInput
            value={formatDuration(work.duration, lang)}
            validate={(v) => (parseDuration(v) === null ? t("lengthInvalid") : null)}
            onCommit={(v) => set("duration", parseDuration(v) ?? 0)}
          />
        </Field>
      </div>

      <L10nField label={t("genre")} path={at("subGenre")} value={work.subGenre} />
      <L10nField label={t("role")} path={at("role")} value={work.role} />

      <Field label={t("thumbnail")}>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="h-11" onClick={() => posterInput.current?.click()} disabled={posterProgress !== null}>
            {posterProgress !== null ? <LuLoaderCircle className="size-4 animate-spin" /> : <LuImagePlus className="size-4" />}
            {posterProgress !== null ? `${Math.round(posterProgress * 100)}%` : t("uploadThumbnail")}
          </Button>
          {work.poster && work.youtubeId ? (
            <Button variant="ghost" className="h-11" onClick={() => set("poster", undefined)}>
              {t("useYoutubeThumbnail")}
            </Button>
          ) : null}
        </div>
        {!work.poster && work.youtubeId ? <p className="text-xs text-neutral-500">{t("usingYoutubeThumbnail")}</p> : null}
        <input
          ref={posterInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            setPosterProgress(0);
            try {
              set("poster", await uploadImage(f, "poster", { onProgress: setPosterProgress }));
            } catch (error) {
              toast.error(error instanceof UnreadableImageError ? t("unreadableImage") : t("uploadFailed"));
            } finally {
              setPosterProgress(null);
            }
          }}
        />
      </Field>

      <Field label={t("loop")} hint={t("loopHint")}>
        {work.loop ? (
          <div className="flex items-center justify-between gap-3 rounded-md border border-white/10 p-3 text-sm">
            <span className="flex items-center gap-2 text-neutral-300">
              <LuFilm className="size-4" />
              {work.loop.duration ? `${work.loop.duration}s` : ""} {work.loop.bytes ? `· ${formatBytes(work.loop.bytes)}` : ""}
            </span>
            <Button variant="ghost" size="sm" className="h-9" onClick={() => set("loop", undefined)}>
              <LuX className="size-4" />
              {t("removeLoop")}
            </Button>
          </div>
        ) : null}
        <Button variant="outline" className="h-11 justify-self-start" onClick={() => loopInput.current?.click()} disabled={loopProgress !== null}>
          {loopProgress !== null ? <LuLoaderCircle className="size-4 animate-spin" /> : <LuFilm className="size-4" />}
          {loopProgress !== null ? `${Math.round(loopProgress * 100)}%` : t("uploadLoop")}
        </Button>
        <input
          ref={loopInput}
          type="file"
          accept="video/mp4,video/webm"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            if (!["video/mp4", "video/webm"].includes(f.type)) return void toast.error(t("loopFormat"));
            if (f.size > LOOP_MAX_BYTES) return void toast.error(t("loopTooBig", { size: formatBytes(f.size) }));
            setLoopProgress(0);
            try {
              set("loop", await uploadLoop(f, setLoopProgress));
            } catch {
              toast.error(t("uploadFailed"));
            } finally {
              setLoopProgress(null);
            }
          }}
        />
      </Field>

      {featured ? (
        <p className={cn("flex items-center gap-2 text-xs text-neutral-400")}>
          <LuStar className="size-3.5" /> {t("featured")}
        </p>
      ) : null}
    </Panel>
  );
}
