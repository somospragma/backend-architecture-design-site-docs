// Verifica que cada par texto/fondo declarado en tokens.json cumpla su contraste mínimo
// (WCAG 2.x) en modo claro y oscuro. Sale con código 1 si alguno falla.
import { loadTokens, resolveVar } from './tokens-lib.mjs';

function luminance(hex) {
	const channels = hex
		.replace('#', '')
		.match(/.{2}/g)
		.map((c) => parseInt(c, 16) / 255)
		.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
	return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function contrast(a, b) {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

const tokens = loadTokens();
let failures = 0;

for (const mode of Object.keys(tokens.themes)) {
	console.log(`\nModo ${mode}`);
	for (const { fg, bg, min, use } of tokens.contrast.pairs) {
		const fgHex = resolveVar(tokens, mode, fg);
		const bgHex = resolveVar(tokens, mode, bg);
		const ratio = contrast(fgHex, bgHex);
		const ok = ratio >= min;
		if (!ok) failures++;
		console.log(
			`  ${ok ? 'OK  ' : 'FALLA'} ${ratio.toFixed(2).padStart(5)} (mín ${min})  ${fgHex} sobre ${bgHex}  ${use}`,
		);
	}
}

if (failures > 0) {
	console.error(`\n${failures} par(es) no cumplen el contraste mínimo.`);
	process.exit(1);
}
console.log('\nTodos los pares cumplen el contraste mínimo.');
