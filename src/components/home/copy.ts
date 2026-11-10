import type { Lang } from '../../i18n/catalog';

// Textos de la página inicial. El home engancha a usar lo que ya existe;
// lo de aportar vive en /contribute/ y aquí solo se invita al final. Todo texto va en los dos idiomas.
export const home = {
	es: {
		// El título se parte alrededor de la ventana del terminal: antes y después de ella.
		title: ['No empieces', 'desde', 'cero.'],
		lead: ['Librerías, plugins y herramientas de Pragma,', 'listas para usar en tu proyecto.'],
		action: 'Ver el catálogo',
		find: {
			heading: '¿Qué vas a construir?',
			label: 'Describe lo que necesitas',
			value: 'enmascarar logs',
			examples: ['arquitectura hexagonal', 'adaptador de Redis', 'logs en Quarkus'],
			examplesLabel: 'Prueba con',
			open: 'Ver la ficha',
			empty: 'Todavía no hay nada para eso en el hub.',
			catalog: 'Ver el catálogo completo',
		},
		proof: {
			heading: 'Esto ya está hecho.',
			open: 'Ver la ficha',
			init: 'Un microservicio hexagonal con sus capas y sus pruebas de arquitectura, en un comando.',
			adapter: 'Un adaptador de Redis con su mapper y su entidad, sin escribirlos a mano.',
			log: 'Logs en JSON con la tarjeta y la contraseña enmascaradas, sin cambiar cómo logueas.',
		},
		types: {
			heading: 'Todo, ordenado por cómo lo usas.',
			label: 'Tipos',
			soon: 'Pronto',
		},
		join: {
			heading: ['¿Tu equipo ya', 'lo construyó?'],
			add: 'Agrégalo al hub',
			or: 'o',
			propose: 'Propónlo en un issue',
			after: 'Los owners del hub lo revisan y lo publican en su tipo.',
		},
	},
	en: {
		title: ["Don't start", 'from', 'scratch.'],
		lead: ['Libraries, plugins and tools from Pragma,', 'ready to use in your project.'],
		action: 'Browse the catalog',
		find: {
			heading: 'What are you building?',
			label: 'Describe what you need',
			value: 'mask logs',
			examples: ['hexagonal architecture', 'Redis adapter', 'logs on Quarkus'],
			examplesLabel: 'Try',
			open: 'Open the entry',
			empty: 'Nothing on the hub does that yet.',
			catalog: 'Browse the whole catalog',
		},
		proof: {
			heading: 'This already exists.',
			open: 'Open the entry',
			init: 'A hexagonal microservice with its layers and architecture tests, in one command.',
			adapter: 'A Redis adapter with its mapper and entity, without writing them by hand.',
			log: 'JSON logs with the card and the password masked, without changing how you log.',
		},
		types: {
			heading: 'Everything, sorted by how you use it.',
			label: 'Types',
			soon: 'Soon',
		},
		join: {
			heading: ['Has your team', 'already built it?'],
			add: 'Add it to the hub',
			or: 'or',
			propose: 'Propose it in an issue',
			after: 'The hub owners review it and publish it under its type.',
		},
	},
} satisfies Record<Lang, unknown>;

export const REPO_URL = 'https://github.com/somospragma/backend-architecture-design-site-docs';

/** Salida real de `initCleanArch` del Clean Architecture Generator (arquitectura hexagonal-single). */
export const generatorRun = [
	'$ ./gradlew initCleanArch',
	'  architecture hexagonal-single',
	'  framework    spring reactive',
	'  create domain/model',
	'  create domain/ports',
	'  create domain/usecases',
	'  create infrastructure/entry-points',
	'  create infrastructure/driven-adapters',
	'  create infrastructure/config',
	'  create ArchitectureTest.java',
	'  create DomainPurityTest.java',
	'  create gradle/libs.versions.toml',
	'BUILD SUCCESSFUL',
];

/** Salida de `generateOutputAdapter` (guía de inicio rápido del generador). */
export const adapterRun = [
	'$ ./gradlew generateOutputAdapter \\',
	'    --name=UserRepository \\',
	'    --entity=User --type=redis',
	'',
	'  create UserRepositoryAdapter.java',
	'  create UserMapper.java',
	'  create UserData.java',
	'',
	'BUILD SUCCESSFUL',
];

/** Ejemplo del README de Pragma Log: un objeto logueado y lo que sale. */
export const logRun = [
	'log.info("Customer registered: {}", customer);',
	'',
	'{',
	'  "level": "INFO",',
	'  "app": "orders",',
	'  "message": "Customer registered:',
	String.raw`    {\"name\":\"Ana\",`,
	String.raw`     \"cardNumber\":\"4111********1111\",`,
	String.raw`     \"password\":\"******\"}",`,
	'  "requestId": "req-7"',
	'}',
];
