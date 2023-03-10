import { vi } from "vitest";

import { createHighlighter } from "../src/highlighter/highlighter.js";

const bitmachinaHighlighter = await createHighlighter({ theme: "css-variables" });
const highlighter = vi.fn(bitmachinaHighlighter);

describe("highlighter", () => {
  describe("render options", async () => {
    describe("line numbers", async () => {
      beforeEach(async () => {
        const code = `let line = 1;\nline = 2;\nline = 3;`;
        const html = await highlighter(code, "js");
        document.body.innerHTML = html;
      });

      describe("default", async () => {
        it("should add data-line-number properties", () => {
          const lines = document.querySelectorAll("span[data-line-number]");
          expect(lines.length).toEqual(3);
        });

        it("should start at the right line number", () => {
          const line = document.querySelector("span[data-line-number]");
          expect(line).toBeVisible();
          expect(line.getAttribute("data-line-number")).toEqual("1");
        });
      });

      describe("metadata provided", async () => {
        beforeEach(async () => {
          const code = `let line = 1;\nline = 2;\nline = 3;`;
          const html = await highlighter(code, "js", "js showLineNumbers{10}");
          document.body.innerHTML = html;
        });

        it("should add data-line-number properties", () => {
          const lines = document.querySelectorAll("span[data-line-number]");
          expect(lines.length).toEqual(3);
        });

        it("should start at the right line number", () => {
          const line = document.querySelector("span[data-line-number]");
          expect(line).toBeVisible();
          expect(line.getAttribute("data-line-number")).toEqual("10");
        });
      });
    });
  });

  describe("highlighted lines", async () => {
    const code = `let line = 1;\nline = 2;\nline = 3;\nline=4\nline=5\nline=6`;

    it("should highlight a single line", async () => {
      const lines = await injectThenQueryLines(code, "js", "js highlight{2}");
      lines.forEach((line, index) => {
        expect(line.getAttribute("data-highlighted")).toBe(index === 1);
      });
    });

    it("should highlight a range of lines", async () => {
      const lines = await injectThenQueryLines(code, "js", "js highlight{2-4}");
      lines.forEach((line, index) => {
        expect(line.getAttribute("data-highlighted")).toBe([1, 2, 3].includes(index));
      });
    });

    it("should highlight a single line and a range of lines", async () => {
      const lines = await injectThenQueryLines(code, "js", "js highlight{2-4,6}");
      lines.forEach((line, index) => {
        expect(line.getAttribute("data-highlighted")).toBe([1, 2, 3, 5].includes(index));
      });
    });

    describe("passing negative ranges", async () => {
      it("should not throw error and ignore negative range", async () => {
        const lines = await injectThenQueryLines(code, "js", "js highlight{-4..-1}");
        lines.forEach((line) => {
          expect(line.getAttribute("data-highlighted")).toBe(false);
        });
      });
    });
  });
});

async function injectThenQueryLines(code: string, lang: string, metadata: string) {
  const html = await highlighter(code, lang, metadata);
  document.body.innerHTML = html;
  return document.querySelectorAll("span[data-line-numbers]");
}
