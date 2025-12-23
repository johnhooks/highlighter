/**
 * Known keywords in code fence metadata.
 *
 * @internal
 */
export enum Keyword {
  TITLE = "title",
  SHOW_LINE_NUMBERS = "showLineNumbers",
  HIGHLIGHT = "highlight",
}

/**
 * Union type of keyword string values, derived from the Keyword enum.
 *
 * @internal
 */
export type KeywordValue = `${Keyword}`;

/**
 * Token types for the lexer.
 *
 * @internal
 */
export type TokenType = "identifier" | "keyword" | "literal" | "symbol";

/**
 * Set of keyword values for fast lookup.
 *
 * @internal
 */
export const KEYWORD_VALUES = new Set<string>(Object.values(Keyword));
