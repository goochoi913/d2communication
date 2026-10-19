/**
 * The only two accounts that may sign in and edit the site. Keep this list identical to
 * EDITOR_EMAILS in src/lib/firebase/config.ts, firestore.rules and storage.rules.
 */
export const EDITOR_EMAILS: readonly string[] = ["pdjschoi@gmail.com", "goochoi913@gmail.com"];

export function isEditorEmail(email: string | undefined, emailVerified: boolean): boolean {
  return !!email && emailVerified && EDITOR_EMAILS.includes(email.toLowerCase());
}
