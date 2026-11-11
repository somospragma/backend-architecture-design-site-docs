---
title: MongoDB
description: The mongodb adapter of generateOutputAdapter, with Spring Data MongoDB.
sidebar:
  order: 3
---

Persists an entity in MongoDB with Spring Data MongoDB: reactive repositories in reactive and blocking repositories in imperative. Use it for documents you store and query whole.

## How to generate it

```bash
./gradlew generateOutputAdapter --name=Order --entity=Order --type=mongodb
```

## What it generates

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>Adapter`, `<Name>Repository`, `config/<Name>MongoConfig`, `entity/<Entity>Entity`, `mapper/<Entity>EntityMapper` | The same |
| Repository | `ReactiveMongoRepository<<Entity>Entity, String>` | `MongoRepository<<Entity>Entity, String>` |
| Package | `infrastructure.drivenadapters.<name>mongodb` | `infrastructure.drivenadapters.<name>mongodb` |

- The adapter comes with `save`, `findById`, `findAll`, `deleteById`, `existsById`, `count` and `deleteAll`, using the domain entity.
- The entity has `@Document`. For `--entity=Product`, the collection is `products`.
- `<Name>MongoConfig` creates the client with `spring.data.mongodb.uri` and `spring.data.mongodb.database`, and enables the repositories in the adapter's package.

## Dependencies

| Reactive | Imperative |
|---|---|
| `spring-boot-starter-data-mongodb-reactive` | `spring-boot-starter-data-mongodb` |

For tests it adds embedded MongoDB (`de.flapdoodle.embed.mongo`).

## Configuration

In a project named `order-service`:

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017
      database: order-service
      repositories:
        enabled: true
logging:
  level:
    org.springframework.data.mongodb: DEBUG
    org.mongodb.driver: INFO
```

`database` takes the project name in lowercase. Don't store credentials in `uri`: pass them through an environment variable.

## Next

- [Driven adapters](../overview/).
- [How to generate entities, use cases and adapters](../../guides/generate-components/).
