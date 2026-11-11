---
title: How much each log costs
description: The measured cost of pragma-log per event, where it comes from and how to reduce it.
sidebar:
  order: 41
---

pragma-log does more work per log than a common JSON encoder: it walks the objects to mask them and checks the sensitive names. This page shows how much that costs and when it matters.

## What was measured

The repository's JMH benchmarks measure only the encoding of an event, without writing it: the cost the library adds to each log. They were compared against `logstash-logback-encoder`, a widely used JSON encoder.

| Scenario | logstash-logback-encoder | pragma-log | Difference |
|---|---|---|---|
| Simple message with MDC | 383 ns | 565 ns | 1.5× |
| Object in `{}` (4-field record) | 454 ns | 1,343 ns | 3.0× |
| Object as a key-value | — | 1,474 ns | — |

Measured on an Apple M4 with OpenJDK 21, average per event. The comparison with objects isn't equivalent: logstash-logback-encoder uses the object's `toString()` and masks nothing; pragma-log converts it to JSON and applies masking.

## What it means for your service

- The fixed cost, about 180 ns per log, comes from checking the sensitive names in the MDC and writing the fixed fields.
- Masking an object costs about 800 ns more. There is no safe way to log an object without walking it.
- 1.5 µs per log equals about 0.15 % of a core for a service that writes 1,000 logs per second.

For most services the difference isn't noticeable next to the cost of writing the log to the console or to a file.

## How to reduce the cost

- **Use [asynchronous logging](../async/)** if logging shows up in your profiles: the thread that handles the request doesn't wait for masking or writing.
- **Keep the list of [patterns](../masking/#find-data-inside-text-with-patterns) short.** Each pattern scans the text of every log.
- **Log only what you need.** A large object costs more than its two relevant fields as key-values.
- **Turn on HTTP bodies only where you need them.** They are the largest objects that go through masking.

## Measure it yourself

The benchmarks are in the [repository](https://github.com/somospragma/pragma-log-lib/tree/main/benchmarks):

```bash
./gradlew :benchmarks:jmh
```

For a quick run filtered by name:

```bash
./gradlew :benchmarks:jmh -PjmhArgs="-wi 1 -i 2 -f 1 Masked"
```
