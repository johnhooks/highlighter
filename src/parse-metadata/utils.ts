import { KEYWORD_VALUES, KeywordValue } from "./constants.js";

/**
 * Type guard to check if a string is a known keyword.
 *
 * @internal
 */
export function isKeyword(value: string): value is KeywordValue {
  return KEYWORD_VALUES.has(value);
}
