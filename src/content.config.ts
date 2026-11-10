import { defineCollection } from 'astro:content';
import type { Loader } from 'astro/loaders';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { artifactSchema, assertHostedDocs, type Artifact } from './content/artifact-schema';
import { draftArtifactSlugs } from './navigation.mjs';

const isDev = process.argv.includes('dev');

// Carga las fichas con el nombre del archivo como slug y, después de validar el schema,
// verifica las reglas que dependen del slug (como la carpeta de docs hosted).
function artifactsLoader(): Loader {
	const base = glob({
		pattern: '*.md',
		base: './src/content/artifacts',
		generateId: ({ entry }) => entry.replace(/\.md$/, ''),
	});
	return {
		name: 'pragma-artifacts',
		async load(context) {
			await base.load(context);
			for (const entry of context.store.values()) {
				assertHostedDocs(entry.id, entry.data as Artifact);
			}
		},
	};
}

// Las docs hosted de una ficha en borrador solo existen en dev, igual que la ficha:
// en producción no tienen tema en la navegación y no se deben publicar.
function hubDocsLoader(): Loader {
	const base = docsLoader();
	return {
		...base,
		async load(context) {
			await base.load(context);
			if (isDev) return;
			const prefixes = draftArtifactSlugs().flatMap((slug) => [`artifacts/${slug}`, `en/artifacts/${slug}`]);
			for (const id of [...context.store.keys()]) {
				if (prefixes.some((prefix) => id === prefix || id.startsWith(`${prefix}/`))) context.store.delete(id);
			}
		},
	};
}

export const collections = {
	docs: defineCollection({ loader: hubDocsLoader(), schema: docsSchema() }),
	artifacts: defineCollection({ loader: artifactsLoader(), schema: artifactSchema }),
};
