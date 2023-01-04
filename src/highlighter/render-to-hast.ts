import { FontStyle } from "shiki";

import { defaultRenderOptions } from "./default-render-options.js";
import type { TElement } from "./hast-utils.js";
import { TRenderToHastParams } from "./types.js";

/**
 * Render Shiki tokens to hast, Hypertext Abstract Syntax Tree format.
 *
 * @param renderParams - The render {@link TRenderToHastParams | parameters}
 * @returns A hast syntax tree for a highlighted code block.
 * @public
 */
export function renderToHast({
  tokens: lines,
  options = {},
  metadata = { lineNumbers: [], lineNumbersStart: 1, showLineNumbers: false },
}: TRenderToHastParams): TElement {
  const { pre, code, line, token } = { ...defaultRenderOptions, ...options.elements };

  return pre({
    metadata,
    children: [
      code({
        metadata,
        children: lines.map((tokens, index) =>
          line({
            index,
            metadata,
            children: tokens.map((shikiToken, index) => {
              const cssDeclarations: string[] = [];

              if (shikiToken.color) {
                cssDeclarations.push(`color: ${shikiToken.color}`);
              }

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

              const children = [shikiToken.content];
              const style = cssDeclarations.length > 0 ? cssDeclarations.join("; ") : undefined;

              return token({
                style,
                token: shikiToken,
                tokens,
                index,
                children,
                metadata,
              });
            }),
          })
        ),
      }),
    ],
  });
}
