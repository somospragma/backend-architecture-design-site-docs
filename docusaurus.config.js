// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Pragma Libs',
  tagline: 'Open-source libraries and tools to accelerate software development',
  favicon: 'img/pragma-icon.svg',

  // Set the production url of your site here
  url: 'https://libs.pragma.com.co',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'somospragma', // Usually your GitHub org/user name.
  projectName: 'backend-architecture-design-archetype-generator', // Usually your repo name.

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
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/somospragma/backend-architecture-design-site-docs/tree/main/',
          editLocalizedFiles: true,
        },
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Pragma Libs',
        logo: {
          alt: 'Pragma Logo',
          src: 'img/pragma-icon.svg',
        },
        items: [
          {
            type: 'dropdown',
            label: 'Java Libs',
            position: 'left',
            items: [
              {
                type: 'docSidebar',
                sidebarId: 'cleanArchSidebar',
                label: 'Clean Architecture Generator',
              },
              // Add more Java libraries here as they become available
            ],
          },
          {
            type: 'dropdown',
            label: 'Node.js Libs',
            position: 'left',
            items: [
              {
                to: '/docs/nodejs/intro',
                label: 'Coming Soon',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Python Libs',
            position: 'left',
            items: [
              {
                to: '/docs/python/intro',
                label: 'Coming Soon',
              },
            ],
          },
          {
            type: 'dropdown',
            label: '.NET Libs',
            position: 'left',
            items: [
              {
                to: '/docs/dotnet/intro',
                label: 'Coming Soon',
              },
            ],
          },
          {
            href: 'https://github.com/somospragma',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Libraries',
            items: [
              {
                label: 'Java Libs',
                to: '/docs/clean-arch/intro',
              },
              {
                label: 'Node.js Libs',
                to: '/docs/nodejs/intro',
              },
              {
                label: 'Python Libs',
                to: '/docs/python/intro',
              },
              {
                label: '.NET Libs',
                to: '/docs/dotnet/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/somospragma',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Pragma',
                href: 'https://pragma.com.co',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Pragma. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['java', 'kotlin', 'gradle', 'yaml'],
      },
    }),
};

export default config;
