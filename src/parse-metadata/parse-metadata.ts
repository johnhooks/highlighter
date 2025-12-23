import { parseRange } from "./parse-range.js";
import { TMetadata } from "./types.js";

/**
 * Parse Markdown code fence metadata.
 *
 * @param metastring - Code block metadata string.
 * @returns Parsed metadata values object.
 * @public
 */
export function parseMetadata(metastring: string | undefined | null): TMetadata {
  if (!metastring) {
    return { lineNumbers: [], lineNumbersStart: 1, showLineNumbers: false };
  }
  const titleMatch = metastring.match(/title="(.+)"/);
  const title = titleMatch?.[1];
  // full title string `title="..."`
  const titleString = titleMatch?.[0] ?? "";
  const metaWithoutTitle = metastring.replace(titleString, "");

  const lineNumbers = parseRange(metaWithoutTitle.match(/{(.*)}/)?.[1] ?? "");

  const showLineNumbers = /srebmuNeniLwohs(?!(.*)(\/))/.test(reverseString(metastring));

  const lineNumbersStartAtMatch = reverseString(metastring)?.match(
    /(?:\}(\d+){)?srebmuNeniLwohs(?!(.*)(\/))/
  );

  const lineNumbersStart = lineNumbersStartAtMatch?.[1]
    ? parseInt(reverseString(lineNumbersStartAtMatch[1]))
    : 1;

  return { lineNumbers, lineNumbersStart, showLineNumbers, title };
}

/**
 * Reverse a string;
 *
 * @param s - String to reverse.
 * I don't know why Rehype Pretty Code reverses the string like this
 */
function reverseString(s: string): string;
function reverseString(s: string | undefined): string | undefined {
  return s?.split("").reverse().join("");
}
