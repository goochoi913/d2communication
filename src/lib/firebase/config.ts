/**
 * Firebase web app identifiers. These are public by design (every visitor's browser
 * receives them); access is controlled by the security rules and the sign-in blocking
 * functions, never by keeping this config secret.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyDvmqDbUN9RX8aTZfj2RqeS4f3mCiq8wuQ",
  authDomain: "d2communication.firebaseapp.com",
  projectId: "d2communication",
  storageBucket: "d2communication.firebasestorage.app",
  messagingSenderId: "1098303015580",
  appId: "1:1098303015580:web:c17f9e3a43ac0409123b59",
};

/**
 * The only two accounts allowed to sign in and edit. The same list is enforced on the
 * server in `firestore.rules`, `storage.rules` and the sign-in blocking functions.
 */
export const EDITOR_EMAILS = ["pdjschoi@gmail.com", "goochoi913@gmail.com"] as const;

/** Local development against the Firebase emulators (`npm run emulators`). */
export const EMULATOR_PROJECT_ID = "demo-d2communication";
export const EMULATOR_PORTS = { auth: 9099, firestore: 8080, storage: 9199, functions: 5001 } as const;
