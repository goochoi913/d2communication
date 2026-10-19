/**
 * The Cloud Build job that rebuilds the static site after a publish.
 *
 * Visitors already see a new publish straight away (the site reads content/published
 * when it loads); this rebuild bakes the new content into the HTML too, so first paint,
 * link previews and search engines catch up within a few minutes.
 */

export const PROJECT_ID = "d2communication";
const REPO = "https://github.com/goochoi913/d2communication.git";
const BUILDER = `site-builder@${PROJECT_ID}.iam.gserviceaccount.com`;
const FIREBASE_TOOLS = "firebase-tools@15.34.0";
const PUBLISHED_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/content/published?mask.fieldPaths=version`;

/**
 * Runs after `npm run build`: if the site was published again while this build was
 * running, its own build will deploy the newer content, so this one steps aside instead of
 * overwriting it with older content. Written without `$`, which Cloud Build would treat
 * as a substitution.
 */
const GUARD = [
  `const fs = require("fs");`,
  `let baked = 0;`,
  `try { baked = JSON.parse(fs.readFileSync("src/content/snapshot.json", "utf8")).version || 0; } catch {}`,
  `fetch(${JSON.stringify(PUBLISHED_URL)})`,
  `  .then((r) => (r.status === 404 ? {} : r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))`,
  `  .then((doc) => {`,
  `    const live = Number(doc.fields?.version?.integerValue ?? 0);`,
  `    console.log("Baked content v" + baked + ", published v" + live + ".");`,
  `    if (live > baked) {`,
  `      fs.writeFileSync(".skip-deploy", "");`,
  `      console.log("A newer version was published during this build; its own build deploys it.");`,
  `    }`,
  `  })`,
  `  .catch((e) => { console.error("Could not read the published version: " + e.message); process.exit(1); });`,
].join("\n");

/** A Cloud Build `Build` resource (https://cloud.google.com/build/docs/api/reference/rest/v1/projects.builds). */
export function rebuildRequest(version: number, reason = `content v${version}`) {
  // The reason becomes the Hosting release message inside a bash command: keep it plain.
  const message = reason.replace(/[^\w .,:()#-]/g, "").slice(0, 120) || `content v${version}`;
  return {
    steps: [
      { id: "clone", name: "gcr.io/cloud-builders/git", args: ["clone", "--depth=1", "--branch=main", REPO, "."] },
      { id: "install", name: "node:24", entrypoint: "npm", args: ["ci", "--no-audit", "--no-fund"] },
      {
        id: "build",
        name: "node:24",
        entrypoint: "npm",
        args: ["run", "build"],
        // CI makes scripts/sync-content.mjs fail the build rather than bake placeholders.
        env: ["CI=true", "NEXT_TELEMETRY_DISABLED=1"],
      },
      { id: "guard", name: "node:24", entrypoint: "node", args: ["-e", GUARD] },
      {
        id: "deploy",
        name: "node:24",
        entrypoint: "bash",
        args: [
          "-c",
          `if test -f .skip-deploy; then echo "Skipping the deploy."; else ` +
            `npx --yes ${FIREBASE_TOOLS} deploy --only hosting --project ${PROJECT_ID} --non-interactive -m "${message}"; fi`,
        ],
      },
    ],
    serviceAccount: `projects/${PROJECT_ID}/serviceAccounts/${BUILDER}`,
    // Builds that run as a chosen service account must log to Cloud Logging only.
    options: { logging: "CLOUD_LOGGING_ONLY" },
    timeout: "1200s",
    tags: ["site-rebuild", `content-v${version}`],
  };
}

type BuildOperation = { metadata?: { build?: { id?: string; logUrl?: string } } };

/**
 * Starts the rebuild and returns at once; the build itself takes a few minutes.
 * `post` sends an authenticated JSON POST and resolves to the parsed response body.
 */
export async function startRebuild(
  post: (url: string, body: unknown) => Promise<unknown>,
  version: number,
  reason?: string,
) {
  const operation = (await post(
    `https://cloudbuild.googleapis.com/v1/projects/${PROJECT_ID}/builds`,
    rebuildRequest(version, reason),
  )) as BuildOperation;
  return { id: operation.metadata?.build?.id, logUrl: operation.metadata?.build?.logUrl };
}
