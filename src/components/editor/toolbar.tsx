"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LuALargeSmall,
  LuCheck,
  LuCircleHelp,
  LuCloudOff,
  LuEllipsis,
  LuEye,
  LuHistory,
  LuLanguages,
  LuLoaderCircle,
  LuLogOut,
  LuPencil,
  LuRedo2,
  LuRotateCcw,
  LuSettings2,
  LuType,
  LuUndo2,
  LuUpload,
} from "react-icons/lu";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { tr } from "@/content/format";
import { otherLangPath, pagePath } from "@/content/select";
import type { CategorySlug } from "@/content/schema";
import { D2Mark } from "@/components/brand/d2-mark";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditor, useUi } from "./context";

/**
 * Edit mode's control bar, floating at the bottom of every page: the Edit/Preview switch,
 * undo/redo, save status, Publish, and a menu for pages, settings, history and sign-out.
 */
export function Toolbar({
  editing,
  onEditing,
  onPanel,
  onSignOut,
  onHelp,
  hidden = false,
}: {
  /** Out of the way while a panel is open (the panel has its own Done button). */
  hidden?: boolean;
  editing: boolean;
  onEditing: (v: boolean) => void;
  onPanel: (panel: "settings" | "history" | "alltext" | "fonts") => void;
  onSignOut: () => void;
  onHelp: () => void;
}) {
  const { state, store, lang, ui, setUi, confirm } = useEditor();
  const t = useUi();
  const [justPublished, setJustPublished] = useState(false);
  const slug = typeof window !== "undefined" ? (window.location.pathname.replace(/^\/ko/, "").split("/")[1] as CategorySlug) || undefined : undefined;

  const publish = async () => {
    if (!state.unpublished) return void toast(t("nothingToPublish"));
    const ok = await confirm({ title: t("publishConfirmTitle"), body: t("publishConfirmBody"), confirm: t("publish") });
    if (!ok) return;
    try {
      await store.publish();
      setJustPublished(true);
      setTimeout(() => setJustPublished(false), 2500);
      toast.success(t("published"));
    } catch (error) {
      console.error(error);
      toast.error(t("uploadFailed"));
    }
  };

  const status =
    state.save === "saving" || state.save === "pending"
      ? { icon: <LuLoaderCircle className="size-3.5 animate-spin" />, text: t("saving") }
      : state.save === "offline"
        ? { icon: <LuCloudOff className="size-3.5" />, text: t("offline") }
        : state.save === "error"
          ? { icon: <LuCloudOff className="size-3.5" />, text: t("saveFailed") }
          : state.unpublished
            ? { icon: <span className="size-2 rounded-full bg-amber-300" />, text: t("unpublished") }
            : { icon: <LuCheck className="size-3.5" />, text: t("allPublished") };

  const round = "grid size-11 shrink-0 place-items-center rounded-full text-neutral-200 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div
      data-lenis-prevent
      className={cn(
        "fixed inset-x-0 bottom-0 z-[55] flex justify-center px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-[opacity,translate] duration-300 md:pb-5",
        hidden && "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <div className="dark flex max-w-full items-center gap-1 rounded-full bg-neutral-900/95 p-1.5 text-sm text-neutral-100 shadow-[0_10px_40px_-8px_rgba(0,0,0,0.8)] ring-1 ring-white/15 backdrop-blur-xl">
        <span className="hidden items-center gap-2 pr-1 pl-3 md:flex">
          <D2Mark title="" className="h-4 w-auto" />
        </span>

        <div className="flex rounded-full bg-black/40 p-0.5" role="group">
          <button
            type="button"
            onClick={() => onEditing(true)}
            aria-pressed={editing}
            className={cn("inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 transition-colors", editing ? "bg-white text-neutral-950" : "text-neutral-300 hover:text-white")}
          >
            <LuPencil className="size-4" />
            <span className="hidden sm:inline">{t("edit")}</span>
          </button>
          <button
            type="button"
            onClick={() => onEditing(false)}
            aria-pressed={!editing}
            className={cn("inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 transition-colors", !editing ? "bg-white text-neutral-950" : "text-neutral-300 hover:text-white")}
          >
            <LuEye className="size-4" />
            <span className="hidden sm:inline">{t("preview")}</span>
          </button>
        </div>

        <button type="button" className={round} onClick={store.undo} disabled={!state.canUndo} aria-label={t("undo")} title={t("undo")}>
          <LuUndo2 className="size-[18px]" />
        </button>
        <button type="button" className={cn(round, "hidden sm:grid")} onClick={store.redo} disabled={!state.canRedo} aria-label={t("redo")} title={t("redo")}>
          <LuRedo2 className="size-[18px]" />
        </button>

        <span className="hidden items-center gap-1.5 px-2 text-xs whitespace-nowrap text-neutral-400 lg:flex" aria-live="polite">
          {status.icon}
          {status.text}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger className={round} aria-label={t("more")}>
            <LuEllipsis className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end" className="dark w-64" data-lenis-prevent>
            <DropdownMenuLabel className="flex items-center gap-2 text-xs font-normal text-neutral-400 lg:hidden">
              {status.icon}
              {status.text}
            </DropdownMenuLabel>
            <DropdownMenuLabel>{t("pages")}</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={pagePath(lang)}>{t("home")}</Link>
            </DropdownMenuItem>
            {state.draft.categories.map((c) => (
              <DropdownMenuItem key={c.slug} asChild>
                <Link href={pagePath(lang, c.slug)}>{tr(c.name, lang)}</Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem asChild>
              <Link href={otherLangPath(lang, slug)}>
                <LuLanguages className="size-4" />
                {t("pageLanguage")}: {lang === "ko" ? "English" : "한국어"}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onPanel("settings")}>
              <LuSettings2 className="size-4" />
              {t("settings")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onPanel("fonts")}>
              <LuALargeSmall className="size-4" />
              {t("fonts")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onPanel("alltext")}>
              <LuType className="size-4" />
              {t("allText")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onPanel("history")}>
              <LuHistory className="size-4" />
              {t("history")}
            </DropdownMenuItem>
            {state.unpublished ? (
              <DropdownMenuItem
                onSelect={async () => {
                  const ok = await confirm({ title: t("discardTitle"), body: t("discardBody"), confirm: t("discard"), destructive: true });
                  if (ok) {
                    store.discard();
                    toast(t("discarded"), { action: { label: t("undo"), onClick: store.undo } });
                  }
                }}
              >
                <LuRotateCcw className="size-4" />
                {t("discard")}
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setUi(ui === "ko" ? "en" : "ko")}>
              <LuLanguages className="size-4" />
              {t("uiLanguage")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onHelp}>
              <LuCircleHelp className="size-4" />
              {t("help")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onSignOut}>
              <LuLogOut className="size-4" />
              {t("signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={publish}
          disabled={state.publishing || !state.ready}
          className={cn(
            "relative inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-5 font-medium transition-colors",
            state.unpublished ? "bg-[#CC0606] text-white hover:bg-[#b00505]" : "bg-white/10 text-neutral-300",
          )}
        >
          {state.publishing ? <LuLoaderCircle className="size-4 animate-spin" /> : justPublished ? <LuCheck className="size-4" /> : <LuUpload className="size-4" />}
          {state.publishing ? t("publishing") : t("publish")}
        </button>
      </div>
    </div>
  );
}
