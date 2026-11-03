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

# Dónde lo busca quien lo va a usar, no el lenguaje en que está escrito:
# 1. ¿Se importa o se usa desde un lenguaje? java | node | python | dotnet | mobile
# 2. ¿Despliega o configura infraestructura? cloud
# 3. ¿Se corre en la máquina del desarrollador? tools
area: java

# library | plugin | sdk | template | cli | tool | action | other
kind: library

# Al menos uno. Lista cerrada en src/content/artifact-schema.ts:
# java, kotlin, spring, quarkus, gradle, maven, node, typescript, python, dotnet, go,
# flutter, aws, azure, gcp, terraform, kubernetes, github-actions
ecosystems: [java]

# official: vive en una organización de Pragma. community: cuenta personal y open source.
origin: official

# Usuarios de GitHub (dev-user) o equipos (somospragma/backend-architecture).
owners: [somospragma/backend-architecture]

repository: https://github.com/somospragma/mi-artefacto

# Opcional. Dónde se publica. type: maven-central | gradle-plugin-portal | npm | pypi | nuget |
# pub-dev | github-packages | docker-hub | terraform-registry | github-marketplace
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
