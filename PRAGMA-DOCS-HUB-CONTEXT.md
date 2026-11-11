# Contexto: esqueleto del hub de documentación de Pragma

Este documento sirve para arrancar en otra sesión el repo del sitio de documentación de Pragma.

**Objetivo de esa sesión: dejar el esqueleto bien hecho, sin cargar contenido.** Al terminar, cualquier persona de Pragma debe poder:
- saber cómo documentar su proyecto;
- agregarlo al hub siguiendo reglas claras;
- usar la marca de Pragma correctamente.

No se carga ningún artefacto todavía.

## Qué es el hub

Un sitio en **Astro Starlight** que reúne todo lo que construye Pragma:

- **Oficial:** librerías, plugins, plantillas y herramientas en cuentas de Pragma (por ejemplo, la organización `somospragma` en GitHub).
- **Comunidad:** artefactos open source que crean pragmáticos en sus cuentas personales y que sirven a otros.

Cada artefacto decide cuánto vive en el hub:

| Modo | Qué publica el hub | Ejemplo |
|---|---|---|
| `indexed` | Solo una ficha: qué es, quién lo mantiene, estado y enlaces | una librería con buen README en su repo |
| `hosted` | La ficha y la documentación completa de uso | un plugin con guías, referencia y ejemplos |

Algunos tipos de artefacto que van a entrar después:
- un plugin de Gradle con plantillas (el archetype generator);
- librerías de Java y de Node;
- CLIs de comunidad, como una para manejar sesiones de AWS con IAM Identity Center.

Sirven solo para validar que el modelo cubra casos distintos. **No se cargan en esta sesión.**

## Entregables del esqueleto

### 1. Sitio Starlight con la marca aplicada
- Proyecto Astro + Starlight.
- Tema de Pragma: Poppins, tokens de color en modo claro y oscuro, logo y favicon (ver "Marca").
- Páginas base, que llevan contenido de reglas y no de artefactos:
  - `/`: qué es el hub y cómo usarlo;
  - `/catalog/`: el catálogo, vacío con su estado "aún no hay artefactos";
  - `/contribute/`: cómo agregar un artefacto;
  - `/guides/documenting/`: cómo documentar un proyecto;
  - `/guides/brand/`: cómo usar la marca;
  - `/community/`: qué significa "comunidad" y cómo se pasa a oficial.
- Una ficha de ejemplo marcada como `draft: true`, para probar el schema y el render. No se publica.

### 2. Modelo de ficha (content collection)
Cada artefacto es un archivo en `src/content/artifacts/<slug>.md(x)`, validado con un schema de Zod. Si una ficha no cumple el schema, el build falla.

```yaml
name: Nombre visible
slug: nombre-en-kebab
summary: Una frase de qué resuelve.
kind: library            # library | plugin | template | tool | automation
disciplines: [backend]   # backend | frontend | mobile | data | ai | quality | integration | cloudops | devsecops | dx
languages: [java]        # java | kotlin | typescript | python | ruby | ...
technologies: [spring-webflux, gradle]  # opcional: frameworks, plataformas, build
origin: official         # official | community
owners: [github-user]    # quién responde por el artefacto
repository: https://github.com/org/repo
registry:                # opcional
  type: maven-central    # maven-central | npm | gradle-plugin-portal | pypi | ...
  id: group:artifact
status: experimental     # experimental | beta | stable | deprecated
license: Apache-2.0
docs:
  mode: indexed          # indexed | hosted
  url: https://...       # README o docs externas (indexed) / ruta dentro del hub (hosted)
tags: []
lastReviewed: 2026-10-31
draft: false
```

Reglas del schema:
- `origin: community` exige `owners` y una licencia open source (SPDX).
- `status: deprecated` exige `replacedBy` o `deprecationNote`.
- `docs.mode: hosted` exige que exista `src/content/docs/artifacts/<slug>/`.
- `lastReviewed` con más de 12 meses → aviso en CI (no falla) para que el owner la revise.

