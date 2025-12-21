/**
 * @vitest-environment jsdom
 */
import { vi } from "vitest";

import { createHighlighter } from "../src/highlighter/highlighter.js";

const singleThemeHighlighter = await createHighlighter({ theme: "github-dark" });
const dualThemeHighlighter = await createHighlighter({
  themes: { light: "github-light", dark: "github-dark" },
});

const highlighter = vi.fn(singleThemeHighlighter);

describe("highlighter", () => {
  describe("theme modes", () => {
    it("should work with single theme", async () => {
      const html = await singleThemeHighlighter("const x = 1;", "js");
      expect(html).toContain('class="shiki github-dark"');
      expect(html).toContain("background-color:");
    });

    it("should work with dual themes", async () => {
      const html = await dualThemeHighlighter("const x = 1;", "js");
      expect(html).toContain('class="shiki shiki-themes github-light github-dark"');
      expect(html).toContain("--shiki-dark:");
      expect(html).toContain("--shiki-dark-bg:");
    });

    it("should apply transforms with dual themes", async () => {
      const html = await dualThemeHighlighter("const x = 1;", "js", 'title="test.js"');
      document.body.innerHTML = html;
      const pre = document.querySelector("pre");
      expect(pre?.getAttribute("data-code-title")).toBe("test.js");
      const code = document.querySelector("code");
      expect(code?.getAttribute("data-language")).toBe("js");
    });
  });

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
          expect(line).toBeTruthy();
          expect(line?.getAttribute("data-line-number")).toEqual("1");
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
          expect(line).toBeTruthy();
          expect(line?.getAttribute("data-line-number")).toEqual("10");
        });
      });
    });
  });

  describe("highlighted lines", async () => {
    const code = `let line = 1;\nline = 2;\nline = 3;\nline=4\nline=5\nline=6`;

    it("should highlight a single line", async () => {
      const lines = await injectThenQueryLines(code, "js", "js highlight{2}");
      lines.forEach((line, index) => {
        const isHighlighted = line.hasAttribute("data-highlighted");
        expect(isHighlighted).toBe(index === 1);
      });
    });

    it("should highlight a range of lines", async () => {
      const lines = await injectThenQueryLines(code, "js", "js highlight{2-4}");
      lines.forEach((line, index) => {
        const isHighlighted = line.hasAttribute("data-highlighted");
        expect(isHighlighted).toBe([1, 2, 3].includes(index));
      });
    });

    it("should highlight a single line and a range of lines", async () => {
      const lines = await injectThenQueryLines(code, "js", "js highlight{2-4,6}");
      lines.forEach((line, index) => {
        const isHighlighted = line.hasAttribute("data-highlighted");
        expect(isHighlighted).toBe([1, 2, 3, 5].includes(index));
      });
    });

    describe("passing negative ranges", async () => {
      it("should not throw error and ignore negative range", async () => {
        const lines = await injectThenQueryLines(code, "js", "js highlight{-4..-1}");
        lines.forEach((line) => {
          const isHighlighted = line.hasAttribute("data-highlighted");
          expect(isHighlighted).toBe(false);
        });
      });
    });
  });

  describe("metadata", () => {
    it("should add title to pre element", async () => {
      const html = await highlighter("const x = 1;", "js", 'title="example.js"');
      document.body.innerHTML = html;
      const pre = document.querySelector("pre");
      expect(pre?.getAttribute("data-code-title")).toBe("example.js");
    });

    it("should add language to code element", async () => {
      const html = await highlighter("const x = 1;", "js");
      document.body.innerHTML = html;
      const code = document.querySelector("code");
      expect(code?.getAttribute("data-language")).toBe("js");
    });

    it("should add data-line-numbers attribute when showLineNumbers is set", async () => {
      const html = await highlighter("const x = 1;", "js", "showLineNumbers");
      document.body.innerHTML = html;
      const code = document.querySelector("code");
      expect(code?.hasAttribute("data-line-numbers")).toBe(true);
    });
  });

  describe("svelte escaping", () => {
    it("should escape curly braces", async () => {
      const html = await highlighter("const obj = { a: 1 };", "js");
      expect(html).toContain("&#123;");
      expect(html).toContain("&#125;");
      expect(html).not.toMatch(/>([^<]*[{}][^<]*)</);
    });

    it("should escape backticks", async () => {
      const html = await highlighter("const str = `hello`;", "js");
      expect(html).toContain("&#96;");
    });

    it("should escape angle brackets", async () => {
      const html = await highlighter("<div>hello</div>", "html");
      // Shiki escapes < and > to &#x3C; and > respectively
      expect(html).toContain("&#x3C;");
      expect(html).toContain(">");
    });
  });
});

async function injectThenQueryLines(code: string, lang: string, metadata: string) {
  const html = await highlighter(code, lang, metadata);
  document.body.innerHTML = html;
  return document.querySelectorAll("span[data-line-number]");
}
