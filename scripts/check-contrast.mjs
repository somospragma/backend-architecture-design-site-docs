// Verifica que cada par texto/fondo declarado en tokens.json cumpla su contraste mínimo
// (WCAG 2.x) en modo claro y oscuro. Sale con código 1 si alguno falla.
import { contrast, loadTokens, resolveVar } from './tokens-lib.mjs';

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
