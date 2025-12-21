import { readFile } from "node:fs/promises";

// To add a test, create a source code file in the fixtures folder
export async function runHighlighterFixture(fixture, lang, highlighter) {
  const raw = await readFile(fixture, "utf8");
  return highlighter(raw, lang);
}
