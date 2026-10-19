"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { LuArrowRight, LuLoaderCircle } from "react-icons/lu";

import { D2Mark } from "@/components/brand/d2-mark";
import { EDITOR_FLAG } from "@/components/content/site-context";
import { finishRedirect, isEditor, signIn, signOut } from "./firebase";
import { UI, type UiKey, type UiLang } from "./strings";

/** The /edit page: Google sign-in for the two editor accounts, then on to the site in edit mode. */
export function SignInScreen({ user, initialUi }: { user: User | null | undefined; initialUi: UiLang }) {
  const [ui, setUi] = useState<UiLang>(initialUi);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<UiKey | null>(null);
  const t = (k: UiKey) => UI[k][ui];
  const home = ui === "ko" ? "/ko" : "/";

  // Back from a full-page redirect sign-in (used when a popup is blocked).
  useEffect(() => {
    finishRedirect().then((r) => {
      if (r && !r.ok && r.reason === "not-editor") setError("notEditor");
    });
  }, []);

  // Signed in with an allowed account: remember it on this device and open the site.
  useEffect(() => {
    if (!user) return;
    if (!isEditor(user)) {
      void signOut();
      return;
    }
    try {
      localStorage.setItem(EDITOR_FLAG, "1");
    } catch {
      // ignore
    }
    const timer = setTimeout(() => window.location.assign(home), 900);
    return () => clearTimeout(timer);
  }, [user, home]);

  const start = async () => {
    setBusy(true);
    setError(null);
    const result = await signIn();
    setBusy(false);
    if (!result.ok && result.reason === "not-editor") setError("notEditor");
    else if (!result.ok && result.reason === "failed") setError("signInFailed");
  };

  const signedIn = user && isEditor(user);

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-neutral-950 px-5 py-10 text-neutral-50">
      <div className="w-full max-w-sm text-center">
        <D2Mark className="mx-auto h-14 w-auto" />
        <h1 className="mt-10 font-display text-[2rem] leading-tight font-light">{t("signInTitle")}</h1>
        <p className="mt-3 text-[15px] text-neutral-400">{t("signInBody")}</p>

        <div className="mt-10">
          {user === undefined ? (
            <LuLoaderCircle className="mx-auto size-6 animate-spin text-neutral-500" />
          ) : signedIn ? (
            <a
              href={home}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-neutral-950"
            >
              {t("openSite")}
              <LuArrowRight className="size-4" />
            </a>
          ) : (
            <button
              type="button"
              onClick={start}
              disabled={busy}
              className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-full bg-white px-6 text-[15px] font-medium text-neutral-950 disabled:opacity-60"
            >
              {busy ? <LuLoaderCircle className="size-5 animate-spin" /> : <FcGoogle className="size-5" />}
              {busy ? t("signingIn") : t("signInGoogle")}
            </button>
          )}
          {signedIn ? <p className="mt-4 text-sm text-neutral-400">{UI.signedInAs[ui].replace("{email}", user.email ?? "")}</p> : null}
          {error ? <p className="mt-4 text-sm leading-relaxed text-[#EA4E4E]">{t(error)}</p> : null}
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-neutral-500">
          <button type="button" className="min-h-11 hover:text-white" onClick={() => setUi(ui === "ko" ? "en" : "ko")}>
            {t("uiLanguage")}
          </button>
          <a href={home} className="min-h-11 content-center hover:text-white">
            {t("backToSite")}
          </a>
        </div>
      </div>
    </div>
  );
}
