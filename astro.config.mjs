// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const REPO_URL = 'https://github.com/somospragma/backend-architecture-design-site-docs';

// https://astro.build/config
export default defineConfig({
	site: 'https://somospragma.github.io',
	base: '/backend-architecture-design-site-docs',
	integrations: [
		starlight({
			title: 'Pragma Hub',
			description: 'Librerías, plugins, plantillas y herramientas que construye Pragma y su comunidad.',
			logo: {
				light: './src/assets/brand/pragma-logo.svg',
				dark: './src/assets/brand/pragma-logo-white.svg',
				alt: 'Pragma',
			},
			favicon: '/favicon.svg',
			defaultLocale: 'root',
			locales: {
				root: { label: 'Español', lang: 'es' },
				en: { label: 'English', lang: 'en' },
			},
			social: [{ icon: 'github', label: 'GitHub', href: REPO_URL }],
			editLink: { baseUrl: `${REPO_URL}/edit/main/` },
			lastUpdated: true,
			customCss: [
				'@fontsource/poppins/400.css',
				'@fontsource/poppins/500.css',
				'@fontsource/poppins/600.css',
				'@fontsource/poppins/700.css',
				'./src/styles/tokens.css',
				'./src/styles/theme.css',
			],
			sidebar: [
				{
					label: 'Hub',
					items: [
						{ slug: 'catalog' },
						{ slug: 'contribute' },
						{ slug: 'community' },
					],
				},
				{
					label: 'Guías',
					translations: { en: 'Guides' },
					items: [{ autogenerate: { directory: 'guides' } }],
				},
			],
		}),
	],
});
