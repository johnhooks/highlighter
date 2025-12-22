# Release Process

This project uses [Changesets](https://github.com/changesets/changesets) for version management and changelog generation.

## How It Works

Changesets tracks changes through small markdown files in `.changeset/`. Each file describes a change and its semver impact (major/minor/patch). When releasing, these files are consumed to:

1. Determine the next version number
2. Generate CHANGELOG.md entries
3. Update package.json version

## Development Workflow

### Adding a Changeset

After making changes that should be released, create a changeset:

```bash
pnpm changeset
```

This prompts you to:
1. Select the semver bump type (major/minor/patch)
2. Write a summary of the change

A markdown file is created in `.changeset/` - commit this with your PR.

### When to Add a Changeset

Add a changeset for:
- New features (minor)
- Bug fixes (patch)
- Breaking changes (major)
- Performance improvements (patch)
- Dependency updates that affect users (patch/minor)

Skip changesets for:
- Documentation-only changes
- Internal refactoring with no API changes
- Test additions/fixes
- CI/tooling updates

### Semver Guidelines

| Change Type | Bump | Example |
|-------------|------|---------|
| Breaking API change | major | Removing an export, changing function signature |
| New feature | minor | Adding new options, new exports |
| Bug fix | patch | Fixing incorrect behavior |
| Peer dep bump | major | Requiring newer Shiki version |

## Release Workflow

### Manual Release

1. Ensure all changesets are committed
2. Run version command to consume changesets:
   ```bash
   pnpm version
   ```
   This updates:
   - `package.json` version
   - `CHANGELOG.md`
   - Deletes consumed changeset files

3. Review and commit the version bump:
   ```bash
   git add .
   git commit -m "chore: release vX.Y.Z"
   ```

4. Publish to npm:
   ```bash
   pnpm release
   ```

5. Push and tag:
   ```bash
   git push --follow-tags
   ```

### CI Release (GitHub Actions)

For automated releases, add `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: pnpm release
          version: pnpm version
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

This workflow:
1. On push to main, checks for pending changesets
2. If changesets exist, opens a "Version Packages" PR
3. When that PR is merged, publishes to npm

### Required Secrets

For CI releases, configure these repository secrets:
- `NPM_TOKEN`: npm access token with publish permissions

`GITHUB_TOKEN` is automatically provided by GitHub Actions.

## Configuration

Changesets config lives in `.changeset/config.json`:

```json
{
  "changelog": ["@changesets/changelog-github", { "repo": "johnhooks/highlighter" }],
  "access": "public",
  "baseBranch": "main"
}
```

- `changelog`: Uses GitHub-flavored changelog with PR/commit links
- `access`: "public" for npm public packages
- `baseBranch`: Branch that releases are made from

## Pre-release Versions

For alpha/beta releases:

```bash
# Enter pre-release mode
pnpm changeset pre enter alpha

# Add changesets and version as normal
pnpm changeset
pnpm version  # Creates 1.0.0-alpha.0

# Exit pre-release mode when ready for stable
pnpm changeset pre exit
```

### Changing Pre-release Tag

To move from alpha to beta (e.g., 1.0.0-alpha.7 to 1.0.0-beta.0):

```bash
# Exit current pre-release mode (if in one)
pnpm changeset pre exit

# Enter new pre-release mode
pnpm changeset pre enter beta

# Add changeset and version
pnpm changeset
pnpm version  # Creates 1.0.0-beta.0
```

Note: The version number resets when changing pre-release tags.
