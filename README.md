<p align="center">
  <a href="https://johnhooks.io/projects/highlighter">
    <img alt="The triple backtick highlighter logo" src="https://raw.githubusercontent.com/johnhooks/highlighter/main/.github/highlighter_512.jpg" width="256" hight="256">
  </a>
</p>

<h1 align="center">
  Highlight code in MDsveX with Shiki
</h1>

> Use [Shiki](https://shiki.style/) to highlight code blocks in [MDSvex](https://mdsvex.com/) files.

## 📦 Install

```sh
npm install @bitmachina/highlighter shiki
```

Shiki is a peer dependency and must be installed alongside this package.

## ⚡️ Quick start

```js
// mdsvex.config.js
import { createHighlighter } from "@bitmachina/highlighter";

export default {
  extensions: [".svelte.md", ".md", ".svx"],
  highlight: {
    highlighter: await createHighlighter({ theme: "github-dark" }),
  },
};
```

## API

### `createHighlighter(options)`

Creates an MDsveX-compatible highlighter function.

**Single theme:**

```js
await createHighlighter({ theme: "github-dark" })
```

**Dual themes (light/dark):**

```js
await createHighlighter({
  themes: { light: "github-light", dark: "github-dark" }
})
```

Dual themes use CSS variables, allowing you to switch themes with CSS.

**Options:**

- `theme` - A single [Shiki theme](https://shiki.style/themes)
- `themes` - An object with `light` and `dark` theme names
- `langs` - Languages to preload (others load on demand)

**CSS variables theme:**

The `css-variables` theme is no longer bundled with Shiki. Use `createCssVariablesTheme()` instead:

```js
import { createHighlighter } from "@bitmachina/highlighter";
import { createCssVariablesTheme } from "shiki";

const theme = createCssVariablesTheme({
  variablePrefix: "--shiki-",
  variableDefaults: {},
});

const highlighter = await createHighlighter({ theme });
```

See the [Shiki theme colors documentation](https://shiki.style/guide/theme-colors) for more details.

### Fence metadata

The highlighter supports metadata in code fence blocks:

````md
```js title="example.js" showLineNumbers {1,3-5}
const highlighted = true;
```
````

- `title="..."` - Adds `data-code-title` to the `<pre>` element
- `showLineNumbers` - Adds `data-line-numbers` to the `<code>` element
- `showLineNumbers{n}` - Start line numbers at `n`
- `{1,3-5}` - Highlight specific lines (adds `data-highlighted` attribute)

## 📚 Documentation

Visit the [full documentation](https://johnhooks.io/projects/highlighter) to know more.

## License

[MIT](https://github.com/johnhooks/highlighter/blob/main/LICENSE) @ [John Hooks](https://github.com/johnhooks)
