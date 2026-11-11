---
title: Changelog
description: Cambios de Clean Architecture Generator por versión.
sidebar:
  order: 99
---

Este changelog es del plugin. Las plantillas tienen sus propias versiones, en la [lista de tags del repositorio de templates](https://github.com/somospragma/backend-architecture-design-archetype-generator-templates/tags).

## 1.1.1 — 2026-11-11

### Corregido

- El plugin genera con las plantillas de GitHub. Descarga el zip del tag una vez, lo guarda en `~/.cleanarch/templates-cache/archives/` y lo lee desde disco. La versión `1.1.0` buscaba los archivos fuera de la carpeta `templates/` y no podía listar los archivos de un adaptador, así que fallaba al crear el proyecto y al generar adaptadores.
- Un tag ya descargado se usa sin conexión si lo fijas con `templates.version`.

## 1.1.0 — 2026-11-11

No la uses: no puede generar con las plantillas de GitHub. Actualiza a `1.1.1`.

### Cambiado

- **Las plantillas salen del último tag `v1.x.y`**, no de la rama `main` del repositorio de templates. Una plantilla nueva o corregida llega con el siguiente tag, sin actualizar el plugin.
- El plugin rechaza plantillas de un `schemaVersion` que no entiende, con un mensaje que dice qué hacer.
- Dependencias actualizadas: FreeMarker `2.3.35`, jackson-databind `2.22.4`, logback-classic `1.5.38`, snakeyaml `2.7` y slf4j `2.0.20`.

### Agregado

- `templates.version` fija un tag de plantillas.
- `templates.branch` lee una rama de plantillas.

### Al actualizar desde 1.0.x

**Rompe compatibilidad:** el plugin `1.0.x` leía la rama `main` de templates, que ya no es compatible con él. Cambia la versión del plugin a `1.1.1` en `build.gradle.kts`.
