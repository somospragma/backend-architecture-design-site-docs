---
title: Redis
description: The redis adapter of generateOutputAdapter, with Spring Data Redis and Lettuce.
sidebar:
  order: 2
---

Stores and reads data in Redis with Spring Data Redis: `ReactiveRedisTemplate` in reactive and `RedisTemplate` with Lettuce in imperative. Values are stored as JSON. Use it as a cache or for short-lived data you read by key.

## How to generate it

```bash
./gradlew generateOutputAdapter --name=Order --entity=Order --type=redis
```

## What it generates

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>Adapter`, `config/<Name>RedisConfig`, `entity/<Entity>Entity`, `mapper/<Entity>EntityMapper` | The same |
| Package | `infrastructure.drivenadapters.<name>redis` | `infrastructure.drivenadapters.<name>redis` |

- The adapter comes with `save(id, entity)`, `findById`, `findAll`, `deleteById` and `existsById`, on `Object`. In imperative, also `deleteAll`.
- `<Name>RedisConfig` creates the template with `String` keys and values serialized with `JacksonJsonRedisSerializer`.

## Dependencies

| Reactive | Imperative |
|---|---|
| `spring-boot-starter-data-redis-reactive`, `spring-boot-starter-jackson` | `spring-boot-starter-data-redis`, `spring-boot-starter-jackson`, `lettuce-core` |

For tests it adds `embedded-redis`. Since that library brings old Guava and commons-io versions with known vulnerabilities, the adapter adds a rule to `build.gradle.kts` that forces newer versions in every module.

## Configuration

```yaml
spring:
  redis:
    host: localhost
    port: 6379
    password: null
    timeout: 2000ms
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
        max-wait: -1ms
      shutdown-timeout: 100ms
logging:
  level:
    org.springframework.data.redis: DEBUG
```

## Notes

In imperative, `<Name>RedisConfig` creates `new LettuceConnectionFactory()` with no arguments, which connects to `localhost:6379`. To use another host, configure it in that class.

## Next

- [Driven adapters](../overview/).
- [How to generate entities, use cases and adapters](../../guides/generate-components/).
