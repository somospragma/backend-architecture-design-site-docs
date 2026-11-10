import { getVisibleArtifacts } from './artifacts';

/** Una página por tipo con al menos una ficha visible. */
export async function getTypePaths() {
	const entries = await getVisibleArtifacts();
	const kinds = [...new Set(entries.map((e) => e.data.kind))];
	return kinds.map((kind) => ({
		params: { kind },
		props: { kind, entries: entries.filter((e) => e.data.kind === kind) },
	}));
}
