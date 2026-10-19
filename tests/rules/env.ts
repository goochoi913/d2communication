import { readFileSync } from "node:fs";
import { initializeTestEnvironment, type RulesTestEnvironment, type TokenOptions } from "@firebase/rules-unit-testing";

/** Emulator-only project, so nothing here can ever touch the real one. */
export const PROJECT_ID = "demo-d2communication";

export const DAD = { uid: "dad", email: "pdjschoi@gmail.com" };
export const GOO = { uid: "goo", email: "goochoi913@gmail.com" };
export const STRANGER = { uid: "stranger", email: "someone.else@gmail.com" };

/** Starts a test environment with both rule files loaded into the running emulators. */
export function startEnv(): Promise<RulesTestEnvironment> {
  return initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
    storage: { rules: readFileSync("storage.rules", "utf8") },
  });
}

/** A signed-in Google account, as the Auth service would issue it. */
export function googleUser(
  env: RulesTestEnvironment,
  who: { uid: string; email: string },
  overrides: Partial<TokenOptions> = {},
) {
  return env.authenticatedContext(who.uid, {
    email: who.email,
    email_verified: true,
    firebase: { sign_in_provider: "google.com" },
    ...overrides,
  });
}
