import { toHtml } from "hast-util-to-html";
import { getHighlighter, type HighlighterOptions } from "shiki";

import { parseMetadata } from "../meta-parser/index.js";

import { renderToHast } from "./render-to-hast.js";

/**
 * MDsveX highlighter type.
 *
 * NOTE: not exported from `mdsvex`, so its copied here.
 * @public
 */
export type MdvexHighlighter = (
  code: string,
  lang: string | undefined,
  metastring: string | undefined
) => string | Promise<string>;

/**
 * Create MDsveX code highlighting function.
 *
 * @param options - Shiki highlighter options object.
 * @returns A Promise of a MDsvex highlighter function.
 * @public
 */
export async function createHighlighter(options: HighlighterOptions): Promise<MdvexHighlighter> {
  const shikiHighlighter = await getHighlighter(options);

  /**
   * Highlighter function for Mdsvex codeblocks.
   *
   * [reference](https://github.com/atomiks/rehype-pretty-code/blob/e24f8415c8264dc868006ced839d3cb7445e716a/src/index.js#L50)
   * @param code - Raw source code to highlight.
   * @param lang - Programming language.
   * @param metastring - Code block fence metadata.
   * @returns HTML string.
   */
  return function highlighter(
    code: string,
    lang: string | undefined,
    metastring: string | undefined
  ): string {
    if (!lang) return `<pre><code>${code}</code></pre>`;

    const tokens = shikiHighlighter.codeToThemedTokens(code, lang || "txt");
    const metadata = parseMetadata(metastring);
    const tree = renderToHast({ tokens, metadata });

    return toHtml(tree);
  };
}
