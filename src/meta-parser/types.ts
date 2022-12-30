/**
 * Markdown Code Block Metadata
 *
 * @public
 */
export type Metadata = {
  /**
   * The lines to highlight.
   */
  lineNumbers?: number[];

  /**
   * The initial line number to start from.
   */
  lineNumbersStart?: string | undefined;

  /**
   * The code block title.
   */
  title?: string | undefined;
};
