---
name: add-artifact
description: Agregar un artefacto al catálogo del Pragma Hub. Crea la ficha en src/content/artifacts/<slug>.md desde la plantilla, elige área, tipo y ecosistemas con las reglas del hub, verifica los criterios de entrada contra el repo del artefacto, valida el schema con pnpm build y arma el PR con su checklist. Úsala en el repo del hub cuando pidan agregar, registrar, catalogar o proponer una librería, plugin, SDK, plantilla, CLI, herramienta o action, o pasar un artefacto de comunidad a oficial.
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
- **area**, en este orden:
  1. ¿Se importa o se usa desde un lenguaje? `java`, `node`, `python`, `dotnet` o `mobile`.
  2. ¿Despliega o configura infraestructura? `cloud`.
  3. ¿Se corre en la máquina del desarrollador? `tools`.
  Es dónde lo busca quien lo usa, no el lenguaje en que está escrito.
- **kind:** `library`, `plugin`, `sdk`, `template`, `cli`, `tool`, `action` u `other`.
- **ecosystems:** de la lista cerrada del schema. Si falta uno, agrégalo a `ECOSYSTEMS` en el mismo PR. Áreas y tipos nuevos van en `src/content/taxonomy.mjs` y necesitan acuerdo del equipo: pregunta antes.
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
- que aparece en `/areas/<area>/` y en el catálogo con los filtros;
- que el área aparece en la barra superior (si es la primera ficha de esa área, aparece sola).

## 5. Arma el PR

- Rama: `artifact/<slug>`.
- Commit: `feat(catalog): add <name>`.
- Usa `.github/pull_request_template.md` y marca solo lo que verificaste.
- Pide confirmación antes de hacer push o abrir el PR.

## De comunidad a oficial

Solo si un equipo de Pragma aceptó mantenerlo. Cambia `origin` a `official`, actualiza `owners` y `repository` si se transfirió, y `lastReviewed`. Commit: `feat(catalog): promote <name> to official`.

## Retirar

Primero `status: deprecated` con `replacedBy` (slug del reemplazo) o `deprecationNote` en los dos idiomas. Borrar la ficha solo si lo piden los owners y lleva al menos tres meses deprecated.
