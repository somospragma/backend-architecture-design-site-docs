---
title: Logback
description: Properties of PragmaStructuredEncoder, PragmaTextEncoder and PragmaAsyncAppender in logback.xml.
sidebar:
  order: 51
---

These classes belong to `pragma-log-logback`. You use them in `logback.xml` in Java apps without Spring Boot or Quarkus. Each property is an element inside the encoder or the appender.

Properties marked as **repeatable** are written once per value. Lists in a single element are comma-separated.

## `PragmaStructuredEncoder`

```xml
<encoder class="co.com.pragma.logging.logback.PragmaStructuredEncoder">
  <appName>orders-service</appName>
</encoder>
```

Writes JSON, XML, CSV or your own format. `PragmaJsonEncoder` is an alias kept for compatibility.

### Format

| Property | Default | What it does |
|---|---|---|
| `format` | `json` | `json`, `xml`, `csv` or `custom`. |
| `pretty` | `false` | Indented JSON. |
| `csvColumns` | `timestamp,level,logger,thread,message` | CSV columns. |
| `csvDelimiter` | `,` | CSV separator. |
| `csvHeader` | `false` | Writes the column names at the start of the file. |
| `customFormatter` | — | Class that implements `LogEventFormatter`. |
| `timestampPattern` | `[ISO_OFFSET_DATE_TIME]` | `DateTimeFormatter` pattern or a constant in brackets. |
| `timeZone` | The system zone | Time zone of the timestamp. |

### Fields

| Property | Default | What it does |
|---|---|---|
| `appName` | — | Value of the `app` field. |
| `appVersion` | — | Value of the `version` field. With no value, it doesn't come out. |
| `includeHost` | `true` | Adds the `host` field. |
| `includePid` | `false` | Adds the `pid` field. |
| `field` | — | Fixed field, such as `env=prod`. **Repeatable.** |
| `hideFields` | — | Fields that don't come out. |
| `renameField` | — | Renamed field, such as `level=severity` or `requestId=$.http.request.id`. **Repeatable.** |
| `fieldOrder` | — | Fields that go first, in that order. |
| `requiredFields` | — | Fields that every log must have. |
| `requiredPlaceholder` | `unknown` | Value of a missing required field. |
| `extraField` | — | Object that groups the MDC and the key-values. |
| `maxFieldLength` | `0` | Maximum characters of the message and of each text. `0` doesn't cut. |
| `enricher` | — | Class that implements `LogEnricher`. **Repeatable.** |

### Masking

| Property | Default | What it does |
|---|---|---|
| `maskingEnabled` | `true` | Turns masking on. |
| `maskCharacter` | `*` | Mask character. |
| `maskDefaultType` | `FULL` | Type for fields masked by name. |
| `maskDefaultLength` | `4` | Length when the annotation doesn't set it. |
| `maskFields` | The [default list](../configuration/#masking) | Names that are masked without an annotation. Replaces the default list. |
| `maskMaxDepth` | `10` | Maximum depth of nested objects. |
| `maskStrategy` | — | Your own strategy, such as `iban=com.acme.IbanMasking`. **Repeatable.** |
| `maskPattern` | — | `CARD`, `EMAIL`, `JWT` or a regex. **Repeatable.** |

### Stack trace

| Property | Default | What it does |
|---|---|---|
| `includeStacktrace` | `true` | Writes the stack trace. The `error` summary always comes out. |
| `stacktraceMaxDepth` | `50` | Frames for each exception in the chain. |
| `stacktraceMaxLength` | `16384` | Maximum characters of the whole stack trace. |
| `stacktraceRootCauseFirst` | `false` | Writes the root cause first. |

### Alerts

| Property | Default | What it does |
|---|---|---|
| `maxLogSize` | `0` | Size in bytes from which a log raises an alert. `0` doesn't alert. |
| `truncateLargeLogs` | `false` | Cuts logs larger than `maxLogSize`. |
| `alertConsole` | `true` | Writes the alerts to the error output. |
| `alertListener` | — | Class that implements `LogAlertListener`. **Repeatable.** |

## `PragmaTextEncoder`

```xml
<encoder class="co.com.pragma.logging.logback.PragmaTextEncoder">
  <color>AUTO</color>
</encoder>
```

Writes readable text with the same masking. It accepts the masking, stack trace and alert properties (without `truncateLargeLogs`), `maxFieldLength`, `enricher`, `hideFields`, `timestampPattern` and `timeZone`, plus these:

| Property | Default | What it does |
|---|---|---|
| `color` | `AUTO` | `AUTO` (only in a terminal and without `NO_COLOR`), `ALWAYS` or `NEVER`. Use `NEVER` in file appenders. |
| `levelColor` | `ERROR=red`, `WARN=yellow`, `INFO=green`, `DEBUG=cyan`, `TRACE=faint` | Color of a level, by name or hex: `INFO=blue`, `WARN=#ff8800`. **Repeatable.** |
| `timestampPattern` | `yyyy-MM-dd HH:mm:ss.SSS` | Timestamp pattern in text. |

## `PragmaAsyncAppender`

```xml
<appender name="ASYNC" class="co.com.pragma.logging.logback.PragmaAsyncAppender">
  <appender-ref ref="CONSOLE"/>
</appender>
```

Writes the logs on another thread without discarding any. It inherits the properties of Logback's `AsyncAppender` with safe default values:

| Property | Default | What it does |
|---|---|---|
| `queueSize` | `8192` | Logs that can wait to be written. |
| `discardingThreshold` | `0` | Doesn't discard logs when the queue fills up. |
| `neverBlock` | `false` | `true` discards instead of making the caller wait. |
| `maxFlushTime` | `5000` | Milliseconds to write pending logs at shutdown. |
| `appender-ref` | — | The real appender. Required. |

Add `<shutdownHook/>` inside `<configuration>`: without it, pending logs are lost when the app ends.
