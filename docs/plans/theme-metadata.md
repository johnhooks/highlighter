# Theme Metadata Override

Design document for per-code-block theme overrides via fence metadata.

## Current State

Themes are configured once at highlighter creation time:

```typescript
// Single theme
createHighlighter({ theme: 'github-dark' })

// Dual theme (light/dark with CSS variables)
createHighlighter({
  themes: { light: 'github-light', dark: 'github-dark' }
})
```

All code blocks use the configured theme(s). No per-block customization.

## Proposed: Multi-Theme with Overrides

### Configuration

Load multiple themes and specify a default:

```typescript
createHighlighter({
  themes: ['github-dark', 'github-light', 'dracula', 'nord'],
  defaultTheme: 'github-dark',  // required when themes.length > 1
  langs: ['js', 'ts']
})
```

When only one theme is provided, it becomes the implicit default:

```typescript
// defaultTheme is implicitly 'github-dark'
createHighlighter({
  themes: ['github-dark'],
  langs: ['js']
})
```

### Per-Block Override

Override the theme for a specific code block via fence metadata:

````md
```js theme="dracula"
const x = 1;
```
````

The `theme` metadata value must match a loaded theme name.

### Dual Theme Mode

The existing dual theme API (light/dark with CSS variables) remains separate:

```typescript
createHighlighter({
  themes: { light: 'github-light', dark: 'github-dark' }
})
```

This mode renders both themes simultaneously using CSS custom properties for runtime switching. Per-block overrides would not apply in this mode (or would need to override both light and dark).

## Implementation

### Metadata Parsing

Add `theme` to `TMetadata`:

```typescript
type TMetadata = {
  lineNumbers: number[];
  lineNumbersStart: number;
  showLineNumbers: boolean;
  title?: string;
  lang?: string;
  theme?: string;  // new
};
```

Parse `theme="..."` in `parseMetadata()`.

### Theme Loading

Themes must be loaded at creation time. Unlike languages (which can be loaded on-demand), themes should be pre-loaded for performance.

### Validation

When processing a code block with `theme="..."` metadata:
1. Check if the theme is loaded
2. If not loaded, either throw an error or fall back to default
3. Use the specified theme for `codeToHtml`

### Type Considerations

The current type assertions (`as BundledTheme`) exist because:
1. We store theme config at creation time
2. We pass it to `codeToHtml` at render time
3. Our `ThemeInput` union is broader than what `codeToHtml` expects

With per-block overrides, we'd validate theme names against loaded themes at render time, making the types flow more naturally:

```typescript
const loadedThemes = shikiHighlighter.getLoadedThemes();
const themeName = metadata.theme ?? defaultTheme;

if (!loadedThemes.includes(themeName)) {
  throw new Error(`Theme "${themeName}" not loaded`);
}

// themeName is now validated, pass to codeToHtml
```

## Open Questions

1. Should invalid theme names throw or fall back to default?
2. How should dual theme mode interact with per-block overrides?
3. Should we support `themes="light:foo,dark:bar"` syntax for per-block dual theme override?
