import { IThemedToken } from "shiki";

import type { TMetadata } from "../parse-metadata/types.js";

import type { TChildren, TElement } from "./hast-utils.js";

/**
 * @public
 */
export interface TRenderToHastParams {
  /**
   * Optional code block metadata.
   */
  metadata?: TMetadata;

  /**
   *  Options to modify the render function.
   */
  options?: THastRendererOptions;

  /**
   * Shiki highlighted tokens to render.
   */
  tokens: IThemedToken[][];
}

/**
 * Hast render options, slimmed down compared to Shiki {@link shiki#HtmlRendererOptions | HtmlRendererOptions}.
 *
 * @public
 */
export type THastRendererOptions = {
  /**
   * Directive to include a language identifier in the rendered output.
   */
  fg?: string;

  /**
   * Optional elements override functions.
   *
   * Allows for fine grained control overrides for rendering of `pre` and `code`
   * tags, lines, or individual tokens.
   */
  elements?: Partial<TRenderOptions>;

  /**
   * Shiki theme name.
   */
  themeName?: string;
};

/**
 * To help add classes to specific line numbers.
 *
 * @public
 */
export type TLineOption = {
  /**
   * 1-based line number.
   */
  line: number;

  /**
   * Class name/names to include.
   */
  className?: string | string[];
};

/**
 * Common renderer props.
 *
 * @public
 */
type TRenderProps = {
  /**
   * Children of the renderer.
   *
   * IMPORTANT: It is necessary pass children down through the renderer, otherwise
   * the code block will not be properly rendered.
   */
  children: TChildren;

  /**
   * Additional information about the code block.
   */
  metadata: TMetadata;

  [key: string]: unknown;
};

/**
 * `pre` tag renderer props.
 *
 * @public
 */
type TPreProps = TRenderProps;

/**
 * `code` tag renderer props.
 * @public
 */
type TCodeProps = TRenderProps;

/**
 * Line renderer props.
 *
 * @public
 */
type TLineProps = TRenderProps & {
  /**
   * Zero based index of the line number.
   */
  index: number;
};

/**
 * Token renderer props.
 *
 * @public
 */
type TTokenProps = TRenderProps & {
  /**
   * Styles applied to the token by Shiki.
   */
  style: string | undefined;

  /**
   * An array of the entire line of tokens.
   */
  tokens: IThemedToken[];

  /**
   * The Shiki {@link shiki#IThemedToken| token} to render.
   */
  token: IThemedToken;

  /**
   * Zero-based index of the token position in the line.
   */
  index: number;
};

/**
 * Options to modify the rendered HTML output.
 *
 * @public
 */
export type TRenderOptions = {
  /**
   * Override function for `pre` tags.
   */

  readonly pre: (props: TPreProps) => TElement;
  /**
   * Override function for `code` tags.
   */
  readonly code: (props: TCodeProps) => TElement;

  /**
   * Override function for code block lines.
   */
  readonly line: (props: TLineProps) => TElement;

  /**
   * Override function for code block tokens.
   */
  readonly token: (props: TTokenProps) => TElement;
};
