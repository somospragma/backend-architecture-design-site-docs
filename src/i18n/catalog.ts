import type { Artifact } from '../content/artifact-schema';
import { AREAS, KINDS } from '../content/taxonomy.mjs';

export type Lang = 'es' | 'en';

// Textos de interfaz del catálogo y de las fichas. Toda etiqueta nueva va en los dos idiomas.
export const ui = {
	es: {
		emptyTitle: 'Aún no hay artefactos',
		emptyBody: 'El catálogo está listo, pero todavía no tiene fichas. Si construiste algo que le sirve a otros,',
		emptyLink: 'agrégalo',
		filtersLabel: 'Filtros del catálogo',
		filterArea: 'Área',
		filterKind: 'Tipo',
		filterEcosystem: 'Ecosistema',
		filterOrigin: 'Origen',
		filterStatus: 'Estado',
		filterAll: 'Todos',
		noMatches: 'Ningún artefacto coincide con los filtros.',
		count: (n: number) => (n === 1 ? '1 artefacto' : `${n} artefactos`),
		draft: 'borrador',
		fieldArea: 'Área',
		fieldKind: 'Tipo',
		fieldEcosystems: 'Ecosistemas',
		fieldOrigin: 'Origen',
		fieldOwners: 'Owners',
		fieldRepository: 'Repositorio',
		fieldRegistry: 'Registro',
		fieldLicense: 'Licencia',
		fieldLastReviewed: 'Última revisión',
		fieldTags: 'Etiquetas',
		docsHosted: 'Ver la documentación',
		docsIndexed: 'Ver la documentación en su repositorio',
		deprecatedTitle: 'Artefacto en desuso',
		replacedBy: 'Usa en su lugar:',
		backToCatalog: 'Volver al catálogo',
		areaIntro: 'Artefactos de esta área, agrupados por tipo. También puedes filtrarlos en el',
		catalogLink: 'catálogo completo',
	},
	en: {
		emptyTitle: 'No artifacts yet',
		emptyBody: 'The catalog is ready but has no entries yet. If you built something others can use,',
		emptyLink: 'add it',
		filtersLabel: 'Catalog filters',
		filterArea: 'Area',
		filterKind: 'Kind',
		filterEcosystem: 'Ecosystem',
		filterOrigin: 'Origin',
		filterStatus: 'Status',
		filterAll: 'All',
		noMatches: 'No artifacts match the filters.',
		count: (n: number) => (n === 1 ? '1 artifact' : `${n} artifacts`),
		draft: 'draft',
		fieldArea: 'Area',
		fieldKind: 'Kind',
		fieldEcosystems: 'Ecosystems',
		fieldOrigin: 'Origin',
		fieldOwners: 'Owners',
		fieldRepository: 'Repository',
		fieldRegistry: 'Registry',
		fieldLicense: 'License',
		fieldLastReviewed: 'Last reviewed',
		fieldTags: 'Tags',
		docsHosted: 'Read the docs',
		docsIndexed: 'Read the docs in its repository',
		deprecatedTitle: 'Deprecated artifact',
		replacedBy: 'Use instead:',
		backToCatalog: 'Back to the catalog',
		areaIntro: 'Artifacts in this area, grouped by kind. You can also filter them in the',
		catalogLink: 'full catalog',
	},
} as const;

const labelsFor = <T extends Record<string, { es: string; en: string }>>(source: T) =>
	({
		es: Object.fromEntries(Object.entries(source).map(([id, l]) => [id, l.es])),
		en: Object.fromEntries(Object.entries(source).map(([id, l]) => [id, l.en])),
	}) as Record<Lang, Record<string, string>>;

export const kindLabels = labelsFor(KINDS);
export const areaLabels = labelsFor(AREAS);

export const originLabels: Record<Lang, Record<Artifact['origin'], string>> = {
	es: { official: 'Oficial', community: 'Comunidad' },
	en: { official: 'Official', community: 'Community' },
};

export const statusLabels: Record<Lang, Record<Artifact['status'], string>> = {
	es: { experimental: 'Experimental', beta: 'Beta', stable: 'Estable', deprecated: 'En desuso' },
	en: { experimental: 'Experimental', beta: 'Beta', stable: 'Stable', deprecated: 'Deprecated' },
};

/** Variante de Badge de Starlight para cada estado. */
export const statusVariant = {
	experimental: 'caution',
	beta: 'note',
	stable: 'success',
	deprecated: 'danger',
} as const;
