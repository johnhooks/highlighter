# Code Fence Metadata

This document describes the metadata syntax supported in markdown code fence info strings.

## Basic Syntax

Metadata appears after the language identifier in a code fence:

````markdown
```js title="example.js" {1,3-5} showLineNumbers
const a = 1;
const b = 2;
const c = 3;
```
````

## Features

### Title

Display a title above the code block.

```
title="filename.js"
title='filename.js'
```

Both double and single quotes are supported.

### Line Highlighting

Highlight specific lines in the code block.

```
{5}           Single line
{1,3,5}       Multiple lines
{1-5}         Range (lines 1 through 5)
{1..5}        Range (alternate syntax)
{1,3-5,7}     Mixed
```

The `highlight` keyword is optional:

```
highlight{1-5}    Explicit form
{1-5}             Shorthand (equivalent)
```

### Line Numbers

Show line numbers in the gutter.

```
showLineNumbers       Start at line 1
showLineNumbers{10}   Start at line 10
```

## Complete Example

````markdown
```typescript title="server.ts" {3-5,8} showLineNumbers{100}
import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port);
```
````

This displays:
- Title: "server.ts"
- Line numbers starting at 100
- Lines 3-5 and 8 highlighted (relative to the code, not the starting number)

## Notes

- The language identifier (e.g., `js`, `typescript`) is passed separately by the markdown processor, not parsed from the metadata string.
- Unknown identifiers are ignored.
- Invalid line numbers are silently ignored.
