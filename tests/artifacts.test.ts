import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Artifact } from '../src/content/artifact-schema';

// astro:content solo existe dentro de Astro; aquí se reemplaza por una colección de prueba.
const entries = vi.hoisted(() => [
	{ id: 'zeta', data: { name: 'Zeta', kind: 'library', draft: false } },
	{ id: 'alfa', data: { name: 'Alfa', kind: 'plugin', draft: false } },
	{ id: 'borrador', data: { name: 'Borrador', kind: 'library', draft: true } },
]);
vi.mock('astro:content', () => ({
	getCollection: async (_name: string, filter: (entry: (typeof entries)[number]) => boolean) => entries.filter(filter),
}));

const { artifactPath, docsHref, getVisibleArtifacts, ownerHref, registryHref, sitePath } =
	await import('../src/lib/artifacts');
const { getTypePaths } = await import('../src/lib/type-paths');

type Registry = NonNullable<Artifact['registry']>;

describe('sitePath', () => {
	it('no agrega prefijo en español', () => {
		expect(sitePath('es', 'catalog/')).toBe('/catalog/');
	});

	it('agrega /en en inglés y quita la barra inicial del path', () => {
		expect(sitePath('en', '/catalog/')).toBe('/en/catalog/');
	});

	it('arma la ruta de una ficha', () => {
		expect(artifactPath('es', 'emvcode')).toBe('/catalog/emvcode/');
		expect(artifactPath('en', 'emvcode')).toBe('/en/catalog/emvcode/');
	});
});

describe('docsHref', () => {
	it('enlaza las docs hosted dentro del sitio', () => {
		const data = { docs: { mode: 'hosted' } } as Artifact;
		expect(docsHref('en', 'emvcode', data)).toBe('/en/artifacts/emvcode/');
	});

	it('usa la url de las docs indexed', () => {
		const data = { docs: { mode: 'indexed', url: 'https://github.com/o/r#readme' } } as Artifact;
		expect(docsHref('es', 'x', data)).toBe('https://github.com/o/r#readme');
	});
});

describe('ownerHref', () => {
	it('enlaza un usuario a su perfil', () => {
		expect(ownerHref('dev-user')).toBe('https://github.com/dev-user');
	});

	it('enlaza un equipo a la página del equipo en la organización', () => {
		expect(ownerHref('somospragma/backend')).toBe('https://github.com/orgs/somospragma/teams/backend');
	});
});

describe('registryHref', () => {
	it('respeta la url explícita', () => {
		expect(registryHref({ type: 'npm', id: 'x', url: 'https://example.com/x' })).toBe('https://example.com/x');
	});

	it.each([
		['maven-central', 'co.com.pragma:lib', 'https://central.sonatype.com/artifact/co.com.pragma/lib'],
		['gradle-plugin-portal', 'co.com.pragma.plugin', 'https://plugins.gradle.org/plugin/co.com.pragma.plugin'],
		['npm', '@pragmasa/emvcode', 'https://www.npmjs.com/package/@pragmasa/emvcode'],
		['pypi', 'pragma-lib', 'https://pypi.org/project/pragma-lib'],
		['nuget', 'Pragma.Lib', 'https://www.nuget.org/packages/Pragma.Lib'],
		['pub-dev', 'pragma_lib', 'https://pub.dev/packages/pragma_lib'],
		['rubygems', 'pragma', 'https://rubygems.org/gems/pragma'],
		['crates-io', 'pragma', 'https://crates.io/crates/pragma'],
		['vscode-marketplace', 'pragma.ext', 'https://marketplace.visualstudio.com/items?itemName=pragma.ext'],
	] as const)('deduce el enlace de %s', (type, id, href) => {
		expect(registryHref({ type, id } as Registry)).toBe(href);
	});

	it('no inventa un enlace para registros sin patrón conocido', () => {
		expect(registryHref({ type: 'github-marketplace', id: 'x' } as Registry)).toBeUndefined();
	});
});

describe('getVisibleArtifacts', () => {
	beforeEach(() => {
		vi.unstubAllEnvs();
	});

	it('en producción excluye las fichas en borrador y ordena por nombre', async () => {
		vi.stubEnv('DEV', false);
		const visible = await getVisibleArtifacts();
		expect(visible.map((e) => e.id)).toEqual(['alfa', 'zeta']);
	});

	it('en dev incluye las fichas en borrador', async () => {
		vi.stubEnv('DEV', true);
		const visible = await getVisibleArtifacts();
		expect(visible.map((e) => e.id)).toEqual(['alfa', 'borrador', 'zeta']);
	});
});

describe('getTypePaths', () => {
	it('crea una página por tipo con sus fichas visibles', async () => {
		vi.stubEnv('DEV', false);
		const paths = await getTypePaths();
		expect(paths.map((p) => p.params.kind).sort()).toEqual(['library', 'plugin']);
		const library = paths.find((p) => p.params.kind === 'library')!;
		expect(library.props.entries.map((e) => e.id)).toEqual(['zeta']);
	});
});
