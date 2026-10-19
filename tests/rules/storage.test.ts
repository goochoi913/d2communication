import "firebase/compat/storage";
import { assertFails, assertSucceeds, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { afterAll, beforeAll, beforeEach, describe, test } from "vitest";

import { DAD, GOO, STRANGER, googleUser, startEnv } from "./env";

const MB = 1024 * 1024;
const bytes = (size: number) => new Uint8Array(size);

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await startEnv();
});
afterAll(async () => {
  await env?.cleanup();
});
beforeEach(async () => {
  await env.clearStorage();
});

const dad = () => googleUser(env, DAD).storage();
const goo = () => googleUser(env, GOO).storage();
const stranger = () => googleUser(env, STRANGER).storage();
const unverifiedDad = () => googleUser(env, { uid: "imposter", email: DAD.email }, { email_verified: false }).storage();
const visitor = () => env.unauthenticatedContext().storage();

type Storage = ReturnType<typeof dad>;

/** An upload as a real promise (the SDK's UploadTask is only thenable). */
async function upload(storage: Storage, path: string, size: number, contentType: string) {
  return storage.ref(path).put(bytes(size), { contentType });
}

async function seed(path: string, contentType = "image/webp") {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await ctx.storage().ref(path).put(bytes(1024), { contentType });
  });
}

describe("reading media", () => {
  test("anyone can read uploaded media", async () => {
    await seed("media/img/abc123/1280.webp");
    await assertSucceeds(visitor().ref("media/img/abc123/1280.webp").getMetadata());
    await assertSucceeds(stranger().ref("media/img/abc123/1280.webp").getMetadata());
  });

  test("nothing outside the four media folders can be read", async () => {
    await seed("media/private/notes.webp");
    await seed("uploads/raw.webp");
    await assertFails(visitor().ref("media/private/notes.webp").getMetadata());
    await assertFails(dad().ref("uploads/raw.webp").getMetadata());
  });
});

describe("uploading", () => {
  test("editors upload each kind of media within its limits", async () => {
    await assertSucceeds(upload(dad(), "media/img/a1/2560.webp", 2 * MB, "image/webp"));
    await assertSucceeds(upload(dad(), "media/img/a1/1280.jpg", 1 * MB, "image/jpeg"));
    await assertSucceeds(upload(goo(), "media/poster/p1/1920.png", 3 * MB, "image/png"));
    await assertSucceeds(upload(dad(), "media/poster/p2/1920.avif", 1 * MB, "image/avif"));
    await assertSucceeds(upload(dad(), "media/logo/kbs/logo.svg", 40 * 1024, "image/svg+xml"));
    await assertSucceeds(upload(dad(), "media/logo/mbc/logo.png", 1 * MB, "image/png"));
    await assertSucceeds(upload(dad(), "media/loop/l1/loop.mp4", 3 * MB, "video/mp4"));
    await assertSucceeds(upload(goo(), "media/loop/l2/loop.webm", 3 * MB, "video/webm"));
  });

  test("visitors, strangers and unverified accounts can't upload", async () => {
    await assertFails(upload(visitor(), "media/img/x/640.webp", 1024, "image/webp"));
    await assertFails(upload(stranger(), "media/img/x/640.webp", 1024, "image/webp"));
    await assertFails(upload(unverifiedDad(), "media/img/x/640.webp", 1024, "image/webp"));
  });

  test("an existing file is never overwritten", async () => {
    await seed("media/img/taken/1280.webp");
    await assertFails(upload(dad(), "media/img/taken/1280.webp", 1024, "image/webp"));
  });

  test("files over the size limit are refused", async () => {
    await assertSucceeds(upload(dad(), "media/img/edge/2560.webp", 10 * MB, "image/webp"));
    await assertFails(upload(dad(), "media/img/big/2560.webp", 10 * MB + 1, "image/webp"));
    await assertFails(upload(dad(), "media/poster/big/1920.jpg", 10 * MB + 1, "image/jpeg"));
    await assertFails(upload(dad(), "media/logo/big/logo.png", 5 * MB + 1, "image/png"));
    await assertFails(upload(dad(), "media/loop/big/loop.mp4", 25 * MB + 1, "video/mp4"));
  });

  test("files of the wrong type for their folder are refused", async () => {
    await assertFails(upload(dad(), "media/img/x/page.html", 1024, "text/html"));
    await assertFails(upload(dad(), "media/img/x/vector.svg", 1024, "image/svg+xml"));
    await assertFails(upload(dad(), "media/img/x/clip.mp4", 1024, "video/mp4"));
    await assertFails(upload(dad(), "media/poster/x/anim.gif", 1024, "image/gif"));
    await assertFails(upload(dad(), "media/logo/x/logo.gif", 1024, "image/gif"));
    await assertFails(upload(dad(), "media/loop/x/still.webp", 1024, "image/webp"));
    await assertFails(upload(dad(), "media/loop/x/clip.mov", 1024, "video/quicktime"));
  });

  test("uploads outside the four media folders are refused", async () => {
    await assertFails(upload(dad(), "media/other/x/file.webp", 1024, "image/webp"));
    await assertFails(upload(dad(), "uploads/x.webp", 1024, "image/webp"));
    await assertFails(upload(dad(), "x.webp", 1024, "image/webp"));
  });
});

describe("deleting", () => {
  test("only editors can delete media", async () => {
    await seed("media/img/del/1280.webp");
    await assertFails(visitor().ref("media/img/del/1280.webp").delete());
    await assertFails(stranger().ref("media/img/del/1280.webp").delete());
    await assertFails(unverifiedDad().ref("media/img/del/1280.webp").delete());
    await assertSucceeds(dad().ref("media/img/del/1280.webp").delete());
  });
});
