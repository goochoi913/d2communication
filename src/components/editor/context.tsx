"use client";

import type { Lang } from "@/content/schema";
import type { PanelRequest } from "@/components/content/bridge";
import { useSite } from "@/components/content/site-context";
import type { DraftStore, EditorState } from "./store";
import { UI, type UiKey, type UiLang } from "./strings";

export type ConfirmOptions = {
  title: string;
  body?: string;
  confirm: string;
  destructive?: boolean;
};

export type EditorApi = {
  store: DraftStore;
  state: EditorState;
  /** Language of the page being edited. */
  lang: Lang;
  /** Language of edit mode's own buttons and panels. */
  ui: UiLang;
  setUi: (ui: UiLang) => void;
  email: string;
  openPanel: (panel: PanelRequest) => void;
  closePanel: () => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

/**
 * Edit mode's API travels inside the bridge, so the editable pieces rendered deep in the
 * site and the toolbar rendered beside it both reach it through the same site context.
 */
export function useEditor(): EditorApi {
  const { bridge } = useSite();
  const api = bridge?.api as EditorApi | undefined;
  if (!api) throw new Error("useEditor must be used inside edit mode");
  return api;
}

/** Edit mode's interface text in the chosen interface language, with `{name}` placeholders filled. */
export function useUi() {
  const { ui } = useEditor();
  return (key: UiKey, vars?: Record<string, string | number>) => {
    let text: string = UI[key][ui];
    if (vars) for (const [k, v] of Object.entries(vars)) text = text.replace(`{${k}}`, String(v));
    return text;
  };
}

export function uiText(ui: UiLang, key: UiKey) {
  return UI[key][ui];
}
