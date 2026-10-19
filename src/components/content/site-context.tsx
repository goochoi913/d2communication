"use client";

import { createContext, use, useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";

import { normalizeContent } from "@/content/normalize";
import type { ContentSnapshot, Lang, SiteContent } from "@/content/schema";
import { PUBLISHED_DOC_URL } from "@/lib/head-scripts";
import type { EditorBridge } from "./bridge";

/** Set after a successful sign-in, so only an editor's browser ever downloads edit mode. */
export const EDITOR_FLAG = "d2.editor";

type FirestoreDoc = {
  fields?: {
    json?: { stringValue?: string };
    version?: { integerValue?: string };
    publishedAt?: { timestampValue?: string };
  };
};

function decodePublished(doc: FirestoreDoc | null): ContentSnapshot | null {
  const json = doc?.fields?.json?.stringValue;
  if (!json) return null;
  try {
    return {
      version: Number(doc.fields?.version?.integerValue ?? 0),
      publishedAt: doc.fields?.publishedAt?.timestampValue ?? null,
      content: normalizeContent(JSON.parse(json)),
    };
  } catch {
    return null;
  }
}

type EditorRootProps = {
  lang: Lang;
  published: ContentSnapshot;
  register: (bridge: EditorBridge | null) => void;
  entry: boolean;
};

type SiteState = {
  content: SiteContent;
  lang: Lang;
  /** Edit affordances are on. */
  editing: boolean;
  bridge: EditorBridge | null;
  /** The version visitors currently see. */
  published: ContentSnapshot;
};

const SiteContext = createContext<SiteState | null>(null);

export function useSite(): SiteState {
  const state = use(SiteContext);
  if (!state) throw new Error("useSite must be used inside <SiteProvider>");
  return state;
}

/**
 * Holds the content for the whole page. Visitors get the version baked into the HTML,
 * replaced by a newer published version from Firestore if there is one. A signed-in
 * editor gets their draft instead, through the edit-mode bridge.
 */
export function SiteProvider({
  snapshot,
  lang,
  editorEntry = false,
  children,
}: {
  snapshot: ContentSnapshot;
  lang: Lang;
  /** The /edit page: always load edit mode (it shows the sign-in). */
  editorEntry?: boolean;
  children: ReactNode;
}) {
  const [live, setLive] = useState<ContentSnapshot | null>(null);
  const [bridge, setBridge] = useState<EditorBridge | null>(null);
  const [EditorRoot, setEditorRoot] = useState<ComponentType<EditorRootProps> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const w = window as unknown as { __d2live?: Promise<FirestoreDoc | null> };
    const pending =
      w.__d2live ??
      fetch(PUBLISHED_DOC_URL, { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);
    pending.then((doc) => {
      const fresh = decodePublished(doc);
      if (!cancelled && fresh && fresh.version > snapshot.version) setLive(fresh);
    });
    return () => {
      cancelled = true;
    };
  }, [snapshot.version]);

  useEffect(() => {
    let wanted = editorEntry;
    try {
      wanted ||= localStorage.getItem(EDITOR_FLAG) === "1";
    } catch {
      // storage blocked: visitors only
    }
    if (!wanted) return;
    import("@/components/editor/editor-root").then((m) => setEditorRoot(() => m.EditorRoot));
  }, [editorEntry]);

  const published = live ?? snapshot;
  const value = useMemo<SiteState>(
    () => ({
      content: bridge?.content ?? published.content,
      lang,
      editing: !!bridge?.editing,
      bridge,
      published,
    }),
    [bridge, published, lang],
  );

  return (
    <SiteContext value={value}>
      {children}
      {EditorRoot ? <EditorRoot lang={lang} published={published} register={setBridge} entry={editorEntry} /> : null}
    </SiteContext>
  );
}
