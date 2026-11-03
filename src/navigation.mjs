// Arma los temas (topics) de la navegación a partir de las fichas.
// Se ejecuta al cargar astro.config.mjs, antes de que exista la colección de contenido,
// por eso lee el frontmatter directamente. La validación completa la hace el schema en el build.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { DISCIPLINES, KINDS } from './content/taxonomy.mjs';

const ARTIFACTS_DIR = new URL('./content/artifacts/', import.meta.url);

/** Fichas visibles: en dev se incluyen las draft, en build se excluyen (igual que el catálogo). */
function readArtifacts(includeDrafts) {
	if (!existsSync(ARTIFACTS_DIR)) return [];
	return readdirSync(ARTIFACTS_DIR)
		.filter((file) => file.endsWith('.md'))
		.map((file) => {
			const frontmatter = readFileSync(new URL(file, ARTIFACTS_DIR), 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1];
			return { slug: file.replace(/\.md$/, ''), ...parse(frontmatter ?? '') };
		})
		.filter((a) => a.kind in KINDS && (includeDrafts || !a.draft));
}

/** Slugs de las fichas en borrador. Sus docs hosted no se publican en el build de producción. */
export function draftArtifactSlugs() {
	if (!existsSync(ARTIFACTS_DIR)) return [];
	return readdirSync(ARTIFACTS_DIR)
		.filter((file) => file.endsWith('.md'))
		.filter((file) => {
			const frontmatter = readFileSync(new URL(file, ARTIFACTS_DIR), 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1];
			return parse(frontmatter ?? '')?.draft === true;
		})
		.map((file) => file.replace(/\.md$/, ''));
}

function artifactItem(artifact) {
	if (artifact.docs?.mode === 'hosted') {
		return {
			label: artifact.name,
			collapsed: true,
			items: [
				{ link: `/catalog/${artifact.slug}/`, label: 'Ficha', translations: { en: 'Overview' } },
				{ autogenerate: { directory: `artifacts/${artifact.slug}` } },
			],
		};
	}
	return { label: artifact.name, link: `/catalog/${artifact.slug}/` };
}

/** Disciplina principal de una ficha: la primera de su lista. */
const primaryDiscipline = (artifact) => artifact.disciplines?.[0];

/** Barra lateral de un tipo: un grupo por disciplina principal, en el orden de DISCIPLINES, con los artefactos en orden alfabético. */
function kindSidebar(artifacts) {
	return Object.entries(DISCIPLINES)
		.map(([discipline, label]) => ({
			label: label.es,
			translations: { en: label.en },
			items: artifacts
				.filter((a) => primaryDiscipline(a) === discipline)
				.sort((a, b) => a.name.localeCompare(b.name))
				.map(artifactItem),
		}))
		.filter((group) => group.items.length > 0);
}

export function buildTopics({ includeDrafts }) {
	const artifacts = readArtifacts(includeDrafts);
	const hub = {
		id: 'hub',
		label: 'Hub',
		link: '/catalog/',
		items: [
			{
				label: 'Hub',
				items: [{ slug: 'catalog' }, { slug: 'contribute' }, { slug: 'community' }],
			},
			{
				label: 'Guías',
				translations: { en: 'Guides' },
				items: [{ autogenerate: { directory: 'guides' } }],
			},
		],
	};

	const kinds = Object.entries(KINDS)
		.map(([kind, labels]) => ({ kind, labels, artifacts: artifacts.filter((a) => a.kind === kind) }))
		.filter(({ artifacts }) => artifacts.length > 0)
		.map(({ kind, labels, artifacts }) => ({
			id: kind,
			label: { es: labels.group.es, en: labels.group.en },
			link: `/types/${kind}/`,
			items: kindSidebar(artifacts),
		}));

	return [hub, ...kinds];
}
