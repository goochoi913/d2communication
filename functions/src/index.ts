/**
 * Cloud Functions for d2communication.com. Deployed by hand with `npm run deploy:backend`
 * from the repo root (not from CI).
 *
 *   editorsOnlyBeforeCreate / editorsOnlyBeforeSignIn
 *     Identity Platform blocking functions: every Google account other than the two
 *     editors is turned away before it can be created or signed in.
 *
 *   rebuildOnPublish
 *     Rebuilds and redeploys the static site whenever content/published changes.
 */
import { setGlobalOptions } from "firebase-functions/v2";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { beforeUserCreated, beforeUserSignedIn, HttpsError, type AuthBlockingEvent } from "firebase-functions/v2/identity";
import { logger } from "firebase-functions";
import { GoogleAuth } from "google-auth-library";

import { isEditorEmail } from "./editors.js";
import { PROJECT_ID, startRebuild } from "./rebuild.js";

setGlobalOptions({
  region: "us-central1",
  serviceAccount: `functions-runtime@${PROJECT_ID}.iam.gserviceaccount.com`,
  memory: "256MiB",
  maxInstances: 5,
});

/**
 * The client sees this as `auth/internal-error`; edit mode looks for the marker in the
 * message to show "this account can't edit the site" instead of a generic error.
 */
const NOT_AN_EDITOR = "D2_NOT_AN_EDITOR: This Google account can't sign in to edit this site.";

function allowEditorsOnly(event: AuthBlockingEvent) {
  const user = event.data;
  if (!user || !isEditorEmail(user.email, user.emailVerified)) {
    logger.warn("Turned away a sign-in", {
      email: user?.email ?? null,
      emailVerified: user?.emailVerified ?? null,
      provider: event.additionalUserInfo?.providerId ?? null,
    });
    throw new HttpsError("permission-denied", NOT_AN_EDITOR);
  }
}

export const editorsOnlyBeforeCreate = beforeUserCreated((event) => {
  allowEditorsOnly(event);
});

export const editorsOnlyBeforeSignIn = beforeUserSignedIn((event) => {
  allowEditorsOnly(event);
});

const googleAuth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"] });

export const rebuildOnPublish = onDocumentWritten({ document: "content/published", timeoutSeconds: 60 }, async (event) => {
  const after = event.data?.after;
  if (!after?.exists) {
    logger.info("content/published was deleted; nothing to rebuild.");
    return;
  }
  const version = Number(after.get("version")) || 0;
  if (Number(event.data?.before?.get("version")) === version) {
    logger.info(`content/published was rewritten at the same version (v${version}); skipping the rebuild.`);
    return;
  }
  if (process.env.FUNCTIONS_EMULATOR === "true") {
    logger.info(`Emulator: would start a Cloud Build rebuild for content v${version}.`);
    return;
  }
  const client = await googleAuth.getClient();
  const post = async (url: string, data: unknown) => (await client.request({ url, method: "POST", data })).data;
  const build = await startRebuild(post, version);
  logger.info(`Started the site rebuild for content v${version}.`, build);
});
