#!/usr/bin/env node
/**
 * Runs before `next build`: downloads the published site content from Firestore and
 * saves it to src/content/snapshot.json, so the static HTML is built with what visitors
 * see. Until the first publish there is no snapshot and the build uses the seed content.
 *
 * content/published is publicly readable (see firestore.rules), so no credentials are
 * needed. In CI any failure other than "not published yet" stops the build: deploying the
 * seed placeholders over real content would be far worse than a failed deploy.
 *
 *   SKIP_CONTENT_SYNC=1  leave src/content/snapshot.json as it is (offline work)
 */
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const PUBLISHED_URL =
  "https://firestore.googleapis.com/v1/projects/d2communication/databases/(default)/documents/content/published";
const SNAPSHOT = fileURLToPath(new URL("../src/content/snapshot.json", import.meta.url));
const shown = relative(process.cwd(), SNAPSHOT);

if (process.env.SKIP_CONTENT_SYNC === "1") {
  console.log(`sync-content: skipped (SKIP_CONTENT_SYNC=1); ${existsSync(SNAPSHOT) ? `using ${shown}` : "using the seed content"}.`);
  process.exit(0);
}

try {
  const response = await fetch(PUBLISHED_URL, { signal: AbortSignal.timeout(20_000) });

  if (response.status === 404) {
    rmSync(SNAPSHOT, { force: true });
    console.log("sync-content: nothing published yet; the build uses the seed content.");
    process.exit(0);
  }
  if (!response.ok) {
    throw new Error(`Firestore answered HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }

  const { fields = {}, updateTime } = await response.json();
  const version = Number(fields.version?.integerValue);
  const json = fields.json?.stringValue;
  if (!Number.isInteger(version) || version < 1 || typeof json !== "string") {
    throw new Error("content/published is missing its version or json field.");
  }

  const snapshot = {
    version,
    publishedAt: fields.publishedAt?.timestampValue ?? updateTime,
    content: JSON.parse(json),
  };
  mkdirSync(dirname(SNAPSHOT), { recursive: true });
  writeFileSync(SNAPSHOT, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`sync-content: wrote published content v${version} (${snapshot.publishedAt}) to ${shown}.`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  if (process.env.CI) {
    console.error(`sync-content: could not fetch the published content, stopping the build. ${message}`);
    process.exit(1);
  }
  console.warn(
    `sync-content: could not fetch the published content (${message}); ` +
      (existsSync(SNAPSHOT) ? `keeping the existing ${shown}.` : "the build uses the seed content."),
  );
}
