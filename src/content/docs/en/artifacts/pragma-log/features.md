---
title: Features
description: Everything pragma-log does, which framework it works in and where it's documented.
sidebar:
  order: 3
---

This page lists every feature of pragma-log `1.0.0`, grouped by topic. Each row says which integration it works in and links to the page that explains how to use it.

**Spring** is the Spring Boot 3.5 and 4.x starter (MVC and WebFlux). **Quarkus** is the extension for Quarkus 3.33 or later. **Java** is `logback.xml` without a framework. ✓ works; — doesn't apply to that integration.

To see all the options together in one file, read the complete configuration for [Spring Boot](../reference/example-spring-boot/), [Quarkus](../reference/example-quarkus/) or [Java with Logback](../reference/example-logback/).

## Formats

| Feature | Spring | Quarkus | Java | Where |
|---|---|---|---|---|
| One-line JSON per log | ✓ | ✓ | ✓ | [Formats](../guides/formats/#json) |
| Indented JSON (`json.pretty`) | ✓ | ✓ | ✓ | [Formats](../guides/formats/#json) |
| XML | ✓ | ✓ | ✓ | [Formats](../guides/formats/#xml) |
| CSV with columns and delimiter | ✓ | ✓ | ✓ | [Formats](../guides/formats/#csv) |
| CSV header | — | ✓ | ✓ | [Formats](../guides/formats/#csv) |
| Your own format (`LogEventFormatter`) | ✓ | ✓ | ✓ | [Formats](../guides/formats/#your-own-format) |
| Plain text with the same masking | ✓ | ✓ | ✓ | [Plain text](../guides/formats/#plain-text-for-local-development) |
| ANSI colors per level, by name or hex | ✓ | ✓ | ✓ | [Colors](../guides/formats/#colors) |
| Different format per environment | ✓ | ✓ | ✓ | [Spring Boot](../guides/spring-boot/#use-different-formats-per-environment), [Quarkus](../guides/quarkus/#use-readable-text-in-dev-mode) |
| Timestamp pattern and time zone | ✓ | ✓ | ✓ | [Fields](../guides/fields/#change-the-timestamp-format) |

## Fields

| Feature | Spring | Quarkus | Java | Where |
|---|---|---|---|---|
| Standard fields: `timestamp`, `level`, `logger`, `thread`, `message` | ✓ | ✓ | ✓ | [Output fields](../reference/output-fields/) |
| `app`, `version`, `host` and `pid` | ✓ | ✓ | ✓ | [Identify the app](../guides/fields/#identify-the-app) |
| Fixed fields (`env`, `team`…) | ✓ | ✓ | ✓ | [Fixed fields](../guides/fields/#add-fixed-fields) |
| MDC and key-values as fields | ✓ | ✓ | ✓ | [Enrich](../guides/enrichment/#add-fields-to-one-log) |
| Objects as fields, masked | ✓ | ✓ | ✓ | [Enrich](../guides/enrichment/#add-fields-to-one-log) |
| Hide fields | ✓ | ✓ | ✓ | [Hide](../guides/fields/#hide-fields) |
| Rename fields | ✓ | ✓ | ✓ | [Rename](../guides/fields/#rename-fields) |
| Nest fields (`$.a.b`) | ✓ | ✓ | ✓ | [Nest](../guides/fields/#nest-fields-in-objects) |
| Order fields | ✓ | ✓ | ✓ | [Order](../guides/fields/#order-the-fields) |
| Required fields with a default value and an alert | ✓ | ✓ | ✓ | [Required](../guides/fields/#require-fields) |
| `extra` object for the MDC and key-values | ✓ | ✓ | ✓ | [Extra](../guides/fields/#group-the-context-in-an-extra-object) |
| Cutting long texts | ✓ | ✓ | ✓ | [Cut](../guides/fields/#cut-long-texts) |
| No log without a message | ✓ | ✓ | ✓ | [Exceptions](../guides/exceptions/#no-log-goes-out-without-a-message) |

## Exceptions

| Feature | Spring | Quarkus | Java | Where |
|---|---|---|---|---|
| `error` summary: type, message and root cause | ✓ | ✓ | ✓ | [Exceptions](../guides/exceptions/#the-error-summary) |
| Optional stack trace | ✓ | ✓ | ✓ | [Bound the stack trace](../guides/exceptions/#bound-the-stack-trace) |
| Frame and length limits | ✓ | ✓ | ✓ | [Bound the stack trace](../guides/exceptions/#bound-the-stack-trace) |
| Root cause first | ✓ | ✓ | ✓ | [Bound the stack trace](../guides/exceptions/#bound-the-stack-trace) |

## Masking

| Feature | Spring | Quarkus | Java | Where |
|---|---|---|---|---|
| `@MaskedLogField` on any type, inheritance and records | ✓ | ✓ | ✓ | [Annotation](../guides/masking/#mark-fields-with-maskedlogfield) |
| `@MaskedLogField` on a whole class | ✓ | ✓ | ✓ | [Whole class](../guides/masking/#mask-a-whole-class) |
| `FULL`, `PREFIX`, `SUFFIX`, `MIDDLE`, `HIDDEN` and `CUSTOM` types | ✓ | ✓ | ✓ | [Types](../guides/masking/#choose-the-mask-type) |
| Configurable character and length | ✓ | ✓ | ✓ | [Tune masking](../guides/masking/#tune-masking) |
| Your own strategies (`MaskingStrategy`) | ✓ | ✓ | ✓ | [Your own strategy](../guides/masking/#create-your-own-strategy) |
| Masking by field name, at any depth | ✓ | ✓ | ✓ | [By name](../guides/masking/#mask-by-field-name) |
| Masking by patterns: `CARD` (Luhn), `EMAIL`, `JWT`, regex | ✓ | ✓ | ✓ | [Patterns](../guides/masking/#find-data-inside-text-with-patterns) |
| Masking in the MDC, key-values, headers and bodies | ✓ | ✓ | ✓ | [Masking](../guides/masking/) |
| No `toString()` and no changes to the object | ✓ | ✓ | ✓ | [Masking](../guides/masking/) |
| Circular references and maximum depth | ✓ | ✓ | ✓ | [Tune masking](../guides/masking/#tune-masking) |
| If masking fails, the log goes out without data and with `pragmaLogError` | ✓ | ✓ | ✓ | [If masking fails](../guides/masking/#what-happens-if-masking-fails) |

## HTTP context

| Feature | Spring | Quarkus | Java | Where |
|---|---|---|---|---|
| `requestId` from the header or generated, validated and returned | ✓ | ✓ | — | [requestId](../guides/http-context/#the-requestid) |
| Request method and path | ✓ | ✓ | — | [HTTP context](../guides/http-context/#what-goes-in-each-request-log) |
| `traceId` and `spanId` | ✓ | ✓ | — | [HTTP context](../guides/http-context/#what-goes-in-each-request-log) |
| Request end log with status and duration | ✓ | ✓ | — | [End log](../guides/http-context/#the-request-end-log) |
| Request start log | ✓ | ✓ | — | [End log](../guides/http-context/#the-request-end-log) |
| Paths excluded from request logs | ✓ | ✓ | — | [End log](../guides/http-context/#the-request-end-log) |
| Headers with an allow list, or `*` with a deny list | ✓ | ✓ | — | [Headers](../guides/http-context/#add-headers) |
| Query params as fields | ✓ | ✓ | — | [Query params](../guides/http-context/#add-query-params) |
| Body capture, masked | ✓ | ✓ | — | [Bodies](../guides/http-context/#capture-the-bodies) |
| Context in reactive code (WebFlux, Mutiny) | ✓ | ✓ | — | [Spring Boot](../guides/spring-boot/#use-your-own-context-in-webflux), [Quarkus](../guides/quarkus/#what-you-get-without-configuring-anything) |
| Context cleanup at the end, with no leaks between requests | ✓ | ✓ | — | [HTTP context](../guides/http-context/) |

In Java without a web framework, put the context in the MDC. [Java with Logback](../guides/plain-java/#log-with-slf4j) explains how.

## Enrichment

| Feature | Spring | Quarkus | Java | Where |
|---|---|---|---|---|
| `LogEnricher` for every log | ✓ | ✓ | ✓ | [Enrichers](../guides/enrichment/#add-fields-to-every-log) |
| Enrichers as beans | ✓ | ✓ | — | [Enrichers](../guides/enrichment/#add-fields-to-every-log) |
| `@LogEnrichment` and `@LogField`, also with `Mono`, `Flux` and `Uni` | ✓ | ✓ | — | [Per method](../guides/enrichment/#add-fields-to-a-method) |
| Reactor Context keys (`context-keys`) | ✓ | — | — | [Reactor Context](../guides/enrichment/#use-the-reactor-context-in-webflux) |

## Alerts

| Feature | Spring | Quarkus | Java | Where |
|---|---|---|---|---|
| Alert by log size | ✓ | ✓ | ✓ | [Size](../guides/alerts/#get-a-warning-when-a-log-is-too-big) |
| Cutting the log when it goes over the maximum size | ✓ | ✓ | ✓ | [Cut](../guides/alerts/#cut-the-logs-that-go-over) |
| Alerts in the console | ✓ | ✓ | ✓ | [Console](../guides/alerts/#see-the-alerts-in-the-console) |
| Your own listeners: `onLargeLog`, `onMaskingError`, `onMissingFields` | ✓ | ✓ | ✓ | [Listeners](../guides/alerts/#send-the-alerts-to-a-metric-or-a-notification) |

## Configuration

| Feature | Spring | Quarkus | Java | Where |
|---|---|---|---|---|
| Works without configuring anything | ✓ | ✓ | — | [Quick start](../quick-start/) |
| Configuration in `application.yml` with autocomplete | ✓ | — | — | [Spring Boot](../guides/spring-boot/#configure-with-applicationyml) |
| Configuration in `application.properties` | ✓ | ✓ | — | [Quarkus](../guides/quarkus/#configure-with-applicationproperties) |
| Configuration in `logback.xml` | — | — | ✓ | [Java with Logback](../guides/plain-java/#configure-logbackxml) |
| Environment variables in the configuration | ✓ | ✓ | ✓ | [Fixed fields](../guides/fields/#add-fixed-fields) |
| An invalid configuration stops startup | ✓ | ✓ | — | [Spring Boot](../guides/spring-boot/#configure-with-applicationyml) |
| Configuration changes without restarting | ✓ | — | ✓ | [At runtime](../guides/hot-reload/) |
| Warnings for inconsistent configurations | ✓ | ✓ | ✓ | [Warnings](../guides/hot-reload/#configuration-warnings) |

## Performance and operations

| Feature | Spring | Quarkus | Java | Where |
|---|---|---|---|---|
| Asynchronous logging that doesn't lose logs | ✓ | ✓ | ✓ | [Asynchronous](../guides/async/) |
| Native mode (GraalVM, Mandrel) | — | ✓ | — | [Quarkus](../guides/quarkus/#compile-in-native-mode) |
| Benchmarks of the cost per log | ✓ | ✓ | ✓ | [Performance](../guides/performance/) |
| Elastic, Datadog and OpenTelemetry names | ✓ | ✓ | ✓ | [Observability](../guides/observability/) |

## What pragma-log doesn't include

| What | Alternative |
|---|---|
| Spring Security authenticated user as a field | Put it in the MDC or use a [`LogEnricher`](../guides/enrichment/#add-fields-to-every-log). |
| Micronaut and Vert.x without Quarkus | There is no integration. You can use `pragma-log-logback` with a `logback.xml`, without automatic HTTP context. |
| Spring without Spring Boot | There is no integration. Use `pragma-log-logback` with a `logback.xml`. |
| Log4j 2 as the backend | There is no integration. pragma-log works on top of Logback and JBoss LogManager. |
| A logger of its own (`PragmaLogger`) | Use SLF4J. Objects are masked all the same. |
| A configuration file of its own | The configuration goes in `application.yml`, `application.properties` or `logback.xml`. |