**Implementado (fase 3).** El schema vive en `src/content/artifact-schema.ts`. Estos son los cambios frente a la propuesta de arriba:
- No hay campo `slug`: el nombre del archivo es el slug. Así no pueden quedar distintos.
- `summary` es `{ es, en }` y los dos idiomas son obligatorios. Se agregó `description: { es, en }`, que es opcional. Las fichas no tienen cuerpo en Markdown.
- `owners` es obligatorio en todas las fichas, no solo en las de comunidad, porque es un criterio de entrada. Acepta un usuario de GitHub (`dev-user`) o un equipo (`org/team`).
- `license` debe ser un identificador SPDX válido. En las fichas de comunidad, además, debe estar aprobado por OSI. Las fichas oficiales pueden usar `UNLICENSED` para artefactos internos.
- `docs.url` es obligatorio en `indexed`. En `hosted` no se usa, porque la ruta sale del slug.
- `deprecationNote` es `{ es, en }`. `replacedBy` acepta el slug de otra ficha o una URL `https`.
- `kind`, `disciplines`, `languages`, `technologies` y `registry.type` son listas cerradas (las cuatro primeras en `src/content/taxonomy.mjs`). Para agregar un valor se edita la lista en el schema dentro del mismo PR de la ficha.
- Las fichas con `draft: true` solo se ven con `pnpm dev`; el build de producción las excluye.
- El aviso por `lastReviewed` vencido lo da `pnpm check:reviews`. En GitHub Actions emite anotaciones `::warning`.

### 3. Reglas de aporte
- `CONTRIBUTING.md`:
  - cómo proponer un artefacto (PR con una ficha);
  - criterios de entrada;
  - qué significa cada estado y quién lo decide;
  - cómo se pasa de comunidad a oficial;
  - cómo se retira un artefacto.
- Criterios de entrada:
  - repo accesible;
  - README con instalación y un ejemplo;
  - licencia;
  - owners reales;
  - sin secretos ni datos de clientes. Algo creado para un cliente solo entra si Pragma tiene derecho a publicarlo.
- `CODE_OF_CONDUCT.md` y `SECURITY.md` (cómo reportar una vulnerabilidad de un artefacto o del sitio).
- `.github/CODEOWNERS`: quién aprueba fichas, docs `hosted` y cambios de marca o tema.
- `.github/pull_request_template.md` con checklist: cumple criterios, schema válido, contraste verificado si toca colores.
- Plantillas de issues: "proponer artefacto", "reportar ficha desactualizada" y "error en el sitio".

### 4. Plantillas para que cada proyecto sepa documentar
Viven en el hub (por ejemplo, en `templates/`) y se enlazan desde `/guides/documenting/`:
- `README.template.md`: estructura mínima del README de cualquier artefacto (qué es, instalación, uso rápido, configuración, contribución, licencia, owners).
- `artifact.template.md`: la ficha vacía con comentarios.
- `docs-hosted/`: estructura de carpetas para un artefacto `hosted` (introducción, inicio rápido, guías, referencia, FAQ y changelog).
- Guía de estilo de escritura técnica: tono, idioma, cómo nombrar versiones, cómo poner ejemplos de código, qué no publicar (secretos, URLs internas, datos de clientes).

### 5. Skills del repo
Skills para que cualquier persona, con su asistente, haga las cosas igual. Van en `.claude/skills/` del repo del hub; las que sirven fuera del hub se pueden copiar a cada proyecto.

| Skill | Para qué |
|---|---|
| `pragma-brand` | Marca de Pragma: paleta, tokens claro/oscuro con contraste verificado, tipografía, logo e isotipo con sus usos, iconografía y voz. Es la fuente única que usan las demás |
| `pragma-docs-theme` | Aplicar o cambiar el tema de Starlight sin romper el contraste: dónde están los tokens, qué variable de Starlight mapea a cuál y cómo verificar AA |
| `document-project` | Documentar un proyecto de Pragma: README con la plantilla y estructura de docs `hosted`. Pensada para usarse dentro de cada repo de artefacto |
| `add-artifact` | Crear la ficha de un artefacto en el hub, validar el schema y armar el PR con su checklist |
| `release-docs` | Qué actualizar en la ficha y en las docs cuando un artefacto saca versión |

### 6. CI/CD
- GitHub Actions con `permissions` mínimos por job y acciones fijadas por SHA.
- En cada PR:
  - build del sitio (incluye la validación del schema);
  - enlaces rotos;
  - gitleaks;
  - chequeo de contraste de los tokens de color (script que falla si un par texto/fondo baja de 4.5:1).
- Deploy solo desde `main`, con un environment protegido que exige aprobación manual. El workflow puede quedar listo pero deshabilitado hasta decidir el hosting.

## Marca (prioritaria)

