# D2 Communication — project rules

Official website of D2 Communication, the production company of director and producer
Jin Sam Choi (최진삼). English first, ready for a Korean toggle later.

@AGENTS.md

## Strict rules

- **UI:** shadcn/ui components, icons from react-icons.
- **No attribution trailers.** No `Co-authored-by` line, no session line, and no "generated with" footer, in commit messages or pull request bodies. Every commit is authored solely as the git user is configured.
- **Conventional Commits v1.0.0:** `<type>[(scope)][!]: <imperative description>`, blank line, body, blank line, footers. Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `build`, `ci`, `style`.
- **Commit far less often:** one commit per meaningful, self-contained piece of work, such as a feature, a fix, a refactor, or a runbook. Small things join the commit they belong to. Never commit to one file, per review round, or per step of a session. A day's work is a handful of commits split by type and scope, not by when the edits were made.
- **GitHub account:** use only the `goochoi913` GitHub account in this repo, never `goo913`. The repo-local git config sets `user.name=goochoi913` and `user.email=goochoi913@gmail.com`; pushing uses a credential helper configured in this repo's own `.git/config`. Never write a token into any committed file.

## Project conventions

- **Stack:** Next.js (App Router) with `output: "export"`. `npm run build` writes a static site to `out/`, which Firebase Hosting serves. Anything that needs a server is off-limits: route handlers that read the request, server actions, rewrites, redirects, headers in `next.config.ts`, and default `next/image` optimisation.
- **Content lives in one file:** `src/data/site.ts` holds the company details, the categories (with `visibility`: `public` | `link-only` | `hidden`) and every video record. Adding a video never needs a code change.
- **Video is never self-hosted.** Everything is an unlisted upload on the D2 Communication YouTube channel, embedded with the components in `src/components/media/`. Embeds load lazily (poster first) so pages stay fast on phones.
- **The logo is fixed.** The official files are `public/brand/d2communication-logo.svg` and `public/brand/d2communication-logo-no-background.svg`. Never redraw, recolour, or reshape them. Animate the official paths from `src/components/brand/logo-geometry.ts`, and make sure every animation comes to rest on the exact original logo.
- **Icons in shadcn components:** the shadcn CLI only knows icon libraries it ships with, so `components.json` keeps `"iconLibrary": "lucide"`. After every `npx shadcn add …`, replace the generated `lucide-react` imports with the same glyphs from `react-icons/lu` (for example `import { LuX as XIcon } from "react-icons/lu"`), and make sure `lucide-react` never ends up in `package.json`.
- **Colours:** shadcn neutral is the base palette. Brand accents come from the logo: red `#CC0606` → `#EA4E4E`, grey `#A6A6A6` with shadow `#6C6F6F`.
- **Mobile is a first-class target.** Check every section at real phone widths (360–430 px), never allow horizontal scrolling, keep tap targets ≥ 44 px, and simplify any effect that is janky on phones. Respect `prefers-reduced-motion`.

## Commands

```bash
npm install
npm run dev       # http://localhost:3000 (hot reload)
npm run preview   # production build served from out/ at http://localhost:4173
npm run build     # static export to out/
npm run lint
```
