"use client";

import { LuArrowLeft, LuArrowRight, LuEye, LuEyeOff, LuSettings2, LuTrash2 } from "react-icons/lu";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { getAt, removeById, stepItem, updateList, type ContentPath } from "@/content/paths";
import type { SiteContent } from "@/content/schema";
import type { EditableItemProps } from "@/components/content/bridge";
import { useEditor, useUi } from "./context";

type Item = { id: string; hidden?: boolean; sample?: boolean };

/** Removes an item, and anything that pointed at it (a featured film, a credited partner). */
export function deleteItem(content: SiteContent, kind: EditableItemProps["kind"], listPath: ContentPath, id: string): SiteContent {
  let next = updateList<SiteContent, Item>(content, listPath, (items) => removeById(items, id));
  if (kind === "partner") {
    next = { ...next, works: next.works.map((w) => (w.partnerId === id ? { ...w, partnerId: undefined } : w)) };
  }
  return next;
}

/**
 * Edit controls around one item of a list: settings, move earlier/later, hide, delete.
 * They appear on hover with a mouse, and stay visible on touch screens.
 */
export function EditableItem({ kind, listPath, id, scopeIds, label, className, onEdit, children }: EditableItemProps) {
  const { store, state, confirm } = useEditor();
  const t = useUi();
  const item = (getAt<Item[]>(state.draft, listPath) ?? []).find((x) => x.id === id);
  const position = scopeIds.indexOf(id);

  const move = (delta: -1 | 1) =>
    store.mutate((c) => updateList<SiteContent, Item>(c, listPath, (items) => stepItem(items, id, delta, scopeIds)));

  const toggleHidden = () =>
    store.mutate((c) =>
      updateList<SiteContent, Item>(c, listPath, (items) => items.map((x) => (x.id === id ? { ...x, hidden: !x.hidden } : x))),
    );

  const remove = async () => {
    const ok = await confirm({
      title: t("deleteTitle", { name: label || t("sample") }),
      body: t("deleteBody"),
      confirm: t("delete"),
      destructive: true,
    });
    if (!ok) return;
    store.mutate((c) => deleteItem(c, kind, listPath, id));
    toast(t("deleted"), { action: { label: t("undo"), onClick: store.undo } });
  };

  const button =
    "grid size-9 place-items-center rounded-full text-white transition-colors hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div data-edit-item={id} className={cn("group/eitem relative", item?.hidden && "opacity-45", className)}>
      {children}
      <div
        className={cn(
          "absolute top-2 right-2 z-30 flex items-center gap-0.5 rounded-full bg-neutral-950/85 p-0.5 shadow-lg ring-1 ring-white/15 backdrop-blur",
          "opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/eitem:opacity-100 [@media(hover:hover)]:group-focus-within/eitem:opacity-100",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {onEdit ? (
          <button type="button" className={button} onClick={onEdit} aria-label={t("details")} title={t("details")}>
            <LuSettings2 className="size-4" />
          </button>
        ) : null}
        {scopeIds.length > 1 ? (
          <>
            <button type="button" className={button} onClick={() => move(-1)} disabled={position <= 0} aria-label={t("moveEarlier")} title={t("moveEarlier")}>
              <LuArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              className={button}
              onClick={() => move(1)}
              disabled={position < 0 || position >= scopeIds.length - 1}
              aria-label={t("moveLater")}
              title={t("moveLater")}
            >
              <LuArrowRight className="size-4" />
            </button>
          </>
        ) : null}
        {kind !== "stat" && kind !== "craft" ? (
          <button
            type="button"
            className={button}
            onClick={toggleHidden}
            aria-label={item?.hidden ? t("show") : t("hide")}
            title={item?.hidden ? t("show") : t("hide")}
          >
            {item?.hidden ? <LuEyeOff className="size-4" /> : <LuEye className="size-4" />}
          </button>
        ) : null}
        <button type="button" className={cn(button, "hover:bg-[#CC0606]")} onClick={remove} aria-label={t("delete")} title={t("delete")}>
          <LuTrash2 className="size-4" />
        </button>
      </div>
      {item?.hidden || item?.sample ? (
        <div className="pointer-events-none absolute top-2 left-2 z-30 flex gap-1.5">
          {item.hidden ? (
            <span className="rounded-full bg-neutral-950/85 px-2.5 py-1 text-[11px] font-medium text-white ring-1 ring-white/20">{t("hidden")}</span>
          ) : null}
          {item.sample ? (
            <span title={t("sampleHint")} className="rounded-full bg-amber-300/90 px-2.5 py-1 text-[11px] font-medium text-neutral-950">
              {t("sample")}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
