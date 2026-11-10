// Búsqueda del home: compara las palabras de la consulta con las fichas, sin acentos y por prefijo
// ("enmascarar" encuentra "enmascaramiento"). Corre en el navegador; las pruebas están en tests/find.test.ts.

const STOP = new Set([
	'para',
	'con',
	'sin',
	'los',
	'las',
	'del',
	'una',
	'uno',
	'que',
	'mis',
	'the',
	'for',
	'and',
	'with',
	'from',
	'your',
]);

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Palabras que cuentan para buscar: sin acentos, de 3 letras o más y sin conectores. */
export const words = (s: string) =>
	normalize(s)
		.split(/[^a-z0-9#.+]+/)
		.filter((w) => w.length >= 3 && !STOP.has(w));

/** Una palabra de la consulta coincide si comparte las primeras 6 letras, o si la palabra de la ficha es su prefijo. */
const matches = (q: string, w: string) => w.startsWith(q.slice(0, 6)) || (w.length >= 4 && q.startsWith(w));

/** Las fichas que más palabras de la consulta cubren, de mayor a menor, hasta `limit`. */
export function search<T extends { text: string }>(items: T[], query: string, limit = 3): T[] {
	const q = words(query);
	return items
		.map((item) => ({ item, words: words(item.text) }))
		.map(({ item, words: w }) => ({ item, score: q.filter((x) => w.some((y) => matches(x, y))).length }))
		.filter((r) => r.score > 0)
		.sort((a, b) => b.score - a.score)
		.map((r) => r.item)
		.slice(0, limit);
}
