# Documentation Maintenance

The site uses VitePress 1.6.4 and includes the [root README](../../README.md),
each library's README, and the repository's [LICENSE](../../LICENSE) directly.
These files are the single source of truth for the site's content. Edit the
root README to update the Overview, `libs/<library>/README.md` to update
library documentation, and [config.mts](./config.mts) to update navigation.

This directory contains the site's implementation and is not published as
documentation pages.

## Repository Links

Keep repository links relative in the READMEs. VitePress translates library
README links to site pages and source-file links to GitHub using the current
Git branch (or the build's GitHub ref in Actions). Set `DOCS_GIT_REF` to override
the source ref, for example `DOCS_GIT_REF=develop bun run docs:dev`. Detached
local checkouts use the checked-out commit. Uncommitted files must be pushed
before their GitHub links can resolve.

## Local Development

Run these commands from the repository root:

```sh
bun install
bun run docs:dev
bun run docs:build
bun run docs:preview
```

The equivalent Nx targets are `bun nx serve docs`, `bun nx build docs`, and
`bun nx preview docs`. The dev server serves the site at
`http://localhost:5173/nestjs-libs/`.

## Deployment

The [documentation workflow](../../.github/workflows/docs.yml) builds and
deploys only on pushes to `main`. To enable publishing, select **GitHub Actions**
under the repository's **Settings > Pages > Build and deployment > Source**.
The project-site base path is configured as `/nestjs-libs/`; update it if
moving to a custom domain.