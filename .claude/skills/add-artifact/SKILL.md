---
name: add-artifact
description: Agregar un artefacto al catálogo del Pragma Hub. Crea la ficha en src/content/artifacts/<slug>.md desde la plantilla, la clasifica por tipo (cómo se usa), disciplina, lenguajes y tecnologías con las reglas del hub, verifica los criterios de entrada contra el repo del artefacto, valida el schema con pnpm build y arma el PR con su checklist. Úsala en el repo del hub cuando pidan agregar, registrar, catalogar o proponer una librería, SDK, plugin, plantilla, arquetipo, CLI, herramienta, GitHub Action o workflow, o pasar un artefacto de comunidad a oficial.
---

# Agregar un artefacto al hub

Trabaja en el repo del hub. Las reglas completas están en `CONTRIBUTING.md`; el schema en `src/content/artifact-schema.ts`. Si algo aquí contradice al schema, gana el schema.

## 1. Reúne los datos

Necesitas el repositorio del artefacto. Léelo (con `gh` o el navegador si es remoto) para sacar:

- nombre, qué resuelve, lenguaje, manifiesto y dónde se publica (registro e id);
- licencia (`LICENSE`, campo del manifiesto);
- owners (`CODEOWNERS`, mantenedores). Si no hay, pregunta. **Nunca inventes owners.**

## 2. Verifica los criterios de entrada

Si alguno falla, detente y dilo. No crees la ficha.

- [ ] El repo es accesible para quien lo va a usar.
- [ ] El README tiene instalación y al menos un ejemplo. Si no, sugiere la skill `document-project` en ese repo.
- [ ] Tiene licencia. Comunidad: aprobada por OSI. Oficial: SPDX o `UNLICENSED`.
- [ ] Owners reales.
- [ ] Sin secretos ni datos de clientes. Si se hizo para un cliente, pregunta si Pragma tiene derecho a publicarlo.

## 3. Crea la ficha

Copia `templates/artifact.template.md` a `src/content/artifacts/<slug>.md`.

- **slug:** minúsculas y guiones, sin prefijo de organización. Revisa que no exista ya otro archivo con ese nombre.
- **kind**, cómo se usa. Es la navegación de arriba. Quédate con el primer sí:
  1. ¿Se agrega como dependencia? `library` (paquetes, SDKs, módulos de Terraform, charts).
  2. ¿Se instala dentro de otra herramienta? `plugin` (Gradle, Maven, IDE, ESLint, Backstage).
  3. ¿Se copia o se genera para empezar un proyecto? `template` (arquetipos, starters, scaffolds).
  4. ¿Se ejecuta? `tool` (CLIs, apps de escritorio, servicios internos, bots).
  5. ¿Corre en el pipeline de CI/CD? `automation` (GitHub Actions, workflows reutilizables, políticas).
  El lenguaje nunca decide el tipo.
- **disciplines:** al menos una de `backend`, `frontend`, `mobile`, `data`, `ai`, `quality`, `integration`, `cloudops`, `devsecops`, `dx`. **La primera es la principal**: decide el grupo en la barra lateral, así que pon primero la del trabajo que más resuelve.
- **languages:** al menos uno, el lenguaje desde el que lo usa quien lo consume (una action es `yaml`, un módulo de Terraform es `hcl`).
- **technologies:** opcional. Frameworks, plataformas y herramientas de build: `spring-boot`, `spring-webflux`, `nestjs`, `aws`, `gradle`…
- Lenguajes, tecnologías y registros son listas cerradas en `src/content/taxonomy.mjs` y `src/content/artifact-schema.ts`. Si falta uno (por ejemplo `ruby`), agrégalo en el mismo PR. **Tipos y disciplinas son la estructura del hub:** no los cambies; si ninguno encaja, dilo y sugiere abrir un issue.
- **origin:** `official` si el repo es de una organización de Pragma; `community` si es de una cuenta personal.
- **summary:** una frase en español y otra en inglés, de máximo 160 caracteres, que diga qué resuelve. Sin superlativos.
- **status:** pregúntalo a los owners si no es obvio. Sin release publicado: `experimental`.
- **docs:** `indexed` con `url` al README, salvo que pidan `hosted`. Para `hosted`, copia `templates/docs-hosted/` (sin su README) a `src/content/docs/artifacts/<slug>/` y llena las páginas con la skill `document-project`.
- **lastReviewed:** la fecha de hoy.
- Quita `draft: true` antes del PR, o déjalo si piden preparar la ficha sin publicarla.
- Borra los comentarios de la plantilla que no aporten.

## 4. Valida

```bash
pnpm build
```

Si falla, el mensaje dice qué campo corregir. Después revisa con `pnpm dev`:

- la ficha en `/catalog/<slug>/`;
- que aparece en `/types/<kind>/`, bajo su disciplina principal, y en el catálogo con los filtros de lenguaje y tecnología;
- que el tipo aparece en la barra superior (si es la primera ficha de ese tipo, aparece sola).

## 5. Arma el PR

- Rama: `artifact/<slug>`.
- Commit: `feat(catalog): add <name>`.
- Usa `.github/pull_request_template.md` y marca solo lo que verificaste.
- Pide confirmación antes de hacer push o abrir el PR.

## De comunidad a oficial

Solo si un equipo de Pragma aceptó mantenerlo. Cambia `origin` a `official`, actualiza `owners` y `repository` si se transfirió, y `lastReviewed`. Commit: `feat(catalog): promote <name> to official`.

## Retirar

Primero `status: deprecated` con `replacedBy` (slug del reemplazo) o `deprecationNote` en los dos idiomas. Borrar la ficha solo si lo piden los owners y lleva al menos tres meses deprecated.
