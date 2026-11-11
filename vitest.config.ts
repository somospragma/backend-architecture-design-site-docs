import { defineConfig } from 'vitest/config';

// La cobertura solo se calcula con `pnpm test:coverage` (la usa el job de SonarCloud en CI).
export default defineConfig({
	test: {
		include: ['tests/**/*.test.ts'],
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{ts,mjs}', 'scripts/**/*.mjs'],
			exclude: ['src/**/*.d.ts'],
			reporter: ['text-summary', 'lcov'],
			reportsDirectory: 'coverage',
		},
	},
});
