import type { Artifact } from '../content/artifact-schema';
import { DISCIPLINES, KINDS } from '../content/taxonomy.mjs';

export type Lang = 'es' | 'en';

// Textos de interfaz del catálogo y de las fichas. Toda etiqueta nueva va en los dos idiomas.
export const ui = {
	es: {
		emptyTitle: 'Aún no hay artefactos',
		emptyBody: 'El catálogo está listo, pero todavía no tiene fichas. Si construiste algo que le sirve a otros,',
		emptyLink: 'agrégalo',
		communityEmptyTitle: 'Aún no hay proyectos de la comunidad',
		communityEmptyBody: 'Si tienes un proyecto open source en tu cuenta que le sirve a otros,',
		filtersLabel: 'Filtros del catálogo',
		filterKind: 'Tipo',
		filterDiscipline: 'Disciplina',
		filterLanguage: 'Lenguaje',
		filterTechnology: 'Tecnología',
		filterOrigin: 'Origen',
		filterStatus: 'Estado',
		filterAll: 'Todos',
		noMatches: 'Ningún artefacto coincide con los filtros.',
		count: (n: number) => (n === 1 ? '1 artefacto' : `${n} artefactos`),
		draft: 'borrador',
		fieldKind: 'Tipo',
		fieldDisciplines: 'Disciplinas',
		fieldLanguages: 'Lenguajes',
		fieldTechnologies: 'Tecnologías',
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
		typeIntro: 'Aquí están agrupados por disciplina. También puedes filtrarlos por lenguaje o tecnología en el',
		catalogLink: 'catálogo completo',
	},
	en: {
		emptyTitle: 'No artifacts yet',
		emptyBody: 'The catalog is ready but has no entries yet. If you built something others can use,',
		emptyLink: 'add it',
		communityEmptyTitle: 'No community projects yet',
		communityEmptyBody: 'If you have an open source project in your own account that others can use,',
		filtersLabel: 'Catalog filters',
		filterKind: 'Type',
		filterDiscipline: 'Discipline',
		filterLanguage: 'Language',
		filterTechnology: 'Technology',
		filterOrigin: 'Origin',
		filterStatus: 'Status',
		filterAll: 'All',
		noMatches: 'No artifacts match the filters.',
		count: (n: number) => (n === 1 ? '1 artifact' : `${n} artifacts`),
		draft: 'draft',
		fieldKind: 'Type',
		fieldDisciplines: 'Disciplines',
		fieldLanguages: 'Languages',
		fieldTechnologies: 'Technologies',
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
		typeIntro: 'Here they are grouped by discipline. You can also filter them by language or technology in the',
		catalogLink: 'full catalog',
	},
} as const;

const labelsFor = <T extends Record<string, { es: string; en: string }>>(source: T) =>
	({
		es: Object.fromEntries(Object.entries(source).map(([id, l]) => [id, l.es])),
		en: Object.fromEntries(Object.entries(source).map(([id, l]) => [id, l.en])),
	}) as Record<Lang, Record<string, string>>;

export const kindLabels = labelsFor(KINDS);
export const disciplineLabels = labelsFor(DISCIPLINES);

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
