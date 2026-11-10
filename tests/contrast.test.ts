import { describe, expect, it } from 'vitest';
import { contrast, loadTokens, resolveRef, resolveVar } from '../scripts/tokens-lib.mjs';

describe('contrast', () => {
	it('calcula la razón WCAG', () => {
		expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5);
		expect(contrast('#ffffff', '#ffffff')).toBe(1);
		expect(contrast('#777777', '#ffffff')).toBeCloseTo(4.48, 2);
	});

	it('no depende del orden', () => {
		expect(contrast('#6429cd', '#ffffff')).toBe(contrast('#ffffff', '#6429cd'));
	});
});

describe('tokens', () => {
	const tokens = loadTokens();

	it('resuelve todas las variables de los pares en los dos modos', () => {
		for (const mode of Object.keys(tokens.themes)) {
			for (const { fg, bg } of tokens.contrast.pairs) {
				expect(resolveVar(tokens, mode, fg)).toMatch(/^#[0-9a-f]{6}$/i);
				expect(resolveVar(tokens, mode, bg)).toMatch(/^#[0-9a-f]{6}$/i);
			}
		}
	});

	it('falla con una referencia que no existe', () => {
		expect(() => resolveRef(tokens, 'brand.no-existe')).toThrow(/desconocida/);
	});
});
