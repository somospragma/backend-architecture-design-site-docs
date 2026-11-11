---
title: Changelog
description: Cambios de cada versión de pragma-log, la más nueva arriba.
sidebar:
  order: 99
---

pragma-log sigue [versionado semántico](https://semver.org/lang/es/). El detalle completo está en el [CHANGELOG del repositorio](https://github.com/somospragma/pragma-log-lib/blob/main/CHANGELOG.md).

## 1.0.1 — 2026-11-11

Corrige los problemas que salieron al probar la 1.0.0 desde Maven Central en proyectos reales. No cambia la configuración.

### Cambiado

- **Spring Boot (MVC y WebFlux):** el body de la respuesta en el log de fin de request es el objeto que retorna el `@RestController`, así que aplican sus `@MaskedLogField`, como en Quarkus. Antes solo se enmascaraba por nombre de campo y por patrones. Lee [Captura los bodies](../guides/http-context/#captura-los-bodies).
- **Spring Boot (MVC y WebFlux):** si un request termina en `500` o más por una excepción no manejada, el log de fin de request sale en `ERROR` con la excepción, así el stack trace lleva el `requestId`.

### Corregido

- El patrón `EMAIL` tardaba un tiempo cuadrático en textos largos sin `@`: un log de 100 KB tomaba más de un minuto y frenaba el logging asíncrono.
- Spring Boot: los objetos de `@LogField` ignoraban `masking.strategies`; un campo `CUSTOM` salía enmascarado completo.
- Documentación: en el `application.properties` de Quarkus una regex de `masking.patterns` necesita `\\\\` por cada `\`, y `scan` de Logback solo funciona con el archivo en disco.

## 1.0.0 — 2026-11-11

Primera versión publicada en Maven Central, con el group `co.com.pragma.logging` y licencia Apache 2.0. Es una reescritura completa de la librería interna anterior.

### Agregado

- **Integraciones:** Spring Boot 3.5 y 4.x (MVC y WebFlux), Quarkus 3.33 o superior (también en modo nativo) y Java con Logback.
- **Formatos:** JSON compacto o indentado, XML, CSV, formatos propios con `LogEventFormatter` y texto plano con colores para local.
- **Campos:** campos fijos; ocultar, renombrar, anidar (`$.a.b`) y ordenar campos; campos obligatorios con valor por defecto; objeto `extra`; patrón y zona del timestamp; recorte de textos largos.
- **Masking:** `@MaskedLogField` en campos, records y clases, con tipos `FULL`, `PREFIX`, `SUFFIX`, `MIDDLE`, `HIDDEN` y `CUSTOM`; masking por nombre a cualquier profundidad; patrones `CARD` (con Luhn), `EMAIL`, `JWT` y regex propias.
- **Contexto HTTP:** `requestId` validado contra inyección, método, path, status y duración; `traceId` y `spanId`; headers con lista blanca o `*` con lista negra; query params; logs de inicio y fin de request; captura opcional de bodies, enmascarados.
- **Enriquecimiento:** `LogEnricher`, `@LogEnrichment`, `@LogField` y claves del Reactor Context.
- **Alertas:** de tamaño, de fallo de masking y de campos faltantes, con listeners propios y recorte opcional de los logs grandes.
- **Operación:** cambios de configuración en caliente en Spring Boot y Logback, advertencias de configuraciones inconsistentes y logging asíncrono que no pierde logs.

### Si venías de la librería interna anterior

**Rompe compatibilidad.** No hay una ruta de actualización automática:

- `PragmaLogger` ya no existe: usa SLF4J (`LoggerFactory.getLogger(...)`). Los objetos se enmascaran igual.
- El archivo `pragma-log-config.yml` ya no existe: la configuración va en `application.yml`, `application.properties` o `logback.xml`, con el prefijo `pragma.log`.
- `@DeepMasking` ya no hace falta: el masking siempre recorre los objetos anidados.
- El objeto `extra` ya no es automático: actívalo con `extra-field: extra`.
- El jar ya no trae un `logback.xml`. En Spring Boot y Quarkus no hace falta; en Java puro, usa `PragmaStructuredEncoder` en tu `logback.xml`.
