// Avisa qué fichas llevan más de 12 meses sin revisarse (lastReviewed).
// No falla: en GitHub Actions emite anotaciones ::warning para que el owner la revise.
import { readdirSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';

const DIR = new URL('../src/content/artifacts/', import.meta.url);
const MAX_AGE_MONTHS = 12;
const inCI = process.env.GITHUB_ACTIONS === 'true';

const limit = new Date();
limit.setUTCMonth(limit.getUTCMonth() - MAX_AGE_MONTHS);

let stale = 0;
for (const file of readdirSync(DIR).filter((f) => f.endsWith('.md'))) {
	const source = readFileSync(new URL(file, DIR), 'utf8');
	const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1];
	if (!frontmatter) continue;
	const { lastReviewed, owners = [] } = parse(frontmatter);
	const reviewed = new Date(lastReviewed);
	if (Number.isNaN(reviewed.getTime()) || reviewed >= limit) continue;

	stale++;
	const date = reviewed.toISOString().slice(0, 10);
	const message = `La ficha no se revisa desde ${date} (más de ${MAX_AGE_MONTHS} meses). Owners: ${owners.join(', ')}. Revisa que siga vigente y actualiza lastReviewed.`;
	console.log(inCI ? `::warning file=src/content/artifacts/${file}::${message}` : `AVISO ${file}: ${message}`);
}

console.log(stale === 0 ? 'Todas las fichas están revisadas.' : `${stale} ficha(s) por revisar.`);
