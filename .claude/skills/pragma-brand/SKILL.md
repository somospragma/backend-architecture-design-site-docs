---
name: pragma-brand
description: Marca de Pragma ("Keep moving") para sitios, docs y piezas visuales de ingeniería. Paleta oficial, tokens claro/oscuro con contraste WCAG verificado, tipografía Poppins, logo e isotipo con sus usos, y voz. Úsala cuando vayas a elegir colores, fuentes o logos de Pragma, revisar si algo respeta la marca, o escribir textos con la voz de Pragma. Es la fuente que usan las demás skills del hub.
---

# Marca de Pragma

## Fuente única

En el hub, la marca vive en `src/styles/tokens.json`. Si estás en el hub, **lee ese archivo**: sus valores ganan sobre los de esta skill. Fuera del hub, usa las tablas de abajo.

Nunca inventes un color, un tono intermedio ni una fuente. Si algo no está aquí, no es de la marca.

## Paleta

| Rol | Nombre | Hex |
|---|---|---|
| Principal | Pragma Purple | `#6429CD` |
| Principal | Deep Violet | `#531DBC` |
| Principal | Midnight | `#330072` |
| Principal | Lavender | `#E4A4FF` |
| Principal | Black | `#1D1D1B` |
| Secundario (gráficas, ilustración) | Electric | `#9610FF` |
| Secundario | Plum | `#7500A0` |
| Secundario | Orchid | `#DD52DD` |
| Secundario | Periwinkle | `#B6B6FF` |
| Secundario | Ice Blue | `#D7E2FF` |

Neutros del hub (fondos y grises de interfaz): `#F7F6FA`, `#EDEBF2`, `#C9C6D1`, `#8E8A99`, `#5C5966`, `#3A3840`, `#28272B`, `#1D1D1B`.

## Contraste

Todo texto necesita al menos **4.5:1** con su fondo; texto grande (24px, o 19px en negrita) y bordes, **3:1**.

| Color | Sobre `#FFFFFF` | Sobre `#1D1D1B` |
|---|---|---|
| `#6429CD` | 7.66 ✅ | 2.20 ❌ |
| `#531DBC` | 9.25 ✅ | 1.82 ❌ |
| `#330072` | 15.18 ✅ | 1.11 ❌ |
| `#7500A0` | 9.28 ✅ | 1.82 ❌ |
| `#9610FF` | 5.50 ✅ | 3.07 ⚠️ solo grande |
| `#DD52DD` | 3.32 ⚠️ solo grande | 5.09 ✅ |
| `#E4A4FF` | 1.90 ❌ | 8.89 ✅ |
| `#B6B6FF` | 1.89 ❌ | 8.94 ✅ |
| `#D7E2FF` | 1.30 ❌ | 13.03 ✅ |
| Blanco sobre `#6429CD` (botón) | 7.66 ✅ | — |

Reglas que salen de la tabla:

- Purple, Deep Violet, Midnight y Plum **nunca** son texto en modo oscuro.
- Lavender, Periwinkle e Ice Blue **nunca** son texto en modo claro.
- Orchid es decorativo, o texto grande en claro.
- Para un par que no está en la tabla, mide antes de usarlo. En el hub: `pnpm check:contrast`.

## Tokens por modo

| Uso | Claro | Oscuro |
|---|---|---|
| Fondo | `#FFFFFF` | `#1D1D1B` |
| Títulos | `#1D1D1B` | `#FFFFFF` |
| Texto del cuerpo | `#3A3840` | `#C9C6D1` |
| Texto secundario | `#5C5966` | `#8E8A99` |
| Enlaces y acento | `#6429CD` | `#E4A4FF` |
| Acento fuerte | `#330072` | `#E4A4FF` |
| Acento suave (fondos de avisos, selección) | `#D7E2FF` | `#330072` |
| Botón primario | fondo `#6429CD`, texto `#FFFFFF` | fondo `#E4A4FF`, texto `#330072` |

## Tipografía

Solo **Poppins**: Bold (700) para títulos, SemiBold (600) o Medium (500) para énfasis, Regular (400) para el cuerpo. En código, una monoespaciada del sistema.

## Logo e isotipo

- **Wordmark:** "pragma" con la "g" morada. En fondos oscuros, la versión blanca.
- **Isotipo:** "g" blanca en un círculo `#6429CD`. Sirve como favicon, avatar o motivo gráfico.
- **Espacio libre:** alrededor, igual a la altura de la "g".
- No cambies sus colores, no lo deformes, no lo rotes, no le pongas sombras ni degradados, no lo pongas sobre fotos con poco contraste.

Archivos en el hub (`src/assets/brand/`): `pragma-logo.svg` (fondo claro), `pragma-logo-white.svg` (fondo oscuro), `pragma-icon-dark.svg`, `pragma-icon-white.svg`. El favicon es `public/favicon.svg`.

Fuera del hub, toma los SVG de `https://github.com/somospragma/backend-architecture-design-site-docs/tree/main/src/assets/brand`. No los redibujes.

## Voz

- Tagline: **Keep moving**. No se traduce.
- Directa y concreta: qué hace, para quién, cómo se usa. Sin superlativos ("el mejor", "revolucionario").
- Segunda persona y voz activa. En español, tuteo.
- Los detalles de escritura técnica están en la guía de estilo del hub: `src/content/docs/guides/style.mdx`.

## Iconos

Iconos de línea simples, con el grosor de trazo uniforme y en un solo color de la paleta. En Starlight, usa los iconos que trae (`<Icon name="..."/>`). No mezcles familias de iconos.
