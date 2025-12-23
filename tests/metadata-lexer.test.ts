import { lexer } from "../src/parse-metadata/lexer.js";

describe("lexer", () => {
  describe("tokens", () => {
    const tokens = lexer('title="testing lexer"');
    it("should lex a keyword token", () => {
      const [keyword] = tokens;
      expect(keyword).toEqual({ value: "title", type: "keyword", start: 0, end: 5 });
    });

    it("should lex symbol tokens", () => {
      const [, equal, leftQuote, , rightQuote] = tokens;
      expect(equal).toEqual({ value: "=", type: "symbol", start: 5, end: 6 });
      expect(leftQuote).toEqual({ value: '"', type: "symbol", start: 6, end: 7 });
      expect(rightQuote).toEqual({ value: '"', type: "symbol", start: 20, end: 21 });
    });

    it("should lex a literal token", () => {
      const [, , , literal] = tokens;
      expect(literal).toEqual({ value: "testing lexer", type: "literal", start: 7, end: 20 });
    });
  });

  describe("snapshots", () => {
    it("should lex single identifier", async () => {
      const tokens = lexer(`javascript`);
      await expect(tokens).toMatchJsonSnapshot();
    });

    it("should lex single quote pair", async () => {
      const tokens = lexer("'single'");
      await expect(tokens).toMatchJsonSnapshot();
    });

    it("should lex double quote pair", async () => {
      const tokens = lexer('"double"');
      await expect(tokens).toMatchJsonSnapshot();
    });

    it("should lex dash pair", async () => {
      const tokens = lexer("/word/");
      await expect(tokens).toMatchJsonSnapshot();
    });

    it("should lex paren pair", async () => {
      const tokens = lexer("(argument)");
      await expect(tokens).toMatchJsonSnapshot();
    });

    it("should lex brace pair", async () => {
      const tokens = lexer("{range}");
      await expect(tokens).toMatchJsonSnapshot();
    });

    it("should lex title", async () => {
      const tokens = lexer('title="hello lexer"');
      await expect(tokens).toMatchJsonSnapshot();
    });

    it("should lex range", async () => {
      const tokens = lexer("{3..5,7}");
      await expect(tokens).toMatchJsonSnapshot();
    });

    it("should lex showLineNumbers identifier", async () => {
      const tokens = lexer("showLineNumbers");
      await expect(tokens).toMatchJsonSnapshot();
    });

    it("should lex starting line number", async () => {
      const tokens = lexer("showLineNumbers{5}");
      await expect(tokens).toMatchJsonSnapshot();
    });
  });
});
