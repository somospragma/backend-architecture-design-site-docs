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
            'clean-arch/getting-started/adding-adapters',
          ],
        },
        {
          type: 'category',
          label: 'Commands',
          items: [
            'clean-arch/commands/init-clean-arch',
            'clean-arch/commands/generate-output-adapter',
            'clean-arch/commands/generate-input-adapter',
            'clean-arch/commands/generate-use-case',
            'clean-arch/commands/validate-templates',
          ],
        },
        {
          type: 'category',
          label: 'Adapters',
          items: [
            'clean-arch/adapters/index',
            'clean-arch/adapters/mongodb',
            'clean-arch/adapters/redis',
            'clean-arch/adapters/dynamodb',
            'clean-arch/adapters/rest-controller',
            'clean-arch/adapters/http-client',
          ],
        },
        {
          type: 'category',
          label: 'Architectures',
          items: [
            'clean-arch/architectures/overview',
            'clean-arch/architectures/hexagonal-single',
            'clean-arch/architectures/hexagonal-multi',
            'clean-arch/architectures/hexagonal-multi-granular',
            'clean-arch/architectures/onion-single',
          ],
        },
        {
          type: 'category',
          label: 'For Contributors',
          items: [
            'clean-arch/for-contributors/developer-mode',
            'clean-arch/for-contributors/adding-adapters',
            'clean-arch/for-contributors/adding-architectures',
            'clean-arch/for-contributors/testing-templates',
          ],
        },
        {
          type: 'category',
          label: 'Reference',
          items: [
            'clean-arch/reference/cleanarch-yml',
            'clean-arch/reference/metadata-yml',
            'clean-arch/reference/structure-yml',
            'clean-arch/reference/commands',
            'clean-arch/reference/configuration',
          ],
        },
        'clean-arch/troubleshooting',
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
              label: 'Frameworks',
              items: [
                'clean-arch/guides/frameworks/spring-reactive',
                'clean-arch/guides/frameworks/spring-imperative',
              ],
            },
            {
              type: 'category',
              label: 'Architecture Patterns',
              items: [
                'clean-arch/guides/architectures/hexagonal',
                'clean-arch/guides/architectures/onion',
              ],
            },
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
