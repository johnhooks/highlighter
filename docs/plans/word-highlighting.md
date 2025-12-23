# Word Highlighting Implementation Plan

## Overview

Add support for highlighting specific words/text within code blocks.
Uses literal string matching (not regex), similar to Rehype Pretty Code.

## Syntax

Two delimiter styles for word matching:

| Syntax | Example |
|--------|---------|
| Slash-delimited | `/error/` |
| Quote-delimited | `"error"` |

Both perform literal string matching (not regex).

### Disambiguation

| Pattern | Interpretation |
|---------|----------------|
| `title="foo"` | Assignment (quoted value after `=`) |
| `"foo"` | Word match (standalone) |
| `/foo/` | Word match |

## Output

Uses same `data-highlighted` attribute as line highlighting:

```html
<span data-highlighted><span style="blue">my</span><span style="red">Error</span></span>
```

CSS distinguishes context:
```css
.line[data-highlighted] { /* line highlighting */ }
.line [data-highlighted] { /* word highlighting */ }
```

## Cross-element Matching

Words may span multiple HAST elements. Wrap matched children in a new parent:

```html
<!-- Before (HAST from Shiki) -->
<span style="blue">my</span><span style="red">Error</span>

<!-- After matching "myError" -->
<span data-highlighted><span style="blue">my</span><span style="red">Error</span></span>
```

## Dependencies

Add unist/hast utilities:
- `unist-util-visit-parents` - walk tree with parent stack

## Algorithm

1. Walk each line's HAST subtree
2. Track partial match state per pattern as we encounter text nodes
3. When match completes, record start/end node positions
4. Wrap matched node ranges in `<span data-highlighted>` element
5. Handle multiple patterns simultaneously

### Constraints

- **Single line only:** Don't match across newlines
- **Preserve content:** Don't introduce or remove whitespace
- **HAST transform:** Operates on HAST from Shiki, before `hastToHtml()`

## Data Structures

### TMetadata

```ts
type TMetadata = {
  lineNumbers: number[];
  lineNumbersStart: number;
  showLineNumbers: boolean;
  title?: string;
  words: string[];  // NEW: literal strings to match
};
```

## Implementation Steps

1. Add `unist-util-visit-parents` dependency
2. Add `words: string[]` to `TMetadata`
3. Update `parseMetadata` to extract word patterns
4. Create HAST transform function for word wrapping
5. Integrate transform into highlighter pipeline
6. Add tests

## Future Enhancements (not v1)

- Instance ranges: `/error/1-3` (match only specific occurrences)
- IDs for grouping: `/error/#e /warning/#w`
- Case insensitive flag
- Whole word matching
- Diff markers: `ins="added"` `del="removed"`
