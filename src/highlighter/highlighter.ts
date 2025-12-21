import {
  createHighlighter as createShikiHighlighter,
  type HighlighterGeneric,
  type BundledLanguage,
  type BundledTheme,
  type ShikiTransformer,
  type ThemeRegistration,
  type ThemeRegistrationRaw,
} from "shiki";

import { parseMetadata } from "../parse-metadata/index.js";

import { escapeSvelte } from "./utils.js";

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

type ThemeInput = BundledTheme | ThemeRegistration | ThemeRegistrationRaw;

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

  const shikiHighlighter: HighlighterGeneric<BundledLanguage, BundledTheme> =
    await createShikiHighlighter({
      themes: themesToLoad as BundledTheme[],
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

    // Load language on demand if not already loaded
    const loadedLangs = shikiHighlighter.getLoadedLanguages();
    if (!loadedLangs.includes(language as BundledLanguage)) {
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
        },
        // Escape Svelte special characters in text nodes
        span(node) {
          node.children = node.children.map((child) => {
            if (child.type === "text") {
              return { ...child, value: escapeSvelte(child.value) };
            }
            return child;
          });
        },
      },
    ];

    // Generate HTML with appropriate theme config
    if (isDualTheme) {
      return shikiHighlighter.codeToHtml(code, {
        lang: language,
        themes: {
          light: options.themes.light as BundledTheme,
          dark: options.themes.dark as BundledTheme,
        },
        transformers,
      });
    } else {
      return shikiHighlighter.codeToHtml(code, {
        lang: language,
        theme: options.theme as BundledTheme,
        transformers,
      });
    }
  };
}
