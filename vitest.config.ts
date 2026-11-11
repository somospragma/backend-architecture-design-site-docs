import { defineConfig } from 'vitest/config';

// La cobertura solo se calcula con `pnpm test:coverage` (la usa el job de SonarCloud en CI).
export default defineConfig({
	test: {
		include: ['tests/**/*.test.ts'],
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{ts,mjs}', 'scripts/**/*.mjs'],
			// Puntos de entrada sin lógica propia que probar: los CLIs de scripts/ corren como checks en CI
			// (pnpm tokens, check:contrast, check:reviews) y content.config.ts lo ejecuta Astro en el build.
			// La lógica de los CLIs vive en scripts/tokens-lib.mjs, que sí se prueba.
			exclude: [
				'src/**/*.d.ts',
				'src/content.config.ts',
				'scripts/build-tokens.mjs',
				'scripts/check-contrast.mjs',
				'scripts/check-review-dates.mjs',
			],
			reporter: ['text-summary', 'lcov'],
			reportsDirectory: 'coverage',
		},
	},
});
