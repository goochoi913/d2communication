"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

import type { ContentSnapshot, Lang } from "@/content/schema";
import type { EditorBridge, PanelRequest } from "@/components/content/bridge";
import { EDITOR_FLAG, useSite } from "@/components/content/site-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddButton } from "./add-button";
import type { EditorApi } from "./context";
import { useConfirm } from "./dialogs";
import { EditableImage } from "./editable-image";
import { EditableItem } from "./editable-item";
import { EditableText } from "./editable-text";
import { firebase, isEditor, signOut } from "./firebase";
import { WorkPanel } from "./panels/work-panel";
import { CategoryPanel, PartnerPanel, PhotoPanel } from "./panels/simple-panels";
import { AllTextPanel, HistoryPanel, SettingsPanel } from "./panels/site-panels";
import { SignInScreen } from "./sign-in";
import { DraftStore } from "./store";
import { UI, type UiLang } from "./strings";
import { Toolbar } from "./toolbar";

type Props = {
  lang: Lang;
  published: ContentSnapshot;
  register: (bridge: EditorBridge | null) => void;
  /** Rendering the /edit page (sign-in) rather than the site. */
  entry: boolean;
};

const UI_KEY = "d2.editor.ui";
const EDITING_KEY = "d2.editing";

function storedUi(email?: string | null): UiLang {
  try {
    const saved = localStorage.getItem(UI_KEY);
    if (saved === "en" || saved === "ko") return saved;
  } catch {
    // ignore
  }
  if (email === "pdjschoi@gmail.com") return "ko";
  return typeof navigator !== "undefined" && navigator.language.startsWith("ko") ? "ko" : "en";
}

/**
 * Edit mode's entry point, downloaded only by editors. It watches the Google sign-in; for
 * an allowed account it loads the draft, hands the site an editing bridge, and shows the
 * toolbar and panels.
 */
export function EditorRoot({ lang, published, register, entry }: Props) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => onAuthStateChanged(firebase().auth, setUser), []);

  useEffect(() => {
    if (user === undefined || entry) return;
    if (!isEditor(user)) {
      try {
        localStorage.removeItem(EDITOR_FLAG);
      } catch {
        // ignore
      }
      register(null);
    }
  }, [user, entry, register]);

  if (entry) return <SignInScreen user={user} initialUi={storedUi(user?.email)} />;
  if (!user || !isEditor(user)) return null;
  return <EditorSession key={user.uid} user={user} lang={lang} published={published} register={register} />;
}

function EditorSession({ user, lang, published, register }: { user: User; lang: Lang; published: ContentSnapshot; register: Props["register"] }) {
  const email = user.email!;
  // The store is created once per signed-in session, from the version visitors see.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const store = useMemo(() => new DraftStore(email, published), [email]);
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  const [editing, setEditing] = useState(true);
  const [ui, setUiState] = useState<UiLang>(() => storedUi(email));
  const [panel, setPanel] = useState<PanelRequest | { kind: "alltext" } | null>(null);
  const [help, setHelp] = useState(false);
  const { confirm, dialog } = useConfirm(UI.cancel[ui]);
  const { bridge } = useSite();

  useEffect(() => {
    store.start();
    return () => store.stop();
  }, [store]);

  // Remember Edit/Preview across pages of the same visit.
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore after hydration
      setEditing(sessionStorage.getItem(EDITING_KEY) !== "0");
    } catch {
      // ignore
    }
  }, []);
  const changeEditing = (v: boolean) => {
    setEditing(v);
    try {
      sessionStorage.setItem(EDITING_KEY, v ? "1" : "0");
    } catch {
      // ignore
    }
  };

  const setUi = (v: UiLang) => {
    setUiState(v);
    try {
      localStorage.setItem(UI_KEY, v);
    } catch {
      // ignore
    }
  };

  const api = useMemo<EditorApi>(
    () => ({ store, state, lang, ui, setUi, email, openPanel: setPanel, closePanel: () => setPanel(null), confirm }),
    [store, state, lang, ui, email, confirm],
  );

  useEffect(() => {
    register({
      editing: editing && state.ready,
      content: state.draft,
      Text: EditableText,
      Image: EditableImage,
      Item: EditableItem,
      Add: AddButton,
      openPanel: setPanel,
      api,
    });
  }, [api, editing, state.ready, state.draft, register]);
  useEffect(() => () => register(null), [register]);

  // Undo / redo from the keyboard, unless the cursor is in a text field (which has its own undo).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "z") return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true'], [contenteditable='']")) return;
      e.preventDefault();
      if (e.shiftKey) store.redo();
      else store.undo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [store]);

  // The toolbar and panels read the API through the bridge, so wait until it's registered.
  if (!bridge?.api) return null;
  const close = () => setPanel(null);

  return (
    <>
      <Toolbar
        hidden={!!panel}
        editing={editing}
        onEditing={changeEditing}
        onPanel={(kind) => setPanel({ kind })}
        onHelp={() => setHelp(true)}
        onSignOut={async () => {
          await store.flush();
          try {
            localStorage.removeItem(EDITOR_FLAG);
          } catch {
            // ignore
          }
          await signOut();
          window.location.reload();
        }}
      />
      {panel?.kind === "work" ? <WorkPanel id={panel.id} onClose={close} /> : null}
      {panel?.kind === "category" ? <CategoryPanel slug={panel.slug as never} onClose={close} /> : null}
      {panel?.kind === "photo" ? <PhotoPanel id={panel.id} onClose={close} /> : null}
      {panel?.kind === "partner" ? <PartnerPanel id={panel.id} onClose={close} /> : null}
      {panel?.kind === "settings" ? <SettingsPanel onClose={close} onAllText={() => setPanel({ kind: "alltext" })} /> : null}
      {panel?.kind === "alltext" ? <AllTextPanel onClose={close} /> : null}
      {panel?.kind === "history" ? <HistoryPanel onClose={close} /> : null}
      {dialog}

      <AlertDialog open={!!state.conflict}>
        <AlertDialogContent className="dark">
          <AlertDialogHeader>
            <AlertDialogTitle>{UI.conflictTitle[ui]}</AlertDialogTitle>
            <AlertDialogDescription>{UI.conflictBody[ui]}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-11" onClick={() => store.resolveConflict(false)}>
              {UI.loadTheirs[ui]}
            </AlertDialogCancel>
            <AlertDialogAction className="h-11" onClick={() => store.resolveConflict(true)}>
              {UI.keepMine[ui]}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={help} onOpenChange={setHelp}>
        <DialogContent className="dark">
          <DialogHeader>
            <DialogTitle>{UI.help[ui]}</DialogTitle>
            <DialogDescription className="text-[15px] leading-relaxed">{UI.helpBody[ui]}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
