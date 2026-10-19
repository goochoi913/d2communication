"use client";

import { useLayoutEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent, type MouseEvent } from "react";
import { LuItalic } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { isFallback } from "@/content/format";
import { getAt } from "@/content/paths";
import type { L10n } from "@/content/schema";
import type { EditableTextProps } from "@/components/content/bridge";
import { parseRich } from "@/components/content/rich-text";
import { useEditor, useUi } from "./context";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Rich text → editable HTML: `*words*` as <em>, line breaks as <br>. */
function toHtml(text: string, rich: boolean) {
  if (!rich) return escape(text).replace(/\n/g, "<br>");
  return parseRich(text)
    .map((line) => line.map((s) => (s.em ? `<em>${escape(s.text)}</em>` : escape(s.text))).join(""))
    .join("<br>");
}

/** Editable HTML → stored text: <em>/<i> back to `*words*`, block breaks to newlines. */
function fromDom(el: HTMLElement, rich: boolean, multiline: boolean): string {
  let out = "";
  const walk = (node: Node, inEm: boolean) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        out += child.textContent ?? "";
        return;
      }
      if (!(child instanceof HTMLElement)) return;
      const tag = child.tagName;
      if (tag === "BR") {
        out += "\n";
        return;
      }
      const block = tag === "DIV" || tag === "P";
      if (block && out && !out.endsWith("\n")) out += "\n";
      const em = rich && !inEm && (tag === "EM" || tag === "I");
      if (em) out += "*";
      walk(child, inEm || em);
      if (em) out += "*";
    });
  };
  walk(el, false);
  out = out.replace(/ /g, " ").replace(/\*\*/g, "");
  if (!multiline) out = out.replace(/\s*\n\s*/g, " ");
  return out.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Text edited in place. Click to type; Enter (single line) or clicking away saves; Esc
 * cancels. In Korean, a field without a translation shows the English in grey until
 * something is typed.
 */
export function EditableText({ path, value, plain, as: As = "span", className, multiline = false, rich = false, placeholder }: EditableTextProps) {
  const { lang, store } = useEditor();
  const t = useUi();
  const ref = useRef<HTMLElement>(null);
  const [focused, setFocused] = useState(false);

  const own = plain ? value.en : value[lang];
  const fallback = !plain && isFallback(value, lang);
  // What shows while not focused: the text, or the English stand-in for a missing translation.
  const shown = fallback ? value.en : own;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || focused) return;
    el.innerHTML = toHtml(shown, rich);
  }, [shown, rich, focused]);

  const commit = () => {
    const el = ref.current;
    if (!el) return;
    const next = fromDom(el, rich, multiline);
    if (next !== own) {
      const target = plain ? path : [...path, lang];
      // A field that never existed gets both languages.
      if (!plain && getAt(store.getState().draft, path) === undefined) {
        store.update(path, { en: next, ko: "" } satisfies L10n);
      } else {
        store.update(target, next);
      }
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (ref.current) ref.current.innerHTML = toHtml(own, rich);
      ref.current?.blur();
      return;
    }
    if (e.key === "Enter" && (!multiline || e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      ref.current?.blur();
      return;
    }
    if (rich && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") {
      e.preventDefault();
      document.execCommand("italic");
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") e.preventDefault();
  };

  return (
    <>
      <As
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        spellCheck
        role="textbox"
        aria-multiline={multiline}
        data-placeholder={fallback ? value.en : (placeholder ?? "…")}
        title={fallback ? t("notTranslated") : undefined}
        onFocus={() => {
          setFocused(true);
          // An untranslated Korean field starts empty, with the English as a hint.
          if (fallback && ref.current) ref.current.innerHTML = "";
        }}
        onBlur={() => {
          commit();
          setFocused(false);
        }}
        onKeyDown={onKeyDown}
        onPaste={(e: ClipboardEvent<HTMLElement>) => {
          e.preventDefault();
          const text = e.clipboardData.getData("text/plain");
          document.execCommand("insertText", false, multiline ? text : text.replace(/\s*\n\s*/g, " "));
        }}
        onClick={(e: MouseEvent<HTMLElement>) => {
          // Editing text inside a link or button must not follow it.
          e.preventDefault();
          e.stopPropagation();
        }}
        className={cn(
          className,
          "d2-editable cursor-text rounded-[2px] outline-1 outline-offset-4 outline-transparent transition-[outline-color] outline-dashed hover:outline-white/45 focus:outline-solid focus:outline-[#EA4E4E]",
          fallback && !focused && "opacity-55",
          "empty:before:pointer-events-none empty:before:text-white/35 empty:before:content-[attr(data-placeholder)]",
        )}
      />
      {focused && rich ? <ItalicHint label={t("italic")} /> : null}
    </>
  );
}

function ItalicHint({ label }: { label: string }) {
  return (
    <button
      type="button"
      // Keep focus (and the selection) in the text while clicking.
      onMouseDown={(e) => {
        e.preventDefault();
        document.execCommand("italic");
      }}
      className="fixed bottom-24 left-1/2 z-[70] inline-flex h-10 -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 text-sm text-neutral-950 shadow-lg md:bottom-28"
    >
      <LuItalic className="size-4" />
      {label}
    </button>
  );
}
