import rangeParser from "parse-numeric-range";

import { Metadata } from "./types.js";

/**
 * Parse Markdown code fence metadata.
 *
 * @param metastring - Code block metadata string.
 * @returns Parsed metadata values object.
 * @public
 */
export function parseMetadata(metastring: string | undefined): Metadata {
  if (metastring === undefined) return { lineNumbers: [], lineNumbersStart: 0 };
  const titleMatch = metastring?.match(/title="(.+)"/);
  const title = titleMatch?.[1] ?? undefined;
  // full title string `title="..."`
  const titleString = titleMatch?.[0] ?? "";
  const metaWithoutTitle = metastring?.replace(titleString, "");

  const lineNumbers = metastring ? rangeParser(metaWithoutTitle.match(/{(.*)}/)?.[1] ?? "") : [];

  const lineNumbersStartAtMatch = reverseString(metastring)?.match(
    /(?:\}(\d+){)?srebmuNeniLwohs(?!(.*)(\/))/
  );
  const lineNumbersStart = lineNumbersStartAtMatch?.[1]
    ? parseInt(reverseString(lineNumbersStartAtMatch[1]))
    : 1;

  return { lineNumbers, lineNumbersStart, title };
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
