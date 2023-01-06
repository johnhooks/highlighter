<p align="center">
  <a href="https://johnhooks.io/projects/highlighter">
    <img alt="The triple backtick highlighter logo" src="https://raw.githubusercontent.com/johnhooks/highlighter/main/.github/highlighter_512.jpg" width="256" hight="256">
  </a>
</p>

<h1 align="center">
  Highlight code in MDsveX with Shiki
</h1>

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

## 📚 Documentation

Visit the [full documentation](https://johnhooks.io/projects/highlighter) to know more.

## License

[MIT](https://github.com/johnhooks/highlighter/blob/main/LICENSE) @ [John Hooks](https://github.com/johnhooks)
