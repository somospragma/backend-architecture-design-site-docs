import { describe, expect, it } from 'vitest';
import { search, words } from '../src/lib/find';

const items = [
	{ name: 'Pragma Log', text: 'Pragma Log logs JSON enmascaramiento masking Quarkus spring-boot' },
	{
		name: 'Clean Architecture Generator',
		text: 'Clean Architecture Generator hexagonal onion adaptadores adapters Redis Gradle',
	},
];
const names = (query: string) => search(items, query).map((i) => i.name);

describe('words', () => {
	it('quita acentos, conectores y palabras cortas', () => {
		expect(words('Logs en Quarkus para la arquitectura hexagonal')).toEqual([
			'logs',
			'quarkus',
			'arquitectura',
			'hexagonal',
		]);
	});
});

describe('search', () => {
	it('encuentra por prefijo: "enmascarar" encuentra "enmascaramiento"', () => {
		expect(names('enmascarar logs')).toEqual(['Pragma Log']);
	});

	it('ignora mayúsculas y acentos', () => {
		expect(names('HEXÁGONAL')).toEqual(['Clean Architecture Generator']);
	});

	it('ordena por cuántas palabras de la consulta cubre cada ficha', () => {
		expect(names('adaptador de Redis para logs')).toEqual(['Clean Architecture Generator', 'Pragma Log']);
	});

	it('no devuelve nada si ninguna palabra coincide', () => {
		expect(names('kubernetes operator')).toEqual([]);
		expect(names('de la')).toEqual([]);
	});

	it('respeta el límite', () => {
		expect(search(items, 'pragma clean', 1)).toHaveLength(1);
	});
});
