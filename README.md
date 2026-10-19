# D2 Communication

The website of D2 Communication, the production company of director and producer
Jin Sam Choi: <https://d2communication.com> (Korean: <https://d2communication.com/ko>).

## Editing the site

Jin Sam Choi edits the site himself, on the page as visitors see it:

1. Open <https://d2communication.com/edit> and sign in with Google. Only `pdjschoi@gmail.com`
   and `goochoi913@gmail.com` can sign in; every other account is refused by the server.
2. The site opens with a toolbar at the bottom. With **Edit** on:
   - click any text to change it (English on `/`, Korean on `/ko`);
   - click a photo to replace it, or a film to change its YouTube link, titles and credits;
   - use **+** to add a film (paste the YouTube link, type the title, optionally a thumbnail),
     photos (several at once) or a partner logo; the arrows reorder and the bin deletes,
     always after asking;
   - **⋯** has the pages, site settings, all texts, History and sign-out.
3. Everything saves as a draft automatically. Visitors see nothing until **Publish**.
   History restores any earlier published version.

Uploaded images are resized and compressed automatically. Films stay on YouTube; only short
muted preview loops (about 3 MB) are uploaded to the site.

## How it's built

- Next.js (App Router) as a static export (`out/`) on Firebase Hosting, with Tailwind CSS v4
  and shadcn/ui; motion and Lenis for animation and scrolling.
- Content is one document in Firestore (draft, published, and a version per publish).
  Publishing updates visitors immediately, and a Cloud Function rebuilds the static site
  within a few minutes so search engines and link previews follow.
- Sign-in is Google via Firebase Authentication, limited to the two editors by blocking
  functions, Firestore rules and Storage rules.

Project rules and commands for contributors are in [CLAUDE.md](./CLAUDE.md). The six
design options reviewed before this build are kept at the git tag `design-options-v1`.

## Develop

```bash
npm install
npm run emulators       # Firebase emulators (needs Java 21+)
npm run dev:emulators   # the site at http://localhost:3000, using the emulators
```

`npm run preview` builds the production export and serves it at <http://localhost:4173>.

## Deploys

- Every push to `main` builds the site and deploys it to Firebase Hosting; pull requests get a
  temporary preview channel.
- Security rules are tested and deployed by CI (`.github/workflows/firebase-rules.yml`).
- Cloud Functions are deployed by hand with `npm run deploy:backend`.

Placeholder photography is from Wikimedia Commons (see `public/images/seed/CREDITS.md`);
placeholder films are public-domain NASA footage and open films. All of it is marked
"Sample" in edit mode until it's replaced.