La marca no se escribe dentro del CSS del sitio. Vive en **un solo archivo de tokens** (por ejemplo `src/styles/tokens.css`, o `tokens.json` del que se genera el CSS). Ese archivo lo usan el tema de Starlight, la skill `pragma-brand` y el chequeo de contraste del CI.

### Paleta oficial
- **Principales:** Pragma Purple `#6429CD`, Deep Violet `#531DBC`, Midnight `#330072`, Lavender `#E4A4FF`, Black `#1D1D1B`.
- **Secundarios** (gráficas e ilustración): `#9610FF`, `#7500A0`, `#DD52DD`, `#B6B6FF`, `#D7E2FF`.
- **Tipografía:** Poppins exclusivamente. Bold para títulos, SemiBold o Medium para énfasis, Regular para cuerpo.
- **Logo:** wordmark "pragma" con la "g" morada. Isotipo: "g" blanca en círculo `#6429CD`. Se respeta un espacio libre alrededor igual a la altura de la "g".
- **Tagline:** "Keep moving".

### Contraste medido (WCAG 2.x)

| Color | Sobre blanco `#FFFFFF` | Sobre negro `#1D1D1B` |
|---|---|---|
| `#1D1D1B` texto | 16.88 ✅ | — |
| `#6429CD` Pragma Purple | 7.66 ✅ | 2.20 ❌ |
| `#531DBC` Deep Violet | 9.25 ✅ | 1.82 ❌ |
| `#330072` Midnight | 15.18 ✅ | 1.11 ❌ |
| `#7500A0` | 9.28 ✅ | 1.82 ❌ |
| `#9610FF` | 5.50 ✅ | 3.07 ⚠️ solo texto grande |
| `#DD52DD` | 3.32 ⚠️ solo texto grande | 5.09 ✅ |
| `#E4A4FF` Lavender | 1.90 ❌ | 8.89 ✅ |
| `#B6B6FF` | 1.89 ❌ | 8.94 ✅ |
| `#D7E2FF` Ice Blue | 1.30 ❌ | 13.03 ✅ |
| Blanco sobre `#6429CD` (botón) | 7.66 ✅ | — |

### Tokens propuestos (provisionales, pendientes de aprobación)

| Uso | Modo claro | Modo oscuro |
|---|---|---|
| Fondo | `#FFFFFF` | `#1D1D1B` o un tono cercano a Midnight (verificar) |
| Texto | `#1D1D1B` | `#FFFFFF` / `#D7E2FF` |
| Acento, enlaces | `#6429CD` | `#E4A4FF` |
| Acento fuerte (hover, títulos destacados) | `#330072` | `#B6B6FF` |
| Acento suave (fondos de callouts, selección) | `#D7E2FF` | `#330072` |
| Botón primario | fondo `#6429CD`, texto blanco | fondo `#6429CD`, texto blanco |

Reglas:
- `#6429CD`, `#531DBC`, `#330072` y `#7500A0` **nunca** como texto en modo oscuro.
- Lavender, `#B6B6FF` e Ice Blue **nunca** como texto en modo claro.
- `#DD52DD` solo decorativo o en texto grande en claro.

En Starlight se mapean a `--sl-color-accent-low`, `--sl-color-accent`, `--sl-color-accent-high`, `--sl-color-white`, `--sl-color-gray-1…7` y `--sl-color-black`, con valores distintos para `:root[data-theme='light']` y `:root[data-theme='dark']`. Las fuentes se ponen con `--sl-font`.

En la otra sesión conviene usar:
- `anthropic-skills:pragma-theme`, como fuente de la marca;
- `ui-ux-pro-max`, para la paleta y la accesibilidad.

## Decisiones tomadas (2026-10-31)

1. **Repo:** se transforma este repo (`somospragma/backend-architecture-design-site-docs`) en el hub y se queda con ese nombre. El sitio sigue en `https://somospragma.github.io/backend-architecture-design-site-docs/`. Docusaurus se reemplaza por Starlight.
2. **Contenido actual:** Clean Architecture Generator y Pragma Log salen del sitio por ahora. Antes se preservan en el tag `docusaurus-final` y en la rama `legacy/docusaurus`. Después se migran como los primeros artefactos `hosted`. El sitio Docusaurus publicado se puede apagar sin aviso ni redirección.
3. **Idioma:** español e inglés desde el inicio, con Starlight i18n. Español es el idioma raíz (`/`) e inglés va en `/en/`. Los textos de las fichas que se muestran al lector, como `summary`, van en los dos idiomas.
4. **Hosting:** GitHub Pages, que es el que ya se usa. El deploy sale solo desde `main` y pasa por un environment protegido con aprobación manual.
5. **Modo claro/oscuro:** se usa el selector de tema que trae Starlight. No se construye uno propio; solo se define la paleta de cada modo con los tokens.
6. **Logos:** los SVG de Pragma que están en `static/img/` se pueden usar en el sitio.

