import {
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  type DocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

import { normalizeContent } from "@/content/normalize";
import { setAt, type ContentPath } from "@/content/paths";
import type { ContentSnapshot, SiteContent } from "@/content/schema";
import { firebase, USE_EMULATORS } from "./firebase";

export type SaveState = "saved" | "pending" | "saving" | "error" | "offline";

export type EditorState = {
  /** The draft has loaded (or been created from the published version). */
  ready: boolean;
  draft: SiteContent;
  canUndo: boolean;
  canRedo: boolean;
  save: SaveState;
  /** The draft differs from what visitors see. */
  unpublished: boolean;
  publishedVersion: number;
  publishing: boolean;
  /** Another device saved a newer draft while this one had unsaved changes. */
  conflict: { content: SiteContent; rev: number } | null;
};

export type VersionInfo = { version: number; publishedAt: string | null; publishedBy: string };

const SAVE_DELAY = 900;
const MAX_UNDO = 120;
/** Firestore documents are capped at 1 MiB. */
const MAX_JSON = 990_000;

type DraftDoc = { json: string; rev: number; baseVersion: number; updatedBy?: string };
type PublishedDoc = { json: string; version: number };

const parse = (json: string) => normalizeContent(JSON.parse(json));

/**
 * Edit mode's working copy. Every change lands in the local draft immediately, goes on the
 * undo stack, and is saved to Firestore (`content/draft`) a moment later. Publish copies the
 * draft to `content/published` and records it in `versions/` in one transaction.
 */
export class DraftStore {
  private state: EditorState;
  private listeners = new Set<() => void>();
  private undoStack: SiteContent[] = [];
  private redoStack: SiteContent[] = [];
  /** `rev` of the draft document as last seen or written. */
  private rev = 0;
  private baseVersion: number;
  private publishedJson: string;
  private lastWrittenJson = "";
  private dirty = false;
  private saving: Promise<void> | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private unsubs: Unsubscribe[] = [];

  constructor(
    private email: string,
    published: ContentSnapshot,
  ) {
    this.baseVersion = published.version;
    this.publishedJson = JSON.stringify(published.content);
    this.state = {
      ready: false,
      draft: published.content,
      canUndo: false,
      canRedo: false,
      save: "saved",
      unpublished: false,
      publishedVersion: published.version,
      publishing: false,
      conflict: null,
    };
  }

  // ── subscription (useSyncExternalStore) ────────────────────────────────────

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  getState = () => this.state;

  private set(patch: Partial<EditorState>) {
    this.state = { ...this.state, ...patch };
    this.state.unpublished = JSON.stringify(this.state.draft) !== this.publishedJson;
    this.listeners.forEach((fn) => fn());
  }

  // ── lifecycle ──────────────────────────────────────────────────────────────

  start() {
    const { db } = firebase();
    this.unsubs.push(
      onSnapshot(doc(db, "content/published"), (snap) => {
        if (!snap.exists()) return;
        const data = snap.data() as PublishedDoc;
        this.publishedJson = JSON.stringify(parse(data.json));
        this.set({ publishedVersion: data.version });
      }),
      onSnapshot(
        doc(db, "content/draft"),
        (snap) => this.onRemoteDraft(snap),
        () => this.set({ ready: true }),
      ),
    );
    const flushSoon = () => document.visibilityState === "hidden" && void this.flush();
    document.addEventListener("visibilitychange", flushSoon);
    window.addEventListener("online", this.retry);
    window.addEventListener("beforeunload", this.warnUnsaved);
    this.unsubs.push(() => {
      document.removeEventListener("visibilitychange", flushSoon);
      window.removeEventListener("online", this.retry);
      window.removeEventListener("beforeunload", this.warnUnsaved);
    });
  }

  stop() {
    this.unsubs.forEach((u) => u());
    this.unsubs = [];
    if (this.timer) clearTimeout(this.timer);
  }

  private warnUnsaved = (e: BeforeUnloadEvent) => {
    if (this.dirty || this.saving) e.preventDefault();
  };

  private retry = () => {
    if (this.dirty) this.schedule(0);
  };

  private onRemoteDraft(snap: DocumentSnapshot) {
    if (!snap.exists()) {
      // No draft yet: start from what visitors see.
      if (!this.state.ready) this.set({ ready: true });
      return;
    }
    const data = snap.data() as DraftDoc;
    if (data.json === this.lastWrittenJson) {
      this.rev = Math.max(this.rev, data.rev);
      if (!this.state.ready) this.set({ ready: true });
      return;
    }
    if (data.rev <= this.rev && this.state.ready) return;
    const content = parse(data.json);
    if (this.dirty || this.saving) {
      this.set({ conflict: { content, rev: data.rev }, ready: true });
      return;
    }
    this.rev = data.rev;
    this.baseVersion = data.baseVersion;
    this.set({ draft: content, ready: true });
  }

  // ── editing ────────────────────────────────────────────────────────────────

  /** Replace the value at `path`. Editing a placeholder item marks it as real content. */
  update = (path: ContentPath, value: unknown) =>
    this.mutate((c) => {
      const next = setAt(c, path, value);
      const [list, item] = path;
      const inItem = typeof item === "string" && item.startsWith("#") && path.length > 2 && list !== "categories";
      return inItem && path[2] !== "hidden" ? setAt(next, [list, item, "sample"], undefined) : next;
    });

  /** Apply any change to the draft as one undoable step. */
  mutate = (fn: (content: SiteContent) => SiteContent) => {
    const before = this.state.draft;
    const after = fn(before);
    if (after === before) return;
    this.undoStack.push(before);
    if (this.undoStack.length > MAX_UNDO) this.undoStack.shift();
    this.redoStack = [];
    this.change(after);
  };

  undo = () => {
    const prev = this.undoStack.pop();
    if (!prev) return;
    this.redoStack.push(this.state.draft);
    this.change(prev);
  };

  redo = () => {
    const next = this.redoStack.pop();
    if (!next) return;
    this.undoStack.push(this.state.draft);
    this.change(next);
  };

  private change(draft: SiteContent) {
    this.dirty = true;
    this.set({ draft, canUndo: this.undoStack.length > 0, canRedo: this.redoStack.length > 0, save: "pending" });
    this.schedule(SAVE_DELAY);
  }

  private schedule(delay: number) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => void this.flush(), delay);
  }

  // ── saving ─────────────────────────────────────────────────────────────────

  /** Saves pending changes now (and waits for any save in flight). */
  flush = async (): Promise<void> => {
    if (this.timer) clearTimeout(this.timer);
    if (this.saving) await this.saving;
    if (!this.dirty || this.state.conflict) return;
    this.saving = this.write().finally(() => (this.saving = null));
    return this.saving;
  };

  private async write() {
    const { db } = firebase();
    const draft = this.state.draft;
    const json = JSON.stringify(draft);
    if (json.length > MAX_JSON) {
      this.set({ save: "error" });
      throw new Error("The site's content has grown too large to save in one piece.");
    }
    if (!navigator.onLine) {
      this.set({ save: "offline" });
      return;
    }
    this.set({ save: "saving" });
    this.dirty = false;
    try {
      const ref = doc(db, "content/draft");
      let conflict: { content: SiteContent; rev: number } | null = null;
      let written = this.rev;
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        const remote = snap.exists() ? (snap.data() as DraftDoc) : null;
        const remoteRev = remote?.rev ?? 0;
        if (remote && remoteRev !== this.rev && remote.json !== json) {
          conflict = { content: parse(remote.json), rev: remoteRev };
          return;
        }
        this.lastWrittenJson = json;
        written = remoteRev + 1;
        tx.set(ref, {
          json,
          rev: written,
          baseVersion: this.baseVersion,
          updatedAt: serverTimestamp(),
          updatedBy: this.email,
        });
      });
      if (conflict) {
        this.dirty = true;
        this.set({ conflict, save: "pending" });
        return;
      }
      // The snapshot listener may have seen this write already.
      this.rev = Math.max(this.rev, written);
      // Edits made while this save was in flight still need saving.
      this.set({ save: this.dirty ? "pending" : "saved" });
      if (this.dirty) this.schedule(SAVE_DELAY);
    } catch (error) {
      this.dirty = true;
      this.set({ save: navigator.onLine ? "error" : "offline" });
      this.schedule(4000);
      console.error("Draft save failed", error);
    }
  }

  /** After a conflict: keep this screen's draft (overwrite the other device's) or adopt theirs. */
  resolveConflict = (keepMine: boolean) => {
    const conflict = this.state.conflict;
    if (!conflict) return;
    this.rev = conflict.rev;
    if (keepMine) {
      this.dirty = true;
      this.set({ conflict: null, save: "pending" });
      void this.flush();
    } else {
      this.dirty = false;
      this.undoStack.push(this.state.draft);
      this.set({ conflict: null, draft: conflict.content, save: "saved", canUndo: true });
    }
  };

  // ── publishing and history ─────────────────────────────────────────────────

  publish = async () => {
    const { db } = firebase();
    this.set({ publishing: true });
    try {
      await this.flush();
      const json = JSON.stringify(this.state.draft);
      let version = 0;
      let written = this.rev;
      await runTransaction(db, async (tx) => {
        const pubRef = doc(db, "content/published");
        const draftRef = doc(db, "content/draft");
        const [pub, draft] = [await tx.get(pubRef), await tx.get(draftRef)];
        version = (pub.exists() ? (pub.data() as PublishedDoc).version : 0) + 1;
        const draftRev = draft.exists() ? (draft.data() as DraftDoc).rev : 0;
        const stamp = { publishedAt: serverTimestamp(), publishedBy: this.email };
        tx.set(doc(db, "versions", String(version)), { json, version, ...stamp });
        tx.set(pubRef, { json, version, ...stamp });
        this.lastWrittenJson = json;
        written = draftRev + 1;
        tx.set(draftRef, { json, rev: written, baseVersion: version, updatedAt: serverTimestamp(), updatedBy: this.email });
      });
      this.rev = Math.max(this.rev, written);
      this.baseVersion = version;
      this.publishedJson = json;
      this.set({ publishing: false, publishedVersion: version });
      return version;
    } catch (error) {
      this.set({ publishing: false });
      throw error;
    }
  };

  /** Draft ← what visitors see now. */
  discard = () => this.mutate(() => parse(this.publishedJson));

  /** Draft ← an earlier published version (still needs Publish). */
  restore = async (version: number) => {
    const snap = await getDoc(doc(firebase().db, "versions", String(version)));
    if (!snap.exists()) throw new Error(`Version ${version} not found`);
    const content = parse((snap.data() as PublishedDoc).json);
    this.mutate(() => content);
  };

  /** Published versions, newest first: just the dates and authors, not the content. */
  async listVersions(limit = 40): Promise<VersionInfo[]> {
    const { auth } = firebase();
    const token = await auth.currentUser?.getIdToken();
    const project = USE_EMULATORS ? "demo-d2communication" : "d2communication";
    const host = USE_EMULATORS ? "http://127.0.0.1:8080" : "https://firestore.googleapis.com";
    const res = await fetch(`${host}/v1/projects/${project}/databases/(default)/documents:runQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "versions" }],
          select: { fields: [{ fieldPath: "version" }, { fieldPath: "publishedAt" }, { fieldPath: "publishedBy" }] },
          orderBy: [{ field: { fieldPath: "version" }, direction: "DESCENDING" }],
          limit,
        },
      }),
    });
    if (!res.ok) throw new Error(`History request failed (${res.status})`);
    const rows = (await res.json()) as { document?: { fields: Record<string, Record<string, string>> } }[];
    return rows
      .filter((r) => r.document)
      .map(({ document }) => ({
        version: Number(document!.fields.version?.integerValue ?? 0),
        publishedAt: document!.fields.publishedAt?.timestampValue ?? null,
        publishedBy: document!.fields.publishedBy?.stringValue ?? "",
      }));
  }
}
