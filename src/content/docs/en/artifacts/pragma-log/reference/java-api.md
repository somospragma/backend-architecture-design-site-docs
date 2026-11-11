---
title: Java API
description: Public annotations, interfaces and classes of pragma-log.
sidebar:
  order: 53
---

All of them are in `pragma-log-core`, which comes with any module. The base package is `co.com.pragma.logging.core`.

## Annotations

### `@MaskedLogField`

```java
import co.com.pragma.logging.core.masking.MaskedLogField;
```

Masks a field, a record component or, on a class, each of its fields. Read [How to mask sensitive data](../../guides/masking/).

| Attribute | Type | Default | What it is |
|---|---|---|---|
| `type` | `MaskType` | `FULL` | Mask type. |
| `length` | `int` | `-1` (uses `masking.default-length`) | Visible or masked characters, depending on the type. |
| `strategy` | `String` | `""` | Name of the registered strategy, with `type = MaskType.CUSTOM`. |

### `MaskType`

```java
import co.com.pragma.logging.core.masking.MaskType;
```

| Value | What it does |
|---|---|
| `FULL` | Replaces the whole value. |
| `PREFIX` | Masks the start; leaves the last characters visible. |
| `SUFFIX` | Leaves the start visible; masks the end. |
| `MIDDLE` | Leaves `length` characters visible on each side. |
| `HIDDEN` | Removes the field from the log. |
| `CUSTOM` | Uses the strategy from `strategy`. |

### `@LogEnrichment`

```java
import co.com.pragma.logging.core.enrich.LogEnrichment;
```

On a class or a method of a Spring or CDI bean. Adds fixed fields to every log written while the method runs. `value` is a list of `name=value`. On the class, it applies to all its methods and subclasses inherit it. Read [How to enrich logs](../../guides/enrichment/#add-fields-to-a-method).

### `@LogField`

```java
import co.com.pragma.logging.core.enrich.LogField;
```

On a parameter of a method of a Spring or CDI bean. Adds the parameter value to the method's logs, with the name from `value`. Objects come out as masked JSON.

## Interfaces to extend

### `MaskingStrategy`

```java
import co.com.pragma.logging.core.masking.MaskingStrategy;

String mask(String value, char maskChar, int length);
```

Your own mask. It receives the value as text, the mask character and the length from the annotation. You register it by name in `masking.strategies`.

### `LogEnricher`

```java
import co.com.pragma.logging.core.enrich.LogEnricher;

void enrich(EnrichedEvent event);
```

Adds fields to every log. `EnrichedEvent` has:

| Method | What it does |
|---|---|
| `logger()` | Logger name of the log. |
| `level()` | Log level. |
| `put(String name, Object value)` | Adds a field. Objects come out as masked JSON. |

### `LogAlertListener`

```java
import co.com.pragma.logging.core.alert.LogAlertListener;
```

Receives the alerts. Its three methods have an empty default implementation:

| Method | Receives |
|---|---|
| `onLargeLog(LargeLogAlert alert)` | `logger()`, `level()`, `sizeBytes()`, `maxBytes()` |
| `onMaskingError(MaskingErrorAlert alert)` | `logger()`, `error()` |
| `onMissingFields(MissingFieldsAlert alert)` | `logger()`, `level()`, `fields()` |

### `LogEventFormatter`

```java
import co.com.pragma.logging.core.format.LogEventFormatter;

String format(Map<String, Object> event);
default String header() { return null; }
```

Your own output format, for `format: custom`. `format` receives the fields already masked and ordered, and returns the log text ending in a line break. `header` returns a line for the start of each file, or `null`. It must be thread-safe.

## Registration in code

For apps without a bean container, or to register in tests:

| Method | What it does |
|---|---|
| `LogEnrichers.register(LogEnricher)` | Registers an enricher. |
| `LogEnrichers.unregister(LogEnricher)` | Removes it. |
| `LogAlerts.register(LogAlertListener)` | Registers an alert listener. |
| `LogAlerts.unregister(LogAlertListener)` | Removes it. |

`LogEnrichers` is in `co.com.pragma.logging.core.enrich` and `LogAlerts` in `co.com.pragma.logging.core.alert`.

## Spring Boot

### `PragmaLogReloader`

```java
import co.com.pragma.logging.spring.PragmaLogReloader;
```

Bean that reads `pragma.log.*` again and applies the changes. It's called automatically on each `EnvironmentChangeEvent`; call `reload()` if you change the `Environment` some other way. Read [How to change configuration at runtime](../../guides/hot-reload/).
