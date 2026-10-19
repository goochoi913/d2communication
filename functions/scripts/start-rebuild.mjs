#!/usr/bin/env node
/**
 * Starts the same Cloud Build rebuild that a publish triggers, without publishing:
 *
 *   npm --prefix functions run build && node functions/scripts/start-rebuild.mjs ["reason"]
 *
 * Calls Cloud Build with your gcloud login (or ACCESS_TOKEN), so it needs permission to
 * create builds that run as site-builder@d2communication.iam.gserviceaccount.com.
 */
import { execFileSync } from "node:child_process";

import { PROJECT_ID, startRebuild } from "../lib/rebuild.js";

const token =
  process.env.ACCESS_TOKEN ??
  execFileSync("gcloud", ["auth", "print-access-token", "--account", "goochoi913@gmail.com"], { encoding: "utf8" }).trim();

// Tag the build with the version that is published right now (0 before the first publish).
const published = await fetch(
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/content/published?mask.fieldPaths=version`,
);
const version = published.ok ? Number((await published.json()).fields?.version?.integerValue ?? 0) : 0;

const post = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "x-goog-user-project": PROJECT_ID },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`Cloud Build answered HTTP ${response.status}: ${JSON.stringify(data.error ?? data)}`);
  return data;
};

const build = await startRebuild(post, version, process.argv[2] ?? `manual rebuild (content v${version})`);
console.log(`Started build ${build.id}\n${build.logUrl}`);
