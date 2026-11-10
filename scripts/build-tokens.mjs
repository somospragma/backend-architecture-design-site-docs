// Genera src/styles/tokens.css a partir de src/styles/tokens.json.
// El CSS generado no se edita a mano ni se versiona: se regenera en dev y en build.
import { writeFileSync } from 'node:fs';
import { loadTokens, resolveRef } from './tokens-lib.mjs';

const tokens = loadTokens();
const lines = ['/* Generado por scripts/build-tokens.mjs desde tokens.json. No editar. */', ''];

lines.push(':root {');
for (const [key, entry] of Object.entries(tokens.brand)) {
	lines.push(`\t--pragma-${key}: ${entry.value};`);
}
for (const [key, value] of Object.entries(tokens.neutral)) {
	lines.push(`\t--pragma-neutral-${key}: ${value};`);
}
lines.push(`\t--sl-font: ${tokens.font.family};`, '}', '');

const selectors = {
	dark: ':root',
	light: ":root[data-theme='light'],\n[data-theme='light'] ::backdrop",
};
for (const [mode, vars] of Object.entries(tokens.themes)) {
	lines.push(`${selectors[mode]} {`);
	for (const [name, ref] of Object.entries(vars)) {
		lines.push(`\t${name}: ${resolveRef(tokens, ref)};`);
	}
	lines.push('}', '');
}

const out = new URL('../src/styles/tokens.css', import.meta.url);
writeFileSync(out, lines.join('\n'));
console.log('tokens.css generado');
