import type { Lang } from '../../i18n/catalog';

// Textos de la página inicial: una introducción a qué es el hub, qué hay en él y cómo recorrerlo.
// Todo texto va en los dos idiomas.
export const home = {
	es: {
		title: 'Lo que construye Pragma, en un solo lugar',
		lead: 'Librerías, plugins, plantillas, herramientas y automatizaciones hechas por los equipos de Pragma, con la documentación para usarlas en tu proyecto.',
		explore: 'Explorar el catálogo',
		contribute: 'Cómo aportar',
		previewLabel: 'Algunas fichas del catálogo',
		kinds: {
			heading: 'Qué vas a encontrar',
			lead: 'Cada artefacto tiene un tipo según cómo lo usas. Es la navegación de arriba.',
			examples: {
				library: 'Paquetes, SDKs, módulos de Terraform',
				plugin: 'Plugins de Gradle, Maven, IDE o ESLint',
				template: 'Arquetipos, starters y scaffolds',
				tool: 'CLIs, apps y servicios internos',
				automation: 'GitHub Actions y workflows reutilizables',
			},
			count: (n: number) => (n === 1 ? '1 artefacto' : `${n} artefactos`),
			soon: 'Pronto',
		},
		steps: {
			heading: 'Cómo usar el hub',
			items: [
				{
					title: 'Busca',
					text: 'En el catálogo filtras por tipo, disciplina, lenguaje y tecnología, o buscas por lo que necesitas resolver.',
				},
				{
					title: 'Revisa la ficha',
					text: 'Cada artefacto tiene una ficha con qué resuelve, su estado, cómo se instala, su licencia y quién lo mantiene.',
				},
				{
					title: 'Úsalo',
					text: 'Sigue la documentación: algunas viven aquí mismo, con guías y referencia; otras están en el repositorio del artefacto.',
				},
			],
		},
		join: {
			heading: '¿Tu equipo construyó algo que otros pueden usar?',
			text: 'Agrégalo al hub con su ficha o propónlo en un issue. Los owners del hub lo revisan y lo publican.',
			action: 'Ver cómo aportar',
		},
	},
	en: {
		title: 'What Pragma builds, in one place',
		lead: "Libraries, plugins, templates, tools and automations made by Pragma's teams, with the docs to use them in your project.",
		explore: 'Browse the catalog',
		contribute: 'How to contribute',
		previewLabel: 'Some catalog entries',
		kinds: {
			heading: "What you'll find",
			lead: 'Each artifact has a type based on how you use it. That is the navigation at the top.',
			examples: {
				library: 'Packages, SDKs, Terraform modules',
				plugin: 'Gradle, Maven, IDE or ESLint plugins',
				template: 'Archetypes, starters and scaffolds',
				tool: 'CLIs, apps and internal services',
				automation: 'GitHub Actions and reusable workflows',
			},
			count: (n: number) => (n === 1 ? '1 artifact' : `${n} artifacts`),
			soon: 'Soon',
		},
		steps: {
			heading: 'How to use the hub',
			items: [
				{
					title: 'Search',
					text: 'In the catalog you filter by type, discipline, language and technology, or search for what you need to solve.',
				},
				{
					title: 'Read the entry',
					text: 'Every artifact has an entry with what it solves, its status, how to install it, its license and who maintains it.',
				},
				{
					title: 'Use it',
					text: "Follow its docs: some live right here, with guides and reference; others are in the artifact's repository.",
				},
			],
		},
		join: {
			heading: 'Has your team built something others can use?',
			text: 'Add it to the hub with its entry or propose it in an issue. The hub owners review it and publish it.',
			action: 'See how to contribute',
		},
	},
} satisfies Record<Lang, unknown>;
