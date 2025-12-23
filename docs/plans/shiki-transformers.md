# Shiki Transformers Support

## Overview

Allow users to pass Shiki transformers to `createHighlighter()`. This unlocks powerful features like word highlighting, diff markers, focus lines, and more - without adding dependencies or breaking changes.

## Motivation

Shiki's transformers use the **decorations API** which handles cross-token matching at the source level, before tokenization. Rather than reimplementing this, we let users opt-in to `@shikijs/transformers` features.

## API Change

Add optional `transformers` option to `createHighlighter()`:

```ts
import { createHighlighter } from "@bitmachina/highlighter";
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
} from "@shikijs/transformers";

const highlighter = await createHighlighter({
  theme: "github-dark",
  transformers: [
    transformerMetaHighlight(),
    transformerMetaWordHighlight(),
    transformerNotationDiff(),
  ],
});
```

## Available Transformers

Users can add any `@shikijs/transformers`:

| Transformer | Syntax | Output |
|-------------|--------|--------|
| `transformerMetaHighlight` | `{1,3-5}` | `class="highlighted"` on lines |
| `transformerMetaWordHighlight` | `/word/` | `class="highlighted-word"` |
| `transformerNotationDiff` | `// [!code ++]` | `class="diff add"` / `class="diff remove"` |
| `transformerNotationFocus` | `// [!code focus]` | `class="focused"` |
| `transformerNotationHighlight` | `// [!code highlight]` | `class="highlighted"` |
| `transformerNotationErrorLevel` | `// [!code error]` | `class="error"` / `class="warning"` |

## No Breaking Change

- Users who don't pass transformers keep existing behavior (`data-highlighted`)
- Users who want Shiki features add `@shikijs/transformers` themselves
- No new dependencies for this package

## What We Keep

Our internal transformer still handles:

- `title="..."` → `data-code-title` on `<pre>`
- `showLineNumbers{n}` → `data-line-numbers` on `<code>`, starting line
- `data-line-number` on each line
- `data-language` on `<code>`
- `data-highlighted` on lines matching `{1,3-5}` (unless user adds `transformerMetaHighlight`)
- Empty line fix (preserve height)

## Implementation

### Update Options Type

```ts
export interface HighlighterOptions {
  theme?: ThemeInput;
  themes?: { light: ThemeInput; dark: ThemeInput };
  langs?: BundledLanguage[];
  transformers?: ShikiTransformer[];  // NEW
}
```

### Pass Meta and Transformers to Shiki

```ts
const allTransformers = [
  ...(options.transformers ?? []),  // User transformers first
  ourInternalTransformer,            // Ours last (fallback highlighting)
];

const hast = shikiHighlighter.codeToHast(code, {
  lang: language,
  theme: options.theme,
  meta: { __raw: metastring },  // NEW: pass raw meta for Shiki transformers
  transformers: allTransformers,
});
```

### Conditional Line Highlighting

If user passes `transformerMetaHighlight`, skip our `data-highlighted` logic:

```ts
line(node, lineNum) {
  node.properties["data-line-number"] = String(lineNum + (lineNumbersStart - 1));

  // Only add data-highlighted if user didn't add transformerMetaHighlight
  if (!hasMetaHighlightTransformer && lineNumbers?.includes(lineNum)) {
    node.properties["data-highlighted"] = "";
  }
}
```

Or simpler: always add ours, let users choose which CSS to use.

## Implementation Steps

1. Add `transformers` option to `HighlighterOptions`
2. Pass `meta: { __raw: metastring }` to `codeToHast()`
3. Merge user transformers with our internal transformer
4. Update documentation with examples
5. Add tests for transformer passthrough

## Example Usage

### Basic (no change)
```ts
const highlighter = await createHighlighter({ theme: "github-dark" });
// Uses data-highlighted for {1,3-5}
```

### With Word Highlighting
```ts
import { transformerMetaWordHighlight } from "@shikijs/transformers";

const highlighter = await createHighlighter({
  theme: "github-dark",
  transformers: [transformerMetaWordHighlight()],
});
// /word/ now works, adds class="highlighted-word"
```

### Full Featured
```ts
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
} from "@shikijs/transformers";

const highlighter = await createHighlighter({
  theme: "github-dark",
  transformers: [
    transformerMetaHighlight(),
    transformerMetaWordHighlight(),
    transformerNotationDiff(),
  ],
});
// All features enabled with class-based output
```
