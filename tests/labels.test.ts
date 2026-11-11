import { describe, expect, it } from 'vitest';
import { home } from '../src/components/home/copy';
import { DISCIPLINES, KINDS } from '../src/content/taxonomy.mjs';
import { disciplineLabels, kindLabels, ui } from '../src/i18n/catalog';

describe('textos con número', () => {
	it.each([
		['es', ui.es.count, '1 artefacto', '3 artefactos'],
		['en', ui.en.count, '1 artifact', '3 artifacts'],
		['es (home)', home.es.kinds.count, '1 artefacto', '3 artefactos'],
		['en (home)', home.en.kinds.count, '1 artifact', '3 artifacts'],
	])('usa singular y plural en %s', (_lang, count, one, many) => {
		expect(count(1)).toBe(one);
		expect(count(3)).toBe(many);
	});
});

describe('etiquetas de la taxonomía', () => {
	it('tiene una etiqueta por tipo en cada idioma', () => {
		for (const [kind, label] of Object.entries(KINDS)) {
			expect(kindLabels.es[kind]).toBe(label.es);
			expect(kindLabels.en[kind]).toBe(label.en);
		}
	});

	it('tiene una etiqueta por disciplina en cada idioma', () => {
		for (const [discipline, label] of Object.entries(DISCIPLINES)) {
			expect(disciplineLabels.es[discipline]).toBe(label.es);
			expect(disciplineLabels.en[discipline]).toBe(label.en);
		}
	});

	it('el home tiene un ejemplo para cada tipo', () => {
		expect(Object.keys(home.es.kinds.examples).sort()).toEqual(Object.keys(KINDS).sort());
		expect(Object.keys(home.en.kinds.examples).sort()).toEqual(Object.keys(KINDS).sort());
	});
});
