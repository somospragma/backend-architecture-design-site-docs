---
name: pragma-docs-theme
description: Cambiar o extender el tema de Starlight del Pragma Hub sin romper el contraste. Dónde están los tokens, cómo se generan las variables --sl-color-*, qué alias usa Starlight en cada modo, cómo agregar un par al chequeo WCAG y qué componentes se sobrescriben. Úsala antes de tocar colores, tipografía, CSS del tema, el logo del header o la página inicial del hub.
---

# Tema de Starlight del hub

La marca está en la skill `pragma-brand`. Esta skill dice cómo se aplica en el sitio.

## Mapa de archivos

| Archivo | Qué hace | ¿Se edita? |
|---|---|---|
| `src/styles/tokens.json` | Fuente única: paleta (`brand`, `neutral`), fuente, variables de cada modo (`themes.dark`, `themes.light`) y pares de contraste (`contrast.pairs`). | Sí, aquí cambian los colores. |
| `scripts/build-tokens.mjs` | Genera `src/styles/tokens.css` con `pnpm tokens`. `pnpm dev` y `pnpm build` lo corren solos. | Solo si cambia la estructura. |
| `src/styles/tokens.css` | Generado y en `.gitignore`. | **Nunca.** |
| `scripts/tokens-lib.mjs` | Lee los tokens y replica los alias que Starlight calcula en cada modo. | Si Starlight cambia sus alias. |
| `scripts/check-contrast.mjs` | `pnpm check:contrast`: mide cada par en los dos modos y falla si alguno baja de su mínimo. | No. |
| `src/styles/theme.css` | Ajustes de Starlight que no son color: pesos de títulos, tamaño del logo, tipos en el header. Usa solo `var(--sl-*)` o `var(--pragma-*)`. | Sí, sin colores literales. |
| `src/styles/home.css` | Estilos de la página inicial, con prefijo `.ph-`. | Sí, sin colores literales. |
| `src/components/SiteTitle.astro` | Override: logo más los tipos de artefacto en el header en pantallas anchas. | Con cuidado. |
| `src/components/Hero.astro` | Override: el hero de la página inicial (título con la ventana del terminal y el círculo como horizonte). | Con cuidado. |

## Cómo mapea a Starlight

En `themes.<modo>` se definen las variables base de Starlight: `--sl-color-white`, `--sl-color-gray-1` a `--sl-color-gray-6`, `--sl-color-black`, `--sl-color-accent-low`, `--sl-color-accent` y `--sl-color-accent-high`. El valor es una referencia como `brand.purple` o `neutral.700`.

El modo oscuro va en `:root` y el claro en `:root[data-theme='light']`. **En claro la escala está invertida**: `white` es el texto más oscuro y `black` es el fondo.

Starlight calcula alias a partir de esas variables, y son los que de verdad se pintan:

| Alias | Oscuro | Claro |
|---|---|---|
| `--sl-color-text-accent` (enlaces) | `accent-high` | `accent` |
| `--sl-color-text-invert` (texto en botones) | `accent-low` | `black` |
| `--sl-color-bg-nav` | `gray-6` | `gray-7` |
| `--sl-color-bg-accent` (botones) | `accent-high` | `accent` |
| `--sl-color-bg-inline-code` | `gray-5` | `gray-6` |

Por eso un cambio en `accent` puede romper los botones del modo oscuro sin tocarlos. El chequeo mide los alias.

## Cambiar un color

1. Edita el valor en `brand` o `neutral`, o cambia la referencia en `themes.<modo>`.
2. `pnpm check:contrast`. Si falla, el mensaje dice qué par y en qué modo.
3. `pnpm dev` y revisa en claro y oscuro: la página inicial, el catálogo, una ficha, una página con avisos (`<Aside>`) y un bloque de código.

## Agregar un color o un par nuevo

- Un color de la marca va en `brand` con `value`, `name` y `role`. Sale como `--pragma-<clave>` en `tokens.css`.
- Si un texto nuevo se pinta sobre un fondo nuevo, agrega el par en `contrast.pairs` con `fg`, `bg`, `min` (4.5 texto, 3 texto grande o bordes) y `use`.

## Reglas

- Cero colores literales (`#hex`, `rgb()`) en CSS o componentes. Siempre `var(--sl-*)` o `var(--pragma-*)`.
- Usa el selector de tema de Starlight. No construyas uno propio.
- No cambies `--sl-content-width` en la página inicial: rompe la grilla del header. Para ancho completo, usa `.sl-container { max-width: none }`.
- Toda animación va dentro de `@media (prefers-reduced-motion: no-preference)`.
- Si tocas la página inicial, revisa a 1440, 768 y 390 px de ancho.
