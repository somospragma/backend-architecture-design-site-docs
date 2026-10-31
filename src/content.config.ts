import { defineCollection } from 'astro:content';
import type { Loader } from 'astro/loaders';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { artifactSchema, assertHostedDocs, type Artifact } from './content/artifact-schema';

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

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	artifacts: defineCollection({ loader: artifactsLoader(), schema: artifactSchema }),
};
