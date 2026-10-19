import { EMULATOR_PORTS, EMULATOR_PROJECT_ID, firebaseConfig } from "@/lib/firebase/config";

/**
 * Tiny scripts that run in <head> before the page paints. Kept out of client components so
 * the server layout can inline them as plain strings.
 */

/** The published content, readable by anyone (the local Firestore emulator in `npm run dev:emulators`). */
export const PUBLISHED_DOC_URL = process.env.NEXT_PUBLIC_FIREBASE_EMULATORS
  ? `http://127.0.0.1:${EMULATOR_PORTS.firestore}/v1/projects/${EMULATOR_PROJECT_ID}/databases/(default)/documents/content/published`
  : `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/content/published`;

/** Starts loading the latest published content before React does; SiteProvider picks it up. */
export const LIVE_PREFETCH_SCRIPT = `window.__d2live=fetch(${JSON.stringify(PUBLISHED_DOC_URL)},{cache:"no-store"}).then(function(r){return r.ok?r.json():null}).catch(function(){return null})`;

export const INTRO_SEEN_KEY = "d2.intro";
export const INTRO_SEEN_CLASS = "d2-intro-seen";

/** On a repeat visit in the same session, hides the intro with CSS before it can flash. */
export const INTRO_SEEN_SCRIPT = `try{if(sessionStorage.getItem(${JSON.stringify(INTRO_SEEN_KEY)})==="1")document.documentElement.classList.add(${JSON.stringify(INTRO_SEEN_CLASS)})}catch(e){}`;

/** Korean pages live under /ko; the root layout is shared, so the html lang is set here. */
export const LANG_SCRIPT = `if(location.pathname==="/ko"||location.pathname.indexOf("/ko/")===0)document.documentElement.lang="ko"`;
