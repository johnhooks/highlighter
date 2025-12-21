# @bitmachina/highlighter

A syntax highlighting library that integrates Shiki with MDsveX for Svelte-based markdown documents.

## Project Identity

This library bridges Shiki (syntax highlighter) with MDsveX (Markdown for Svelte) to provide:
- Code block syntax highlighting with any Shiki theme
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

## Modernization In Progress

This project is undergoing a major modernization. See `PLAN.md` for full details.

| Component | Current | Target |
|-----------|---------|--------|
| Shiki | 0.11.1 | 3.x |
| TypeScript | 4.9.4 | 5.x |
| Vite/Vitest | 4.x/0.25 | 5.x/2.x |
| Build | Rollup + API Extractor | tsup |
| Package manager | yarn | pnpm |
| Release | ShipJS | Changesets |
| Output | ESM + CJS/UMD | ESM-only |

**Key changes in progress:**
- Shiki 3.x uses `createHighlighter` (we alias internally to keep our export name)
- Moving from custom HAST generation to Shiki's transformers API
- Shiki becomes a peer dependency (users install it alongside)
- Dual theme support (light/dark)

## Architecture

Two main modules:

```
src/
├── index.ts                 # Re-exports both modules
├── highlighter/             # Core highlighting
│   ├── highlighter.ts       # createHighlighter() - main entry
│   ├── render-to-hast.ts    # Token → HAST tree conversion
│   ├── hast-utils.ts        # HAST → HTML string
│   ├── default-render-options.ts
│   ├── types.ts
│   └── utils.ts             # escapeHtml, etc.
└── parse-metadata/          # Fence metadata parsing
    ├── parse-metadata.ts    # parseMetadata() entry
    ├── lexer.ts             # Tokenizer for metadata strings
    └── types.ts
```

**Data flow:**
1. MDsveX calls highlighter with `(code, lang, metastring)`
2. Shiki tokenizes code with theme colors
3. `parseMetadata()` extracts line numbers, title, etc.
4. `renderToHast()` builds HAST tree with customizable elements
5. HAST converted to HTML string, returned to MDsveX

## Key Files

| File | Purpose |
|------|---------|
| `src/highlighter/highlighter.ts` | Main `createHighlighter()` function |
| `src/highlighter/render-to-hast.ts` | HAST generation (being replaced by transformers) |
| `src/parse-metadata/lexer.ts` | Metadata tokenizer |
| `PLAN.md` | Modernization plan and checklist |

## Conventions (Target State)

Follow these for all new code:

### Code Style
- **ESM-only** - No CommonJS, use `import`/`export`
- **ES2022** - Use modern syntax (optional chaining, nullish coalescing, etc.)
- **Strict TypeScript** - `noImplicitAny: true`, explicit types on public APIs
- **No Shiki re-exports** - Users import Shiki types directly from `shiki`

### Dependencies
- **Shiki as peer dep** - Don't bundle Shiki, users install it
- **Minimize dependencies** - Prefer Shiki's built-in features over external utils

### Naming
- `createHighlighter` - Our export name (alias Shiki's internally)
- `ThemedToken` - New Shiki type (not `IThemedToken`)
- `FontStyle` from `@shikijs/vscode-textmate`

### Testing
- Vitest for all tests
- Snapshot tests for HTML output
- Test both modules independently

## Development Commands

Current (yarn):
```bash
yarn install
yarn build
yarn test
yarn lint
```

Target (pnpm):
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
