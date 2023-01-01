import { screen } from "@testing-library/dom";
import { vi } from "vitest";

import { createHighlighter } from "../src/highlighter/highlighter.js";

const bitmachinaHighlighter = await createHighlighter({ theme: "css-variables" });

describe("highlighter", () => {
  const highlighter = vi.fn(bitmachinaHighlighter);

  describe("default render option", async () => {
    const code = `let line = 1;\nline = 2;\nline = 3;\n`;
    const html = await highlighter(code, "js");

    it("should add data-line-number properties", () => {
      document.body.innerHTML = html;
      const lineOne = screen.getByText("let line = 1;");
      expect(lineOne).toBeVisible();
    });
  });
});
