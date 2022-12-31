/**
 * Shiki renderer modified to render to hast.
 *
 * @see {@link https://github.com/shikijs/shiki/blob/a585c9d6860334a6233ff1c035a42d023e016400/packages/shiki/src/renderer.ts | shiki/src/renderer.ts} was inspiration for this module.
 * @see {@link https://github.com/atomiks/rehype-pretty-code/blob/e24f8415c8264dc868006ced839d3cb7445e716a/src/index.js | rehype-pretty-code/src/index.js} was inspiration for this module.
 */

import type { Root, Element } from "hast";
import { h } from "hastscript";
import type { IThemedToken } from "shiki";
import { FontStyle } from "shiki";

import type { Metadata } from "../meta-parser/index.js";

import type { IHastRendererOptions, ILineOption, IElementsOptions } from "./types.js";
import { groupBy, escapeHtml } from "./utils.js";

const defaultElements: IElementsOptions = {
  pre({ style, children }) {
    return h("pre", { style }, children);
  },

  code({ children }) {
    return h("code", {}, children);
  },

  line({ children }) {
    return h("span", {}, children);
  },

  token({ style, children }) {
    return h("span", { style }, children);
  },
};

/**
 * Render Shiki tokens to hast, Hypertext Abstract Syntax Tree format.
 *
 * @param tokens - Shiki highlighted tokens to render.
 * @param options - Options to modify the render function.
 * @param metadata - The code block metadata.
 * @returns A hast syntax tree for a highlighted code block.
 * @public
 */
export function renderToHast({
  tokens,
  options = {},
  metadata = {},
}: {
  tokens: IThemedToken[][];
  options?: IHastRendererOptions;
  metadata?: Metadata;
}): Root {
  // If the user supplied custom elements override the defaults.
  options.elements = Object.assign(defaultElements, options.elements || {});
  const pre = options.elements?.["pre"] as IElementsOptions["pre"];
  const code = options.elements?.["code"] as IElementsOptions["code"];

  const lineNodes = mapLinesToHast({ lines: tokens, options, metadata });
  const codeNode = code({ children: lineNodes });
  const preNode = pre({ children: [codeNode] });

  return h(null, [preNode]);
}

function getLineClasses(lineOptions: ILineOption[]): string[] {
  const lineClasses = new Set(["line"]);
  for (const lineOption of lineOptions) {
    for (const lineClass of lineOption.classes ?? []) {
      lineClasses.add(lineClass);
    }
  }
  return Array.from(lineClasses);
}

function mapLinesToHast({
  lines,
  options = {},
  metadata = {},
}: {
  lines: IThemedToken[][];
  options?: IHastRendererOptions;
  metadata?: Metadata;
}): Element[] {
  const optionsByLineNumber = groupBy(options.lineOptions ?? [], (option) => option.line);
  const line = options.elements?.["line"] as IElementsOptions["line"];

  return lines.map((tokens, index) => {
    const lineNumber = index + 1;
    const lineOptions = optionsByLineNumber.get(lineNumber) ?? [];
    const lineClasses = getLineClasses(lineOptions).join(" ");
    const children = tokens.map((token, index) => {
      return mapTokenToHast({ token, index, options, metadata });
    });

    return line({
      className: lineClasses,
      lines,
      line: tokens,
      index,
      children,
    });
  });
}

function mapTokenToHast({
  token: shikiToken,
  index,
  options = {},
}: //  metadata = {},

{
  token: IThemedToken;
  index: number;
  options: IHastRendererOptions;
  metadata: Metadata;
}): Element {
  const token = options.elements?.["token"] as IElementsOptions["token"];

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
    index,
    children,
  });
}
