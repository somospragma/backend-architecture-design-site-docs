---
title: Configuración
description: Todas las propiedades pragma.log de Spring Boot y Quarkus, con su valor por defecto.
sidebar:
  order: 50
---

Las propiedades son las mismas en Spring Boot (`application.yml`) y en Quarkus (`application.properties`), con el prefijo `pragma.log`. La columna **Dónde** indica si una propiedad solo existe en uno de los dos. Para `logback.xml`, lee la [referencia de Logback](../logback/).

Formatos de los valores:

- **Listas:** `[a, b]` en YAML; `a,b` en properties.
- **Mapas:** `fields: {env: prod}` en YAML; `pragma.log.fields.env=prod` en properties.
- **Tamaños:** `64KB`, `1MB` en Spring Boot; `64K`, `1M` en Quarkus.
- **Duraciones:** `5s`, `500ms` en Spring Boot.

## General

| Propiedad | Por defecto | Dónde | Qué hace |
|---|---|---|---|
| `enabled` | `true` | Ambos | `false` apaga la librería y deja el logging por defecto del framework. |
| `format` | `json` | Ambos | `json`, `xml`, `csv`, `custom` o `plain`. Lee [Cómo elegir el formato](../../guides/formats/). |
| `custom-formatter` | — | Ambos | Clase que implementa `LogEventFormatter`, para `format: custom`. |
| `json.pretty` | `false` | Ambos | JSON indentado en varias líneas. Solo para local. |
| `csv.columns` | `timestamp, level, logger, thread, message` | Ambos | Columnas del CSV, por nombre de salida. |
| `csv.delimiter` | `,` | Ambos | Separador del CSV. |
| `csv.header` | `false` | Quarkus | Escribe los nombres de las columnas al comienzo de cada archivo. |

## Identificación

| Propiedad | Por defecto | Dónde | Qué hace |
|---|---|---|---|
| `app-name` | `spring.application.name` / `quarkus.application.name` | Ambos | Valor del campo `app`. |
| `version` | `spring.application.version` / `quarkus.application.version` | Ambos | Valor del campo `version`. Si no hay ninguno, no sale. |
| `include-host` | `true` | Ambos | Agrega el campo `host`. |
| `include-pid` | `false` | Ambos | Agrega el campo `pid`. |

## Campos

| Propiedad | Por defecto | Dónde | Qué hace |
|---|---|---|---|
| `fields` | — | Ambos | Campos fijos en todos los logs, como mapa: `env: prod`. |
| `hide-fields` | — | Ambos | Campos que no salen: estándar, fijos, del MDC o key-values. |
| `rename-fields` | — | Ambos | Campos renombrados, como mapa `actual: nuevo`. Un nombre `$.a.b` anida el campo. |
| `field-order` | — | Ambos | Campos que van primero, en ese orden. |
| `required-fields` | — | Ambos | Campos que todo log debe tener. |
| `required-placeholder` | `unknown` | Ambos | Valor de un campo obligatorio que falta. |
| `extra-field` | — | Ambos | Nombre del objeto que agrupa el MDC y los key-values. Sin valor, todo va en la raíz. |
| `max-field-length` | `0` | Ambos | Caracteres máximos del mensaje y de cada texto. `0` no recorta. |
| `enrichers` | — | Ambos | Clases que implementan `LogEnricher`. Los beans se registran solos. |
| `context-keys` | — | Spring Boot | Claves del Reactor Context que salen en los logs (WebFlux). |

## Timestamp

| Propiedad | Por defecto | Dónde | Qué hace |
|---|---|---|---|
| `timestamp.pattern` | `[ISO_OFFSET_DATE_TIME]` en JSON; `yyyy-MM-dd HH:mm:ss.SSS` en `plain` | Ambos | Patrón de `DateTimeFormatter` o una constante entre corchetes, como `[ISO_INSTANT]`. |
| `timestamp.zone` | La zona del sistema | Ambos | Zona horaria, como `UTC` o `America/Bogota`. |

## Masking

