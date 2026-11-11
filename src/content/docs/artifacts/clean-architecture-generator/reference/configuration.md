---
title: Configuración
description: Todas las claves de .cleanarch.yml, sus valores por defecto y quién las escribe.
sidebar:
  order: 7
---

`.cleanarch.yml` vive en la raíz del proyecto. `initCleanArch` escribe las secciones `project` y `architecture`; la sección `templates` la escribes tú, si la necesitas. Versiona el archivo con el proyecto: los comandos de generación lo leen.

## Ejemplo completo

```yaml
project:
  name: order-service
  basePackage: com.example.orders
  pluginVersion: 1.1.1
  createdAt: '2026-11-11T10:30:00'
architecture:
  type: hexagonal-multi
  paradigm: reactive
  framework: spring
  adaptersAsModules: false
templates:
  version: v1.0.1
```

## project

| Clave | Tipo | Qué es |
|---|---|---|
| `name` | texto | Nombre del proyecto: `rootProject.name` o el nombre de la carpeta. |
| `basePackage` | texto | El `--package` de `initCleanArch`. Todos los paquetes generados empiezan por él. |
| `pluginVersion` | texto | Versión del plugin que generó por última vez. Los comandos de adaptadores la actualizan cuando usas otra versión. |
| `createdAt` | fecha y hora ISO | Cuándo se creó el proyecto. |

`name` y `basePackage` son obligatorias: sin ellas, los comandos fallan con un mensaje que muestra un ejemplo.

## architecture

| Clave | Tipo | Valores |
|---|---|---|
| `type` | texto | `hexagonal-single`, `hexagonal-multi`, `hexagonal-multi-granular`, `onion-single` |
| `paradigm` | texto | `reactive`, `imperative` |
| `framework` | texto | `spring` |
| `adaptersAsModules` | booleano | `true` en `hexagonal-multi-granular`. Lo decide la arquitectura; no lo cambies. |

No cambies `type` ni `paradigm` en un proyecto existente: el código ya generado no se mueve y los comandos nuevos generarían en otra estructura.

## templates

Todas las claves son opcionales. Lee [cómo controlar la versión de las plantillas](../../guides/template-versions/) para los casos de uso.

| Clave | Tipo | Por defecto | Qué hace |
|---|---|---|---|
| `version` | texto | el último tag `v1.x.y` | Fija un tag de plantillas, por ejemplo `v1.0.1`. |
| `branch` | texto | | Lee una rama en vez de un tag. Si también hay `version`, gana `version`. |
| `repository` | URL | `https://github.com/somospragma/backend-architecture-design-archetype-generator-templates` | Repositorio de plantillas. Para usar un fork, tiene que ser de GitHub. |
| `mode` | texto | `production` | `developer` (o `local`) lee las plantillas de `localPath`. Cualquier otro valor, de GitHub. |
| `localPath` | ruta | | Carpeta `templates/` de una copia local del repositorio. Solo se usa con `mode: developer`. Usa una ruta absoluta. |
| `cache` | booleano | `true` | Con `false`, el plugin no guarda en disco lo que descarga archivo por archivo. Los tags descargados como zip siempre se guardan. |

## Archivos que crea el plugin

| Ruta | Qué es |
|---|---|
| `.cleanarch.yml` | Esta configuración. |
| `.cleanarch/backups/<id>/` | Copias de `application.yml` y `build.gradle.kts` antes de generar cada adaptador. Puedes borrarlas y agregarlas a `.gitignore`. |
| `~/.cleanarch/templates-cache/` | Caché de plantillas, compartida por todos tus proyectos. La borran `updateTemplates` y `clearTemplateCache`. |
