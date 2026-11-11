---
title: Preguntas frecuentes
description: Respuestas a las preguntas que más se repiten sobre Clean Architecture Generator.
sidebar:
  order: 90
---

## ¿Puedo usarlo en un proyecto que ya existe?

No para crearlo: `initCleanArch` exige una carpeta vacía. Si tu proyecto ya sigue una de las arquitecturas, puedes escribir `.cleanarch.yml` a mano con las secciones `project` y `architecture` (lee la [referencia de configuración](../reference/configuration/)) y usar los comandos de generación. Revisa que tus paquetes coincidan con los que espera la arquitectura.

## ¿Tengo que actualizar el plugin para recibir plantillas nuevas?

No. El plugin `1.x` lee el último tag `v1.x.y` de las plantillas en cada generación. Solo actualizas el plugin para recibir cambios del propio plugin o para pasar a un mayor nuevo. Lee [cómo controlar la versión de las plantillas](../guides/template-versions/).

## ¿El código ya generado cambia cuando salen plantillas nuevas?

No. Las plantillas solo afectan lo que generas desde ese momento. Para traer reglas nuevas de ArchUnit, corre `./gradlew validateStructure`.

## ¿Puedo cambiar de arquitectura o de paradigma después?

No con el plugin. Crea un proyecto nuevo con la arquitectura que quieres, genera los mismos componentes y mueve tu lógica.

## ¿Puedo quitar el plugin del proyecto generado?

Sí. El código generado no depende del plugin para compilar ni para correr; el Dockerfile ya lo quita. Si lo quitas de `build.gradle.kts`, pierdes los comandos de generación.

## ¿Necesito conexión a internet?

Para generar, sí, salvo que fijes `templates.version` a un tag que ya descargaste o uses plantillas locales. Lee [cómo trabajar sin conexión](../guides/template-versions/#cómo-trabajar-sin-conexión). Compilar el proyecto generado no necesita el repositorio de plantillas.

## ¿Puedo usar mis propias plantillas?

Sí. Haz un fork del repositorio de templates en GitHub y apunta `templates.repository` a él, o usa `mode: developer` con una copia local. Para que tu cambio llegue a todos, abre un pull request al [repositorio de templates](https://github.com/somospragma/backend-architecture-design-archetype-generator-templates): ahí está la guía para agregar arquitecturas y adaptadores.

## ¿Qué problemas conocidos tiene la versión 1.1.1?

- `generateUseCase` genera siempre el mismo esqueleto (`execute`, `findById`, `findAll`, `update`, `delete` sobre `Object`), sin importar `--methods`.
- El adaptador `rest` publica siempre un CRUD en `/api/v1/<nombre>s`, sin importar `--endpoints`.
- Los adaptadores de entrada necesitan `--useCase`, aunque la tarea no lo exige: sin él, `scheduled` falla al generar.
- `listComponents` no encuentra todos los componentes en `hexagonal-multi-granular` ni en `onion-single`.
- No se generan clases de prueba para casos de uso ni adaptadores.

## ¿Qué pasó con la versión 1.1.0?

La `1.1.0` no puede generar con las plantillas de GitHub: busca los archivos fuera de la carpeta `templates/` y no puede listar los archivos de un adaptador. Usa la `1.1.1`.
