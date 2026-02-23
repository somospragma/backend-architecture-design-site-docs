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

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

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
      // Mermaid configuration with Pragma colors
      mermaid: {
        theme: { light: 'base', dark: 'base' },
        options: {
          themeVariables: {
            // Pragma brand colors
            primaryColor: '#6429CD',
            primaryTextColor: '#fff',
            primaryBorderColor: '#440099',
            lineColor: '#6429CD',
            secondaryColor: '#8f5ae0',
            tertiaryColor: '#c5aaf1',

            // Node colors
            mainBkg: '#6429CD',
            secondBkg: '#8f5ae0',
            tertiaryBkg: '#c5aaf1',

            // Text colors
            textColor: '#1D1D1B',
            mainTextColor: '#ffffff',
            secondaryTextColor: '#1D1D1B',

            // Border colors
            border1: '#440099',
            border2: '#6429CD',

            // Special states
            nodeBorder: '#440099',
            clusterBkg: '#f5f0ff',
            clusterBorder: '#6429CD',
            defaultLinkColor: '#6429CD',
            titleColor: '#1D1D1B',
            edgeLabelBackground: '#ffffff',
            edgeLabelText: '#1D1D1B',

            // Activity colors
            activeTaskBkgColor: '#6429CD',
            activeTaskBorderColor: '#440099',
            doneTaskBkgColor: '#8f5ae0',
            doneTaskBorderColor: '#6429CD',
            critBkgColor: '#ff6b6b',
            critBorderColor: '#ff5252',

            // Git graph colors
            git0: '#6429CD',
            git1: '#8f5ae0',
            git2: '#c5aaf1',
            git3: '#440099',
            git4: '#531DBC',
            git5: '#330072',
            git6: '#7c3fdb',
            git7: '#a175e5',

            // Sequence diagram
            actorBkg: '#6429CD',
            actorBorder: '#440099',
            actorTextColor: '#ffffff',
            actorLineColor: '#6429CD',
            signalColor: '#1D1D1B',
            signalTextColor: '#1D1D1B',
            labelBoxBkgColor: '#8f5ae0',
            labelBoxBorderColor: '#6429CD',
            labelTextColor: '#ffffff',
            loopTextColor: '#1D1D1B',
            noteBorderColor: '#6429CD',
            noteBkgColor: '#f5f0ff',
            noteTextColor: '#1D1D1B',
            activationBorderColor: '#440099',
            activationBkgColor: '#c5aaf1',
            sequenceNumberColor: '#ffffff',

            // State diagram
            labelColor: '#ffffff',
            altBackground: '#f5f0ff',

            // Class diagram
            classText: '#1D1D1B',

            // Pie chart
            pie1: '#6429CD',
            pie2: '#8f5ae0',
            pie3: '#c5aaf1',
            pie4: '#440099',
            pie5: '#531DBC',
            pie6: '#330072',
            pie7: '#7c3fdb',
            pie8: '#a175e5',
            pie9: '#ad87e9',
            pie10: '#b99aed',
            pie11: '#c5aaf1',
            pie12: '#d1bbf5',
          },
        },
      },
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
                sidebarId: 'javaSidebar',
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
