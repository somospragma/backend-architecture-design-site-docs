/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  cleanArchSidebar: [
    {
      type: 'category',
      label: 'Clean Architecture Generator',
      collapsed: false,
      items: [
        'clean-arch/intro',
        {
          type: 'category',
          label: 'Getting Started',
          items: [
            'clean-arch/getting-started/installation',
            'clean-arch/getting-started/quick-start',
            'clean-arch/getting-started/first-project',
          ],
        },
        {
          type: 'category',
          label: 'Guides',
          items: [
            {
              type: 'category',
              label: 'Component Generators',
              items: [
                'clean-arch/guides/generators/entities',
                'clean-arch/guides/generators/use-cases',
                'clean-arch/guides/generators/output-adapters',
                'clean-arch/guides/generators/input-adapters',
              ],
            },
            {
              type: 'category',
              label: 'Driven Adapters (Output)',
              items: [
                'clean-arch/guides/adapters/driven-adapters/redis',
                'clean-arch/guides/adapters/driven-adapters/mongodb',
                'clean-arch/guides/adapters/driven-adapters/postgresql',
              ],
            },
            {
              type: 'category',
              label: 'Entry Points (Input)',
              items: [
                'clean-arch/guides/adapters/entry-points/rest',
              ],
            },
            {
              type: 'category',
              label: 'Architectures',
              items: [
                'clean-arch/guides/architectures/hexagonal',
                'clean-arch/guides/architectures/onion',
              ],
            },
            {
              type: 'category',
              label: 'Frameworks',
              items: [
                'clean-arch/guides/frameworks/spring-reactive',
                'clean-arch/guides/frameworks/spring-imperative',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Reference',
          items: [
            'clean-arch/reference/commands',
            'clean-arch/reference/configuration',
          ],
        },
        {
          type: 'category',
          label: 'Contributing',
          items: [
            'clean-arch/contributing/overview',
            'clean-arch/contributing/adding-commands',
            'clean-arch/contributing/adding-adapters',
            'clean-arch/contributing/modifying-templates',
          ],
        },
      ],
    },
  ],
  nodejsSidebar: [
    {
      type: 'doc',
      id: 'nodejs/intro',
      label: 'Node.js Libraries',
    },
  ],
  pythonSidebar: [
    {
      type: 'doc',
      id: 'python/intro',
      label: 'Python Libraries',
    },
  ],
  dotnetSidebar: [
    {
      type: 'doc',
      id: 'dotnet/intro',
      label: '.NET Libraries',
    },
  ],
};

export default sidebars;
