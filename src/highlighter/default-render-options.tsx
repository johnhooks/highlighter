import type { IRenderOptions } from "./types.js";

/**
 * The default renderers for {@link renderToHast}
 *
 * @internal
 */
export const defaultRenderOptions: IRenderOptions = {
  pre({ style, children, meta }) {
    return meta.title ? (
      <div>
        <pre style={style} dataCodeTitle={meta.title}>
          {children}
        </pre>
      </div>
    ) : (
      <pre style={style}>{children}</pre>
    );
  },

  code({ children, meta }) {
    const { lang, showLineNumbers } = meta;
    return <code dataLanguage={lang} dataLineNumbers={showLineNumbers}>{children}</code>;
  },

  line({ children, meta, index }) {
    const { lineNumbers, lineNumbersStart } = meta;
    const lineNumber = index + lineNumbersStart;
    const highlighted = lineNumbers?.includes(index) ? true : null;

    return (
      <span dataHighlighted={highlighted} dataLineNumber={lineNumber}>
        {children}
      </span>
    );
  },

  token({ style, children }) {
    return <span style={style}>{children}</span>;
  },
};
