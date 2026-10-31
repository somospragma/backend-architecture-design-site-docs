# Pragma Hub

Sitio que reúne las librerías, plugins, plantillas y herramientas que construye Pragma y su comunidad. Está hecho con [Astro Starlight](https://starlight.astro.build/), en español (`/`) e inglés (`/en/`).

**Sitio:** https://somospragma.github.io/backend-architecture-design-site-docs/

## Desarrollo

Requiere Node 22 o superior y pnpm 10.

```bash
pnpm install
pnpm dev              # servidor local en http://localhost:4321/backend-architecture-design-site-docs/
pnpm build            # genera el sitio en dist/
pnpm check:contrast   # verifica el contraste de los colores de la marca
```

## Estructura

```
src/
├── content/docs/        # páginas en español (raíz) y en/ para inglés
├── styles/
│   ├── tokens.json      # única fuente de la marca: colores, neutros, fuente y pares de contraste
│   └── theme.css        # ajustes de Starlight que no son colores
└── assets/brand/        # logos de Pragma
scripts/
├── build-tokens.mjs     # genera src/styles/tokens.css desde tokens.json
└── check-contrast.mjs   # falla si un par texto/fondo baja de su mínimo
```

## Marca

Los colores no se escriben en el CSS. Se agregan o cambian en `src/styles/tokens.json` y se verifican con `pnpm check:contrast`. Las reglas están en la guía de marca del sitio (`/guides/brand/`).

## Historia

Hasta octubre de 2026 este repo era un sitio Docusaurus con la documentación del Clean Architecture Generator y de Pragma Log. Ese estado quedó en el tag `docusaurus-final` y en la rama `legacy/docusaurus`. Las dos documentaciones se van a migrar al hub como artefactos `hosted`.

## Licencia

Apache License 2.0. Ver [LICENSE](LICENSE) y [NOTICE](NOTICE).
