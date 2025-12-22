# @bitmachina/highlighter

A syntax highlighting library that integrates Shiki with MDsveX for Svelte-based markdown documents.

## Overview

This library bridges Shiki (syntax highlighter) with MDsveX (Markdown for Svelte) to provide:
- Code block syntax highlighting with any Shiki theme
- Dual theme support (light/dark) via CSS variables
- Line highlighting via fence metadata (`{1,3,5-7}`)
- Line numbers with configurable start (`showLineNumbers{100}`)
- Custom titles (`title="filename.js"`)

**Primary use case**: Drop-in highlighter for `mdsvex.config.js`

```js
import { createHighlighter } from "@bitmachina/highlighter";

export default {
  highlight: {
    highlighter: await createHighlighter({ theme: "github-dark" }),
  },
};
```

## Architecture

Two main modules:

```
src/
├── index.ts                 # Re-exports both modules
├── highlighter/             # Core highlighting
│   ├── highlighter.ts       # createHighlighter() - main entry
│   ├── index.ts             # Module exports
│   └── utils.ts             # escapeHtml, etc.
└── parse-metadata/          # Fence metadata parsing
    ├── parse-metadata.ts    # parseMetadata() entry
    ├── lexer.ts             # Tokenizer for metadata strings
    ├── index.ts             # Module exports
    └── types.ts
```

**Data flow:**
1. MDsveX calls highlighter with `(code, lang, metastring)`
2. `parseMetadata()` extracts line numbers, title, highlights from metastring
3. Shiki tokenizes code and generates HTML via `codeToHtml()`
4. Shiki transformers add data attributes for line numbers, highlights, etc.
5. Svelte special characters are escaped in postprocess
6. HTML string returned to MDsveX

## Key Files

| File | Purpose |
|------|---------|
| `src/highlighter/highlighter.ts` | Main `createHighlighter()` function using Shiki transformers |
| `src/parse-metadata/lexer.ts` | Tokenizer for fence metadata strings |
| `src/parse-metadata/parse-metadata.ts` | Metadata parsing logic |

## Conventions

### Code Style
- **ESM-only** - No CommonJS, use `import`/`export`
- **ES2022** - Use modern syntax (optional chaining, nullish coalescing, etc.)
- **Strict TypeScript** - Explicit types on public APIs
- **No Shiki re-exports** - Users import Shiki types directly from `shiki`

### Dependencies
- **Shiki as peer dep** - Users install shiki alongside this package
- **Minimize dependencies** - Prefer Shiki's built-in features

### Testing
- Vitest for all tests
- Snapshot tests for HTML output
- Test both modules independently

## Development

```bash
pnpm install
pnpm build      # tsup
pnpm test       # vitest run
pnpm lint       # eslint
pnpm check      # tsc --noEmit
```

## Repository

- GitHub: https://github.com/johnhooks/highlighter
- Docs: https://johnhooks.io/projects/highlighter
- npm: @bitmachina/highlighter
