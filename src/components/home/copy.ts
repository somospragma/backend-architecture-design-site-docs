import type { Lang } from '../../i18n/catalog';

// Textos de la página inicial. Todo texto nuevo va en los dos idiomas.
export const home = {
	es: {
		title: 'Todo lo que construye Pragma',
		lead: 'Librerías, plugins, CLIs y plantillas de Pragma y de sus pragmáticos. Cada uno con dueño, estado y documentación.',
		action: 'Ver el catálogo',
		builder: {
			title: 'Tu artefacto en el hub',
			name: 'Nombre',
			area: 'Área',
			kind: 'Tipo',
			placeholder: 'Mi librería',
			copy: 'Copiar ficha',
			copied: 'Copiada',
			summary: 'Una frase de qué resuelve.',
		},
		areas: {
			heading: 'Búscalo por área',
			empty: 'Aún sin artefactos. Puede ser el tuyo.',
			facts: {
				java: 'Lo que importas desde Java, Kotlin, Spring, Quarkus o Gradle.',
				node: 'Librerías, SDKs y plantillas para Node y TypeScript.',
				python: 'Librerías y herramientas que se instalan con pip.',
				dotnet: 'Paquetes NuGet y plantillas para .NET.',
				mobile: 'Flutter y desarrollo nativo para iOS y Android.',
				cloud: 'Lo que despliega o configura infraestructura: Terraform, CDK, Kubernetes, Actions.',
				tools: 'Lo que corres en tu máquina: CLIs, terminal, extensiones y skills de IA.',
			},
		},
		steps: {
			heading: 'Cómo entra un artefacto',
			items: [
				'Primero abres un PR con su ficha.',
				'Luego el build valida el schema.',
				'Después los owners del hub lo aprueban.',
				'Y queda publicado en su área.',
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
		lead: 'Libraries, plugins, CLIs and templates from Pragma and its people. Each with an owner, a status and docs.',
		action: 'Browse the catalog',
		builder: {
			title: 'Your artifact on the hub',
			name: 'Name',
			area: 'Area',
			kind: 'Kind',
			placeholder: 'My library',
			copy: 'Copy entry',
			copied: 'Copied',
			summary: 'One sentence on what it solves.',
		},
		areas: {
			heading: 'Find it by area',
			empty: 'No artifacts yet. Yours could be first.',
			facts: {
				java: 'What you import from Java, Kotlin, Spring, Quarkus or Gradle.',
				node: 'Libraries, SDKs and templates for Node and TypeScript.',
				python: 'Libraries and tools you install with pip.',
				dotnet: 'NuGet packages and templates for .NET.',
				mobile: 'Flutter and native development for iOS and Android.',
				cloud: 'What deploys or configures infrastructure: Terraform, CDK, Kubernetes, Actions.',
				tools: 'What runs on your machine: CLIs, terminal, extensions and AI skills.',
			},
		},
		steps: {
			heading: 'How an artifact gets in',
			items: [
				'First you open a PR with its entry.',
				'Then the build checks the schema.',
				'Then the hub owners approve it.',
				'And it goes live in its area.',
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

/** Ejemplos de la barra lateral de cada área en la página inicial. Solo artefactos reales. */
export const areaExamples: Record<string, { group: { es: string; en: string }; items: string[] }[]> = {
	java: [
		{ group: { es: 'Librerías', en: 'Libraries' }, items: ['Pragma Log'] },
		{ group: { es: 'Plugins', en: 'Plugins' }, items: ['Clean Architecture Generator'] },
	],
};

export const REPO_URL = 'https://github.com/somospragma/backend-architecture-design-site-docs';
