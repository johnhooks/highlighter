import { h } from "./hast-utils.js";
import { TRenderOptions } from "./types";

/**
 * The default renderers for {@link renderToHast}
 *
 * @internal
 */
export const defaultRenderOptions: TRenderOptions = {
  pre({ children, metadata: { title: dataCodeTitle } }) {
    return h("pre", { dataCodeTitle }, children);
  },

  code({ children, metadata: { lang: dataLanguage, showLineNumbers: dataLineNumbers } }) {
    return h("code", { dataLanguage, dataLineNumbers }, children);
  },

  line({ children, index, metadata: { lineNumbers, lineNumbersStart } }) {
    const dataLineNumber = String(index + lineNumbersStart);
    const dataHighlighted = lineNumbers?.includes(index);
    return h("span", { dataHighlighted, dataLineNumber }, children);
  },

  token({ style, children }) {
    return h("span", { style }, children);
  },
};
