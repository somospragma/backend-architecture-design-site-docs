// Arma los temas (topics) de la navegación a partir de las fichas.
// Se ejecuta al cargar astro.config.mjs, antes de que exista la colección de contenido,
// por eso lee el frontmatter directamente. La validación completa la hace el schema en el build.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { AREAS, KINDS } from './content/taxonomy.mjs';

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
		.filter((a) => a.area in AREAS && a.kind in KINDS && (includeDrafts || !a.draft));
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

/** Barra lateral de un área: un grupo por tipo, en el orden de KINDS, con los artefactos en orden alfabético. */
function areaSidebar(artifacts) {
	return Object.entries(KINDS)
		.map(([kind, labels]) => ({
			label: labels.group.es,
			translations: { en: labels.group.en },
			items: artifacts
				.filter((a) => a.kind === kind)
				.sort((a, b) => a.name.localeCompare(b.name))
				.map(artifactItem),
		}))
		.filter((group) => group.items.length > 0);
}

/** Lista de áreas con al menos una ficha visible. */
export function populatedAreas({ includeDrafts }) {
	const artifacts = readArtifacts(includeDrafts);
	return Object.keys(AREAS).filter((area) => artifacts.some((a) => a.area === area));
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

	const areas = Object.entries(AREAS)
		.map(([area, label]) => ({ area, label, artifacts: artifacts.filter((a) => a.area === area) }))
		.filter(({ artifacts }) => artifacts.length > 0)
		.map(({ area, label, artifacts }) => ({
			id: area,
			label: { es: label.es, en: label.en },
			link: `/areas/${area}/`,
			items: areaSidebar(artifacts),
		}));

	return [hub, ...areas];
}
