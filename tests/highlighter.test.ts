import { readdirSync, lstatSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

import { vi } from "vitest";

import { createHighlighter } from "../src/highlighter/highlighter.js";

import { runHighlighterFixture } from "./utils/run-fixture.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fixturesFolder = join(__dirname, "fixtures");

const bitmachinaHighlighter = await createHighlighter({ theme: "css-variables" });

describe("createHighlighter", () => {
  const highlighter = vi.fn(bitmachinaHighlighter);

  readdirSync(fixturesFolder).forEach((fixtureName) => {
    const fixture = join(fixturesFolder, fixtureName);
    if (lstatSync(fixture).isDirectory()) {
      return;
    }

    const ext = extname(fixture);
    const lang = ext.length > 1 ? ext.slice(1) : "txt";

    it("should render fixture: " + fixtureName, async () => {
      const html = await runHighlighterFixture(fixture, lang, highlighter);
      expect(html).toMatchSnapshot();
    });
  });
});
