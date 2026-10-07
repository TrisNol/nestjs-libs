import { execFileSync } from 'node:child_process';
import { defineConfig } from 'vitepress';

const gitRef =
  process.env.DOCS_GIT_REF ||
  process.env.GITHUB_HEAD_REF ||
  process.env.GITHUB_REF_NAME ||
  execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    encoding: 'utf8',
  }).trim();
const sourceRef =
  gitRef === 'HEAD'
    ? execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
    : gitRef;
const sourceBase = `https://github.com/TrisNol/nestjs-libs/blob/${encodeURIComponent(sourceRef)}`;

export default defineConfig({
  title: 'nestjs-libs',
  description: 'Utility libraries for NestJS applications.',
  base: '/nestjs-libs/',
  markdown: {
    config(markdown) {
      markdown.core.ruler.after('inline', 'repository-readme-links', (state) => {
        const library = state.env.relativePath?.match(/^libraries\/([^/]+)\.md$/);
        for (const block of state.tokens) {
          for (const token of block.children ?? []) {
            if (token.type !== 'link_open') continue;
            const href = token.attrGet('href');
            if (!href) continue;
            const documentationLink = href.replace(
              /^\.\/libs\/([^/]+)\/README\.md(?=[?#]|$)/,
              '/libraries/$1',
            );
            if (documentationLink !== href) {
              token.attrSet('href', documentationLink);
            } else if (library && /^\.\.?\//.test(href)) {
              token.attrSet(
                'href',
                new URL(href, `${sourceBase}/libs/${library[1]}/`).href,
              );
            }
          }
        }
      });
    },
  },
  themeConfig: {
    nav: [{ text: 'Libraries', link: '/' }],
    sidebar: [
      { text: 'Overview', link: '/' },
      { text: 'License', link: '/license' },
      {
        text: 'Libraries',
        items: [
          {
            text: 'TypeORM Transactions',
            link: '/libraries/nestjs-typeorm-transactional',
          },
          { text: 'Contextual Logging', link: '/libraries/contextual-logging' },
          {
            text: 'Buffered MQTT Adapter',
            link: '/libraries/buffered-mqtt-adapter',
          },
          { text: 'GraphQL Live Queries', link: '/libraries/gql-live-query' },
          { text: 'MCP Server', link: '/libraries/mcp-server' },
        ],
      },
    ],
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/TrisNol/nestjs-libs' },
    ],
    outline: [2, 3],
  },
});