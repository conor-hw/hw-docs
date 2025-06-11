// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Hostelworld Docs Hub',
  tagline: 'Centralized Documentation for Hostelworld Projects',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://conor-hw.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/hw-docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'conor-hw', // Usually your GitHub org/user name.
  projectName: 'hw-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/conor-hw/hw-docs/tree/main/website/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'hub',
        path: 'hub-docs-source',
        routeBasePath: 'docs',
        sidebarPath: './sidebars.js',
        editUrl: 'https://github.com/conor-hw/hw-docs/edit/main/website/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'ticketWizard',
        path: 'docs/hostelworld-ticket-wizard/hw-docs',
        routeBasePath: 'ticket-wizard',
        editUrl: ({ docPath }) =>
          `https://github.com/conor-hw/hostelworld-ticket-wizard/edit/main/hw-docs/${docPath}`,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'nuxtProject',
        path: 'docs/nuxt-project/hw-docs',
        routeBasePath: 'nuxt-project',
        editUrl: ({ docPath }) =>
          `https://github.com/conor-hw/nuxt-project/edit/main/hw-docs/${docPath}`,
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'HW Docs Hub',
        logo: {
          alt: 'HW Docs Hub Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Hub Documentation',
            docsPluginId: 'hub',
          },
          {
            type: 'doc',
            docId: 'introduction',
            position: 'left',
            label: 'Ticket Wizard',
            docsPluginId: 'ticketWizard',
          },
          {
            type: 'doc',
            docId: 'introduction',
            position: 'left',
            label: 'Nuxt Project',
            docsPluginId: 'nuxtProject',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/conor-hw/hw-docs',
            label: 'GitHub (Hub)',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Hub Docs',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Projects',
            items: [
              {
                label: 'Ticket Wizard',
                to: '/ticket-wizard/introduction',
              },
              {
                label: 'Nuxt Project',
                to: '/nuxt-project/introduction',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'X',
                href: 'https://x.com/docusaurus',
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
                label: 'GitHub (Hub)',
                href: 'https://github.com/conor-hw/hw-docs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Hostelworld. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
