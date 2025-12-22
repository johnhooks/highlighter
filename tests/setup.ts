import { join, dirname } from "node:path";

import { expect } from "vitest";

/**
 * Derive snapshot path from current test state.
 */
function getSnapshotPath(ext: string): string {
  const state = expect.getState();
  const testPath = state.testPath ?? "unknown";
  const testName = state.currentTestName ?? "unknown";

  // Get directory of test file
  const testDir = dirname(testPath);

  // Convert test name to filename-safe string
  // "lexer > snapshots > should lex a single identifier" -> "single-identifier"
  const name = testName
    .split(" > ")
    .pop()! // Get last segment (the actual test name)
    .replace(/^should /, "")
    .replace(/^(a|an) /, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  // Derive subfolder from describe block
  // "lexer > snapshots > ..." -> "lexer"
  const parts = testName.split(" > ");
  const category = parts[0]?.toLowerCase().replace(/[^a-z0-9]+/g, "-") ?? "misc";

  return join(testDir, "__snapshots__", category, `${name}.${ext}`);
}

// Extend Vitest's expect with custom matchers
expect.extend({
  async toMatchJsonSnapshot(received: unknown) {
    const path = getSnapshotPath("json");
    const json = JSON.stringify(received, null, 2);

    // Use Vitest's file snapshot under the hood
    try {
      await expect(json).toMatchFileSnapshot(path);
      return { pass: true, message: () => "" };
    } catch (error) {
      return {
        pass: false,
        message: () => (error as Error).message,
      };
    }
  },

  async toMatchHtmlSnapshot(received: string) {
    const path = getSnapshotPath("html");

    try {
      await expect(received).toMatchFileSnapshot(path);
      return { pass: true, message: () => "" };
    } catch (error) {
      return {
        pass: false,
        message: () => (error as Error).message,
      };
    }
  },
});

// Extend TypeScript types
declare module "vitest" {
  interface Assertion {
    toMatchJsonSnapshot(): Promise<void>;
    toMatchHtmlSnapshot(): Promise<void>;
  }
  interface AsymmetricMatchersContaining {
    toMatchJsonSnapshot(): void;
    toMatchHtmlSnapshot(): void;
  }
}
