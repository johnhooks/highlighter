/**
 * Copy of internal types not exported by `shiki`.
 *
 * [shiki/src/types.ts](https://github.com/shikijs/shiki/blob/a585c9d6860334a6233ff1c035a42d023e016400/packages/shiki/src/types.ts#L203-L242)
 */

import type { HChild, HPropertyValue, HResult, HStyle } from "hastscript/lib/core.js";
import type { IThemedToken } from "shiki";

import type { Metadata } from "../parse-metadata/types.js";

/**
 * @public
 */
export interface IRenderToHastParams {
  /**
   * Optional code block metadata.
   */
  metadata?: Metadata;

  /**
   *  Options to modify the render function.
   */
  options?: IHastRendererOptions;

  /**
   * Shiki highlighted tokens to render.
   */
  tokens: IThemedToken[][];
}

/**å
 * @public
 */
export interface IHastRendererOptions {
  /**
   * Directive to include a language identifier in the rendered output.
   */
  langId?: string;

  /**
   * Optional foreground color for `code` elements that do not have a grammar.
   */
  fg?: string;

  /**
   * Optional background color of `code` elements.
   */
  bg?: string;

  /**
   * Optional classes for specific line numbers.
   */
  lineOptions?: ILineOption[];

  /**
   * Optional elements override functions.
   *
   * Allows for fine grained control overrides for the rendering of `pre` and `code`
   * tags, lines, or individual tokens.
   */
  elements?: Partial<IRenderOptions>;

  /**
   * Shiki theme name.
   */
  themeName?: string;
}

/**
 * Optional {@link IHastRendererOptions} property, allows inclusion of classes for
 * specific line numbers.
 *
 * @public
 */
export interface ILineOption {
  /**
   * 1-based line number.
   */
  line: number;

  /**
   * Class name/names to include.
   */
  className?: HPropertyValue;
}

/**
 * Common renderer props.
 *
 * @public
 */
interface IRenderProps {
  /**
   * Children of the renderer.
   *
   * IMPORTANT: It is necessary pass children down through the renderer, otherwise
   * the code block will not be properly rendered.
   */
  children: HChild;

  /**
   * Additional information about the code block.
   */
  meta: Metadata;

  [key: string]: unknown;
}

/**
 * `pre` tag renderer props.
 *
 * @public
 */
interface IPreRenderProps extends IRenderProps {
  /**
   * Class name/names of the line to be rendered, as generated from a combination of
   * the {@link LineOptions} and the defaults.
   */
  className?: HPropertyValue;

  /**
   * Styles applied to the token by Shiki.
   *
   * Should be included in the {@link hastscript#h  | h} {@link hastscript#Properties | props} argument.
   */
  style?: HStyle;
}

/**
 * `code` tag renderer props.
 * @public
 */
type ICodeRenderProps = IRenderProps;

/**
 * Line renderer props.
 *
 * @public
 */
interface ILineRenderProps extends IRenderProps {
  /**
   * Class name/names of the line to be rendered, as generated from a combination of
   * the {@link LineOptions} and the defaults.
   */
  className?: HPropertyValue;

  /**
   * The entire Shiki code block of tokens.
   */
  lines: readonly IThemedToken[][];

  /**
   * The Shiki tokens of the line.
   */
  line: readonly IThemedToken[];

  /**
   * Zero based index of the line number.
   */
  index: number;
}

/**
 * Token renderer props.
 *
 * @public
 */
interface ITokenRenderProps extends IRenderProps {
  /**
   * Styles applied to the token by Shiki.
   *
   * Should be included in the {@link hastscript#h | h} {@link hastscript#Properties | props} argument.
   */
  style: string;

  /**
   * An array of the entire line of tokens.
   */
  tokens: readonly IThemedToken[];

  /**
   * The Shiki {@link shiki#IThemedToken| token} to render.
   */
  token: IThemedToken;

  /**
   * Zero-based index of the token position in the line.
   */
  index: number;
}

/**
 * Options to modify the syntax tree of the hast code block.
 *
 * @public
 */
export interface IRenderOptions {
  /**
   * Override function for `pre` tags.
   */
  readonly pre: (props: IPreRenderProps) => HResult;

  /**
   * Override function for `code` tags.
   */
  readonly code: (props: ICodeRenderProps) => HResult;

  /**
   * Override function for code block lines.
   */
  readonly line: (props: ILineRenderProps) => HResult;

  /**
   * Override function for code block tokens.
   */
  readonly token: (props: ITokenRenderProps) => HResult;
}
