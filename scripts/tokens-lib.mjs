import { readFileSync } from 'node:fs';

const TOKENS_PATH = new URL('../src/styles/tokens.json', import.meta.url);

// Alias semánticos que Starlight define a partir de las variables base. Se replican aquí
// para poder medir el contraste de lo que realmente se pinta en cada modo.
const STARLIGHT_ALIASES = {
	dark: {
		'text-accent': '--sl-color-accent-high',
		'text-invert': '--sl-color-accent-low',
		'bg-nav': '--sl-color-gray-6',
		'bg-accent': '--sl-color-accent-high',
		'bg-inline-code': '--sl-color-gray-5',
	},
	light: {
		'text-accent': '--sl-color-accent',
		'text-invert': '--sl-color-black',
		'bg-nav': '--sl-color-gray-7',
		'bg-accent': '--sl-color-accent',
		'bg-inline-code': '--sl-color-gray-6',
	},
};

export function loadTokens() {
	return JSON.parse(readFileSync(TOKENS_PATH, 'utf8'));
}

/** Convierte una referencia como "brand.purple" o "neutral.700" en su valor hexadecimal. */
export function resolveRef(tokens, ref) {
	if (ref.startsWith('#')) return ref;
	const [group, key] = ref.split('.');
	const entry = tokens[group]?.[key];
	const value = typeof entry === 'string' ? entry : entry?.value;
	if (!value) throw new Error(`Referencia de token desconocida: "${ref}"`);
	return value;
}

/** Devuelve el hex de una variable de Starlight o de un alias semántico en un modo dado. */
export function resolveVar(tokens, mode, name) {
	const theme = tokens.themes[mode];
	const target = STARLIGHT_ALIASES[mode][name] ?? name;
	const ref = theme[target];
	if (!ref) throw new Error(`"${name}" no está definida en el modo ${mode}`);
	return resolveRef(tokens, ref);
}

function luminance(hex) {
	const channels = hex
		.replace('#', '')
		.match(/.{2}/g)
		.map((c) => Number.parseInt(c, 16) / 255)
		.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
	return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/** Razón de contraste WCAG 2.x entre dos colores hexadecimales (de 1 a 21). */
export function contrast(a, b) {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}
