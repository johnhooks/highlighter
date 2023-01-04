import { lexer } from "../src/parse-metadata/lexer.js";

describe("lexer", () => {
  describe("tokens", () => {
    const tokens = lexer('title="testing lexer"');
    it("should lex an identifier token", () => {
      const [identifier] = tokens;
      expect(identifier).toEqual({ value: "title", type: "identifier", start: 0, end: 5 });
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
    it("should lex a single identifier", () => {
      const tokens = lexer(`javascript`);
      expect(tokens).toMatchSnapshot();
    });

    it("should lex a single quote pair", () => {
      const tokens = lexer("'single'");
      expect(tokens).toMatchSnapshot();
    });

    it("should lex a double quote pair", () => {
      const tokens = lexer('"double"');
      expect(tokens).toMatchSnapshot();
    });

    it("should lex a dash pair", () => {
      const tokens = lexer("/word/");
      expect(tokens).toMatchSnapshot();
    });

    it("should lex a paren pair", () => {
      const tokens = lexer("(argument)");
      expect(tokens).toMatchSnapshot();
    });

    it("should lex a brace pair", () => {
      const tokens = lexer("{range}");
      expect(tokens).toMatchSnapshot();
    });

    it("should lex a title", () => {
      const tokens = lexer('title="hello lexer"');
      expect(tokens).toMatchSnapshot();
    });

    it("should lex a range", () => {
      const tokens = lexer("{3..5,7}");
      expect(tokens).toMatchSnapshot();
    });

    it("should lex a `showLineNumbers `identifier", () => {
      const tokens = lexer("showLineNumbers");
      expect(tokens).toMatchSnapshot();
    });

    it("should lex a starting line number", () => {
      const tokens = lexer("showLineNumbers{5}");
      expect(tokens).toMatchSnapshot();
    });
  });
});
