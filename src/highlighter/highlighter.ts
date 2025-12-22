import {
  createHighlighter as createShikiHighlighter,
  type BundledLanguage,
  type BundledTheme,
  type ShikiTransformer,
  type ThemeRegistration,
  type ThemeRegistrationRaw,
} from "shiki";

import { parseMetadata } from "../parse-metadata/index.js";

import { hastToHtml } from "./hast-to-html.js";

type ThemeInput = BundledTheme | ThemeRegistration | ThemeRegistrationRaw;

/**
 * MDsveX highlighter type.
 *
 * NOTE: not exported from `mdsvex`, so its copied here.
 * @public
 */
export type MdsvexHighlighter = (
  code: string,
  lang: string | undefined,
  metastring?: string | undefined
) => string | Promise<string>;

/**
 * Options for creating a highlighter with a single theme.
 * @public
 */
export interface SingleThemeOptions {
  /**
   * Single theme to use for highlighting.
   */
  theme: ThemeInput;
  themes?: never;

  /**
   * Languages to preload. Other languages will be loaded on demand.
   */
  langs?: BundledLanguage[];
}

/**
 * Options for creating a highlighter with dual themes (light/dark).
 * @public
 */
export interface DualThemeOptions {
  theme?: never;
  /**
   * Dual themes for light/dark mode. CSS variables will be used for colors.
   */
  themes: {
    light: ThemeInput;
    dark: ThemeInput;
  };

  /**
   * Languages to preload. Other languages will be loaded on demand.
   */
  langs?: BundledLanguage[];
}

export type HighlighterOptions = SingleThemeOptions | DualThemeOptions;

/**
 * Create MDsveX code highlighting function.
 *
 * @param options - Highlighter options object.
 * @returns A Promise of a MDsvex highlighter function.
 * @public
 */
export async function createHighlighter(options: HighlighterOptions): Promise<MdsvexHighlighter> {
  const langs = options.langs ?? [];
  const isDualTheme = "themes" in options && options.themes !== undefined;

  // Determine themes to load
  const themesToLoad: ThemeInput[] = isDualTheme
    ? [options.themes.light, options.themes.dark]
    : [options.theme];

  const shikiHighlighter = await createShikiHighlighter({
    themes: themesToLoad,
    langs,
  });

  /**
   * Highlighter function for Mdsvex codeblocks.
   *
   * @param code - Raw source code to highlight.
   * @param lang - Programming language.
   * @param metastring - Code block fence metadata.
   * @returns HTML string.
   */
  return async function highlighter(
    code: string,
    lang: string | undefined,
    metastring?: string | undefined
  ): Promise<string> {
    const language = lang || "text";

    // Load language on demand if not already loaded.
    // Note: language comes from markdown files as an arbitrary string.
    // Shiki throws at runtime if the language is not supported.
    const loadedLangs = shikiHighlighter.getLoadedLanguages();
    if (!loadedLangs.includes(language)) {
      await shikiHighlighter.loadLanguage(language as BundledLanguage);
    }

    const metadata = parseMetadata(metastring);
    const { lineNumbers, lineNumbersStart, showLineNumbers, title } = metadata;

    // Create transformers for line numbers and highlighting
    const transformers: ShikiTransformer[] = [
      {
        pre(node) {
          if (title) {
            node.properties["data-code-title"] = title;
          }
        },
        code(node) {
          if (language) {
            node.properties["data-language"] = language;
          }
          if (showLineNumbers) {
            node.properties["data-line-numbers"] = "";
          }
        },
        line(node, lineNum) {
          node.properties["data-line-number"] = String(lineNum + (lineNumbersStart - 1));
          if (lineNumbers?.includes(lineNum)) {
            node.properties["data-highlighted"] = "";
          }
          // Insert newline for empty lines to preserve height in <pre>
          const isEmpty =
            node.children.length === 0 ||
            (node.children.length === 1 &&
              node.children[0].type === "element" &&
              node.children[0].children.length === 1 &&
              node.children[0].children[0].type === "text" &&
              node.children[0].children[0].value === "");
          if (isEmpty) {
            node.children = [{ type: "text", value: "\n" }];
          }
        },
      },
    ];

    // Generate HAST and render to HTML with proper Svelte escaping
    // TODO: Replace `as` assertions with proper type guards
    if (isDualTheme) {
      const hast = shikiHighlighter.codeToHast(code, {
        lang: language,
        themes: {
          light: options.themes.light as BundledTheme,
          dark: options.themes.dark as BundledTheme,
        },
        transformers,
      });
      return hastToHtml(hast);
    } else {
      const hast = shikiHighlighter.codeToHast(code, {
        lang: language,
        theme: options.theme as BundledTheme,
        transformers,
      });
      return hastToHtml(hast);
    }
  };
}
