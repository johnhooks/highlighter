/**
 * Shiki renderer modified to render to hast.
 *
 * @see {@link https://github.com/shikijs/shiki/blob/a585c9d6860334a6233ff1c035a42d023e016400/packages/shiki/src/renderer.ts | shiki/src/renderer.ts} was inspiration for this module.
 * @see {@link https://github.com/atomiks/rehype-pretty-code/blob/e24f8415c8264dc868006ced839d3cb7445e716a/src/index.js | rehype-pretty-code/src/index.js} was inspiration for this module.
 */

import type { Root } from "hast";
import { h } from "hastscript";
import type { IThemedToken } from "shiki";
import { FontStyle } from "shiki";

import type { Metadata } from "../parse-metadata/index.js";

import { defaultRenderOptions } from "./default-render-options.js";
import type {
  IHastRendererOptions,
  ILineOption,
  IRenderOptions,
  IRenderToHastParams,
} from "./types.js";
import { groupBy, escapeHtml } from "./utils.js";

/**
 * Render Shiki tokens to hast, Hypertext Abstract Syntax Tree format.
 *
 * @param renderParams - The render {@link IRenderToHastParams | parameters}
 * @returns A hast syntax tree for a highlighted code block.
 * @public
 */
export function renderToHast({
  metadata = { lineNumbers: [], lineNumbersStart: 1 },
  options = {},
  tokens,
}: IRenderToHastParams): Root {
  // If the user supplied custom elements override the defaults.
  options.elements = Object.assign(defaultRenderOptions, options.elements || {});
  const pre = options.elements?.["pre"] as IRenderOptions["pre"];
  const code = options.elements?.["code"] as IRenderOptions["code"];

  const lineNodes = renderLines({ lines: tokens, options, metadata });
  const codeNode = code({ children: lineNodes, meta: metadata });
  const preNode = pre({ children: [codeNode], meta: metadata });

  return h(null, [preNode]);
}

/**
 *  Kept for compatibility with {@link shiki#renderToHtml | renderToHtml}
 *
 * @internal
 */
function getLineClasses(lineOptions: ILineOption[]): string[] {
  const lineClasses = new Set(["line"]);
  for (const lineOption of lineOptions) {
    if (Array.isArray(lineOption.className)) {
      for (const lineClass of lineOption.className ?? []) {
        if (typeof lineClass === "string") {
          lineClasses.add(lineClass);
        }
      }
    }
  }
  return Array.from(lineClasses);
}

/**
 * Render the matrix of Shiki tokens to hast.
 *
 * @internal
 */
function renderLines({
  lines,
  metadata,
  options = {},
}: {
  lines: IThemedToken[][];
  metadata: Metadata;
  options?: IHastRendererOptions;
}) {
  const optionsByLineNumber = groupBy(options.lineOptions ?? [], (option) => option.line);
  const line = options.elements?.["line"] as IRenderOptions["line"];

  return lines.map((tokens, index) => {
    const lineNumber = index + 1;
    const lineOptions = optionsByLineNumber.get(lineNumber) ?? [];
    const lineClasses = getLineClasses(lineOptions).join(" ");

    const children = tokens.map((token, index) => {
      return renderToken({ token, tokens, index, options, metadata });
    });

    return line({
      children,
      className: lineClasses,
      index,
      line: tokens,
      lines,
      meta: metadata,
    });
  });
}

/**
 * Render a Shiki token to hast.
 *
 * @internal
 */
function renderToken({
  index,
  metadata,
  options = {},
  token: shikiToken,
  tokens,
}: {
  index: number;

  metadata: Metadata;
  options: IHastRendererOptions;
  token: IThemedToken;
  tokens: IThemedToken[];
}) {
  const token = options.elements?.["token"] as IRenderOptions["token"];

  const cssDeclarations = [`color: ${shikiToken.color || options.fg}`];

  if (shikiToken.fontStyle) {
    if (shikiToken.fontStyle & FontStyle.Italic) {
      cssDeclarations.push("font-style: italic");
    }
    if (shikiToken.fontStyle & FontStyle.Bold) {
      cssDeclarations.push("font-weight: bold");
    }
    if (shikiToken.fontStyle & FontStyle.Underline) {
      cssDeclarations.push("text-decoration: underline");
    }
  }

  const children = [escapeHtml(shikiToken.content)];

  return token({
    style: cssDeclarations.join("; "),
    token: shikiToken,
    tokens,
    index,
    children,
    meta: metadata,
  });
}
