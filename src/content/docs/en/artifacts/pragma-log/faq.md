---
title: FAQ
description: Common questions when using pragma-log.
sidebar:
  order: 90
---

## Do I have to change how I write logs?

No. You keep using SLF4J (`LoggerFactory.getLogger(...)`, `log.info(...)`). In Quarkus, JBoss Logging (`Log.infof(...)`) also works. pragma-log has no logger of its own.

## Do I need a `logback-spring.xml`?

Not in Spring Boot or Quarkus: the library configures logging on its own. If you already have a `logback-spring.xml` with your own appenders, check that it doesn't replace the Spring Boot ones, or use `PragmaStructuredEncoder` in them. In plain Java you do need `logback.xml`.

## I log an object and it comes out as `<ClassName>`. Why?

It happens in Quarkus in native mode: the class isn't registered for reflection and its fields can't be read. Add `@RegisterForReflection` to it. Classes with `@MaskedLogField` are registered automatically.

## Why didn't a field with sensitive data come out masked?

Check in this order:

1. Whether the field has `@MaskedLogField` or its name is in [`masking.fields`](../guides/masking/#mask-by-field-name). If you defined `masking.fields`, that list replaces the default one.
2. Whether the data is inside a text (`"card " + number`). There, only [patterns](../guides/masking/#find-data-inside-text-with-patterns) find it.
3. Whether `masking.enabled` is `false`.
4. Whether you wrote the data into the message with concatenation instead of `{}`: `log.info("Customer " + customer)` calls your class's `toString()` before pragma-log sees it. Use `log.info("Customer {}", customer)`.

## Does masking make logging slower?

Turning an object into masked JSON costs more than a `toString()`, and each pattern scans the text of every log. For most services you won't notice. If logging shows up in your profiles, use [asynchronous logging](../guides/async/) and keep the list of patterns short.

## Can I see the logs as text locally?

Yes, with `format: plain` in a local profile. The masking is the same. Read [Plain text for local development](../guides/formats/#plain-text-for-local-development).

## Why doesn't the end-of-request log appear?

- The path is in `http.request-log.exclude-paths` (by default `/actuator/**` in Spring Boot and `/q/**` in Quarkus).
- `http.request-log.enabled` or `http.enabled` is `false`.
- The level of the `co.com.pragma.logging.http` logger is above `INFO`.

## Why don't `traceId` and `spanId` come out?

pragma-log doesn't create traces: it takes them from Micrometer Tracing in Spring Boot (add `micrometer-tracing-bridge-brave` or `micrometer-tracing-bridge-otel`) or from OpenTelemetry in Quarkus (`quarkus-opentelemetry`). If your app has no traces, those fields don't come out.

## Does it work with Log4j 2?

No. pragma-log works on top of Logback (Spring Boot and plain Java) and on top of JBoss LogManager (Quarkus). If your app uses `spring-boot-starter-log4j2`, switch to Logback, which is the default in Spring Boot.

## Does it work in Kubernetes?

Yes. The `host` field takes the `HOSTNAME` variable, which in Kubernetes is the pod name. Writing JSON to the console is what Kubernetes collectors such as Fluent Bit or the OpenTelemetry collector expect.

## How do I add more than one module with the same version?

Use the BOM:

```kotlin
dependencies {
    implementation(platform("co.com.pragma.logging:pragma-log-bom:1.0.0"))
    implementation("co.com.pragma.logging:pragma-log-spring-boot-starter")
}
```

## Where do I report a bug or request a feature?

In the [repository issues](https://github.com/somospragma/pragma-log-lib/issues). Include the pragma-log version, the framework and its version, the configuration and the log you expected to see.
