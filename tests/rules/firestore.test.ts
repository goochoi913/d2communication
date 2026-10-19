import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { assertFails, assertSucceeds, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { afterAll, beforeAll, beforeEach, describe, test } from "vitest";

import { DAD, GOO, STRANGER, googleUser, startEnv } from "./env";

type Db = firebase.firestore.Firestore;

const now = () => firebase.firestore.FieldValue.serverTimestamp();
const content = (label: string) => JSON.stringify({ schema: 1, label });

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await startEnv();
});
afterAll(async () => {
  await env?.cleanup();
});
beforeEach(async () => {
  await env.clearFirestore();
});

const dad = () => googleUser(env, DAD).firestore();
const goo = () => googleUser(env, GOO).firestore();
const stranger = () => googleUser(env, STRANGER).firestore();
/** The right address, but Google hasn't confirmed the account owns it. */
const unverifiedDad = () => googleUser(env, { uid: "imposter", email: DAD.email }, { email_verified: false }).firestore();
const visitor = () => env.unauthenticatedContext().firestore();

/** Publishes the way edit mode does: the history entry and the live document in one batch. */
function publish(db: Db, version: number, json = content(`v${version}`), by = DAD.email) {
  const batch = db.batch();
  batch.set(db.doc(`versions/${version}`), { json, version, publishedAt: now(), publishedBy: by });
  batch.set(db.doc("content/published"), { json, version, publishedAt: now(), publishedBy: by });
  return batch.commit();
}

/** Puts a published version (and its history entry) in place without going through the rules. */
async function seedPublished(version: number) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    const json = content(`v${version}`);
    const record = { json, version, publishedAt: now(), publishedBy: DAD.email };
    await db.doc(`versions/${version}`).set(record);
    await db.doc("content/published").set(record);
  });
}

async function seedDraft(rev: number) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await ctx
      .firestore()
      .doc("content/draft")
      .set({ json: content("draft"), rev, baseVersion: 1, updatedAt: now(), updatedBy: DAD.email });
  });
}

function draft(db: Db, rev: number, fields: Record<string, unknown> = {}) {
  return db
    .doc("content/draft")
    .set({ json: content(`draft r${rev}`), rev, baseVersion: 1, updatedAt: now(), updatedBy: DAD.email, ...fields });
}

describe("content/published", () => {
  test("anyone can read the published site, even before the first publish", async () => {
    await assertSucceeds(visitor().doc("content/published").get());
    await seedPublished(3);
    await assertSucceeds(visitor().doc("content/published").get());
    await assertSucceeds(stranger().doc("content/published").get());
  });

  test("nobody can list the content collection", async () => {
    await seedPublished(1);
    await assertFails(visitor().collection("content").get());
    await assertFails(dad().collection("content").get());
  });

  test("an editor publishes version 1, then the other editor publishes version 2", async () => {
    await assertSucceeds(publish(dad(), 1));
    await assertSucceeds(publish(goo(), 2, content("v2"), GOO.email));
  });

  test("a publish without its history entry is refused", async () => {
    const db = dad();
    await assertFails(
      db.doc("content/published").set({ json: content("v1"), version: 1, publishedAt: now(), publishedBy: DAD.email }),
    );
  });

  test("a publish whose history entry holds different content is refused", async () => {
    const db = dad();
    const batch = db.batch();
    batch.set(db.doc("versions/1"), { json: content("one thing"), version: 1, publishedAt: now(), publishedBy: DAD.email });
    batch.set(db.doc("content/published"), { json: content("another"), version: 1, publishedAt: now(), publishedBy: DAD.email });
    await assertFails(batch.commit());
  });

  test("versions must count up by exactly one", async () => {
    await assertFails(publish(dad(), 2)); // first publish must be 1
    await seedPublished(1);
    await assertFails(publish(dad(), 3)); // skips 2
    await assertSucceeds(publish(dad(), 2));
  });

  test("a version that already exists can't be published again", async () => {
    await seedPublished(1);
    // versions/1 exists, so the batch would overwrite history (and 1 is not 1 + 1).
    await assertFails(publish(dad(), 1));
  });

  test("the publish must be signed with the editor's own address and the server's clock", async () => {
    await assertFails(publish(dad(), 1, content("v1"), GOO.email));
    const db = dad();
    const json = content("v1");
    const batch = db.batch();
    const clientClock = firebase.firestore.Timestamp.fromDate(new Date("2026-01-01T00:00:00Z"));
    batch.set(db.doc("versions/1"), { json, version: 1, publishedAt: clientClock, publishedBy: DAD.email });
    batch.set(db.doc("content/published"), { json, version: 1, publishedAt: clientClock, publishedBy: DAD.email });
    await assertFails(batch.commit());
  });

  test("unexpected fields and oversized content are refused", async () => {
    const db = dad();
    const json = content("v1");
    const batch = db.batch();
    batch.set(db.doc("versions/1"), { json, version: 1, publishedAt: now(), publishedBy: DAD.email });
    batch.set(db.doc("content/published"), { json, version: 1, publishedAt: now(), publishedBy: DAD.email, extra: true });
    await assertFails(batch.commit());

    await assertFails(publish(dad(), 1, "x".repeat(1_000_001)));
    await assertFails(publish(dad(), 1, 42 as unknown as string));
  });

  test("a verified stranger, an unverified editor address and a visitor can't publish", async () => {
    await assertFails(publish(stranger(), 1, content("v1"), STRANGER.email));
    await assertFails(publish(unverifiedDad(), 1));
    await assertFails(publish(visitor(), 1));
  });

  test("the published document can't be deleted", async () => {
    await seedPublished(1);
    await assertFails(dad().doc("content/published").delete());
    await assertFails(visitor().doc("content/published").delete());
  });
});

