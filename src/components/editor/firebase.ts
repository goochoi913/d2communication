import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  connectAuthEmulator,
  GoogleAuthProvider,
  initializeAuth,
  signInWithPopup,
  signInWithCredential,
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut,
  type Auth,
  type User,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage, type FirebaseStorage } from "firebase/storage";

import { EDITOR_EMAILS, EMULATOR_PORTS, EMULATOR_PROJECT_ID, firebaseConfig } from "@/lib/firebase/config";

/** `npm run dev:emulators`: everything talks to the local emulators instead of the real project. */
export const USE_EMULATORS = !!process.env.NEXT_PUBLIC_FIREBASE_EMULATORS;

type Services = { app: FirebaseApp; auth: Auth; db: Firestore; storage: FirebaseStorage; bucket: string };
let services: Services | null = null;

export function firebase(): Services {
  if (services) return services;
  const config = USE_EMULATORS
    ? { ...firebaseConfig, projectId: EMULATOR_PROJECT_ID, apiKey: "demo-key", storageBucket: `${EMULATOR_PROJECT_ID}.appspot.com` }
    : firebaseConfig;
  const app = getApps()[0] ?? initializeApp(config);
  const auth = initializeAuth(app, { persistence: browserLocalPersistence, popupRedirectResolver: browserPopupRedirectResolver });
  const db = getFirestore(app);
  const storage = getStorage(app);
  if (USE_EMULATORS) {
    connectAuthEmulator(auth, `http://127.0.0.1:${EMULATOR_PORTS.auth}`, { disableWarnings: true });
    connectFirestoreEmulator(db, "127.0.0.1", EMULATOR_PORTS.firestore);
    connectStorageEmulator(storage, "127.0.0.1", EMULATOR_PORTS.storage);
  }
  services = { app, auth, db, storage, bucket: config.storageBucket };
  if (USE_EMULATORS) exposeTestSignIn(auth);
  return services;
}

/**
 * Emulators only: lets automated browser tests sign in without Google's popup. The Auth
 * emulator accepts an unsigned Google ID token; the real project never sees this code path.
 */
function exposeTestSignIn(auth: Auth) {
  (window as unknown as { __d2TestSignIn?: (email: string) => Promise<unknown> }).__d2TestSignIn = (email) =>
    signInWithCredential(
      auth,
      GoogleAuthProvider.credential(JSON.stringify({ sub: `test-${email}`, email, email_verified: true })),
    );
}

export const isEditor = (user: User | null) =>
  !!user?.email && user.emailVerified && (EDITOR_EMAILS as readonly string[]).includes(user.email.toLowerCase());

/** Public URL of an uploaded file. `{w}` may stay in the path as the width placeholder. */
export function storageUrl(path: string) {
  const { bucket } = firebase();
  const encoded = encodeURIComponent(path).replace("%7Bw%7D", "{w}");
  const host = USE_EMULATORS ? `http://127.0.0.1:${EMULATOR_PORTS.storage}` : "https://firebasestorage.googleapis.com";
  return `${host}/v0/b/${bucket}/o/${encoded}?alt=media`;
}

export type SignInResult = { ok: true } | { ok: false; reason: "not-editor" | "cancelled" | "failed" };

function explain(error: unknown): SignInResult {
  const e = error as { code?: string; message?: string };
  // The blocking function refuses every other account before sign-in completes.
  if (e?.message?.includes("D2_NOT_AN_EDITOR")) return { ok: false, reason: "not-editor" };
  if (e?.code === "auth/popup-closed-by-user" || e?.code === "auth/cancelled-popup-request") return { ok: false, reason: "cancelled" };
  return { ok: false, reason: "failed" };
}

/** Google sign-in in a popup; falls back to a full-page redirect when the popup is blocked. */
export async function signIn(): Promise<SignInResult> {
  const { auth } = firebase();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    const cred = await signInWithPopup(auth, provider);
    if (!isEditor(cred.user)) {
      await fbSignOut(auth);
      return { ok: false, reason: "not-editor" };
    }
    return { ok: true };
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
      await signInWithRedirect(auth, provider);
      return { ok: true };
    }
    return explain(error);
  }
}

/** Completes a redirect sign-in after the page comes back from Google. */
export async function finishRedirect(): Promise<SignInResult | null> {
  try {
    const result = await getRedirectResult(firebase().auth);
    if (!result) return null;
    return isEditor(result.user) ? { ok: true } : { ok: false, reason: "not-editor" };
  } catch (error) {
    return explain(error);
  }
}

export const signOut = () => fbSignOut(firebase().auth);
