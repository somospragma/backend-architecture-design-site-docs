---
title: Configuration
description: Every pragma.log property for Spring Boot and Quarkus, with its default value.
sidebar:
  order: 50
---

The properties are the same in Spring Boot (`application.yml`) and in Quarkus (`application.properties`), with the `pragma.log` prefix. The **Where** column shows whether a property exists in only one of the two. For `logback.xml`, read the [Logback reference](../logback/).

Value formats:

- **Lists:** `[a, b]` in YAML; `a,b` in properties.
- **Maps:** `fields: {env: prod}` in YAML; `pragma.log.fields.env=prod` in properties.
- **Sizes:** `64KB`, `1MB` in Spring Boot; `64K`, `1M` in Quarkus.
- **Durations:** `5s`, `500ms` in Spring Boot.

## General

| Property | Default | Where | What it does |
|---|---|---|---|
| `enabled` | `true` | Both | `false` turns the library off and leaves the framework's default logging. |
| `format` | `json` | Both | `json`, `xml`, `csv`, `custom` or `plain`. Read [How to choose the output format](../../guides/formats/). |
| `custom-formatter` | — | Both | Class that implements `LogEventFormatter`, for `format: custom`. |
| `json.pretty` | `false` | Both | Indented JSON over several lines. Local use only. |
| `csv.columns` | `timestamp, level, logger, thread, message` | Both | CSV columns, by output name. |
| `csv.delimiter` | `,` | Both | CSV separator. |
| `csv.header` | `false` | Quarkus | Writes the column names at the start of each file. |

## Identification

| Property | Default | Where | What it does |
|---|---|---|---|
| `app-name` | `spring.application.name` / `quarkus.application.name` | Both | Value of the `app` field. |
| `version` | `spring.application.version` / `quarkus.application.version` | Both | Value of the `version` field. If there is none, it doesn't come out. |
| `include-host` | `true` | Both | Adds the `host` field. |
| `include-pid` | `false` | Both | Adds the `pid` field. |

## Fields

| Property | Default | Where | What it does |
|---|---|---|---|
| `fields` | — | Both | Fixed fields in every log, as a map: `env: prod`. |
| `hide-fields` | — | Both | Fields that don't come out: standard, fixed, MDC or key-values. |
| `rename-fields` | — | Both | Renamed fields, as a map `current: new`. A `$.a.b` name nests the field. |
| `field-order` | — | Both | Fields that go first, in that order. |
| `required-fields` | — | Both | Fields that every log must have. |
| `required-placeholder` | `unknown` | Both | Value of a missing required field. |
| `extra-field` | — | Both | Name of the object that groups the MDC and the key-values. With no value, everything goes at the root. |
| `max-field-length` | `0` | Both | Maximum characters of the message and of each text. `0` doesn't cut. |
| `enrichers` | — | Both | Classes that implement `LogEnricher`. Beans are registered automatically. |
| `context-keys` | — | Spring Boot | Reactor Context keys that come out in the logs (WebFlux). |

## Timestamp

| Property | Default | Where | What it does |
|---|---|---|---|
| `timestamp.pattern` | `[ISO_OFFSET_DATE_TIME]` in JSON; `yyyy-MM-dd HH:mm:ss.SSS` in `plain` | Both | `DateTimeFormatter` pattern or a constant in brackets, such as `[ISO_INSTANT]`. |
| `timestamp.zone` | The system zone | Both | Time zone, such as `UTC` or `America/Bogota`. |

## Masking

