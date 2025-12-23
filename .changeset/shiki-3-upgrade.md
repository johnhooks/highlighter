---
"@bitmachina/highlighter": minor
---

Upgrade to Shiki 3.x and modernize build tooling

**Breaking Changes:**
- Shiki is now a peer dependency - install it alongside this package
- Requires Node.js 20+
- Removed direct dependencies on hast-util-to-string, rehype-parse, unified, and unist-util-visit

**Fixes:**
- Properly escape Svelte special characters (`{`, `}`, `` ` ``) in highlighted code
- Empty lines no longer collapse in rendered output

**Internal:**
- Migrated from Rollup to tsup for builds
- Migrated from Yarn to pnpm
- Updated TypeScript to 5.x
- Switched to transformer-based rendering with custom HAST-to-HTML serialization
