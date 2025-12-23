# Commit Command

Create git commits following project conventions.

## Commit Message Format

Use conventional commits without emoji:

```
type: subject line (max 50 chars)

Optional body if context is needed. Keep lines to
80 characters max. Focus on the "why" and "what"
from a user/developer perspective.
```

### Types
- `feat`: New feature or capability
- `fix`: Bug fix
- `docs`: Documentation only
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependencies, config

## Changesets

This project uses [changesets](https://github.com/changesets/changesets) for release management.

### When to Add a Changeset

- `feat` → requires changeset (minor or major)
- `fix` → requires changeset (patch)
- `refactor` → changeset if it affects public API
- `docs`, `test`, `chore` → no changeset needed

### Creating a Changeset

Create manually in `.changeset/` with a kebab-case filename:

```md
---
"@bitmachina/highlighter": patch
---

Brief description of the change for the changelog.
```

### Breaking Changes

Breaking changes require:
1. A changeset with `major` bump
2. `!` after type in commit: `feat!:`, `refactor!:`
3. `BREAKING CHANGE:` footer with migration details

```
feat!: require shiki as peer dependency

Shiki is no longer bundled. Users must install it
alongside this package.

BREAKING CHANGE: shiki moved from dependencies to
peerDependencies. Users must run `pnpm add shiki`
separately.
```

## Rules

1. **Title**: Max 50 characters, lowercase, no period
2. **Body**: Optional, max 80 characters per line
3. **Style**: Prefer single-line commits for simple changes
4. **No emoji**
5. **No co-author lines**
6. **No lists** unless they genuinely improve clarity
7. **Don't mention tests** unless the commit is specifically about testing

## Process

1. Run `git status` to see changes
2. Run `git diff --staged` or `git diff` to understand what changed
3. Run `git log --oneline -5` to see recent commit style
4. Check if a changeset is needed (see above)
5. If changeset needed, create it and **show user for review** before committing
6. Stage files and create commit with Graphite:

```bash
# Simple commit
git add <files>
gt create -m "type: subject line here"
```

```bash
# With body (use heredoc)
git add <files>
gt create -m "$(cat <<'EOF'
type: subject line here

Body explaining the functional change from a user
or developer perspective.
EOF
)"
```

Note: Use `gt create` not `git commit`. This creates a new branch in the Graphite stack. The user will handle `gt submit` themselves.

## Examples

Good (single line):
```
feat: add dual theme support
fix: escape curly braces in svelte output
chore: migrate from yarn to pnpm
refactor: use lexer with keyword identification
```

Good (with body):
```
feat: add user-configurable shiki transformers

Users can now pass custom Shiki transformers to
createHighlighter(). This enables word highlighting,
diff markers, and other transformer features.
```

Bad:
```
Update highlighter to support new themes 🎨

- Added theme config
- Updated types
- Fixed tests

Co-Authored-By: Claude <noreply@anthropic.com>
```
