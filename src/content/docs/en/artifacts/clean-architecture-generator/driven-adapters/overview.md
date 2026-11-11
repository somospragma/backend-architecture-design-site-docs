---
title: Driven adapters
description: The driven adapters generateOutputAdapter generates, what they have in common and which one to use.
sidebar:
  label: Overview
  order: 1
---

A driven adapter connects the domain to a database, a cache, another service or a queue. You generate it with:

```bash
./gradlew generateOutputAdapter --name=<Name> --entity=<Entity> --type=<type>
```

On these pages, `<Name>` is the value of `--name`, exactly as you type it, and `<name>` is that value in lowercase. `<Entity>` is the value of `--entity`.

## Summary

| `--type` | Reactive | Imperative | Page |
|---|---|---|---|
| `redis` | Spring Data Redis Reactive | Spring Data Redis with Lettuce | [Redis](../redis/) |
| `mongodb` | Spring Data MongoDB Reactive | Spring Data MongoDB | [MongoDB](../mongodb/) |
| `postgresql` | Spring Data R2DBC | Spring Data JPA with HikariCP | [PostgreSQL](../postgresql/) |
| `http-client` | `WebClient` | `RestClient` | [HTTP client](../http-client/) |
| `dynamodb` | AWS SDK v2 `DynamoDbAsyncClient` | AWS SDK v2 `DynamoDbClient` | [DynamoDB](../dynamodb/) |
| `sqs-producer` | AWS SDK v2 `SqsAsyncClient` | AWS SDK v2 `SqsClient` | [SQS producer](../sqs-producer/) |

If you don't pass `--type`, you get `redis`.

## What they all have

- **The gateway.** The adapter implements `I<Entity>Gateway`, in the ports package (`domain/ports`, or `domain/gateway` in onion). If it doesn't exist, it is created empty: add there the methods your use case needs.
- **The persistence entity.** `entity/<Entity>Entity.java`, separate from the domain entity. In MongoDB, PostgreSQL and reactive Redis it has the technology's annotations (`@Document`, `@Table`, `@RedisHash`); in the others it's a plain class with an `id`.
- **The mapper.** `mapper/<Entity>EntityMapper.java`, a MapStruct interface (`@Mapper(componentModel = "spring")`) between the two entities.
- **The configuration.** A class in `config/` and its properties in `application.yml`. If a key already exists, the project's value is kept.
- **The package.** `infrastructure.drivenadapters.<name><type>`, with the type without hyphens. With `--name=Order --type=http-client` you get `infrastructure.drivenadapters.orderhttpclient`.
- **The folder.** In `hexagonal-single`, `onion-single` and `hexagonal-multi`, the package goes inside the infrastructure code. In `hexagonal-multi-granular`, each adapter is its own module in `infrastructure/driven-adapters/<name>`.

## Tests

The `v1` templates don't generate test classes for the adapters; write them yourself. They do add each technology's test dependencies. Each page lists them.

## Next

- [How to generate entities, use cases and adapters](../../guides/generate-components/), with the order of work.
- [Entry points](../../entry-points/overview/).