7. **Navegación por áreas** (2026-11-02, reemplazada por la decisión 12). La barra superior tiene un tema "Hub" y un tema por cada área con al menos una ficha publicada. Las áreas son `java`, `node`, `python`, `dotnet`, `mobile`, `cloud` y `tools`, y están en `src/content/taxonomy.mjs`. Cada ficha tiene un `area` obligatorio: el lugar donde la busca quien la va a usar, no el lenguaje en que está escrita. `ecosystems` queda para filtrar. Dentro de cada área, la barra lateral se agrupa por tipo y en orden alfabético. Se implementa con `starlight-sidebar-topics` y con un `SiteTitle` propio que pone las áreas arriba en pantallas anchas; en celular quedan en el menú lateral.
8. **Página inicial**. Se hace con componentes Astro, sin React, y conserva la barra superior y el buscador de Starlight. El motivo visual es el círculo del isotipo de Pragma. Es un enganche para quien va a usar artefactos: el título "No empieces desde cero" con la salida real del Clean Architecture Generator dentro, un buscador que responde con fichas reales, "Esto ya está hecho" con la salida de tres comandos reales, los tipos con su número de fichas y, al final, la invitación a aportar. Lo de aportar vive en /contribute/.

9. **Paleta** (2026-11-02). Se aprueban los valores claro y oscuro de `src/styles/tokens.json`.
10. **Reglas de aporte** (2026-11-03). Aprueba todo el equipo `@somospragma/backend-architecture`; CODEOWNERS separa fichas, docs `hosted` y marca para poder repartirlas después. Las vulnerabilidades se reportan por el reporte privado de GitHub (Security Advisories), sin correo. Los problemas de conducta se reportan por mensaje privado a alguien del equipo. Las docs `hosted` de una ficha en borrador solo se generan con `pnpm dev`.

11. **Skills** (2026-11-03). Las cinco skills están en `.claude/skills/`. `pragma-brand` es la fuente de marca para fuera del hub; dentro del hub gana `tokens.json`. `document-project` es autocontenida para poder copiarla a cualquier repo de artefacto.

12. **Navegación por tipo** (2026-11-03). El lenguaje no escala como navegación: el día que entra Ruby habría que crear una pestaña, y algo muy específico de Spring WebFlux quedaba al mismo nivel que un artefacto grande de Node. La barra superior tiene "Hub" y un tema por cada **tipo** con al menos una ficha publicada: `library` (se agrega como dependencia), `plugin` (se instala dentro de otra herramienta), `template` (se copia o genera para empezar), `tool` (se ejecuta) y `automation` (corre en el pipeline). Dentro de cada tipo, la barra lateral se agrupa por la **disciplina principal** (la primera de `disciplines`): backend, frontend, mobile, data, ai, quality, integration, cloudops, devsecops y dx. `languages` (obligatorio) y `technologies` (opcional) son filtros del catálogo; agregar uno no cambia la navegación. Se quitan `area` y `ecosystems`. Las páginas de cada tipo están en `/types/<kind>/`.

13. **CI/CD** (2026-11-03). `ci.yml` y `security.yml` corren en cada PR y son reutilizables. `deploy.yml` tiene tres etapas: validar (los dos anteriores), aprobar (environment `production` con revisores obligatorios) y desplegar (environment `github-pages`). El deploy queda apagado hasta crear la variable de repositorio `DEPLOY_ENABLED=true`. Gitleaks se instala desde su release con checksum porque la action oficial pide licencia en organizaciones.

