"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LuFilm, LuHistory, LuLoaderCircle, LuRotateCcw, LuSearch, LuX } from "react-icons/lu";
import { toast } from "sonner";

import { tr } from "@/content/format";
import { TEXT_DEFAULTS, type TextKey } from "@/content/text-defaults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditor, useUi } from "../context";
import { Field, L10nField, Panel, SwitchRow, TextInput } from "../fields";
import { formatBytes, LOOP_MAX_BYTES, uploadLoop } from "../media/upload";
import type { VersionInfo } from "../store";

export function SettingsPanel({ onClose, onAllText }: { onClose: () => void; onAllText: () => void }) {
  const { state, store, lang } = useEditor();
  const t = useUi();
  const { settings } = state.draft;
  const [loopProgress, setLoopProgress] = useState<number | null>(null);
  const loopInput = useRef<HTMLInputElement>(null);
  const works = state.draft.works.filter((w) => !w.hidden);

  return (
    <Panel title={t("settings")} onClose={onClose} footer={<Button className="h-11 w-full" onClick={onClose}>{t("done")}</Button>}>
      <Field label={t("contactEmail")}>
        <TextInput
          value={settings.contactEmail}
          inputMode="email"
          validate={(v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "name@example.com")}
          onCommit={(v) => store.update(["settings", "contactEmail"], v)}
        />
      </Field>
      <Field label={t("featuredFilm")}>
        <Select value={settings.featuredWorkId || undefined} onValueChange={(v) => store.update(["settings", "featuredWorkId"], v)}>
          <SelectTrigger className="h-11 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark max-h-80">
            {works.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {tr(w.title, lang)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <SwitchRow label={t("koToggle")} hint={t("koToggleHint")} checked={settings.koEnabled} onChange={(v) => store.update(["settings", "koEnabled"], v)} />
      <SwitchRow label={t("search")} hint={t("searchHint")} checked={settings.searchVisible} onChange={(v) => store.update(["settings", "searchVisible"], v)} />
      <Field label={t("heroLoop")} hint={t("loopHint")}>
        {settings.heroLoop ? (
          <div className="flex items-center justify-between gap-3 rounded-md border border-white/10 p-3 text-sm text-neutral-300">
            <span className="flex items-center gap-2">
              <LuFilm className="size-4" />
              {settings.heroLoop.bytes ? formatBytes(settings.heroLoop.bytes) : ""}
            </span>
            <Button variant="ghost" size="sm" className="h-9" onClick={() => store.update(["settings", "heroLoop"], undefined)}>
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
              store.update(["settings", "heroLoop"], await uploadLoop(f, setLoopProgress));
            } catch {
              toast.error(t("uploadFailed"));
            } finally {
              setLoopProgress(null);
            }
          }}
        />
      </Field>
      <L10nField label={t("pageTitle")} path={["text", "meta.title"]} value={state.draft.text["meta.title"]} />
      <L10nField label={t("pageDescription")} path={["text", "meta.description"]} value={state.draft.text["meta.description"]} multiline />
      <Button variant="outline" className="h-11" onClick={onAllText}>
        {t("allText")}
      </Button>
    </Panel>
  );
}

/** Every fixed text on the site in one searchable list, including labels that aren't clickable on the page. */
export function AllTextPanel({ onClose }: { onClose: () => void }) {
  const { state } = useEditor();
  const t = useUi();
  const [query, setQuery] = useState("");
  const keys = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (Object.keys(TEXT_DEFAULTS) as TextKey[]).filter((k) => {
      if (!q) return true;
      const v = state.draft.text[k];
      return k.includes(q) || v.en.toLowerCase().includes(q) || v.ko.toLowerCase().includes(q);
    });
  }, [query, state.draft.text]);

  return (
    <Panel title={t("allText")} onClose={onClose} footer={<Button className="h-11 w-full" onClick={onClose}>{t("done")}</Button>}>
      <div className="relative">
        <LuSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} className="h-11 pl-9" placeholder="…" />
      </div>
      {keys.map((k) => (
        <L10nField key={k} label={k} path={["text", k]} value={state.draft.text[k]} multiline={TEXT_DEFAULTS[k].en.length > 60} />
      ))}
    </Panel>
  );
}

export function HistoryPanel({ onClose }: { onClose: () => void }) {
  const { store, state, ui, confirm } = useEditor();
  const t = useUi();
  const [versions, setVersions] = useState<VersionInfo[] | null>(null);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState<number | null>(null);

  useEffect(() => {
    store.listVersions().then(setVersions, () => setError(true));
  }, [store, state.publishedVersion]);

  const format = (iso: string | null) =>
    iso ? new Intl.DateTimeFormat(ui === "ko" ? "ko-KR" : "en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso)) : "";

  const restore = async (v: VersionInfo) => {
    const ok = await confirm({ title: t("restoreTitle"), body: t("restoreBody"), confirm: t("restore") });
    if (!ok) return;
    setBusy(v.version);
    try {
      await store.restore(v.version);
      toast.success(t("restored"));
      onClose();
    } catch {
      toast.error(t("uploadFailed"));
    } finally {
      setBusy(null);
    }
  };

  return (
    <Panel title={t("historyTitle")} onClose={onClose}>
      {state.unpublished ? (
        <Button
          variant="outline"
          className="h-11"
          onClick={async () => {
            const ok = await confirm({ title: t("discardTitle"), body: t("discardBody"), confirm: t("discard"), destructive: true });
            if (ok) {
              store.discard();
              toast(t("discarded"), { action: { label: t("undo"), onClick: store.undo } });
            }
          }}
        >
          <LuRotateCcw className="size-4" />
          {t("discard")}
        </Button>
      ) : null}
      {error ? <p className="text-sm text-[#EA4E4E]">{t("uploadFailed")}</p> : null}
      {!versions && !error ? <LuLoaderCircle className="mx-auto size-6 animate-spin text-neutral-500" /> : null}
      {versions?.length === 0 ? <p className="text-sm text-neutral-400">{t("historyEmpty")}</p> : null}
      <ol className="grid gap-2">
        {versions?.map((v) => (
          <li key={v.version} className="flex items-center justify-between gap-3 rounded-md border border-white/10 p-3.5">
            <div className="grid gap-0.5">
              <span className="flex items-center gap-2 text-[15px] text-neutral-100">
                <LuHistory className="size-4 text-neutral-500" />v{v.version}
                {v.version === state.publishedVersion ? (
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-neutral-950">{t("live")}</span>
                ) : null}
              </span>
              <span className="text-xs text-neutral-500">
                {format(v.publishedAt)} · {v.publishedBy}
              </span>
            </div>
            {v.version !== state.publishedVersion || state.unpublished ? (
              <Button variant="ghost" className="h-10" onClick={() => restore(v)} disabled={busy !== null}>
                {busy === v.version ? <LuLoaderCircle className="size-4 animate-spin" /> : <LuRotateCcw className="size-4" />}
                {t("restore")}
              </Button>
            ) : null}
          </li>
        ))}
      </ol>
    </Panel>
  );
}
