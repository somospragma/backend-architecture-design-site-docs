---
title: Campos de salida
description: Todos los campos que puede escribir pragma-log, cuándo salen y en qué orden.
sidebar:
  order: 52
---

Cada log es un objeto con estos campos, en este orden. Un campo sin valor no se escribe. Puedes [ocultar, renombrar, anidar y ordenar](../../guides/fields/) cualquiera de ellos.

## Campos estándar

| Campo | Tipo | Cuándo sale | Qué es |
|---|---|---|---|
| `timestamp` | texto | Siempre | Fecha y hora del log, con el [patrón y la zona](../../guides/fields/#cambia-el-formato-del-timestamp) configurados. |
| `level` | texto | Siempre | `ERROR`, `WARN`, `INFO`, `DEBUG` o `TRACE`. |
| `logger` | texto | Siempre | Nombre del logger, normalmente la clase. |
| `thread` | texto | Siempre | Hilo que escribió el log. |
| `message` | texto | Siempre | Mensaje con los argumentos `{}` ya enmascarados. Nunca vacío. |

## Contexto

Después de los estándar van, en este orden:

1. Los campos de los [enrichers](../../guides/enrichment/#agrega-campos-a-todos-los-logs).
2. Los campos del MDC, incluidos los del [contexto HTTP](../../guides/http-context/) (`requestId`, `http.method`, `http.path`, `http.header.*`, `http.query.*`), `traceId`, `spanId` y los de `@LogEnrichment` y `@LogField`.
3. Los key-values del log (`addKeyValue`).

Si dos tienen el mismo nombre, gana el que va después: un key-value gana sobre el MDC, y el MDC sobre un enricher.

Con `extra-field`, estos campos van dentro de ese objeto.

## Identificación

| Campo | Cuándo sale | Qué es |
|---|---|---|
| `app` | Si hay nombre de app | Nombre de la app. |
| `version` | Si hay versión | Versión de la app. |
| `host` | `include-host: true` (por defecto) | `HOSTNAME` o el nombre del equipo. |
| `pid` | `include-pid: true` | Id del proceso. |
| Campos fijos | Si los configuras en `fields` | Mismo valor en todos los logs. |

## Excepciones

| Campo | Cuándo sale | Qué es |
|---|---|---|
| `error.type` | Con una excepción | Clase de la excepción. |
| `error.message` | Con una excepción que tiene mensaje | Mensaje, enmascarado. |
| `error.rootCause` | Con una excepción que tiene causa | Causa raíz, como `Clase: mensaje`. |
| `stacktrace` | Con una excepción y `stacktrace.include: true` | Stack trace acotado, enmascarado. |

## Log de fin de request

Solo en el log que escribe el logger `co.com.pragma.logging.http` al terminar cada request:

| Campo | Tipo | Qué es |
|---|---|---|
| `http.status` | número | Status de la respuesta. |
| `http.durationMs` | número | Duración del request en milisegundos. |
| `http.request.body` | objeto o texto | Body del request, si `http.body.enabled: true`. |
| `http.response.body` | objeto o texto | Body de la respuesta, si `http.body.enabled: true`. |

## Campos de control

| Campo | Cuándo sale | Qué significa |
|---|---|---|
| `truncated` | El log se recortó por `alerts.truncate` | `true`. Busca este campo para encontrar logs incompletos. |
| `pragmaLogError` | El masking falló | El log se escribió sin los argumentos. El valor es la clase de la excepción que lo impidió. |
| Un campo obligatorio con `unknown` | Faltaba un campo de `required-fields` | El valor es `required-placeholder`. |
