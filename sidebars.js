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
  javaSidebar: [
    {
      type: 'doc',
      id: 'java/intro',
      label: 'Librerías Java',
    },
    {
      type: 'category',
      label: 'Clean Architecture Generator',
      collapsed: false,
      items: [
        'java/clean-arch/intro',
        {
          type: 'category',
          label: 'Getting Started',
          items: [
            'java/clean-arch/getting-started/installation',
            'java/clean-arch/getting-started/quick-start',
            'java/clean-arch/getting-started/first-project',
            'java/clean-arch/getting-started/adding-adapters',
          ],
        },
        {
          type: 'category',
          label: 'Commands',
          items: [
            'java/clean-arch/commands/init-clean-arch',
            'java/clean-arch/commands/generate-output-adapter',
            'java/clean-arch/commands/generate-input-adapter',
            'java/clean-arch/commands/generate-use-case',
            'java/clean-arch/commands/validate-templates',
          ],
        },
        {
          type: 'category',
          label: 'Adapters',
          items: [
            'java/clean-arch/adapters/index',
            'java/clean-arch/adapters/mongodb',
            'java/clean-arch/adapters/redis',
            'java/clean-arch/adapters/dynamodb',
            'java/clean-arch/adapters/rest-controller',
            'java/clean-arch/adapters/http-client',
          ],
        },
        {
          type: 'category',
          label: 'Architectures',
          items: [
            'java/clean-arch/architectures/overview',
            'java/clean-arch/architectures/hexagonal-single',
            'java/clean-arch/architectures/hexagonal-multi',
            'java/clean-arch/architectures/hexagonal-multi-granular',
            'java/clean-arch/architectures/onion-single',
          ],
        },
        {
          type: 'category',
          label: 'For Contributors',
          items: [
            'java/clean-arch/contributors/index',
            'java/clean-arch/contributors/overview',
            'java/clean-arch/contributors/development-setup',
            'java/clean-arch/contributors/developer-mode',
            {
              type: 'category',
              label: 'Template System',
              items: [
                'java/clean-arch/contributors/template-system',
                'java/clean-arch/contributors/testing-templates',
                'java/clean-arch/contributors/modifying-templates',
                'java/clean-arch/contributors/contributing-templates',
              ],
            },
            {
              type: 'category',
              label: 'Adding Features',
              items: [
                'java/clean-arch/contributors/adding-adapter',
                'java/clean-arch/contributors/adding-architecture',
                'java/clean-arch/contributors/adding-command',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Reference',
          items: [
            'java/clean-arch/reference/cleanarch-yml',
            'java/clean-arch/reference/metadata-yml',
            'java/clean-arch/reference/structure-yml',
            'java/clean-arch/reference/commands',
            'java/clean-arch/reference/configuration',
          ],
        },
        'java/clean-arch/troubleshooting',
        {
          type: 'category',
          label: 'Guides',
          items: [
            {
              type: 'category',
              label: 'Component Generators',
              items: [
                'java/clean-arch/guides/generators/entities',
                'java/clean-arch/guides/generators/use-cases',
                'java/clean-arch/guides/generators/output-adapters',
                'java/clean-arch/guides/generators/input-adapters',
              ],
            },
            {
              type: 'category',
              label: 'Frameworks',
              items: [
                'java/clean-arch/guides/frameworks/spring-reactive',
                'java/clean-arch/guides/frameworks/spring-imperative',
              ],
            },
            {
              type: 'category',
              label: 'Architecture Patterns',
              items: [
                'java/clean-arch/guides/architectures/hexagonal',
                'java/clean-arch/guides/architectures/onion',
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
