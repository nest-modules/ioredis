import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'NestJS IoRedis',
  tagline: 'A IoRedis module for the NestJS framework',
  favicon: 'img/nestjs.svg',

  url: 'https://nest-modules.github.io',
  baseUrl: '/ioredis/',

  organizationName: 'nest-modules',
  projectName: 'ioredis',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/nest-modules/ioredis/tree/main/apps/website/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/nest-modules/ioredis/tree/main/apps/website/blog/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'NestJS IoRedis',
      logo: {
        alt: 'NestJS IoRedis Logo',
        src: 'img/nestjs.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Documentation',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/nest-modules/ioredis',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'Configuration',
              to: '/docs/configuration',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Issues',
              href: 'https://github.com/nest-modules/ioredis/issues',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/nestjs',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/@nestjs-modules/ioredis',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/nest-modules/ioredis',
            },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} Nest Modules TM. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
