import { getCollection, type CollectionEntry } from 'astro:content';
import type { Artifact } from '../content/artifact-schema';
import type { Lang } from '../i18n/catalog';

export type ArtifactEntry = CollectionEntry<'artifacts'>;

/** Fichas visibles: en producción se excluyen las que tienen draft: true; en dev se muestran todas. */
export async function getVisibleArtifacts(): Promise<ArtifactEntry[]> {
	const entries = await getCollection('artifacts', ({ data }) => import.meta.env.DEV || !data.draft);
	return entries.sort((a, b) => a.data.name.localeCompare(b.data.name));
}

/** Ruta dentro del sitio, con el base y el prefijo de idioma. */
export function sitePath(lang: Lang, path: string) {
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	const prefix = lang === 'en' ? '/en' : '';
	return `${base}${prefix}/${path.replace(/^\//, '')}`;
}

export const artifactPath = (lang: Lang, slug: string) => sitePath(lang, `catalog/${slug}/`);

export function docsHref(lang: Lang, slug: string, data: Artifact) {
	return data.docs.mode === 'hosted' ? sitePath(lang, `artifacts/${slug}/`) : data.docs.url!;
}

export function ownerHref(owner: string) {
	const [org, team] = owner.split('/');
	return team ? `https://github.com/orgs/${org}/teams/${team}` : `https://github.com/${org}`;
}

/** Enlace público del paquete en su registro, si se puede deducir del id. */
export function registryHref(registry: NonNullable<Artifact['registry']>) {
	if (registry.url) return registry.url;
	const id = encodeURIComponent(registry.id);
	switch (registry.type) {
		case 'maven-central':
			return `https://central.sonatype.com/artifact/${registry.id.replace(':', '/')}`;
		case 'gradle-plugin-portal':
			return `https://plugins.gradle.org/plugin/${id}`;
		case 'npm':
			return `https://www.npmjs.com/package/${registry.id}`;
		case 'pypi':
			return `https://pypi.org/project/${id}`;
		case 'nuget':
			return `https://www.nuget.org/packages/${id}`;
		case 'pub-dev':
			return `https://pub.dev/packages/${id}`;
		case 'rubygems':
			return `https://rubygems.org/gems/${id}`;
		case 'crates-io':
			return `https://crates.io/crates/${id}`;
		case 'vscode-marketplace':
			return `https://marketplace.visualstudio.com/items?itemName=${id}`;
		default:
			return undefined;
	}
}
