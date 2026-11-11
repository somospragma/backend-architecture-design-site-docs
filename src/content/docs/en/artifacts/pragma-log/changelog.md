---
title: Changelog
description: Changes in each pragma-log version, newest first.
sidebar:
  order: 99
---

pragma-log follows [semantic versioning](https://semver.org/). The full detail is in the [repository CHANGELOG](https://github.com/somospragma/pragma-log-lib/blob/main/CHANGELOG.md).

## 1.0.0 — 2026-11-11

First version published to Maven Central, with the group `co.com.pragma.logging` and the Apache 2.0 license. It is a complete rewrite of the previous internal library.

### Added

- **Integrations:** Spring Boot 3.5 and 4.x (MVC and WebFlux), Quarkus 3.33 or later (also in native mode) and Java with Logback.
- **Formats:** compact or indented JSON, XML, CSV, your own formats with `LogEventFormatter` and plain text with colors for local use.
- **Fields:** fixed fields; hide, rename, nest (`$.a.b`) and order fields; required fields with a default value; `extra` object; timestamp pattern and zone; cutting of long texts.
- **Masking:** `@MaskedLogField` on fields, records and classes, with types `FULL`, `PREFIX`, `SUFFIX`, `MIDDLE`, `HIDDEN` and `CUSTOM`; masking by name at any depth; `CARD` (with Luhn), `EMAIL`, `JWT` patterns and your own regexes.
- **HTTP context:** `requestId` validated against injection, method, path, status and duration; `traceId` and `spanId`; headers with an allowlist or `*` with a denylist; query params; request start and end logs; optional capture of bodies, masked.
- **Enrichment:** `LogEnricher`, `@LogEnrichment`, `@LogField` and Reactor Context keys.
- **Alerts:** for size, masking failure and missing fields, with your own listeners and optional cutting of large logs.
- **Operation:** configuration changes at runtime in Spring Boot and Logback, warnings for inconsistent configurations and asynchronous logging that doesn't lose logs.

### If you came from the previous internal library

**Breaking change.** There is no automatic upgrade path:

- `PragmaLogger` no longer exists: use SLF4J (`LoggerFactory.getLogger(...)`). Objects are masked the same way.
- The `pragma-log-config.yml` file no longer exists: the configuration goes in `application.yml`, `application.properties` or `logback.xml`, with the `pragma.log` prefix.
- `@DeepMasking` is no longer needed: masking always walks nested objects.
- The `extra` object is no longer automatic: turn it on with `extra-field: extra`.
- The jar no longer ships a `logback.xml`. In Spring Boot and Quarkus you don't need one; in plain Java, use `PragmaStructuredEncoder` in your `logback.xml`.
