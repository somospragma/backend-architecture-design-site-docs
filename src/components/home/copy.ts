import type { Lang } from '../../i18n/catalog';

// Textos de la página inicial. Todo texto nuevo va en los dos idiomas.
export const home = {
	es: {
		title: 'Todo lo que construye Pragma',
		lead: 'Librerías, plugins, plantillas, herramientas y automatizaciones de Pragma y de sus pragmáticos. Cada uno con dueño, estado y documentación.',
		action: 'Ver el catálogo',
		builder: {
			title: 'Tu artefacto en el hub',
			name: 'Nombre',
			kind: 'Tipo',
			discipline: 'Disciplina',
			placeholder: 'Mi librería',
			copy: 'Copiar ficha',
			copied: 'Copiada',
			summary: 'Una frase de qué resuelve.',
		},
		types: {
			heading: 'Búscalo por cómo lo usas',
			empty: 'Aún sin artefactos. Puede ser el tuyo.',
			stack: 'En cualquier lenguaje',
			facts: {
				library: 'Lo agregas como dependencia: paquetes de Maven, npm, PyPI o NuGet, SDKs y módulos de Terraform.',
				plugin: 'Lo instalas dentro de otra herramienta: Gradle, Maven, tu IDE, ESLint o Backstage.',
				template: 'Lo copias o lo generas para empezar un proyecto: arquetipos, starters y scaffolds.',
				tool: 'Lo ejecutas: CLIs, apps de escritorio, servicios internos y bots.',
				automation: 'Corre en tu pipeline: GitHub Actions, workflows reutilizables y políticas.',
			},
		},
		steps: {
			heading: 'Cómo entra un artefacto',
			items: [
				'Primero abres un PR con su ficha.',
				'Luego el build valida el schema.',
				'Después los owners del hub lo aprueban.',
				'Y queda publicado en su tipo.',
			],
			checks: 'Schema válido',
			approved: 'Aprobado',
			published: 'Publicado',
		},
		features: {
			heading: 'Lo que trae cada ficha',
			owners: ['Dueños reales', 'Siempre hay alguien que responde.'],
			docs: ['Docs donde sirvan', 'En su repo, o completas en el hub.'],
			search: ['Búsqueda en todo', 'Desde cualquier página del sitio.'],
			status: ['Un estado claro', 'Experimental, beta, estable o en desuso.'],
			langs: ['Español e inglés', 'Cada ficha se lee en los dos idiomas.'],
		},
		cta: {
			heading: 'Súbelo al hub',
			body: 'Escribe el nombre y abre el PR con la ficha lista para completar. Si falta algo, el build te lo dice.',
			dialog: 'Propón un artefacto',
			field: 'Nombre del artefacto',
			official: 'Oficial',
			community: 'Comunidad',
			origin: 'Origen',
			button: 'Abrir el PR en GitHub',
		},
	},
	en: {
		title: 'Everything Pragma builds',
		lead: 'Libraries, plugins, templates, tools and automations from Pragma and its people. Each with an owner, a status and docs.',
		action: 'Browse the catalog',
		builder: {
			title: 'Your artifact on the hub',
			name: 'Name',
			kind: 'Type',
			discipline: 'Discipline',
			placeholder: 'My library',
			copy: 'Copy entry',
			copied: 'Copied',
			summary: 'One sentence on what it solves.',
		},
		types: {
			heading: 'Find it by how you use it',
			empty: 'No artifacts yet. Yours could be first.',
			stack: 'In any language',
			facts: {
				library: 'You add it as a dependency: Maven, npm, PyPI or NuGet packages, SDKs and Terraform modules.',
				plugin: 'You install it inside another tool: Gradle, Maven, your IDE, ESLint or Backstage.',
				template: 'You copy or generate it to start a project: archetypes, starters and scaffolds.',
				tool: 'You run it: CLIs, desktop apps, internal services and bots.',
				automation: 'It runs in your pipeline: GitHub Actions, reusable workflows and policies.',
			},
		},
		steps: {
			heading: 'How an artifact gets in',
			items: [
				'First you open a PR with its entry.',
				'Then the build checks the schema.',
				'Then the hub owners approve it.',
				'And it goes live under its type.',
			],
			checks: 'Schema valid',
			approved: 'Approved',
			published: 'Published',
		},
		features: {
			heading: 'What every entry carries',
			owners: ['Real owners', 'There is always someone accountable.'],
			docs: ['Docs where they fit', 'In its repo, or in full on the hub.'],
			search: ['Search everything', 'From any page on the site.'],
			status: ['A clear status', 'Experimental, beta, stable or deprecated.'],
			langs: ['Spanish and English', 'Every entry reads in both languages.'],
		},
		cta: {
			heading: 'Put it on the hub',
			body: 'Type the name and open the PR with the entry ready to fill in. If something is missing, the build tells you.',
			dialog: 'Propose an artifact',
			field: 'Artifact name',
			official: 'Official',
			community: 'Community',
			origin: 'Origin',
			button: 'Open the PR on GitHub',
		},
	},
} satisfies Record<Lang, unknown>;

/**
 * Ejemplo de barra lateral de cada tipo en la página inicial: grupos por disciplina.
 * Solo artefactos reales; los grupos vacíos muestran el texto de "aún sin artefactos".
 */
export const typeExamples: Record<string, { discipline: string; items: string[] }[]> = {
	library: [
		{ discipline: 'backend', items: ['Pragma Log'] },
		{ discipline: 'frontend', items: [] },
		{ discipline: 'mobile', items: [] },
	],
	plugin: [
		{ discipline: 'backend', items: ['Clean Architecture Generator'] },
		{ discipline: 'dx', items: [] },
	],
	template: [
		{ discipline: 'backend', items: [] },
		{ discipline: 'frontend', items: [] },
		{ discipline: 'mobile', items: [] },
	],
	tool: [
		{ discipline: 'dx', items: [] },
		{ discipline: 'devsecops', items: [] },
	],
	automation: [
		{ discipline: 'devsecops', items: [] },
		{ discipline: 'cloudops', items: [] },
		{ discipline: 'quality', items: [] },
	],
};

/** Lenguajes y tecnologías de muestra en cada tipo: son filtros, no pestañas. */
export const typeStacks: Record<string, string[]> = {
	library: ['Java', 'TypeScript', 'Python', 'C#', 'Ruby'],
	plugin: ['Gradle', 'Maven', 'ESLint', 'VS Code'],
	template: ['Spring Boot', 'NestJS', 'React', 'Flutter'],
	tool: ['Go', 'Rust', 'Node.js', 'Shell'],
	automation: ['GitHub Actions', 'Terraform', 'Azure DevOps'],
};

export const REPO_URL = 'https://github.com/somospragma/backend-architecture-design-site-docs';
