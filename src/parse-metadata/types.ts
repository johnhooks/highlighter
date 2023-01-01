/**
 * Markdown Code Block Metadata
 *
 * @public
 */
export type Metadata = {
  /**
   * The lines to highlight.
   */
  lineNumbers: number[];

  /**
   * The initial line number to start from.
   */
  lineNumbersStart: number;

  /**
   * The title of the code block.
   */
  title?: string | undefined;

  /**
   * The language of the code block.
   */
  lang?: string | undefined;
};