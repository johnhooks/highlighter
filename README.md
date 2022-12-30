# Highlight code in MDsveX with Shiki

> Use [Shiki](https://shiki.matsu.io/) to highlight code blocks in [MDSvex](https://mdsvex.com/) files.

## 📦 Install

```sh
npm install @bitmachina/highlighter@alpha

# or

yarn add @bitmachina/highlighter@alpha
```

## ⚡️ Quick start

The `createHighlighter` function takes an argument of Shiki `HighlighterOptions`.

Any [Shiki theme](https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes) can be used. This example uses the `css-variables` theme, which is really flexible.

```js
// mdsvex.config.js
import { createHighlighter } from "@bitmachina/highlighter";

/** @type {import('mdsvex').MdsvexOptions} */
export default {
  extensions: [".svelte.md", ".md", ".svx"],
  highlight: {
    highlighter: await createHighlighter({ theme: "css-variables" }),
  },
};
```

If using the `css-variables` theme, add the variables to your css.

```css
/* app.css */
:root {
  --shiki-color-background: #27272a;
  --shiki-color-text: #fff;
  --shiki-token-constant: #6ee7b7;
  --shiki-token-string: #6ee7b7;
  --shiki-token-comment: #71717a;
  --shiki-token-keyword: #7dd3fc;
  --shiki-token-parameter: #f9a8d4;
  --shiki-token-function: #c4b5fd;
  --shiki-token-string-expression: #6ee7b7;
  --shiki-token-punctuation: #e4e4e7;
}
```

## Meta strings

Code blocks are configured via the meta string on the top codeblock fence.

Some features have been added to make this package comparable to [Rehype Pretty Code](https://rehype-pretty-code.netlify.app/).

### Titles

Add a file title to your code block, with text inside double quotes (`""`):

````md
```js title="..."
```
````

### Line numbers

CSS Counters can be used to add line numbers.

```css
code {
  counter-reset: line;
}

code > .line::before {
  counter-increment: line;
  content: counter(line);

  /* Other styling */
  display: inline-block;
  width: 1rem;
  margin-right: 2rem;
  text-align: right;
  color: gray;
}
```

If you want to conditionally show them, use showLineNumbers:

````md
```js showLineNumbers
  // <code> will have a `data-line-numbers` attribute
```
````

The starting line number can be specified by providing a line number argument, use `showLineNumbers{number}`.

````md
```js showLineNumbers{64}
// the first line of this code block will start at {number}
```
````

### Highlight lines

Place a numeric range inside `{}`.

````md
```js {1-3,4}

```
````

Add this css to your project highlight lines.

```css
code > span[data-highlight]:after {
  background-color: #fff;
  content: " ";
  left: 0;
  opacity: 0.1;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: max-content;
}
```

## Notes

If languages are known ahead of time, limiting them should speed up loading the highlighter.

```js
// mdsvex.config.js
export default {
  // ...rest of the MDsveX options
  highlight: {
    highlighter: createHighlighter({
      //  ...rest of the Shiki options
      lang: ["css", "html", "js", "ts", "sh"]
     }),
  },
};
```

## References

- [Shiki - Theming with CSS Variables](https://github.com/shikijs/shiki/blob/main/docs/themes.md#theming-with-css-variables)
- [Rehype Pretty Code](https://github.com/atomiks/rehype-pretty-code)

## License

MIT
