# Cómo aportar al Pragma Hub

El hub reúne las librerías, plugins, plantillas y herramientas que construye Pragma y su comunidad. Cada artefacto entra con una **ficha**: un archivo Markdown con frontmatter validado por un schema. Si la ficha no cumple el schema, el build falla y el PR no se puede fusionar.

La versión para lectores está en el sitio, en [Agregar un artefacto](https://somospragma.github.io/backend-architecture-design-site-docs/contribute/). Este archivo es la referencia completa.

## Antes de empezar

- Node 22 o superior y pnpm 10 (`corepack enable`).
- `pnpm install` y luego `pnpm dev` para ver el sitio en `http://localhost:4321/backend-architecture-design-site-docs/`.
- Las fichas con `draft: true` solo se ven con `pnpm dev`.

## Criterios de entrada

Un artefacto entra al hub si cumple todo esto:

1. **El repositorio es accesible** para quien lo va a usar. Los repos privados de Pragma valen para fichas oficiales.
2. **El README explica la instalación y trae al menos un ejemplo.** Usa [`templates/README.template.md`](templates/README.template.md).
3. **Tiene licencia.**
   - Comunidad: una licencia open source aprobada por OSI, con su identificador SPDX (`MIT`, `Apache-2.0`…).
   - Oficial: un identificador SPDX, o `UNLICENSED` si es interno.
4. **Tiene owners reales**: usuarios de GitHub o un equipo (`org/team`) que responden por él.
5. **No tiene secretos ni datos de clientes.** Algo creado para un cliente solo entra si Pragma tiene derecho a publicarlo.

## Proponer un artefacto

1. Deja el README del artefacto como pide la plantilla.
2. Copia [`templates/artifact.template.md`](templates/artifact.template.md) a `src/content/artifacts/<slug>.md`. El nombre del archivo es el slug y la URL de la ficha: minúsculas y guiones, sin el prefijo de la organización.
3. Clasifícalo:
   - **Tipo (`kind`), cómo se usa.** Es la navegación de arriba. Responde en orden y quédate con el primer sí:
     1. ¿Se agrega como dependencia? `library` (paquetes, SDKs, módulos de Terraform, charts).
     2. ¿Se instala dentro de otra herramienta? `plugin` (Gradle, Maven, IDE, ESLint, Backstage).
     3. ¿Se copia o se genera para empezar un proyecto? `template` (arquetipos, starters, scaffolds).
     4. ¿Se ejecuta? `tool` (CLIs, apps de escritorio, servicios internos, bots).
     5. ¿Corre en el pipeline de CI/CD? `automation` (GitHub Actions, workflows reutilizables, políticas).
   - **Disciplinas (`disciplines`), para qué trabajo sirve.** Al menos una de `backend`, `frontend`, `mobile`, `data`, `ai`, `quality`, `integration`, `cloudops`, `devsecops`, `dx`. La primera es la principal y decide el grupo en la barra lateral.
   - **Lenguajes (`languages`)**, al menos uno, y **tecnologías (`technologies`)**, opcional: frameworks, plataformas y herramientas de build. Son filtros del catálogo.
4. Elige el modo de documentación:
   - `indexed`: la documentación vive en el repo del artefacto y `docs.url` apunta a ella.
   - `hosted`: la documentación vive en el hub, en `src/content/docs/artifacts/<slug>/`. Copia la estructura de [`templates/docs-hosted/`](templates/docs-hosted/).
5. Corre `pnpm build`. Si falla, el mensaje dice qué campo corregir.
6. Abre el PR y completa el checklist.

Si falta un lenguaje o una tecnología (por ejemplo `ruby` o `rails`), agrégalo en `src/content/taxonomy.mjs` dentro del mismo PR; la navegación no cambia. Un registro nuevo va en `REGISTRIES` de `src/content/artifact-schema.ts`. Los tipos y las disciplinas son la estructura del hub: para cambiarlos, abre primero un issue.

¿No tienes la ficha lista? Abre un issue con la plantilla **Proponer artefacto** y alguien te ayuda.

## Estados

| Estado | Qué significa |
|---|---|
| `experimental` | Se puede probar, pero puede cambiar sin aviso. |
| `beta` | La API está casi cerrada y se aceptan reportes de errores. |
| `stable` | Listo para producción, con versionado semántico. |
| `deprecated` | No se recomienda. La ficha dice qué usar en su lugar (`replacedBy`) o por qué (`deprecationNote`). |

Los owners del artefacto proponen el estado. Quienes aprueban fichas (ver [`.github/CODEOWNERS`](.github/CODEOWNERS)) lo confirman en el PR.

## De comunidad a oficial

1. Un equipo de Pragma acepta mantenerlo.
2. El repositorio se transfiere a una organización de Pragma, o se acuerda dónde va a vivir.
3. Un PR cambia `origin: community` por `origin: official` y actualiza `owners` y `repository`.

## Mantener una ficha

- Actualiza `lastReviewed` cada vez que revises que la ficha sigue siendo cierta. `pnpm check:reviews` avisa de las fichas con más de 12 meses sin revisar.
- Cuando el artefacto saque versión, revisa `status`, `registry` y, si es `hosted`, el changelog.
- Si ves una ficha desactualizada y no es tuya, abre un issue con la plantilla **Reportar ficha desactualizada**.

## Retirar un artefacto

1. Márcalo como `deprecated` con `replacedBy` o `deprecationNote`.
2. Después de al menos tres meses, sus owners pueden pedir en un PR que se quite la ficha.

## Cambios al sitio

- **Colores:** se cambian solo en `src/styles/tokens.json`. Corre `pnpm check:contrast` antes de abrir el PR.
- **Páginas:** toda página va en español (`src/content/docs/`) y en inglés (`src/content/docs/en/`), con el mismo nombre de archivo.
- **Escritura:** sigue la [guía de estilo](https://somospragma.github.io/backend-architecture-design-site-docs/guides/style/).

## Conducta y seguridad

Al participar aceptas el [código de conducta](CODE_OF_CONDUCT.md). Las vulnerabilidades se reportan como dice [SECURITY.md](SECURITY.md), nunca en un issue público.
