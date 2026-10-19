import { defineConfig } from "vitest/config";

// Vitest only runs the security-rules tests, against the Firebase emulators:
// `npm run test:rules` starts them, runs these files and shuts them down again.
export default defineConfig({
  test: {
    include: ["tests/rules/**/*.test.ts"],
    environment: "node",
    // Both files share one set of emulators and clear them between tests.
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
