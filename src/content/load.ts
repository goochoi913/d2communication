import { readFileSync } from "node:fs";
import path from "node:path";

import type { ContentSnapshot } from "./schema";
import { normalizeContent } from "./normalize";
import { SEED_CONTENT } from "./seed";

let cached: ContentSnapshot | undefined;

/**
 * Build time only: the published content that `scripts/sync-content.mjs` fetched from
 * Firestore, or the built-in seed content when nothing has been published yet.
 */
export function loadPublishedContent(): ContentSnapshot {
  if (cached) return cached;
  try {
    const raw = JSON.parse(readFileSync(path.join(process.cwd(), "src/content/snapshot.json"), "utf8"));
    cached = {
      version: Number(raw.version) || 0,
      publishedAt: typeof raw.publishedAt === "string" ? raw.publishedAt : null,
      content: normalizeContent(raw.content),
    };
  } catch {
    cached = { version: 0, publishedAt: null, content: normalizeContent(SEED_CONTENT) };
  }
  return cached;
}
