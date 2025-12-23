import { Keyword } from "./constants.js";
import { lexer, Token } from "./lexer.js";
import { parseRange } from "./parse-range.js";
import { TMetadata } from "./types.js";

/**
 * Parser context for tracking state during metadata parsing.
 */
type ParserContext = {
  tokens: readonly Token[];
  pos: number;
  result: TMetadata;
};

/**
 * Default metadata values.
 */
function defaultMetadata(): TMetadata {
  return { lineNumbers: [], lineNumbersStart: 1, showLineNumbers: false };
}

/**
 * Parse Markdown code fence metadata.
 *
 * @param metastring - Code block metadata string.
 * @returns Parsed metadata values object.
 * @public
 */
export function parseMetadata(metastring: string | undefined | null): TMetadata {
  if (!metastring) {
    return defaultMetadata();
  }

  const ctx: ParserContext = {
    tokens: lexer(metastring),
    pos: 0,
    result: defaultMetadata(),
  };

  while (ctx.pos < ctx.tokens.length) {
    const token = ctx.tokens[ctx.pos];

    switch (token.type) {
      case "keyword":
        parseKeyword(ctx, token.value);
        break;
      case "symbol":
        if (token.value === "{") {
          parseLineNumbers(ctx);
        } else {
          ctx.pos++;
        }
        break;
      default:
        ctx.pos++;
    }
  }

  return ctx.result;
}

/**
 * Dispatch keyword parsing based on value.
 */
function parseKeyword(ctx: ParserContext, value: string): void {
  switch (value) {
    case Keyword.TITLE:
      parseTitle(ctx);
      break;
    case Keyword.SHOW_LINE_NUMBERS:
      parseShowLineNumbers(ctx);
      break;
    case Keyword.HIGHLIGHT:
      // highlight{...} - skip the keyword, brace group handled by symbol case
      ctx.pos++;
      break;
    default:
      ctx.pos++;
  }
}

/**
 * Parse title="..." or title='...'
 */
function parseTitle(ctx: ParserContext): void {
  if (isAssignment(ctx.tokens, ctx.pos)) {
    ctx.result.title = ctx.tokens[ctx.pos + 3]?.value;
  }
  ctx.pos++;
}

/**
 * Parse showLineNumbers or showLineNumbers{n}
 */
function parseShowLineNumbers(ctx: ParserContext): void {
  ctx.result.showLineNumbers = true;

  // Check for showLineNumbers{n}
  if (isBraceGroup(ctx.tokens, ctx.pos + 1)) {
    const startNum = parseInt(ctx.tokens[ctx.pos + 2]?.value ?? "", 10);
    if (!isNaN(startNum) && startNum > 0) {
      ctx.result.lineNumbersStart = startNum;
    }
  }
  ctx.pos++;
}

/**
 * Parse {1,3-5} line highlighting.
 * Skip if preceded by showLineNumbers (that's the starting line number).
 */
function parseLineNumbers(ctx: ParserContext): void {
  const prev = ctx.tokens[ctx.pos - 1];
  const isShowLineNumbersArg = prev?.type === "keyword" && prev.value === Keyword.SHOW_LINE_NUMBERS;

  if (!isShowLineNumbersArg && ctx.result.lineNumbers.length === 0) {
    const literal = ctx.tokens[ctx.pos + 1];
    if (literal?.type === "literal") {
      ctx.result.lineNumbers = parseRange(literal.value);
    }
  }
  ctx.pos++;
}

/**
 * Check if tokens at position form an assignment: keyword = "literal"
 */
function isAssignment(tokens: readonly Token[], pos: number): boolean {
  const eq = tokens[pos + 1];
  const quote = tokens[pos + 2];
  return (
    eq?.type === "symbol" &&
    eq.value === "=" &&
    quote?.type === "symbol" &&
    (quote.value === '"' || quote.value === "'")
  );
}

/**
 * Check if tokens at position form a brace group: { literal }
 */
function isBraceGroup(tokens: readonly Token[], pos: number): boolean {
  const open = tokens[pos];
  return open?.type === "symbol" && open.value === "{";
}
