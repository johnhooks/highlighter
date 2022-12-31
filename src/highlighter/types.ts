/**
 * Copy of internal types not exported by `shiki`.
 *
 * [shiki/src/types.ts](https://github.com/shikijs/shiki/blob/a585c9d6860334a6233ff1c035a42d023e016400/packages/shiki/src/types.ts#L203-L242)
 */

import type { HChild, Element } from "hastscript/lib/core.js";
import type { IThemedToken } from "shiki";

/**
 * @public
 */
export interface IHastRendererOptions {
  langId?: string;
  fg?: string;
  bg?: string;
  lineOptions?: ILineOption[];
  elements?: Partial<IElementsOptions>;
  themeName?: string;
}

/**
 * @public
 */
export interface ILineOption {
  /**
   * 1-based line number.
   */
  line: number;
  classes?: string[];
}

/**
 * @public
 */
interface IElementProps {
  children: HChild;
  [key: string]: unknown;
}

/**
 * @public
 */
interface IPreElementProps extends IElementProps {
  className?: string;
  style?: string;
}

/**
 * @public
 */
type ICodeElementProps = IElementProps;

/**
 * @public
 */
interface ILineElementProps extends IElementProps {
  className?: string;
  lines: IThemedToken[][];
  line: IThemedToken[];
  index: number;
}

/**
 * @public
 */
interface ITokenElementProps extends IElementProps {
  style: string;
  tokens: IThemedToken[];
  token: IThemedToken;
  index: number;
}

/**
 * Options to modify the syntax tree of the hast code block.
 *
 * @public
 */
export interface IElementsOptions {
  /**
   * Override function for `pre` tags.
   */
  readonly pre: (props: Partial<IPreElementProps>) => Element;

  /**
   * Override function for `code` tags.
   */
  readonly code: (props: Partial<ICodeElementProps>) => Element;

  /**
   * Override function for code block lines.
   */
  readonly line: (props: Partial<ILineElementProps>) => Element;

  /**
   * Override function for code block tokens.
   */
  readonly token: (props: Partial<ITokenElementProps>) => Element;
}

/**
 * This took forever to figure out. The `GetPropsType` didn't work with the `ElementsOptions` below.
 * because `T` could have been undefined, so it was always `never`! Making the properties
 * not optional and then using `Partial` where it's actually necessary made it all work.
 *
 * ```ts
 * export interface ElementsOptions {
 *   pre?: (props: PreElementProps => string;
 *   code?: (props: CodeElementProps => string;
 *   line?: (props: LineElementProps => string;
 *   token?: (props: TokenElementProps => string;
 * }
 * ```
 *
 * Though totally unnecessary now that I created my own types.
 */
// export type GetPropsType<T> = T extends (props: infer Props) => string ? Props : never;
