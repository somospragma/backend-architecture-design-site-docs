---
title: How to send logs to Elastic, Datadog or OpenTelemetry
description: Field mapping and ready-to-use configuration for Elastic (ECS), Datadog and OpenTelemetry.
sidebar:
  order: 40
---

pragma-log writes its own stable schema (`timestamp`, `level`, `app`…). Each observability platform expects other names to recognize the level, the service or the trace. With [`rename-fields`](../fields/#rename-fields) (and `$.a.b` to [nest](../fields/#nest-fields-in-objects)) the output follows each platform's schema, with no code.

## Field mapping

| pragma-log field | Elastic (ECS) | Datadog | OpenTelemetry (log data model) |
|---|---|---|---|
| `timestamp` | `@timestamp` | `timestamp` (or `date`) | `Timestamp` |
| `level` | `log.level` | `status` | `SeverityText` |
| `logger` | `log.logger` | `logger.name` | `InstrumentationScope.Name` |
| `thread` | `process.thread.name` | `logger.thread_name` | `thread.name` |
| `message` | `message` | `message` | `Body` |
| `app` | `service.name` | `service` | `service.name` (resource) |
| `version` | `service.version` | `version` | `service.version` (resource) |
| `host` | `host.name` | `host` | `host.name` (resource) |
| `pid` | `process.pid` | `pid` | `process.pid` (resource) |
| `env` (fixed field) | `service.environment` | `env` | `deployment.environment.name` |
| `error.type` | `error.type` | `error.kind` | `exception.type` |
| `error.message` | `error.message` | `error.message` | `exception.message` |
| `stacktrace` | `error.stack_trace` | `error.stack` | `exception.stacktrace` |
| `requestId` | `http.request.id` | `http.request_id` | `http.request.id` |
| `traceId` | `trace.id` | `dd.trace_id` (see note) | `TraceId` |
| `spanId` | `span.id` | `dd.span_id` (see note) | `SpanId` |
| `http.method` | `http.request.method` | `http.method` | `http.request.method` |
| `http.path` | `url.path` | `http.url_details.path` | `url.path` |
| `http.status` | `http.response.status_code` | `http.status_code` | `http.response.status_code` |
| `http.durationMs` | `event.duration` (in ns, see note) | `duration` (in ns, see note) | `http.server.request.duration` (metric) |
| `http.header.<name>` | `http.request.headers.<name>` | `http.headers.<name>` | `http.request.header.<name>` |
| `http.request.body` | `http.request.body.content` | `http.request.body` | `http.request.body` |
| `http.response.body` | `http.response.body.content` | `http.response.body` | `http.response.body` |

Notes:

- **Duration:** ECS and Datadog expect the duration in nanoseconds; pragma-log gives it in milliseconds (`http.durationMs`). If you rename the field, convert it in the ingestion pipeline or search for it by its original name.
- **Traces in Datadog:** Micrometer Tracing writes 128-bit hexadecimal IDs (W3C). Datadog links logs and traces with `dd.trace_id` as a 64-bit decimal, unless the agent is configured for W3C IDs (`DD_TRACE_128_BIT_TRACEID_LOGGING_ENABLED=true`, the default in recent agents). With the current agent, renaming is enough.
- **OpenTelemetry:** the names in the table are those of the log data model; if you send JSON to a collector, use the `filelog` receiver with a `json_parser` operator and map `level` to `severity`. The resource fields (`service.name`, `host.name`) are usually set by the collector or the SDK.
- **Fields with no equivalent** (`error.rootCause`, `http.query.*`, your own fields): they keep their name and are just as searchable.
- **Nested fields** (`$.log.level`) and names with dots (`log.level`) are the same for Elasticsearch and Datadog; use `$.` when the field must go inside an object that already exists, like `stacktrace` inside `error`.

## Configure Elastic (ECS)

```yaml
pragma:
  log:
    rename-fields:
      timestamp: "@timestamp"
      level: log.level
      logger: log.logger
      thread: process.thread.name
      app: service.name
      version: service.version
      host: host.name
      pid: process.pid
      env: service.environment
      stacktrace: $.error.stack_trace      # inside the error object, next to type and message
      requestId: http.request.id
      traceId: trace.id
      spanId: span.id
      http.method: http.request.method
      http.path: url.path
      http.status: http.response.status_code
    fields:
      env: prod
    timestamp:
      pattern: "[ISO_INSTANT]"             # ECS recommends UTC
      zone: UTC
```

The log looks like this:

```json
{"@timestamp":"2026-11-10T15:04:05.123Z","log.level":"ERROR","log.logger":"com.acme.Orders","message":"Payment failed","service.name":"orders","service.environment":"prod","http.request.id":"req-7","trace.id":"4bf92f3577b34da6a3ce929d0e0e4736","error":{"type":"java.lang.IllegalStateException","message":"Gateway timeout","stack_trace":"java.lang.IllegalStateException: ..."}}
```

## Configure Datadog

```yaml
pragma:
  log:
    rename-fields:
      level: status
      logger: logger.name
      thread: logger.thread_name
      app: service
      stacktrace: $.error.stack
      requestId: http.request_id
      traceId: dd.trace_id
      spanId: dd.span_id
      http.path: http.url_details.path
      http.status: http.status_code
    fields:
      env: prod                            # Datadog uses "env" as is
```

The exception type stays in `error.type`; for Datadog to show it as `error.kind`, add a remapper in the logs pipeline or leave it as a searchable attribute.

## Configure OpenTelemetry

```yaml
pragma:
  log:
    rename-fields:
      level: severity_text
      app: service.name
      version: service.version
      host: host.name
      env: deployment.environment.name
      thread: thread.name
      stacktrace: exception.stacktrace
      traceId: trace_id
      spanId: span_id
      http.method: http.request.method
      http.path: url.path
      http.status: http.response.status_code
```

If the collector reads the log files, use the `filelog` receiver:

```yaml
receivers:
  filelog:
    include: [/var/log/app/*.log]
    operators:
      - type: json_parser
        timestamp: {parse_from: attributes.timestamp, layout_type: gotime, layout: "2006-01-02T15:04:05.999999999Z07:00"}
        severity: {parse_from: attributes.severity_text}
      - type: trace_parser
        trace_id: {parse_from: attributes.trace_id}
        span_id: {parse_from: attributes.span_id}
      - type: move
        from: attributes.message
        to: body
```

## Use the same mapping in Quarkus and logback.xml

The same keys work in `application.properties` (`pragma.log.rename-fields.http.method=http.request.method`) and in `logback.xml` (`<renameField>level=log.level</renameField>`, one per field). Names with dots work as they are, without brackets. The ECS mapping on this page is covered by a test in the library.
