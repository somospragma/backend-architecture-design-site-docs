---
title: Output adapters
description: The driven adapters generateOutputAdapter generates, their technology in each paradigm, their classes and their properties.
sidebar:
  order: 9
---

You generate them with `./gradlew generateOutputAdapter --name=<Name> --entity=<Entity> --type=<type>`. In the tables, `<Name>` is the value of `--name`. They all go in `infrastructure/driven-adapters/` and in the `infrastructure.drivenadapters.<name><type>` package.

## What they all have

- **The gateway.** The adapter implements `I<Entity>Gateway`, in the ports package (`domain/ports`, or `domain/gateway` in onion). If it doesn't exist, it is created empty: add there the methods your use case needs.
- **The persistence entity.** `entity/<Entity>Entity.java`, with the technology's annotations, separate from the domain entity.
- **The mapper.** `mapper/<Entity>EntityMapper.java`, with MapStruct, between the two entities.
- **The configuration.** A class in `config/` and its properties in `application.yml`.

## Summary

| `--type` | Reactive | Imperative |
|---|---|---|
| `redis` | Spring Data Redis Reactive | Spring Data Redis with Lettuce |
| `mongodb` | Spring Data MongoDB Reactive | Spring Data MongoDB |
| `postgresql` | Spring Data R2DBC | Spring Data JPA with HikariCP |
| `http-client` | `WebClient` | `RestClient` |
| `dynamodb` | AWS SDK v2 `DynamoDbAsyncClient` | AWS SDK v2 `DynamoDbClient` |
| `sqs-producer` | AWS SDK v2 `SqsAsyncClient` | AWS SDK v2 `SqsClient` |

## redis

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>Adapter`, `config/<Name>RedisConfig` | the same |
| Dependencies | `spring-boot-starter-data-redis-reactive`, `spring-boot-starter-jackson` | `spring-boot-starter-data-redis`, `spring-boot-starter-jackson`, `lettuce-core` |

Properties under `spring.redis`: `host`, `port` and the Lettuce pool.

## mongodb

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>Adapter`, `<Name>Repository`, `config/<Name>MongoConfig` | the same |
| Dependencies | `spring-boot-starter-data-mongodb-reactive` | `spring-boot-starter-data-mongodb` |

- The adapter comes with `save`, `findById`, `findAll`, `deleteById`, `existsById`, `count` and `deleteAll`.
- Properties: `spring.data.mongodb.uri` and `spring.data.mongodb.database`.

## postgresql

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>Adapter`, `<Name>Repository`, `config/<Name>R2dbcConfig` | `<Name>Adapter`, `<Name>Repository`, `config/<Name>JpaConfig` |
| Dependencies | `spring-boot-starter-data-r2dbc`, `r2dbc-postgresql` | `spring-boot-starter-data-jpa`, `postgresql` |

- Properties: `spring.r2dbc.*` in reactive; `spring.datasource.*`, the Hikari pool and `spring.jpa.hibernate.ddl-auto: update` in imperative.
- Change `ddl-auto` to `validate` or `none` before production and use migrations (Flyway or Liquibase).

## http-client

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>HttpClientAdapter`, `config/<Name>WebClientConfig` | `<Name>HttpClientAdapter`, `config/<Name>RestTemplateConfig` |
| Dependencies | `spring-boot-starter-webflux` | `spring-boot-starter-web`, `spring-boot-starter-restclient` |

Properties: `<name>.http.base-url` and `<name>.http.timeout`. The imperative adapter uses `RestClient`, even though its configuration class is called `RestTemplateConfig`.

## dynamodb

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>DynamoDbAdapter`, `config/<Name>DynamoDbConfig` | the same |
| Dependencies | AWS SDK v2 `dynamodb` | AWS SDK v2 `dynamodb` |

Properties under `aws.dynamodb`: `region`, `endpoint`, `access-key` and `secret-key`. For local development, point `endpoint` to LocalStack or DynamoDB Local. On AWS, leave the keys empty and use the application's role.

## sqs-producer

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>SqsProducerAdapter`, `config/<Name>SqsConfig` | the same |
| Dependencies | AWS SDK v2 `sqs` | AWS SDK v2 `sqs` |

Properties under `aws.sqs`: `region`, `endpoint`, `queue-url`, `access-key` and `secret-key`.

## Tests

The `v1` templates don't generate test classes for the adapters. They do add the dependencies to write them: embedded Redis, embedded MongoDB (Flapdoodle), H2 or `r2dbc-h2`, `mockwebserver` and Testcontainers with LocalStack for DynamoDB and SQS.
