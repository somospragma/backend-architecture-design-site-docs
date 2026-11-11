// ESLint del hub: reglas recomendadas de JavaScript, TypeScript y Astro.
// El formato lo revisa Prettier, no ESLint.
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
	{ ignores: ['dist/', 'coverage/', '.astro/', '.taste-skill/', 'src/styles/tokens.css'] },
	js.configs.recommended,
	tseslint.configs.recommended,
	astro.configs.recommended,
	{
		languageOptions: { globals: { ...globals.node, ...globals.browser } },
	},
);