| Propiedad | Por defecto | Dónde | Qué hace |
|---|---|---|---|
| `masking.enabled` | `true` | Ambos | Activa el masking. |
| `masking.character` | `*` | Ambos | Carácter de la máscara. |
| `masking.default-type` | `FULL` | Ambos | Tipo para los campos enmascarados por nombre: `FULL`, `PREFIX`, `SUFFIX`, `MIDDLE` o `HIDDEN`. |
| `masking.default-length` | `4` | Ambos | Longitud para `PREFIX`, `SUFFIX` y `MIDDLE` cuando la anotación no la define. |
| `masking.fields` | `password`, `passwd`, `pwd`, `secret`, `token`, `accessToken`, `refreshToken`, `idToken`, `apiKey`, `authToken`, `authorization`, `proxyAuthorization`, `cookie`, `setCookie`, `cardNumber`, `cvv`, `cvc`, `pin` | Ambos | Nombres que se enmascaran sin anotación. **Reemplaza** la lista por defecto. |
| `masking.max-depth` | `10` | Ambos | Profundidad máxima de objetos anidados. |
| `masking.strategies` | — | Ambos | Estrategias propias, como mapa `nombre: clase`. |
| `masking.patterns` | — | Ambos | `CARD`, `EMAIL`, `JWT` o una regex. Se buscan en el texto. |

## Stack trace

| Propiedad | Por defecto | Dónde | Qué hace |
|---|---|---|---|
| `stacktrace.include` | `true` | Ambos | Escribe el stack trace. El resumen `error` sale siempre. |
| `stacktrace.max-depth` | `50` | Ambos | Frames por cada excepción de la cadena. |
| `stacktrace.max-length` | `16384` | Ambos | Caracteres máximos de todo el stack trace. |
| `stacktrace.root-cause-first` | `false` | Ambos | Escribe primero la causa raíz. |

## HTTP

| Propiedad | Por defecto | Dónde | Qué hace |
|---|---|---|---|
| `http.enabled` | `true` | Ambos | Agrega el contexto HTTP y los logs de request. |
| `http.request-id-header` | `X-Request-Id` | Ambos | Header del `requestId`. |
| `http.headers` | — | Ambos | Headers que salen como `http.header.<nombre>`. `*` para todos. |
| `http.exclude-headers` | `Authorization`, `Proxy-Authorization`, `Cookie`, `Set-Cookie` | Ambos | Headers que `*` no copia. |
| `http.query-params` | — | Ambos | Query params que salen como `http.query.<nombre>`. `*` para todos. |
| `http.request-log.enabled` | `true` | Ambos | Log de fin de request con `http.status` y `http.durationMs`. |
| `http.request-log.entry` | `false` | Ambos | Log adicional al comenzar cada request. |
| `http.request-log.exclude-paths` | `/actuator/**` (Spring Boot); `/q/**` (Quarkus) | Ambos | Paths sin logs de request, como patrones Ant. |
| `http.body.enabled` | `false` | Ambos | Agrega los bodies al log de fin de request. |
| `http.body.request` | `true` | Ambos | Captura el body del request. |
| `http.body.response` | `true` | Ambos | Captura el body de la respuesta. |
| `http.body.max-size` | `4KB` | Ambos | Bytes que se guardan de cada body. |
| `http.body.content-types` | `application/json`, `application/*+json`, `application/x-www-form-urlencoded`, `application/xml`, `text/*` | Ambos | Tipos de contenido que se capturan. |

## Alertas

| Propiedad | Por defecto | Dónde | Qué hace |
|---|---|---|---|
| `alerts.max-log-size` | — | Ambos | Tamaño a partir del cual un log genera una alerta. Sin valor, no hay alertas de tamaño. |
| `alerts.truncate` | `false` | Ambos | Recorta los logs más grandes que `max-log-size`. |
| `alerts.console` | `true` | Ambos | Escribe las alertas en la salida de error, máximo una por minuto por logger. |
| `alerts.listeners` | — | Ambos | Clases que implementan `LogAlertListener`. Los beans se registran solos. |

## Texto plano y colores

| Propiedad | Por defecto | Dónde | Qué hace |
|---|---|---|---|
| `color.mode` | `auto` | Ambos | `auto`, `always` o `never`. Solo aplica a `format: plain` en la consola. |
| `color.levels` | `ERROR` rojo, `WARN` amarillo, `INFO` verde, `DEBUG` cian, `TRACE` tenue | Ambos | Color por nivel, con nombre o hex. |

## Logging asíncrono

| Propiedad | Por defecto | Dónde | Qué hace |
|---|---|---|---|
| `async.enabled` | `false` | Spring Boot | Escribe los logs en otro hilo. En Quarkus usa `quarkus.log.console.async`. |
| `async.queue-size` | `8192` | Spring Boot | Logs que pueden esperar a ser escritos. |
| `async.never-block` | `false` | Spring Boot | Descarta logs cuando la cola está llena, en vez de esperar. |
| `async.max-flush-time` | `5s` | Spring Boot | Tiempo máximo para escribir los pendientes al apagar la app. |
