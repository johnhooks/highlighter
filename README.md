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

This directive will add a `data-code-title` attribute to the `pre` element.

### Line numbers

By default line numbers are made available though the `data-line-number` attribute on the `span` elements containing lines.

Below is an example of adding line numbers to the code block using CSS and the data attributes.

```css
/* Example of adding line numbers to code blocks using CSS and the data attributes. */
code[data-line-numbers] > span[data-line-number]::before {
  /* Insert the line number data attribute before the line */
  content: attr(data-line-number);

  /* Other styling */
  display: inline-block;
  width: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  text-align: right;
  color: gray;
}
```

If you want to conditionally show lines, use the `showLineNumbers` directive.

````md
```js showLineNumbers
  // <code> will have a `data-line-numbers` attribute
```
````

A starting line number can be provided as an argument to `showLineNumbers`.

````md
```js showLineNumbers{64}
// the first line of this code block will start at {number}
```
````

### Highlight lines

Place a numeric range inside `{}`.

````md
```js {1-3,4}
// lines 1,2,3 and 4 will have the `data-highlighted`
```
````

Below is an example of how to highlight lines using CSS and the `data-highlighted` attribute.

```css
code > span[data-highlighted] {
  background: #3b4252;
  width: 100%;
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

- The rendering was inspired by Shiki's [renderToHtml](https://github.com/shikijs/shiki/blob/a585c9d6860334a6233ff1c035a42d023e016400/packages/shiki/src/renderer.ts) function.
- The metadata parsing was inspired by [Rehype Pretty Code](https://github.com/atomiks/rehype-pretty-code).
- More information on theming: [Shiki - Theming with CSS Variables](https://github.com/shikijs/shiki/blob/main/docs/themes.md#theming-with-css-variables)

## License

MIT
