---
# Ficha de un artefacto del Pragma Hub.
# Cópiala a src/content/artifacts/<slug>.md. El nombre del archivo es el slug y la URL:
# minúsculas y guiones, por ejemplo pragma-log.md → /catalog/pragma-log/.
# Las reglas completas están en CONTRIBUTING.md. `pnpm build` valida todo.

# Nombre tal como lo conoce la gente. Máximo 60 caracteres.
name: Mi Artefacto

# Una frase de qué resuelve, en los dos idiomas. Máximo 160 caracteres cada una.
summary:
  es: Qué resuelve y para quién, en una frase.
  en: What it solves and for whom, in one sentence.

# Opcional. Un párrafo más largo para la ficha. Máximo 600 caracteres.
# description:
#   es: ...
#   en: ...

# Tipo: cómo se usa. Quédate con el primer sí:
# ¿Se agrega como dependencia?                → library
# ¿Se instala dentro de otra herramienta?      → plugin
# ¿Se copia o genera para empezar un proyecto? → template
# ¿Se ejecuta?                                 → tool
# ¿Corre en el pipeline de CI/CD?              → automation
kind: library

# Para qué trabajo sirve. La primera es la principal (grupo en la barra lateral).
# backend | frontend | mobile | data | ai | quality | integration | cloudops | devsecops | dx
disciplines: [backend]

# En qué lenguaje lo usa quien lo consume. Al menos uno. Lista en src/content/taxonomy.mjs:
# java, kotlin, groovy, scala, javascript, typescript, python, csharp, go, rust, dart,
# swift, ruby, php, hcl, shell, yaml, sql. Si falta uno, agrégalo allí en el mismo PR.
languages: [java]

# Opcional. Frameworks, plataformas y herramientas de build (lista en taxonomy.mjs),
# por ejemplo spring-boot, spring-webflux, gradle, nestjs, react, flutter, aws, terraform.
technologies: []

# official: vive en una organización de Pragma. community: cuenta personal y open source.
origin: official

# Usuarios de GitHub (dev-user) o equipos (somospragma/backend-architecture).
owners: [somospragma/backend-architecture]

repository: https://github.com/somospragma/mi-artefacto

# Opcional. Dónde se publica. type: maven-central | gradle-plugin-portal | npm | pypi | nuget |
# pub-dev | rubygems | crates-io | artifact-hub | vscode-marketplace | github-packages |
# docker-hub | terraform-registry | github-marketplace
registry:
  type: maven-central
  id: com.pragma:mi-artefacto

# experimental | beta | stable | deprecated
status: experimental

# Si es deprecated, uno de estos dos:
# replacedBy: slug-del-reemplazo
# deprecationNote:
#   es: Por qué ya no se recomienda.
#   en: Why it is no longer recommended.

# Identificador SPDX. Comunidad: aprobada por OSI (MIT, Apache-2.0…).
# Oficial: cualquier SPDX, o UNLICENSED si es interno.
license: Apache-2.0

# indexed: la documentación vive en el repo del artefacto y url apunta a ella.
# hosted: vive en src/content/docs/artifacts/<slug>/ (ver templates/docs-hosted/) y url no hace falta.
docs:
  mode: indexed
  url: https://github.com/somospragma/mi-artefacto#readme

# Opcional. Palabras para la búsqueda, en minúsculas.
tags: []

# Fecha de la última vez que alguien revisó que la ficha sigue siendo cierta.
lastReviewed: 2026-01-01

# true mientras la preparas: solo se ve con `pnpm dev`. Quítalo antes de abrir el PR.
draft: true
---