14. **Pipeline por etapas, como el de Azure** (2026-11-09). `ci.yml` se parte en **Calidad**, con jobs paralelos (ESLint y Prettier, `astro check`, vitest, knip, y marca y fichas), y **Build**, que espera a todos, construye el sitio sin caché y revisa los enlaces. El sitio se construye una sola vez: `deploy.yml` llama a `ci.yml` con `publish: true` y publica ese mismo artefacto. Seguridad corre en paralelo con CI, no después, y la aprobación espera a los dos. La preparación del entorno está en la action compuesta `.github/actions/setup`. TypeScript queda en 6.x porque `@astrojs/check` y typescript-eslint todavía no soportan la 7. Prettier solo revisa código; Markdown, MDX y YAML quedan fuera para no reformatear la prosa. La lógica del buscador del home vive en `src/lib/find.ts` para poder probarla.

15. **EMVCode, primera documentación `hosted`** (2026-11-10). La rama legacy `feature/emvcode-package` traía 11 páginas de Docusaurus para la librería EMVCo QR. Se migraron a `src/content/docs/artifacts/emvcode/` (y `en/`) con la estructura de `templates/docs-hosted/`, verificadas contra el paquete publicado `@pragmasa/emvcode` 1.1.1: la rama decía `emvcode` 0.1.0, un paquete que no existe en npm. Todos los ejemplos se ejecutaron contra el paquete y la salida que muestran es real. Los diagramas Mermaid se reemplazaron por texto porque Starlight no los dibuja sin un plugin. La configuración de Docusaurus de esa rama no se migró. Quedan documentados tres problemas de la librería con su forma de evitarlos (subtag `62.11`, tags `92` y `94` a `98`, enum `TypeCondition` sin exportar), además del import en ESM nativo y el margen del PNG.
16. **SonarCloud desde CI, con cobertura** (2026-11-11). El proyecto `somospragma_backend-architecture-design-site-docs` (organización `somospragma-sa`) usaba Automatic Analysis, que no puede leer la cobertura. Ahora lo analiza el job `Calidad · SonarCloud` de `ci.yml`: corre `pnpm test:coverage` (vitest con v8, reporte `lcov`) y el scanner oficial con `SONAR_TOKEN`. La configuración está en `sonar-project.properties`. No corre en el deploy ni en PRs desde forks, y el build no depende de él, así que una caída de SonarCloud no frena un despliegue. Requiere el secret `SONAR_TOKEN` y Automatic Analysis desactivado en SonarCloud.

## Decisiones pendientes

1. Crear el equipo del hub en la organización: `somospragma/backend-architecture` no existe. Cuando exista, ponerlo en `CODEOWNERS`, en `owners` de las fichas y como revisor del environment `production`.
2. Configuración del repo para el deploy (hecha el 2026-11-10). Un solo environment de aprobación, `production`: su único revisor es `dayepesb-pragma`, sin bypass de administradores y solo desde `main`. "Prevent self-review" está apagado porque, con un solo revisor, si no podría aprobar sus propios despliegues; encenderlo cuando haya más revisores. `github-pages` solo acepta `main`, Pages está en modo "GitHub Actions" y existe la variable `DEPLOY_ENABLED=true`. El ruleset de `main` exige PR, bloquea force push y borrado, y exige los checks `Build · Sitio y enlaces` (que solo corre si pasa toda la etapa de Calidad), `Secretos (gitleaks)`, `Vulnerabilidades de dependencias` y `Seguridad de los workflows (zizmor)`. Pide 0 aprobaciones de PR mientras haya un solo responsable. Están activos el reporte privado de vulnerabilidades y las actualizaciones de seguridad de Dependabot. No hay environment de desarrollo. Pendiente: crear el equipo que reemplace a `@somospragma/backend-architecture` (no existe en la organización) en `CODEOWNERS` y en `owners` de las fichas; mientras tanto, `CODEOWNERS` usa `@dayepesb-pragma`.
3. Contenido legacy: `feature/emvcode-package` se migró (decisión 15). El arquetipo Node hexagonal de `feature/backend-diseno-arquitectura-fnc-ts-archetype-node-hexagonal` no se documenta en el hub (decisión del 2026-11-10); sus PRs #7 y #8 se cerraron.
4. Más adelante: cómo traer las docs `hosted` que viven en otros repos (copiarlas, traerlas en el build o que cada repo las publique con una Action) y si habrá versionado de docs por artefacto.

## Fuera de alcance de esta sesión

- Cargar artefactos reales.
- Migrar la documentación del archetype generator. Hoy vive en un sitio Docusaurus aparte; se migra cuando el plugin esté publicado y funcionando.
- Automatizar la sincronización de docs entre repos.
