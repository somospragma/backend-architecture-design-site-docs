import { describe, expect, it } from 'vitest';
import { artifactSchema } from '../src/content/artifact-schema';

const valid = {
	name: 'Ejemplo',
	summary: { es: 'Un ejemplo.', en: 'An example.' },
	kind: 'library',
	disciplines: ['backend'],
	languages: ['java'],
	origin: 'official',
	owners: ['somospragma/backend-chapter'],
	repository: 'https://github.com/somospragma/ejemplo',
	status: 'stable',
	license: 'Apache-2.0',
	docs: { mode: 'indexed', url: 'https://github.com/somospragma/ejemplo#readme' },
	lastReviewed: '2026-11-01',
};

const issues = (data: object) => {
	const result = artifactSchema.safeParse(data);
	return result.success ? [] : result.error.issues.map((i) => i.path.join('.'));
};

describe('artifactSchema', () => {
	it('acepta una ficha completa', () => {
		expect(issues(valid)).toEqual([]);
	});

	it('pide el resumen en los dos idiomas', () => {
		expect(issues({ ...valid, summary: { es: 'Solo español.' } })).toContain('summary.en');
	});

	it('pide al menos un owner con formato de GitHub', () => {
		expect(issues({ ...valid, owners: [] })).toContain('owners');
		expect(issues({ ...valid, owners: ['no es un owner'] })).toContain('owners.0');
	});

	it('solo acepta repositorios https', () => {
		expect(issues({ ...valid, repository: 'http://github.com/x/y' })).toContain('repository');
	});

	it('acepta UNLICENSED solo en fichas oficiales', () => {
		expect(issues({ ...valid, license: 'UNLICENSED' })).toEqual([]);
		expect(issues({ ...valid, origin: 'community', license: 'UNLICENSED' })).toContain('license');
	});

	it('pide una licencia OSI a la comunidad y un SPDX válido a todos', () => {
		expect(issues({ ...valid, origin: 'community', license: 'MIT' })).toEqual([]);
		expect(issues({ ...valid, license: 'Mi-Licencia' })).toContain('license');
	});

	it('pide replacedBy o deprecationNote a un artefacto deprecated', () => {
		expect(issues({ ...valid, status: 'deprecated' })).toContain('status');
		expect(issues({ ...valid, status: 'deprecated', replacedBy: 'otro' })).toEqual([]);
	});

	it('pide docs.url en modo indexed', () => {
		expect(issues({ ...valid, docs: { mode: 'indexed' } })).toContain('docs.url');
	});
});
