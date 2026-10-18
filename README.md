# D2 Communication

Website for D2 Communication, the production company of director and producer Jin Sam Choi.

This repository currently holds **six landing-page design options** for review. After one
is chosen (or several are combined), the real site is built from it.

## Review the design options

```bash
npm install
npm run preview
```

Then open <http://localhost:4173>. That index links every option:

| Option | Brief | URL |
| --- | --- | --- |
| 1 · Reel | No restrictions | <http://localhost:4173/options/1> |
| 2 · Monogram | Built from the logo | <http://localhost:4173/options/2> |
| 3 · Frozen River | Based on the original mockup | <http://localhost:4173/options/3> |
| 4 · Premiere | Cinematic and dark | <http://localhost:4173/options/4> |
| 5 · Archive | Editorial documentary | <http://localhost:4173/options/5> |
| 6 · Multiview | Extra: everything at a glance | <http://localhost:4173/options/6> |

`npm run preview` builds the production static export and serves it. Animations run at
real speed there, so use it for judging. `npm run dev` (port 3000) is for development with
hot reload. While an option is open, the pill at the bottom left (or the ← / → keys) steps
between options.

All titles, credits, clients, contact details and video embeds are **placeholders**. Their
single source is `src/data/site.ts`. Placeholder photography comes from Wikimedia Commons;
see `public/images/placeholders/CREDITS.md`.

## Stack

- Next.js (App Router) as a static export (`out/`), hosted on Firebase Hosting
- Tailwind CSS v4 and shadcn/ui (neutral base), icons from react-icons
- motion for animation, Lenis for smooth wheel scrolling
- Videos are unlisted YouTube uploads, embedded lazily and never self-hosted

## Deploys

GitHub Actions builds every push to `main` and deploys it to Firebase Hosting. Pull requests
get a temporary preview channel. See `.github/workflows/`.

Project rules for contributors are in [CLAUDE.md](./CLAUDE.md).
