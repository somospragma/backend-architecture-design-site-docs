# Pragma Hub

Sitio que reúne las librerías, plugins, plantillas y herramientas que construye Pragma y su comunidad. Está hecho con [Astro Starlight](https://starlight.astro.build/), en español (`/`) e inglés (`/en/`).

**Sitio:** https://somospragma.github.io/backend-architecture-design-site-docs/

## Desarrollo

Requiere Node 22 o superior y pnpm 10.

```bash
pnpm install
pnpm dev              # servidor local en http://localhost:4321/backend-architecture-design-site-docs/
pnpm build            # genera el sitio en dist/ (valida el schema de las fichas)
pnpm check            # lo mismo que la etapa de calidad del CI: lint, formato, tipos, pruebas, código muerto y marca
pnpm format           # aplica el formato de Prettier
```

Cada chequeo también corre por separado: `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test`, `pnpm knip`, `pnpm check:contrast` y `pnpm check:reviews`.

## Estructura

```
src/
├── content/
│   ├── artifacts/       # una ficha por artefacto: <slug>.md
│   ├── artifact-schema.ts  # schema de las fichas (el build falla si no se cumple)
│   ├── taxonomy.mjs     # tipos, disciplinas, lenguajes y tecnologías
│   └── docs/            # páginas en español (raíz) y en/ para inglés
├── styles/
│   ├── tokens.json      # única fuente de la marca: colores, neutros, fuente y pares de contraste
│   └── theme.css        # ajustes de Starlight que no son colores
└── assets/brand/        # logos de Pragma
scripts/
├── build-tokens.mjs     # genera src/styles/tokens.css desde tokens.json
└── check-contrast.mjs   # falla si un par texto/fondo baja de su mínimo
```

## Aportar

Cada artefacto entra con una ficha en un PR. Lee [CONTRIBUTING.md](CONTRIBUTING.md); las plantillas están en [templates/](templates/).

## Skills

En [.claude/skills/](.claude/skills/) hay skills para que cualquier asistente haga las cosas igual:

| Skill | Para qué |
|---|---|
| `pragma-brand` | Paleta, contraste, tipografía, logo y voz de Pragma. |
| `pragma-docs-theme` | Cambiar el tema de Starlight sin romper el contraste. |
| `add-artifact` | Crear una ficha, validarla y armar el PR. |
| `document-project` | Documentar un artefacto en su propio repo. Se puede copiar a cualquier proyecto. |
| `release-docs` | Qué actualizar cuando un artefacto saca versión. |

## CI y despliegue

| Workflow | Cuándo | Qué hace |
|---|---|---|
| `ci.yml` | Cada PR y `main` | **Calidad**, en jobs paralelos: ESLint y Prettier, tipos (`astro check`), pruebas (vitest), código muerto (knip), contraste de la marca, fichas sin revisar y SonarCloud con la cobertura de vitest. Si todo pasa, **Build**: construye el sitio (valida el schema de las fichas) y revisa los enlaces internos. |
| `security.yml` | Cada PR, `main` y los lunes | Secretos con gitleaks en toda la historia, CodeQL para TypeScript y para los workflows, zizmor, `pnpm audit` y revisión de dependencias nuevas en el PR. |
| `deploy.yml` | `main` | Corre CI y seguridad en paralelo, **espera aprobación** en el environment `production` y publica en GitHub Pages el mismo build que validó el CI. Está apagado hasta que exista la variable `DEPLOY_ENABLED=true`. |

La preparación del entorno (pnpm, Node y dependencias) está en `.github/actions/setup`. Las acciones están fijadas por SHA y Dependabot las mantiene al día. Los falsos positivos de gitleaks van en `.gitleaksignore` con su huella exacta.

## Marca

Los colores no se escriben en el CSS. Se agregan o cambian en `src/styles/tokens.json` y se verifican con `pnpm check:contrast`. Las reglas están en la guía de marca del sitio (`/guides/brand/`).

## Historia

Hasta octubre de 2026 este repo era un sitio Docusaurus con la documentación del Clean Architecture Generator y de Pragma Log. Ese estado quedó en el tag `docusaurus-final` y en la rama `legacy/docusaurus`. Las dos documentaciones se van a migrar al hub como artefactos `hosted`.

## Licencia

Apache License 2.0. Ver [LICENSE](LICENSE) y [NOTICE](NOTICE).
