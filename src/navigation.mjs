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

const HOSTED_DOCS_DIR = new URL('./content/docs/artifacts/', import.meta.url);

// Nombres de las carpetas de templates/docs-hosted/ en la barra lateral. Starlight usaría el nombre de la carpeta.
const HOSTED_GROUPS = {
	guides: { es: 'Guías', en: 'Guides' },
	reference: { es: 'Referencia', en: 'Reference' },
};

/**
 * Páginas de unas docs hosted: las de la raíz en el orden de `sidebar.order`, con las carpetas
 * como grupos entre medio. Las páginas con orden 90 o más (FAQ, changelog) van al final.
 */
function hostedItems(slug) {
	const dir = new URL(`${slug}/`, HOSTED_DOCS_DIR);
	if (!existsSync(dir)) return [];
	const entries = readdirSync(dir, { withFileTypes: true });
	const pages = entries
		.filter((e) => e.isFile() && /\.mdx?$/.test(e.name))
		.map((e) => {
			const frontmatter = readFileSync(new URL(e.name, dir), 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1];
			const name = e.name.replace(/\.mdx?$/, '');
			return {
				order: parse(frontmatter ?? '')?.sidebar?.order ?? 50,
				slug: name === 'index' ? `artifacts/${slug}` : `artifacts/${slug}/${name}`,
			};
		})
		.sort((a, b) => a.order - b.order);
	const groups = entries
		.filter((e) => e.isDirectory())
		.sort((a, b) => Object.keys(HOSTED_GROUPS).indexOf(a.name) - Object.keys(HOSTED_GROUPS).indexOf(b.name))
		.map((e) => ({
			label: HOSTED_GROUPS[e.name]?.es ?? e.name,
			...(HOSTED_GROUPS[e.name] && { translations: { en: HOSTED_GROUPS[e.name].en } }),
			items: [{ autogenerate: { directory: `artifacts/${slug}/${e.name}` } }],
		}));
	const page = ({ slug }) => ({ slug });
	return [...pages.filter((p) => p.order < 90).map(page), ...groups, ...pages.filter((p) => p.order >= 90).map(page)];
}

function artifactItem(artifact) {
	if (artifact.docs?.mode === 'hosted') {
		return {
			label: artifact.name,
			collapsed: true,
			items: [
				{ link: `/catalog/${artifact.slug}/`, label: 'Ficha', translations: { en: 'Overview' } },
				...hostedItems(artifact.slug),
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
