// Áreas y tipos de artefacto. Lo usan el schema de las fichas, la navegación (astro.config.mjs)
// y las páginas del catálogo. Es JavaScript plano para poder importarlo desde la configuración.
//
// Área: dónde busca el artefacto quien lo va a usar (no el lenguaje en que está escrito).
// 1. ¿Se importa o usa desde un lenguaje? → el área de ese lenguaje.
// 2. ¿Despliega o configura infraestructura? → cloud.
// 3. ¿Se corre en la máquina del desarrollador? → tools.
// Un área solo aparece en la navegación cuando tiene al menos una ficha publicada.

/** @type {Record<string, { es: string, en: string }>} */
export const AREAS = {
	java: { es: 'Java / JVM', en: 'Java / JVM' },
	node: { es: 'Node / TS', en: 'Node / TS' },
	python: { es: 'Python', en: 'Python' },
	dotnet: { es: '.NET', en: '.NET' },
	mobile: { es: 'Mobile', en: 'Mobile' },
	cloud: { es: 'Cloud', en: 'Cloud' },
	tools: { es: 'Herramientas', en: 'Tools' },
};

/** Tipos en el orden en que aparecen en la barra lateral de cada área. */
export const KINDS = {
	library: { es: 'Librería', en: 'Library', group: { es: 'Librerías', en: 'Libraries' } },
	plugin: { es: 'Plugin', en: 'Plugin', group: { es: 'Plugins', en: 'Plugins' } },
	sdk: { es: 'SDK', en: 'SDK', group: { es: 'SDKs', en: 'SDKs' } },
	template: { es: 'Plantilla', en: 'Template', group: { es: 'Plantillas', en: 'Templates' } },
	cli: { es: 'CLI', en: 'CLI', group: { es: 'CLIs', en: 'CLIs' } },
	tool: { es: 'Herramienta', en: 'Tool', group: { es: 'Herramientas', en: 'Tools' } },
	action: { es: 'Action', en: 'Action', group: { es: 'Actions', en: 'Actions' } },
	other: { es: 'Otro', en: 'Other', group: { es: 'Otros', en: 'Other' } },
};

export const AREA_IDS = /** @type {[string, ...string[]]} */ (Object.keys(AREAS));
export const KIND_IDS = /** @type {[string, ...string[]]} */ (Object.keys(KINDS));
