"use client";

import { useState } from "react";
import { LuCheck } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { DEFAULT_FONTS, FONT_PRESETS, FONTS, type FontKind, type FontRole } from "@/content/fonts";
import { Button } from "@/components/ui/button";
import { useEditor, useUi } from "../context";
import { Panel } from "../fields";
import type { UiKey } from "../strings";

const ROLES: { role: FontRole; label: UiKey; sample: string; display: boolean }[] = [
  { role: "koDisplay", label: "koDisplayFont", sample: "이야기가 있는 곳이면 어디든 갑니다", display: true },
  { role: "koText", label: "koTextFont", sample: "방송과 기업, 무대를 위해 만든 50편이 넘는 다큐멘터리와 영상.", display: false },
  { role: "enDisplay", label: "enDisplayFont", sample: "I go where the story is.", display: true },
  { role: "enText", label: "enTextFont", sample: "Documentaries and films for broadcasters, companies and the stage.", display: false },
];

const KINDS: { kind: FontKind; label: UiKey }[] = [
  { kind: "serif", label: "fontSerif" },
  { kind: "sans", label: "fontSans" },
  { kind: "display", label: "fontDisplay" },
];

/** Every font for each of the four type roles, previewed in its own face. */
export function FontPanel({ onClose }: { onClose: () => void }) {
  const { state, store, ui } = useEditor();
  const t = useUi();
  const choice = state.draft.settings.fonts;
  const [tab, setTab] = useState<FontRole>("koDisplay");
  const role = ROLES.find((r) => r.role === tab)!;
  const script = tab.startsWith("ko") ? "ko" : "en";
  const set = (r: FontRole, id: string) => store.update(["settings", "fonts", r], id);

  return (
    <Panel title={t("fonts")} description={t("fontsHint")} onClose={onClose} footer={<Button className="h-11 w-full" onClick={onClose}>{t("done")}</Button>}>
      {/* Load every option once, so the list can show each font in its own face. */}
      {FONTS.filter((f) => f.css).map((f) => (
        <link key={f.id} rel="stylesheet" href={f.css} precedence="fonts" />
      ))}

      <section className="grid gap-2">
        <p className="text-[13px] font-medium text-neutral-300">{t("fontPresets")}</p>
        <div className="grid gap-2">
          {FONT_PRESETS.map((preset) => {
            const active = (Object.keys(preset.fonts) as FontRole[]).every((k) => preset.fonts[k] === choice[k]);
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => store.update(["settings", "fonts"], preset.fonts)}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-md border p-3.5 text-left text-[15px] transition-colors",
                  active ? "border-white bg-white/[0.06]" : "border-white/10 hover:border-white/30",
                )}
              >
                {preset.name[ui]}
                {active ? <LuCheck className="size-4" /> : null}
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-1 rounded-lg bg-white/5 p-1" role="tablist">
        {ROLES.map((r) => (
          <button
            key={r.role}
            type="button"
            role="tab"
            aria-selected={tab === r.role}
            onClick={() => setTab(r.role)}
            className={cn("h-10 rounded-md text-[13px] transition-colors", tab === r.role ? "bg-white text-neutral-950" : "text-neutral-300 hover:text-white")}
          >
            {t(r.label)}
          </button>
        ))}
      </div>

      {KINDS.map(({ kind, label }) => {
        const options = FONTS.filter((f) => f.script === script && f.kind === kind);
        if (!options.length) return null;
        return (
          <section key={kind} className="grid gap-2">
            <p className="text-xs font-medium tracking-wide text-neutral-500">{t(label)}</p>
            {options.map((f) => {
              const active = choice[tab] === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => set(tab, f.id)}
                  aria-pressed={active}
                  className={cn(
                    "grid gap-1.5 rounded-md border p-3.5 text-left transition-colors",
                    active ? "border-white bg-white/[0.06]" : "border-white/10 hover:border-white/30",
                  )}
                >
                  <span className="flex items-center justify-between gap-3 text-[13px] text-neutral-400">
                    <span>
                      {f.name}
                      {f.id === DEFAULT_FONTS[tab] ? <span className="ml-2 text-neutral-600">· {t("fontDefault")}</span> : null}
                    </span>
                    {active ? <LuCheck className="size-4 shrink-0 text-white" /> : null}
                  </span>
                  <span
                    className={cn("text-neutral-50", role.display ? "text-[1.45rem] leading-snug font-light" : "text-[15px] leading-relaxed")}
                    style={{ fontFamily: f.family }}
                    lang={script}
                  >
                    {role.sample}
                  </span>
                  {f.note ? <span className="text-[11px] text-neutral-600">{f.note[ui]}</span> : null}
                </button>
              );
            })}
          </section>
        );
      })}
    </Panel>
  );
}
