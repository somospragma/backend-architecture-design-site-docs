---
title: Output fields
description: Every field pragma-log can write, when it comes out and in what order.
sidebar:
  order: 52
---

Each log is an object with these fields, in this order. A field with no value isn't written. You can [hide, rename, nest and order](../../guides/fields/) any of them.

## Standard fields

| Field | Type | When it comes out | What it is |
|---|---|---|---|
| `timestamp` | text | Always | Date and time of the log, with the configured [pattern and zone](../../guides/fields/#change-the-timestamp-format). |
| `level` | text | Always | `ERROR`, `WARN`, `INFO`, `DEBUG` or `TRACE`. |
| `logger` | text | Always | Logger name, usually the class. |
| `thread` | text | Always | Thread that wrote the log. |
| `message` | text | Always | Message with the `{}` arguments already masked. Never empty. |

## Context

After the standard fields come, in this order:

1. The fields from [enrichers](../../guides/enrichment/#add-fields-to-every-log).
2. The MDC fields, including those from the [HTTP context](../../guides/http-context/) (`requestId`, `http.method`, `http.path`, `http.header.*`, `http.query.*`), `traceId`, `spanId` and those from `@LogEnrichment` and `@LogField`.
3. The log's key-values (`addKeyValue`).

If two have the same name, the one that comes later wins: a key-value wins over the MDC, and the MDC over an enricher.

With `extra-field`, these fields go inside that object.

## Identification

| Field | When it comes out | What it is |
|---|---|---|
| `app` | If there is an app name | App name. |
| `version` | If there is a version | App version. |
| `host` | `include-host: true` (default) | `HOSTNAME` or the machine name. |
| `pid` | `include-pid: true` | Process id. |
| Fixed fields | If you configure them in `fields` | Same value in every log. |

## Exceptions

| Field | When it comes out | What it is |
|---|---|---|
| `error.type` | With an exception | Exception class. |
| `error.message` | With an exception that has a message | Message, masked. |
| `error.rootCause` | With an exception that has a cause | Root cause, as `Class: message`. |
| `stacktrace` | With an exception and `stacktrace.include: true` | Bounded stack trace, masked. |

## End-of-request log

Only in the log that the `co.com.pragma.logging.http` logger writes when each request ends:

| Field | Type | What it is |
|---|---|---|
| `http.status` | number | Response status. |
| `http.durationMs` | number | Request duration in milliseconds. |
| `http.request.body` | object or text | Request body, if `http.body.enabled: true`. |
| `http.response.body` | object or text | Response body, if `http.body.enabled: true`. |

## Control fields

| Field | When it comes out | What it means |
|---|---|---|
| `truncated` | The log was cut by `alerts.truncate` | `true`. Search for this field to find incomplete logs. |
| `pragmaLogError` | Masking failed | The log was written without the arguments. The value is the class of the exception that prevented it. |
| A required field with `unknown` | A field from `required-fields` was missing | The value is `required-placeholder`. |
