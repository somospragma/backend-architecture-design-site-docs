## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Proyecto

- Contexto, decisiones y plan del hub: `PRAGMA-DOCS-HUB-CONTEXT.md`.
- Los colores solo se cambian en `src/styles/tokens.json`. Después de cambiarlos, corre `pnpm check:contrast`.
- Toda página nueva va en español (`src/content/docs/`) y en inglés (`src/content/docs/en/`).
- El schema de las fichas está en `src/content/artifact-schema.ts`. Para validar una ficha, corre `pnpm build`; si no cumple el schema, falla.