| Property | Default | Where | What it does |
|---|---|---|---|
| `masking.enabled` | `true` | Both | Turns masking on. |
| `masking.character` | `*` | Both | Mask character. |
| `masking.default-type` | `FULL` | Both | Type for fields masked by name: `FULL`, `PREFIX`, `SUFFIX`, `MIDDLE` or `HIDDEN`. |
| `masking.default-length` | `4` | Both | Length for `PREFIX`, `SUFFIX` and `MIDDLE` when the annotation doesn't set it. |
| `masking.fields` | `password`, `passwd`, `pwd`, `secret`, `token`, `accessToken`, `refreshToken`, `idToken`, `apiKey`, `authToken`, `authorization`, `proxyAuthorization`, `cookie`, `setCookie`, `cardNumber`, `cvv`, `cvc`, `pin` | Both | Names that are masked without an annotation. **Replaces** the default list. |
| `masking.max-depth` | `10` | Both | Maximum depth of nested objects. |
| `masking.strategies` | — | Both | Your own strategies, as a map `name: class`. |
| `masking.patterns` | — | Both | `CARD`, `EMAIL`, `JWT` or a regex. They are searched for in the text. |

## Stack trace

| Property | Default | Where | What it does |
|---|---|---|---|
| `stacktrace.include` | `true` | Both | Writes the stack trace. The `error` summary always comes out. |
| `stacktrace.max-depth` | `50` | Both | Frames for each exception in the chain. |
| `stacktrace.max-length` | `16384` | Both | Maximum characters of the whole stack trace. |
| `stacktrace.root-cause-first` | `false` | Both | Writes the root cause first. |

## HTTP

| Property | Default | Where | What it does |
|---|---|---|---|
| `http.enabled` | `true` | Both | Adds the HTTP context and the request logs. |
| `http.request-id-header` | `X-Request-Id` | Both | Header for the `requestId`. |
| `http.headers` | — | Both | Headers that come out as `http.header.<name>`. `*` for all. |
| `http.exclude-headers` | `Authorization`, `Proxy-Authorization`, `Cookie`, `Set-Cookie` | Both | Headers that `*` doesn't copy. |
| `http.query-params` | — | Both | Query params that come out as `http.query.<name>`. `*` for all. |
| `http.request-log.enabled` | `true` | Both | End-of-request log with `http.status` and `http.durationMs`. |
| `http.request-log.entry` | `false` | Both | Additional log when each request starts. |
| `http.request-log.exclude-paths` | `/actuator/**` (Spring Boot); `/q/**` (Quarkus) | Both | Paths without request logs, as Ant patterns. |
| `http.body.enabled` | `false` | Both | Adds the bodies to the end-of-request log. |
| `http.body.request` | `true` | Both | Captures the request body. |
| `http.body.response` | `true` | Both | Captures the response body. |
| `http.body.max-size` | `4KB` | Both | Bytes kept from each body. |
| `http.body.content-types` | `application/json`, `application/*+json`, `application/x-www-form-urlencoded`, `application/xml`, `text/*` | Both | Content types that are captured. |

## Alerts

| Property | Default | Where | What it does |
|---|---|---|---|
| `alerts.max-log-size` | — | Both | Size from which a log raises an alert. With no value, there are no size alerts. |
| `alerts.truncate` | `false` | Both | Cuts logs larger than `max-log-size`. |
| `alerts.console` | `true` | Both | Writes the alerts to the error output, at most one per minute per logger. |
| `alerts.listeners` | — | Both | Classes that implement `LogAlertListener`. Beans are registered automatically. |

## Plain text and colors

| Property | Default | Where | What it does |
|---|---|---|---|
| `color.mode` | `auto` | Both | `auto`, `always` or `never`. Only applies to `format: plain` on the console. |
| `color.levels` | `ERROR` red, `WARN` yellow, `INFO` green, `DEBUG` cyan, `TRACE` faint | Both | Color per level, by name or hex. |

## Asynchronous logging

| Property | Default | Where | What it does |
|---|---|---|---|
| `async.enabled` | `false` | Spring Boot | Writes the logs on another thread. In Quarkus, use `quarkus.log.console.async`. |
| `async.queue-size` | `8192` | Spring Boot | Logs that can wait to be written. |
| `async.never-block` | `false` | Spring Boot | Discards logs when the queue is full, instead of waiting. |
| `async.max-flush-time` | `5s` | Spring Boot | Maximum time to write pending logs when the app shuts down. |
