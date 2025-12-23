import { parseRange } from "../src/parse-metadata/parse-range.js";

describe("parseRange", () => {
  describe("single numbers", () => {
    it("should parse a single number", () => {
      expect(parseRange("5")).toEqual([5]);
    });

    it("should ignore zero", () => {
      expect(parseRange("0")).toEqual([]);
    });
  });

  describe("comma-separated", () => {
    it("should parse comma-separated numbers", () => {
      expect(parseRange("1,3,5")).toEqual([1, 3, 5]);
    });

    it("should handle whitespace around commas", () => {
      expect(parseRange("1, 3 , 5")).toEqual([1, 3, 5]);
    });

    it("should skip empty parts", () => {
      expect(parseRange("1,,3")).toEqual([1, 3]);
    });
  });

  describe("ranges with dash", () => {
    it("should parse ascending range", () => {
      expect(parseRange("1-5")).toEqual([1, 2, 3, 4, 5]);
    });

    it("should parse descending range as ascending", () => {
      expect(parseRange("5-1")).toEqual([1, 2, 3, 4, 5]);
    });

    it("should parse single element range", () => {
      expect(parseRange("3-3")).toEqual([3]);
    });
  });

  describe("ranges with dots", () => {
    it("should parse range with ..", () => {
      expect(parseRange("1..5")).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("mixed", () => {
    it("should parse mixed single and range", () => {
      expect(parseRange("1,3-5,7")).toEqual([1, 3, 4, 5, 7]);
    });

    it("should parse complex mixed input", () => {
      expect(parseRange("1-3,5,7..9,11")).toEqual([1, 2, 3, 5, 7, 8, 9, 11]);
    });
  });

  describe("edge cases", () => {
    it("should return empty array for empty string", () => {
      expect(parseRange("")).toEqual([]);
    });

    it("should return empty array for whitespace only", () => {
      expect(parseRange("   ")).toEqual([]);
    });

    it("should ignore invalid parts", () => {
      expect(parseRange("1,abc,3")).toEqual([1, 3]);
    });
  });
});
