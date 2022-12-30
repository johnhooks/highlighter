import { readFile } from "node:fs/promises";

import { renderToHast } from "../../src/highlighter/render-to-hast.js";

// To add a test, create a source code file in the fixtures folder
export async function runHastFixture(fixture, lang, tokenizer) {
  const code = await readFile(fixture, "utf8");
  const tokens = tokenizer(code, lang);
  return renderToHast({ tokens });
}

export async function runHighlighterFixture(fixture, lang, highlighter) {
  const code = await readFile(fixture, "utf8");
  return highlighter(code, lang);
}
