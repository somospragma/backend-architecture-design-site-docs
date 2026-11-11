---
title: Scheduled task
description: The scheduled adapter of generateInputAdapter, a @Scheduled task that calls a use case.
sidebar:
  order: 6
---

Runs a use case periodically with Spring's `@Scheduled`. In reactive, the logic returns a `Mono`; in imperative, it's a synchronous method. Use it for periodic jobs: cleanups, syncs, reports.

## How to generate it

```bash
./gradlew generateInputAdapter --name=OrderCleanup --type=scheduled --useCase=CreateOrder
```

## What it generates

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>ScheduledTask`, `config/<Name>SchedulingConfig` | The same |
| Package | `infrastructure.entrypoints.<name>scheduled` | `infrastructure.entrypoints.<name>scheduled` |

- `<Name>ScheduledTask` receives the use case in its constructor. The call is left as a `TODO` in `execute` (in reactive, in `executeReactive`).
- `execute` has `@Scheduled(cron = "${scheduled.<name>.cron:0 */5 * * * *}")`. The class comes with two commented-out alternatives using `fixed-delay` and `fixed-rate`.
- `<Name>SchedulingConfig` turns on `@EnableScheduling`.

## Dependencies

| Reactive | Imperative |
|---|---|
| `spring-boot-starter`, `reactor-core` | `spring-boot-starter` |

For tests it adds `spring-boot-starter-test` and Awaitility and, in reactive, `reactor-test`.

## Configuration

With `--name=OrderCleanup`:

```yaml
scheduled:
  ordercleanup:
    cron: 0 */5 * * * *
    enabled: true
```

- `cron` uses Spring's six-field format (second, minute, hour, day, month, weekday). By default, every 5 minutes.
- The `v1` templates don't read `enabled`: the task runs even if you set it to `false`.

## Next

- [Entry points](../overview/).
- [How to generate entities, use cases and adapters](../../guides/generate-components/).
