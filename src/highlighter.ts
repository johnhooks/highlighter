import type { Element } from "hast";
import { toHtml } from "hast-util-to-html";
import rangeParser from "parse-numeric-range";
import rehypeParse from "rehype-parse";
import { getHighlighter, type HighlighterOptions } from "shiki";
import { unified } from "unified";
import { visit } from "unist-util-visit";

/**
 * MDsveX highlighter type.
 *
 * NOTE: not exported from `mdsvex`, so its copied here.
 */
type Highlighter = (
  code: string,
  lang: string | undefined,
  metastring: string | undefined
) => string | Promise<string>;

/**
 * Escape curlies, backtick, \t, \r, \n to avoid breaking output of {@html `here`} in .svelte
 *
 * [reference](https://github.com/pngwn/MDsveX/blob/6c60fe68c335fce559db9690fbf5e69ef539d37d/packages/mdsvex/src/transformers/index.ts#L571)
 * @param str - The string to escape.
 */
function escape_svelty(str: string): string {
  return str
    .replace(
      /[{}`]/g,
      (c) => ({ "{": "&#123;", "}": "&#125;", "`": "&#96;" }[c as unknown as "{" | "}" | "`"])
    )
    .replace(/\\([trn])/g, "&#92;$1");
}

const reverseString = (s) => s?.split("").reverse().join("");

const hastParser = unified().use(rehypeParse, { fragment: true });

/**
 * Create MDsveX code highlighting function.
 *
 * @param options - Shiki highlighter options object.
 * @returns A Promise of a MDsvex highlighter function.
 * @public
 */
export async function createHighlighter(options: HighlighterOptions): Promise<Highlighter> {
  const shikiHighlighter = await getHighlighter(options);

  /**
   * Highlighter function for Mdsvex codeblocks.
   *
   * [reference](https://github.com/atomiks/rehype-pretty-code/blob/e24f8415c8264dc868006ced839d3cb7445e716a/src/index.js#L50)
   * @param raw - Source code to highlight
   * @param lang - Source language
   * @param metastring - Source metadata
   * @returns HTML string
   */
  return function highlighter(
    raw: string,
    lang: string | undefined,
    metastring: string | undefined
  ): string {
    const titleMatch = metastring?.match(/title="(.+)"/);
    const title = titleMatch?.[1] ?? null;
    const titleString = titleMatch?.[0] ?? "";
    const metaWithoutTitle = metastring?.replace(titleString, "");

    const tree = hastParser.parse(shikiHighlighter.codeToHtml(raw, { lang: lang || "txt" }));

    const lineNumbers = metastring ? rangeParser(metaWithoutTitle?.match(/{(.*)}/)?.[1] ?? "") : [];
    let lineCounter = 0;

    // inspiration: https://github.com/atomiks/rehype-pretty-code/blob/e24f8415c8264dc868006ced839d3cb7445e716a/src/index.js#L89
    visit(tree, "element", (node) => {
      node.properties = node.properties ?? {};

      if (
        node.tagName === "code" &&
        /srebmuNeniLwohs(?!(.*)(\/))/.test(reverseString(metastring))
      ) {
        node.properties["data-line-numbers"] = "";

        const lineNumbersStartAtMatch = reverseString(metastring).match(
          /(?:\}(\d+){)?srebmuNeniLwohs(?!(.*)(\/))/
        );
        if (lineNumbersStartAtMatch[1])
          node.properties["style"] = `counter-set: line ${
            reverseString(lineNumbersStartAtMatch[1]) - 1
          };`;
      }

      // TODO fix the highlighted line to fill the scrolling overflow.
      if (node.properties.className?.[0] === "line") {
        if (lineNumbers.length !== 0 && lineNumbers.includes(++lineCounter)) {
          node.properties["data-highlight"] = "";
        }
      }
    });

    toFragment({ node: tree as unknown as Element, lang, title });

    return escape_svelty(toHtml(tree));
  };
}

/**
 * Convert hast `Root` to an `Element`.
 *
 * [reference](https://github.com/atomiks/rehype-pretty-code/blob/e24f8415c8264dc868006ced839d3cb7445e716a/src/index.js#L9)
 * @param params - Parameters to turn `node` into a `fragment`.
 * @returns
 */
function toFragment({
  node,
  lang,
  title,
  inline = false,
}: {
  node: Element;
  lang: string | undefined;
  title: string | null;
  inline?: boolean;
}) {
  node.tagName = inline ? "span" : "div";
  // User can replace this with a real Fragment at runtime
  node.properties = { "data-code-fragment": "" };

  const pre = node.children[0] as Element;
  // Remove class="shiki" and the background-color
  pre.properties = pre.properties ?? {};
  pre.properties.class = undefined;
  pre.properties["data-language"] = lang;

  const code = pre.children[0] as Element;
  code.properties = code.properties ?? {};
  code.properties["data-language"] = lang;

  if (inline) {
    node.children = [code];
    return;
  }

  if (title) {
    // TODO create a flexible format to customize adding a title to the code blocks.
    pre.properties["data-code-title"] = title;
    return;
  }

  node.children = [pre];
}
