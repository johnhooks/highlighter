# Commit Command

Create concise conventional commits.

## Format

```
type: subject (max 50 chars)

Optional body (1-2 sentences max).
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring
- `test`: Test changes
- `docs`: Documentation
- `chore`: Dependencies, config, build

## Breaking Changes

Use ! after the type and include a BREAKING CHANGE: footer with full details:

```
feat!: require shiki as peer dependency

Shiki is no longer bundled. Users must install it alongside
this package.

BREAKING CHANGE: shiki moved from dependencies to peerDependencies.
Users must now run `npm install shiki@^3.0.0` separately. This
reduces bundle size and allows users to control their Shiki version.
```

For breaking changes:
- Add ! after type: feat!, refactor!, etc.
- Include BREAKING CHANGE: footer with migration details
- Explain what users need to change
- Be thorough - this generates changelog entries

## Rules

1. Subject: lowercase, max 50 chars, no period
2. Body: optional, 1-2 sentences only if needed for context
3. Breaking changes: be thorough with `BREAKING CHANGE:` footer
4. No emoji, no co-author lines, no lists
5. Prefer single-line commits when possible (except breaking changes)

## Process

1. Run `git status` and `git diff` to understand changes
2. Run `git log --oneline -5` to see recent style
3. Stage and commit:

```bash
git add <files>
git commit -m "type: subject"
```

Or with body:

```bash
git commit -m "$(cat <<'EOF'
type: subject

Brief context if the subject alone isn't clear.
EOF
)"
```

## Examples

Good (single line):
```
feat: add dual theme support
fix: escape curly braces in svelte output
chore: migrate from yarn to pnpm
refactor: replace hast generation with shiki transformers
```

Good (with body):
```
feat: add line number configuration

Users can now set starting line number via showLineNumbers{n}.
```

Bad:
```
Update highlighter to support new themes 🎨

- Added theme config
- Updated types
- Fixed tests

Co-Authored-By: Claude <noreply@anthropic.com>
```
