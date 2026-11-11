---
title: Funcionalidades
description: Todo lo que hace pragma-log, en qué framework funciona y dónde está documentado.
sidebar:
  order: 3
---

Esta página lista todas las funcionalidades de pragma-log `1.0.1`, agrupadas por tema. Cada fila dice en qué integración funciona y enlaza a la página que explica cómo usarla.

**Spring** es el starter de Spring Boot 3.5 y 4.x (MVC y WebFlux). **Quarkus** es la extensión para Quarkus 3.33 o superior. **Java** es `logback.xml` sin framework. ✓ funciona; — no aplica a esa integración.

Para ver todas las opciones juntas en un archivo, lee la configuración completa de [Spring Boot](../reference/example-spring-boot/), [Quarkus](../reference/example-quarkus/) o [Java con Logback](../reference/example-logback/).

## Formatos

| Funcionalidad | Spring | Quarkus | Java | Dónde |
|---|---|---|---|---|
| JSON de una línea por log | ✓ | ✓ | ✓ | [Formatos](../guides/formats/#json) |
| JSON indentado (`json.pretty`) | ✓ | ✓ | ✓ | [Formatos](../guides/formats/#json) |
| XML | ✓ | ✓ | ✓ | [Formatos](../guides/formats/#xml) |
| CSV con columnas y separador | ✓ | ✓ | ✓ | [Formatos](../guides/formats/#csv) |
| Encabezado del CSV | — | ✓ | ✓ | [Formatos](../guides/formats/#csv) |
| Formato propio (`LogEventFormatter`) | ✓ | ✓ | ✓ | [Formatos](../guides/formats/#formato-propio) |
| Texto plano con el mismo masking | ✓ | ✓ | ✓ | [Texto plano](../guides/formats/#texto-plano-para-desarrollo-local) |
| Colores ANSI por nivel, con nombre o hex | ✓ | ✓ | ✓ | [Colores](../guides/formats/#colores) |
| Formato distinto por ambiente | ✓ | ✓ | ✓ | [Spring Boot](../guides/spring-boot/#usa-formatos-distintos-por-ambiente), [Quarkus](../guides/quarkus/#usa-texto-legible-en-dev-mode) |
| Patrón y zona horaria del timestamp | ✓ | ✓ | ✓ | [Campos](../guides/fields/#cambia-el-formato-del-timestamp) |

## Campos

| Funcionalidad | Spring | Quarkus | Java | Dónde |
|---|---|---|---|---|
| Campos estándar: `timestamp`, `level`, `logger`, `thread`, `message` | ✓ | ✓ | ✓ | [Campos de salida](../reference/output-fields/) |
| `app`, `version`, `host` y `pid` | ✓ | ✓ | ✓ | [Identifica la app](../guides/fields/#identifica-la-app) |
| Campos fijos (`env`, `team`…) | ✓ | ✓ | ✓ | [Campos fijos](../guides/fields/#agrega-campos-fijos) |
| MDC y key-values como campos | ✓ | ✓ | ✓ | [Enriquecer](../guides/enrichment/#agrega-campos-a-un-log) |
| Objetos como campos, enmascarados | ✓ | ✓ | ✓ | [Enriquecer](../guides/enrichment/#agrega-campos-a-un-log) |
| Ocultar campos | ✓ | ✓ | ✓ | [Ocultar](../guides/fields/#oculta-campos) |
| Renombrar campos | ✓ | ✓ | ✓ | [Renombrar](../guides/fields/#renombra-campos) |
| Anidar campos (`$.a.b`) | ✓ | ✓ | ✓ | [Anidar](../guides/fields/#anida-campos-en-objetos) |
| Ordenar campos | ✓ | ✓ | ✓ | [Ordenar](../guides/fields/#ordena-los-campos) |
| Campos obligatorios con valor por defecto y alerta | ✓ | ✓ | ✓ | [Obligatorios](../guides/fields/#exige-campos-obligatorios) |
| Objeto `extra` para el MDC y los key-values | ✓ | ✓ | ✓ | [Extra](../guides/fields/#agrupa-el-contexto-en-un-objeto-extra) |
| Recorte de textos largos | ✓ | ✓ | ✓ | [Recortar](../guides/fields/#recorta-los-textos-largos) |
| Ningún log sin mensaje | ✓ | ✓ | ✓ | [Excepciones](../guides/exceptions/#ningún-log-sale-sin-mensaje) |

## Excepciones

| Funcionalidad | Spring | Quarkus | Java | Dónde |
|---|---|---|---|---|
| Resumen `error`: tipo, mensaje y causa raíz | ✓ | ✓ | ✓ | [Excepciones](../guides/exceptions/#el-resumen-error) |
| Stack trace opcional | ✓ | ✓ | ✓ | [Acota el stack trace](../guides/exceptions/#acota-el-stack-trace) |
| Límite de frames y de largo | ✓ | ✓ | ✓ | [Acota el stack trace](../guides/exceptions/#acota-el-stack-trace) |
| Causa raíz primero | ✓ | ✓ | ✓ | [Acota el stack trace](../guides/exceptions/#acota-el-stack-trace) |

## Masking

| Funcionalidad | Spring | Quarkus | Java | Dónde |
|---|---|---|---|---|
| `@MaskedLogField` en cualquier tipo, herencia y records | ✓ | ✓ | ✓ | [Anotación](../guides/masking/#marca-los-campos-con-maskedlogfield) |
| `@MaskedLogField` en una clase completa | ✓ | ✓ | ✓ | [Clase completa](../guides/masking/#enmascara-una-clase-completa) |
| Tipos `FULL`, `PREFIX`, `SUFFIX`, `MIDDLE`, `HIDDEN` y `CUSTOM` | ✓ | ✓ | ✓ | [Tipos](../guides/masking/#elige-el-tipo-de-máscara) |
| Carácter y longitud configurables | ✓ | ✓ | ✓ | [Ajusta el masking](../guides/masking/#ajusta-el-masking) |
| Estrategias propias (`MaskingStrategy`) | ✓ | ✓ | ✓ | [Estrategia propia](../guides/masking/#crea-tu-propia-estrategia) |
| Masking por nombre de campo, a cualquier profundidad | ✓ | ✓ | ✓ | [Por nombre](../guides/masking/#enmascara-por-nombre-de-campo) |
| Masking por patrones: `CARD` (Luhn), `EMAIL`, `JWT`, regex | ✓ | ✓ | ✓ | [Patrones](../guides/masking/#busca-datos-dentro-del-texto-con-patrones) |
| Masking en el MDC, key-values, headers y bodies | ✓ | ✓ | ✓ | [Masking](../guides/masking/) |
| Sin `toString()` y sin modificar el objeto | ✓ | ✓ | ✓ | [Masking](../guides/masking/) |
| Referencias circulares y profundidad máxima | ✓ | ✓ | ✓ | [Ajusta el masking](../guides/masking/#ajusta-el-masking) |
| Si el masking falla, el log sale sin datos y con `pragmaLogError` | ✓ | ✓ | ✓ | [Si el masking falla](../guides/masking/#qué-pasa-si-el-masking-falla) |

## Contexto HTTP

| Funcionalidad | Spring | Quarkus | Java | Dónde |
|---|---|---|---|---|
| `requestId` del header o generado, validado y devuelto | ✓ | ✓ | — | [requestId](../guides/http-context/#el-requestid) |
| Método y path del request | ✓ | ✓ | — | [Contexto HTTP](../guides/http-context/#qué-sale-en-cada-log-del-request) |
| `traceId` y `spanId` | ✓ | ✓ | — | [Contexto HTTP](../guides/http-context/#qué-sale-en-cada-log-del-request) |
| Log de fin de request con status y duración | ✓ | ✓ | — | [Log de fin](../guides/http-context/#el-log-de-fin-de-request) |
| Log de inicio de request | ✓ | ✓ | — | [Log de fin](../guides/http-context/#el-log-de-fin-de-request) |
| Rutas excluidas de los logs de request | ✓ | ✓ | — | [Log de fin](../guides/http-context/#el-log-de-fin-de-request) |
| Headers con lista permitida o `*` con lista negra | ✓ | ✓ | — | [Headers](../guides/http-context/#agrega-headers) |
| Query params como campos | ✓ | ✓ | — | [Query params](../guides/http-context/#agrega-query-params) |
| Captura de bodies, enmascarados | ✓ | ✓ | — | [Bodies](../guides/http-context/#captura-los-bodies) |
| Contexto en código reactivo (WebFlux, Mutiny) | ✓ | ✓ | — | [Spring Boot](../guides/spring-boot/#usa-contexto-propio-en-webflux), [Quarkus](../guides/quarkus/#qué-obtienes-sin-configurar-nada) |
| Limpieza del contexto al terminar, sin fugas entre requests | ✓ | ✓ | — | [Contexto HTTP](../guides/http-context/) |

En Java sin framework web pon el contexto en el MDC. Lo explica [Java con Logback](../guides/plain-java/#loguea-con-slf4j).

## Enriquecimiento

| Funcionalidad | Spring | Quarkus | Java | Dónde |
|---|---|---|---|---|
| `LogEnricher` para todos los logs | ✓ | ✓ | ✓ | [Enrichers](../guides/enrichment/#agrega-campos-a-todos-los-logs) |
| Enrichers como beans | ✓ | ✓ | — | [Enrichers](../guides/enrichment/#agrega-campos-a-todos-los-logs) |
| `@LogEnrichment` y `@LogField`, también con `Mono`, `Flux` y `Uni` | ✓ | ✓ | — | [Por método](../guides/enrichment/#agrega-campos-a-un-método) |
| Claves del Reactor Context (`context-keys`) | ✓ | — | — | [Reactor Context](../guides/enrichment/#usa-el-reactor-context-en-webflux) |

## Alertas

| Funcionalidad | Spring | Quarkus | Java | Dónde |
|---|---|---|---|---|
| Alerta por tamaño de log | ✓ | ✓ | ✓ | [Tamaño](../guides/alerts/#avisa-cuando-un-log-es-demasiado-grande) |
| Recorte del log al pasar el tamaño máximo | ✓ | ✓ | ✓ | [Recorte](../guides/alerts/#recorta-los-logs-que-se-pasan) |
| Alertas en la consola | ✓ | ✓ | ✓ | [Consola](../guides/alerts/#mira-las-alertas-en-la-consola) |
| Listeners propios: `onLargeLog`, `onMaskingError`, `onMissingFields` | ✓ | ✓ | ✓ | [Listeners](../guides/alerts/#lleva-las-alertas-a-una-métrica-o-una-notificación) |

## Configuración

| Funcionalidad | Spring | Quarkus | Java | Dónde |
|---|---|---|---|---|
| Funciona sin configurar nada | ✓ | ✓ | — | [Inicio rápido](../quick-start/) |
| Configuración en `application.yml` con autocompletado | ✓ | — | — | [Spring Boot](../guides/spring-boot/#configura-con-applicationyml) |
| Configuración en `application.properties` | ✓ | ✓ | — | [Quarkus](../guides/quarkus/#configura-con-applicationproperties) |
| Configuración en `logback.xml` | — | — | ✓ | [Java con Logback](../guides/plain-java/#configura-logbackxml) |
| Variables de ambiente en la configuración | ✓ | ✓ | ✓ | [Campos fijos](../guides/fields/#agrega-campos-fijos) |
| Una configuración inválida detiene el arranque | ✓ | ✓ | — | [Spring Boot](../guides/spring-boot/#configura-con-applicationyml) |
| Cambios de configuración sin reiniciar | ✓ | — | ✓ | [En caliente](../guides/hot-reload/) |
| Advertencias de configuraciones inconsistentes | ✓ | ✓ | ✓ | [Advertencias](../guides/hot-reload/#advertencias-de-configuración) |

## Rendimiento y operación

| Funcionalidad | Spring | Quarkus | Java | Dónde |
|---|---|---|---|---|
| Logging asíncrono que no pierde logs | ✓ | ✓ | ✓ | [Asíncrono](../guides/async/) |
| Modo nativo (GraalVM, Mandrel) | — | ✓ | — | [Quarkus](../guides/quarkus/#compila-en-modo-nativo) |
| Benchmarks del costo por log | ✓ | ✓ | ✓ | [Rendimiento](../guides/performance/) |
| Nombres de Elastic, Datadog y OpenTelemetry | ✓ | ✓ | ✓ | [Observabilidad](../guides/observability/) |

## Lo que pragma-log no incluye

| Qué | Alternativa |
|---|---|
| Usuario autenticado de Spring Security como campo | Ponlo en el MDC o con un [`LogEnricher`](../guides/enrichment/#agrega-campos-a-todos-los-logs). |
| Micronaut y Vert.x sin Quarkus | No hay integración. Puedes usar `pragma-log-logback` con un `logback.xml`, sin contexto HTTP automático. |
| Spring sin Spring Boot | No hay integración. Usa `pragma-log-logback` con un `logback.xml`. |
| Log4j 2 como backend | No hay integración. pragma-log funciona sobre Logback y JBoss LogManager. |
| Un logger propio (`PragmaLogger`) | Usa SLF4J. Los objetos se enmascaran igual. |
| Un archivo de configuración propio | La configuración va en `application.yml`, `application.properties` o `logback.xml`. |
