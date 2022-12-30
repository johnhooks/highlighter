import { readdirSync, lstatSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

import { getHighlighter } from "shiki";
import { vi } from "vitest";

import { runHastFixture } from "./utils/run-fixture.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fixturesFolder = join(__dirname, "fixtures");

const shikiHighlighter = await getHighlighter({ theme: "css-variables" });

describe("renderToHast", () => {
  const tokenizer = vi.fn(shikiHighlighter.codeToThemedTokens);

  readdirSync(fixturesFolder).forEach((fixtureName) => {
    const fixture = join(fixturesFolder, fixtureName);
    if (lstatSync(fixture).isDirectory()) {
      return;
    }

    const ext = extname(fixture);
    const lang = ext.length > 1 ? ext.slice(1) : "txt";

    it("should render fixture: " + fixtureName, async () => {
      const hast = await runHastFixture(fixture, lang, tokenizer);
      expect(hast).toMatchSnapshot();
    });
  });
});
