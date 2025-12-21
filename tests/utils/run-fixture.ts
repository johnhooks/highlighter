import { readFile } from "node:fs/promises";

// eslint-disable-next-line import/default
import prettier from "prettier";

import { renderToHast } from "../../src/highlighter/render-to-hast.js";

// prettier requires this to import into an es module without error.
// eslint-disable-next-line import/no-named-as-default-member
const { format, resolveConfig } = prettier;

const prettierOptions = {
  ...(await resolveConfig(process.cwd())),
  parser: "babel",
};

// To add a test, create a source code file in the fixtures folder
export async function runHastFixture(fixture, lang, tokenizer) {
  const code = await readFile(fixture, "utf8");
  const tokens = await tokenizer(code, lang);
  return renderToHast({ tokens });
}

export async function runHighlighterFixture(fixture, lang, highlighter) {
  const raw = await readFile(fixture, "utf8");
  const code = await highlighter(raw, lang);
  return format(code, prettierOptions);
}
