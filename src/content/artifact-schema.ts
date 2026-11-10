import { existsSync } from 'node:fs';
import { z } from 'astro/zod';
import spdx from 'spdx-license-list';
import { DISCIPLINE_IDS, KIND_IDS, LANGUAGE_IDS, TECHNOLOGY_IDS } from './taxonomy.mjs';

// Modelo de ficha de un artefacto del hub. Cada ficha es src/content/artifacts/<slug>.md
// y el nombre del archivo es su slug. Si una ficha no cumple este schema, el build falla.
//
// Tipos, disciplinas, lenguajes y tecnologías viven en taxonomy.mjs porque también los usa la navegación.
// Para agregar un lenguaje, una tecnología o un registro, edita su lista en el mismo PR de la ficha.

export const KINDS = KIND_IDS;
export const DISCIPLINES = DISCIPLINE_IDS;
export const LANGUAGES = LANGUAGE_IDS;
export const TECHNOLOGIES = TECHNOLOGY_IDS;
export const ORIGINS = ['official', 'community'] as const;
export const STATUSES = ['experimental', 'beta', 'stable', 'deprecated'] as const;
export const REGISTRIES = [
	'maven-central',
	'gradle-plugin-portal',
	'npm',
	'pypi',
	'nuget',
	'pub-dev',
	'rubygems',
	'crates-io',
	'artifact-hub',
	'vscode-marketplace',
	'github-packages',
	'docker-hub',
	'terraform-registry',
	'github-marketplace',
] as const;
export const DOCS_MODES = ['indexed', 'hosted'] as const;

/** Las fichas oficiales pueden usar UNLICENSED para artefactos internos sin licencia pública. */
const INTERNAL_LICENSE = 'UNLICENSED';

// Usuario de GitHub (dev-user) o equipo de una organización (somospragma/backend-team).
const OWNER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})(?:\/[A-Za-z0-9._-]+)?$/;

const localized = (max: number) =>
	z.object({
		es: z.string().trim().min(1).max(max),
		en: z.string().trim().min(1).max(max),
	});

export const artifactSchema = z
	.object({
		name: z.string().trim().min(1).max(60),
		summary: localized(160),
		description: localized(600).optional(),
		// Lo mínimo para empezar a usarlo: la dependencia, el plugin o el comando. Se muestra en la ficha y en el home.
		install: z.string().trim().min(1).max(400).optional(),
		kind: z.enum(KINDS),
		// La primera disciplina es la principal: decide el grupo en la barra lateral del tipo.
		disciplines: z.array(z.enum(DISCIPLINES)).min(1, 'Indica al menos una disciplina'),
		languages: z.array(z.enum(LANGUAGES)).min(1, 'Indica al menos un lenguaje'),
		technologies: z.array(z.enum(TECHNOLOGIES)).default([]),
		origin: z.enum(ORIGINS),
		owners: z
			.array(z.string().regex(OWNER, 'Usa un usuario de GitHub (dev-user) o un equipo (org/team)'))
			.min(1, 'Toda ficha necesita al menos un owner que responda por el artefacto'),
		repository: z.url({ protocol: /^https$/ }),
		registry: z
			.object({
				type: z.enum(REGISTRIES),
				id: z.string().trim().min(1),
				url: z.url({ protocol: /^https$/ }).optional(),
			})
			.optional(),
		status: z.enum(STATUSES),
		replacedBy: z.string().trim().min(1).optional(),
		deprecationNote: localized(300).optional(),
		license: z.string().trim().min(1),
		docs: z.object({
			mode: z.enum(DOCS_MODES),
			url: z.url({ protocol: /^https$/ }).optional(),
		}),
		tags: z.array(z.string().trim().toLowerCase()).default([]),
		lastReviewed: z.coerce.date(),
		draft: z.boolean().default(false),
	})
	.superRefine((data, ctx) => {
		const license = spdx[data.license];
		if (data.origin === 'community') {
			if (!license?.osiApproved) {
				ctx.addIssue({
					code: 'custom',
					path: ['license'],
					message: `Las fichas de comunidad necesitan una licencia open source aprobada por OSI con su identificador SPDX (por ejemplo MIT o Apache-2.0). "${data.license}" no lo es.`,
				});
			}
		} else if (!license && data.license !== INTERNAL_LICENSE) {
			ctx.addIssue({
				code: 'custom',
				path: ['license'],
				message: `"${data.license}" no es un identificador SPDX. Usa uno como Apache-2.0, o ${INTERNAL_LICENSE} si el artefacto es interno.`,
			});
		}

		if (data.status === 'deprecated' && !data.replacedBy && !data.deprecationNote) {
			ctx.addIssue({
				code: 'custom',
				path: ['status'],
				message: 'Un artefacto deprecated necesita replacedBy o deprecationNote.',
			});
		}

		if (data.docs.mode === 'indexed' && !data.docs.url) {
			ctx.addIssue({
				code: 'custom',
				path: ['docs', 'url'],
				message: 'En modo indexed, docs.url debe apuntar al README o a la documentación externa.',
			});
		}
	});

export type Artifact = z.infer<typeof artifactSchema>;

/** Carpeta donde viven las docs de un artefacto hosted, relativa a la raíz del repo. */
export const hostedDocsDir = (slug: string) => `src/content/docs/artifacts/${slug}`;

/**
 * El schema no conoce el nombre del archivo, así que la regla de hosted se valida
 * al cargar la colección (ver content.config.ts).
 */
export function assertHostedDocs(slug: string, data: Artifact) {
	if (data.docs.mode === 'hosted' && !existsSync(hostedDocsDir(slug))) {
		throw new Error(
			`La ficha "${slug}" usa docs.mode: hosted, pero no existe ${hostedDocsDir(slug)}/. Crea esa carpeta con la estructura de templates/docs-hosted/ o cambia a indexed.`,
		);
	}
}
