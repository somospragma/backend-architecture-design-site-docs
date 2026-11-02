import { getVisibleArtifacts } from './artifacts';

/** Una página por área con al menos una ficha visible. */
export async function getAreaPaths() {
	const entries = await getVisibleArtifacts();
	const areas = [...new Set(entries.map((e) => e.data.area))];
	return areas.map((area) => ({
		params: { area },
		props: { area, entries: entries.filter((e) => e.data.area === area) },
	}));
}
