import { parseMetadata } from "../src/parse-metadata/index.js";

describe("parseMetadata", () => {
  describe("empty input", () => {
    it("should return defaults for undefined", () => {
      expect(parseMetadata(undefined)).toEqual({
        lineNumbers: [],
        lineNumbersStart: 1,
        showLineNumbers: false,
      });
    });

    it("should return defaults for null", () => {
      expect(parseMetadata(null)).toEqual({
        lineNumbers: [],
        lineNumbersStart: 1,
        showLineNumbers: false,
      });
    });

    it("should return defaults for empty string", () => {
      expect(parseMetadata("")).toEqual({
        lineNumbers: [],
        lineNumbersStart: 1,
        showLineNumbers: false,
      });
    });
  });

  describe("title", () => {
    it("should parse double-quoted title", () => {
      const metadata = parseMetadata('title="hello world"');
      expect(metadata.title).toEqual("hello world");
    });

    it("should parse single-quoted title", () => {
      const metadata = parseMetadata("title='hello world'");
      expect(metadata.title).toEqual("hello world");
    });

    it("should parse title with language prefix", () => {
      const metadata = parseMetadata('js title="example.js"');
      expect(metadata.title).toEqual("example.js");
    });

    it("should return undefined when no title", () => {
      const metadata = parseMetadata("js");
      expect(metadata.title).toBeUndefined();
    });
  });

  describe("line numbers", () => {
    it("should parse single line number", () => {
      const metadata = parseMetadata("{5}");
      expect(metadata.lineNumbers).toEqual([5]);
    });

    it("should parse multiple line numbers", () => {
      const metadata = parseMetadata("{1,3,5}");
      expect(metadata.lineNumbers).toEqual([1, 3, 5]);
    });

    it("should parse line range", () => {
      const metadata = parseMetadata("{1-5}");
      expect(metadata.lineNumbers).toEqual([1, 2, 3, 4, 5]);
    });

    it("should parse mixed line numbers and ranges", () => {
      const metadata = parseMetadata("{1,3-5,7}");
      expect(metadata.lineNumbers).toEqual([1, 3, 4, 5, 7]);
    });

    it("should parse highlight syntax", () => {
      const metadata = parseMetadata("highlight{1-3}");
      expect(metadata.lineNumbers).toEqual([1, 2, 3]);
    });

    it("should return empty array when no line numbers", () => {
      const metadata = parseMetadata("js");
      expect(metadata.lineNumbers).toEqual([]);
    });
  });

  describe("showLineNumbers", () => {
    it("should detect showLineNumbers", () => {
      const metadata = parseMetadata("showLineNumbers");
      expect(metadata.showLineNumbers).toBe(true);
    });

    it("should parse starting line number", () => {
      const metadata = parseMetadata("showLineNumbers{10}");
      expect(metadata.showLineNumbers).toBe(true);
      expect(metadata.lineNumbersStart).toBe(10);
    });

    it("should default lineNumbersStart to 1", () => {
      const metadata = parseMetadata("showLineNumbers");
      expect(metadata.lineNumbersStart).toBe(1);
    });

    it("should be false when not present", () => {
      const metadata = parseMetadata("js");
      expect(metadata.showLineNumbers).toBe(false);
    });
  });

  describe("complex metadata", () => {
    it("should parse all options together", () => {
      const metadata = parseMetadata('js title="test.js" {1,3} showLineNumbers{5}');
      expect(metadata.title).toEqual("test.js");
      expect(metadata.lineNumbers).toEqual([1, 3]);
      expect(metadata.showLineNumbers).toBe(true);
      expect(metadata.lineNumbersStart).toBe(5);
    });
  });

  describe("snapshots", () => {
    it("should parse basic metadata", async () => {
      await expect(parseMetadata("js")).toMatchJsonSnapshot();
    });

    it("should parse title with double quotes", async () => {
      await expect(parseMetadata('title="hello"')).toMatchJsonSnapshot();
    });

    it("should parse title with single quotes", async () => {
      await expect(parseMetadata("title='hello'")).toMatchJsonSnapshot();
    });

    it("should parse line highlighting", async () => {
      await expect(parseMetadata("{1,3-5}")).toMatchJsonSnapshot();
    });

    it("should parse showLineNumbers with start", async () => {
      await expect(parseMetadata("showLineNumbers{10}")).toMatchJsonSnapshot();
    });

    it("should parse complex metadata", async () => {
      await expect(
        parseMetadata('js title="example.js" {1-3,5} showLineNumbers{100}')
      ).toMatchJsonSnapshot();
    });
  });
});