describe("content/draft", () => {
  test("only editors can read the draft", async () => {
    await seedDraft(4);
    await assertSucceeds(dad().doc("content/draft").get());
    await assertSucceeds(goo().doc("content/draft").get());
    await assertFails(visitor().doc("content/draft").get());
    await assertFails(stranger().doc("content/draft").get());
    await assertFails(unverifiedDad().doc("content/draft").get());
  });

  test("an editor creates the draft at rev 1 and then counts up one save at a time", async () => {
    await assertFails(draft(dad(), 2));
    await assertSucceeds(draft(dad(), 1));
    await assertFails(draft(dad(), 1)); // stale save from another tab
    await assertFails(draft(dad(), 3)); // skipped a rev
    await assertSucceeds(draft(goo(), 2, { updatedBy: GOO.email }));
  });

  test("a draft save must be signed with the editor's own address and the server's clock", async () => {
    await assertFails(draft(dad(), 1, { updatedBy: GOO.email }));
    await assertFails(draft(dad(), 1, { updatedAt: firebase.firestore.Timestamp.now() }));
  });

  test("a draft save with bad fields is refused", async () => {
    await assertFails(draft(dad(), 1, { baseVersion: -1 }));
    await assertFails(draft(dad(), 1, { extra: "nope" }));
    await assertFails(draft(dad(), 1, { json: "x".repeat(1_000_001) }));
  });

  test("strangers and visitors can't write or delete the draft", async () => {
    await assertFails(draft(stranger(), 1, { updatedBy: STRANGER.email }));
    await assertFails(draft(visitor(), 1));
    await seedDraft(1);
    await assertFails(stranger().doc("content/draft").delete());
    await assertFails(visitor().doc("content/draft").delete());
  });

  test("an editor can discard the draft", async () => {
    await seedDraft(7);
    await assertSucceeds(dad().doc("content/draft").delete());
  });
});

describe("versions", () => {
  test("editors can list the history, newest first", async () => {
    await seedPublished(1);
    await seedPublished(2);
    await assertSucceeds(dad().collection("versions").orderBy("version", "desc").limit(20).get());
    await assertSucceeds(goo().doc("versions/1").get());
  });

  test("visitors and strangers can't read the history", async () => {
    await seedPublished(1);
    await assertFails(visitor().collection("versions").get());
    await assertFails(visitor().doc("versions/1").get());
    await assertFails(stranger().collection("versions").get());
    await assertFails(unverifiedDad().doc("versions/1").get());
  });

  test("history entries are never rewritten, but editors may prune them", async () => {
    await seedPublished(1);
    await assertFails(
      dad().doc("versions/1").set({ json: content("rewritten"), version: 1, publishedAt: now(), publishedBy: DAD.email }),
    );
    await assertFails(dad().doc("versions/1").update({ note: "edited" }));
    await assertFails(stranger().doc("versions/1").delete());
    await assertSucceeds(dad().doc("versions/1").delete());
  });

  test("an entry's id must match its version, and notes are short text", async () => {
    const record = (version: number, extra: Record<string, unknown> = {}) => ({
      json: content(`v${version}`),
      version,
      publishedAt: now(),
      publishedBy: DAD.email,
      ...extra,
    });
    await assertFails(dad().doc("versions/7").set(record(8)));
    await assertFails(dad().doc("versions/0").set(record(0)));
    await assertFails(dad().doc("versions/5").set(record(5, { note: "x".repeat(501) })));
    await assertSucceeds(dad().doc("versions/5").set(record(5, { note: "Restored the spring edit" })));
  });
});

describe("everything else", () => {
  test("is closed, even to editors", async () => {
    await assertFails(dad().doc("users/dad").set({ hello: "world" }));
    await assertFails(dad().doc("users/dad").get());
    await assertFails(dad().doc("content/other").set({ json: "{}" }));
    await assertFails(visitor().doc("settings/site").get());
  });
});
