// Taxonomía del hub. La usan el schema de las fichas, la navegación (astro.config.mjs)
// y las páginas del catálogo. Es JavaScript plano para poder importarlo desde la configuración.
//
// Tipo: cómo se usa el artefacto. Es la navegación de arriba y no depende del lenguaje.
//   ¿Se agrega como dependencia?                 → library
//   ¿Se instala dentro de otra herramienta?       → plugin
//   ¿Se copia o genera para empezar un proyecto?  → template
//   ¿Se ejecuta?                                  → tool
//   ¿Corre en el pipeline de CI/CD?               → automation
// Un tipo solo aparece en la navegación cuando tiene al menos una ficha publicada.
//
// Disciplina: para qué trabajo sirve. Agrupa la barra lateral de cada tipo (la primera de la lista).
// Lenguajes y tecnologías: etiquetas para filtrar. Agregar uno (por ejemplo ruby) es agregarlo aquí,
// en el mismo PR de la ficha; la navegación no cambia.

/** @type {Record<string, { es: string, en: string, group: { es: string, en: string }, how: { es: string, en: string } }>} */
export const KINDS = {
	library: {
		es: 'Librería',
		en: 'Library',
		group: { es: 'Librerías', en: 'Libraries' },
		how: { es: 'Se agrega como dependencia', en: 'Added as a dependency' },
	},
	plugin: {
		es: 'Plugin',
		en: 'Plugin',
		group: { es: 'Plugins', en: 'Plugins' },
		how: { es: 'Se instala dentro de otra herramienta', en: 'Installed inside another tool' },
	},
	template: {
		es: 'Plantilla',
		en: 'Template',
		group: { es: 'Plantillas', en: 'Templates' },
		how: { es: 'Se copia o genera para empezar un proyecto', en: 'Copied or generated to start a project' },
	},
	tool: {
		es: 'Herramienta',
		en: 'Tool',
		group: { es: 'Herramientas', en: 'Tools' },
		how: { es: 'Se ejecuta', en: 'Runs on its own' },
	},
	automation: {
		es: 'Automatización',
		en: 'Automation',
		group: { es: 'Automatización', en: 'Automation' },
		how: { es: 'Corre en el pipeline', en: 'Runs in the pipeline' },
	},
};

/** En el orden en que agrupan la barra lateral. @type {Record<string, { es: string, en: string }>} */
export const DISCIPLINES = {
	backend: { es: 'Backend', en: 'Backend' },
	frontend: { es: 'Frontend', en: 'Frontend' },
	mobile: { es: 'Mobile', en: 'Mobile' },
	data: { es: 'Datos', en: 'Data' },
	ai: { es: 'IA', en: 'AI' },
	quality: { es: 'Calidad y pruebas', en: 'Quality and testing' },
	integration: { es: 'Integración', en: 'Integration' },
	cloudops: { es: 'Cloud y operaciones', en: 'Cloud and operations' },
	devsecops: { es: 'DevSecOps', en: 'DevSecOps' },
	dx: { es: 'Developer experience', en: 'Developer experience' },
};

/** @type {Record<string, string>} */
export const LANGUAGES = {
	java: 'Java',
	kotlin: 'Kotlin',
	groovy: 'Groovy',
	scala: 'Scala',
	javascript: 'JavaScript',
	typescript: 'TypeScript',
	python: 'Python',
	csharp: 'C#',
	go: 'Go',
	rust: 'Rust',
	dart: 'Dart',
	swift: 'Swift',
	ruby: 'Ruby',
	php: 'PHP',
	hcl: 'HCL',
	shell: 'Shell',
	yaml: 'YAML',
	sql: 'SQL',
};

/** Frameworks, plataformas y herramientas de build. @type {Record<string, string>} */
export const TECHNOLOGIES = {
	'spring-boot': 'Spring Boot',
	'spring-webflux': 'Spring WebFlux',
	quarkus: 'Quarkus',
	micronaut: 'Micronaut',
	gradle: 'Gradle',
	maven: 'Maven',
	node: 'Node.js',
	nestjs: 'NestJS',
	express: 'Express',
	react: 'React',
	angular: 'Angular',
	vue: 'Vue',
	astro: 'Astro',
	flutter: 'Flutter',
	'react-native': 'React Native',
	android: 'Android',
	ios: 'iOS',
	dotnet: '.NET',
	fastapi: 'FastAPI',
	django: 'Django',
	rails: 'Ruby on Rails',
	aws: 'AWS',
	azure: 'Azure',
	gcp: 'Google Cloud',
	terraform: 'Terraform',
	kubernetes: 'Kubernetes',
	docker: 'Docker',
	'github-actions': 'GitHub Actions',
	'azure-devops': 'Azure DevOps',
	kafka: 'Kafka',
	rabbitmq: 'RabbitMQ',
	postgresql: 'PostgreSQL',
	mongodb: 'MongoDB',
	opentelemetry: 'OpenTelemetry',
};

/** @param {object} o */
const ids = (o) => /** @type {[string, ...string[]]} */ (Object.keys(o));
export const KIND_IDS = ids(KINDS);
export const DISCIPLINE_IDS = ids(DISCIPLINES);
export const LANGUAGE_IDS = ids(LANGUAGES);
export const TECHNOLOGY_IDS = ids(TECHNOLOGIES);
