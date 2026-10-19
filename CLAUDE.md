# D2 Communication — project rules

Official website of D2 Communication, the production company of director and producer
Jin Sam Choi (최진삼). English at `/`, Korean at `/ko`. Jin Sam Choi edits the live site
himself in edit mode (`/edit`), without touching code.

@AGENTS.md

## Strict rules

- **UI:** shadcn/ui components, icons from react-icons.
- **No attribution trailers.** No `Co-authored-by` line, no session line, and no "generated with" footer, in commit messages or pull request bodies. Every commit is authored solely as the git user is configured.
- **Conventional Commits v1.0.0:** `<type>[(scope)][!]: <imperative description>`, blank line, body, blank line, footers. Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `build`, `ci`, `style`.
- **Commit far less often:** one commit per meaningful, self-contained piece of work, such as a feature, a fix, a refactor, or a runbook. Small things join the commit they belong to. Never commit to one file, per review round, or per step of a session. A day's work is a handful of commits split by type and scope, not by when the edits were made.
- **GitHub account:** use only the `goochoi913` GitHub account in this repo, never `goo913`. The repo-local git config sets `user.name=goochoi913` and `user.email=goochoi913@gmail.com`; pushing uses a credential helper configured in this repo's own `.git/config` (it asks `gh auth token --user goochoi913`). Never write a token into any committed file.
- **Google Cloud / Firebase:** always pass `--project d2communication` and, for gcloud, `--account goochoi913@gmail.com`. The gcloud default project is a work project; never touch it.
- **Editors:** only `pdjschoi@gmail.com` and `goochoi913@gmail.com` may sign in. The list lives in four places that must stay identical: `src/lib/firebase/config.ts`, `firestore.rules`, `storage.rules`, `functions/src/editors.ts`.

## How the site works

- **Static site, live content.** `npm run build` writes a static export to `out/` (Firebase Hosting). Nothing may need a server: no route handlers that read the request, server actions, rewrites, redirects, headers in `next.config.ts`, or default `next/image` optimisation.
- **One content document.** Everything visitors see — every text in English and Korean, images, films, photos, partner logos, categories and their visibility — is one `SiteContent` object (`src/content/schema.ts`). It is stored in Firestore as JSON:
  - `content/published`: what visitors see. It is baked into the HTML at build time (`scripts/sync-content.mjs` → `src/content/snapshot.json`, git-ignored), and the browser also checks it on load, so a publish shows up immediately.
  - `content/draft`: edit mode's working copy.
  - `versions/{n}`: every publish, for History → Restore.
  - Until the first publish, the build uses `src/content/seed.ts` (placeholder content, marked `sample`).
- **Changing the shape of content:** extend `schema.ts`, give the new field a default in `seed.ts` / `text-defaults.ts`, and make `normalize.ts` fill it in, so older drafts and versions still load. Never hard-code visitor-facing text: fixed texts are keys in `src/content/text-defaults.ts` (English and natural Korean) rendered with `Txt`; item texts use `EText`.
- **Edit mode** (`src/components/editor/`) is downloaded only after an editor has signed in on that device (`localStorage["d2.editor"]`). Site components render through the primitives in `src/components/content/editable.tsx` (`Txt`, `EText`, `EPlain`, `EImage`, `EItem`, `EAdd`), which become editable through the bridge in `src/components/content/bridge.ts`. Never import from `src/components/editor/` in site code; the only entry is the dynamic import in `site-context.tsx`.
- **Publishing** writes `content/published` + `versions/{n}` in one transaction (enforced by `firestore.rules`). The `rebuildOnPublish` function then rebuilds and redeploys the static site with Cloud Build (about 2–3 minutes), so search engines and link previews catch up.
- **Uploads** go to Firebase Storage under `media/` with new paths every time (never overwritten). Images are resized and encoded in the browser (`src/components/editor/media/`).
- **Video:** films are unlisted YouTube uploads, played in the shared player (`src/components/site/work-player.tsx`), with an optional full-length link. The only self-hosted video is the short muted preview loop (about 3 MB) uploaded in edit mode.

## Project conventions

- **The logo is fixed.** The official files are `public/brand/d2communication-logo.svg` and `public/brand/d2communication-logo-no-background.svg`. Never redraw, recolour, or reshape them. Animate the official paths from `src/components/brand/logo-geometry.ts`, and make sure every animation comes to rest on the exact original logo.
- **Look:** black background, black-and-white imagery that comes into colour on hover (in the middle of the screen on touch devices), and one red from the logo (`#CC0606` → `#EA4E4E`) as the only colour. shadcn neutral is the base palette.
- **Fonts are chosen in edit mode** (`settings.fonts`: Korean and English headings and text) from the list in `src/content/fonts.ts`. The defaults ship with the site (Cormorant Garamond, Inter, Pretendard, and MaruBuri split into unicode-range slices by `scripts/fonts/split-maruburi.py`); other choices load at runtime from Google Fonts or the font's official CDN, only on pages that use them. Never add a build-time font download such as `next/font/google`: the rebuild after Publish must not depend on it. Only list fonts licensed for commercial web use (OFL).
- **Icons in shadcn components:** the shadcn CLI only knows icon libraries it ships with, so `components.json` keeps `"iconLibrary": "lucide"`. After every `npx shadcn add …`, replace the generated `lucide-react` imports with the same glyphs from `react-icons/lu` (for example `import { LuX as XIcon } from "react-icons/lu"`), and make sure `lucide-react` never ends up in `package.json`.
- **Mobile is a first-class target**, edit mode included. Check every section at real phone widths (360–430 px), never allow horizontal scrolling, keep tap targets ≥ 44 px, and simplify any effect that is janky on phones. Respect `prefers-reduced-motion`.
- **Lists must take any number of items** (a category may hold dozens of films): new items follow the existing layout, and nothing an editor adds may break it.

## Commands

```bash
npm install
npm run dev            # http://localhost:3000, against the real Firebase project
npm run emulators      # local Firebase (Java 21+); then, in another terminal:
npm run dev:emulators  # http://localhost:3000 against the emulators (safe for testing edit mode)
npm run preview        # production build served from out/ at http://localhost:4173
npm run build          # fetches the published content, then the static export to out/
npm run lint
npm run typecheck
npm run test:rules     # security-rule tests against the emulators
npm run deploy:backend # rules, indexes, storage rules and functions (functions are not deployed by CI)
```
