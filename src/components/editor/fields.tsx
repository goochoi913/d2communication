"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { ContentPath } from "@/content/paths";
import type { L10n } from "@/content/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEditor, useUi } from "./context";

const mobileQuery = "(max-width: 767px)";
export function useIsMobile() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(mobileQuery);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(mobileQuery).matches,
    () => false,
  );
}

/** A settings panel: from the right on desktop, from the bottom on phones. */
export function Panel({ title, description, onClose, children, footer }: {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const mobile = useIsMobile();
  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side={mobile ? "bottom" : "right"}
        data-lenis-prevent
        // Keep the page visible beside the panel, so every change shows up live.
        overlayClassName="bg-transparent supports-backdrop-filter:backdrop-blur-none"
        className={cn(
          "dark gap-0 border-white/10 bg-neutral-950 p-0 text-neutral-50",
          "data-[side=right]:w-[440px] data-[side=right]:sm:max-w-[440px]",
          "data-[side=bottom]:max-h-[88svh] data-[side=bottom]:rounded-t-2xl",
        )}
      >
        <SheetHeader className="border-b border-white/10 px-5 py-4 pr-14">
          <SheetTitle className="text-base">{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          <div className="grid gap-6">{children}</div>
        </div>
        {footer ? <div className="border-t border-white/10 px-5 py-4">{footer}</div> : null}
      </SheetContent>
    </Sheet>
  );
}

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor} className="text-[13px] text-neutral-300">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-xs leading-relaxed text-neutral-500">{hint}</p> : null}
    </div>
  );
}

/**
 * A text input that saves when you leave it (or press Enter), not on every keystroke,
 * so each finished edit is one undo step.
 */
export function TextInput({ value, onCommit, multiline, id, placeholder, inputMode, className, validate }: {
  value: string;
  onCommit: (v: string) => void;
  multiline?: boolean;
  id?: string;
  placeholder?: string;
  inputMode?: "url" | "email" | "text" | "numeric";
  className?: string;
  /** Returns an error message, or null when the value is fine. */
  validate?: (v: string) => string | null;
}) {
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- follow outside changes (undo, other fields)
  useEffect(() => setDraft(value), [value]);

  const commit = () => {
    const v = draft.trim();
    const problem = validate?.(v) ?? null;
    setError(problem);
    if (!problem && v !== value) onCommit(v);
  };

  const props = {
    id,
    value: draft,
    placeholder,
    onChange: (e: { target: { value: string } }) => setDraft(e.target.value),
    onBlur: commit,
    "aria-invalid": !!error,
  };

  return (
    <>
      {multiline ? (
        <Textarea {...props} rows={3} className={cn("min-h-20 text-[15px]", className)} />
      ) : (
        <Input
          {...props}
          inputMode={inputMode}
          onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
          className={cn("h-11 text-[15px]", className)}
        />
      )}
      {error ? <p className="text-sm text-[#EA4E4E]">{error}</p> : null}
    </>
  );
}

/** English and Korean versions of one text, side by side. */
export function L10nField({ label, path, value, multiline, hint }: { label: string; path: ContentPath; value: L10n; multiline?: boolean; hint?: string }) {
  const { store } = useEditor();
  const t = useUi();
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-[13px] font-medium text-neutral-300">{label}</legend>
      <div className="grid gap-2">
        <div className="flex items-start gap-2">
          <span className="mt-3 w-7 shrink-0 text-[11px] font-medium text-neutral-500">EN</span>
          <div className="min-w-0 flex-1">
            <TextInput value={value.en} multiline={multiline} onCommit={(v) => store.update([...path, "en"], v)} placeholder={t("english")} />
          </div>
        </div>
        <div className="flex items-start gap-2" lang="ko">
          <span className="mt-3 w-7 shrink-0 text-[11px] font-medium text-neutral-500">KO</span>
          <div className="min-w-0 flex-1">
            <TextInput value={value.ko} multiline={multiline} onCommit={(v) => store.update([...path, "ko"], v)} placeholder={value.en || t("korean")} />
          </div>
        </div>
      </div>
      {hint ? <p className="text-xs leading-relaxed text-neutral-500">{hint}</p> : null}
    </fieldset>
  );
}

export function SwitchRow({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-md border border-white/10 p-3.5">
      <span className="grid gap-1">
        <span className="text-[15px] text-neutral-100">{label}</span>
        {hint ? <span className="text-xs leading-relaxed text-neutral-500">{hint}</span> : null}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} className="mt-0.5" />
    </label>
  );
}

/** Radio-style choice as large tappable cards. */
export function Choice<T extends string>({ value, options, onChange }: {
  value: T;
  options: { value: T; label: string; hint?: string; icon?: ReactNode }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" className="grid gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex items-start gap-3 rounded-md border p-3.5 text-left transition-colors",
            value === o.value ? "border-white bg-white/[0.06]" : "border-white/10 hover:border-white/30",
          )}
        >
          <span className={cn("mt-1 grid size-4 shrink-0 place-items-center rounded-full border", value === o.value ? "border-white" : "border-white/40")}>
            {value === o.value ? <span className="size-2 rounded-full bg-white" /> : null}
          </span>
          <span className="grid gap-1">
            <span className="flex items-center gap-2 text-[15px] text-neutral-100">
              {o.icon}
              {o.label}
            </span>
            {o.hint ? <span className="text-xs leading-relaxed text-neutral-500">{o.hint}</span> : null}
          </span>
        </button>
      ))}
    </div>
  );
}
