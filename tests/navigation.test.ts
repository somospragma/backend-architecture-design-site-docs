import { describe, expect, it } from 'vitest';
import { readdirSync } from 'node:fs';
import { buildTopics, draftArtifactSlugs } from '../src/navigation.mjs';

describe('buildTopics', () => {
	const topics = buildTopics({ includeDrafts: false });

	it('empieza por el tema del hub', () => {
		expect(topics[0]).toMatchObject({ id: 'hub', link: '/catalog/' });
	});

	it('crea un tema solo para los tipos con fichas, enlazado a su página', () => {
		for (const topic of topics.slice(1)) {
			expect(topic.link).toBe(`/types/${topic.id}/`);
			expect(topic.items.length).toBeGreaterThan(0);
		}
	});

	it('enlaza cada ficha publicada a su página del catálogo', () => {
		const links = JSON.stringify(topics);
		const drafts = new Set(draftArtifactSlugs());
		const published = readdirSync('src/content/artifacts')
			.map((file) => file.replace(/\.md$/, ''))
			.filter((slug) => !drafts.has(slug));
		for (const slug of published) expect(links).toContain(`/catalog/${slug}/`);
	});

	it('nombra en los dos idiomas los grupos de las docs hosted, en vez de usar el nombre de la carpeta', () => {
		const json = JSON.stringify(topics);
		expect(json).not.toMatch(/"label":"(guides|reference)"/);
		for (const match of json.matchAll(/"label":"(Guías|Referencia)"/g)) expect(match).toBeTruthy();
	});
});
