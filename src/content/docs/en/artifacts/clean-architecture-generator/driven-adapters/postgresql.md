---
title: PostgreSQL
description: The postgresql adapter of generateOutputAdapter, with Spring Data R2DBC in reactive and Spring Data JPA in imperative.
sidebar:
  order: 4
---

Persists an entity in PostgreSQL. In reactive it uses Spring Data R2DBC; in imperative, Spring Data JPA with Hibernate and a HikariCP pool. Use it for relational data with transactions.

## How to generate it

```bash
./gradlew generateOutputAdapter --name=Order --entity=Order --type=postgresql
```

## What it generates

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>Adapter`, `<Name>Repository`, `config/<Name>R2dbcConfig`, `entity/<Entity>Entity`, `mapper/<Entity>EntityMapper` | `<Name>Adapter`, `<Name>Repository`, `config/<Name>JpaConfig`, `entity/<Entity>Entity`, `mapper/<Entity>EntityMapper` |
| Repository | `ReactiveCrudRepository<<Entity>Entity, Long>` | `JpaRepository<<Entity>Entity, Long>` |
| Package | `infrastructure.drivenadapters.<name>postgresql` | `infrastructure.drivenadapters.<name>postgresql` |

- The adapter comes with `save`, `findById`, `findAll` and `deleteById`. The persistence entity's `id` is a `Long`.
- The entity has `@Table` (and `@Entity` in imperative). For `--entity=Product`, the table is `products`.
- In reactive, `<Name>R2dbcConfig` declares a `ConnectionFactoryInitializer`, with the lines to run a `schema.sql` commented out.
- In imperative, `<Name>JpaConfig` creates the Hikari `DataSource`, the `EntityManagerFactory` and the `PlatformTransactionManager`, and enables the JPA repositories of the base package.

## Dependencies

| Reactive | Imperative |
|---|---|
| `spring-boot-starter-data-r2dbc`, `r2dbc-postgresql` | `spring-boot-starter-data-jpa`, `postgresql`, `HikariCP` |

For tests it adds `r2dbc-h2` in reactive and `h2` in imperative.

In reactive, the adapter adds a rule to `build.gradle.kts` that forces a newer SCRAM client, because `r2dbc-postgresql` brings one with a known vulnerability.

## Configuration

In reactive, in a project named `order-service`:

```yaml
spring:
  r2dbc:
    url: r2dbc:postgresql://localhost:5432/order-service
    username: postgres
    password: postgres
  data:
    r2dbc:
      repositories:
        enabled: true
logging:
  level:
    io.r2dbc.postgresql.QUERY: DEBUG
    io.r2dbc.postgresql.PARAM: DEBUG
```

In imperative:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/order-service
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      pool-name: order-serviceHikariPool
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
        use_sql_comments: true
logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

## Before production

- Move the `postgres` user and password out of the file: pass them through environment variables.
- In imperative, change `ddl-auto` to `validate` or `none` and use migrations (Flyway or Liquibase). `<Name>JpaConfig` also sets `hibernate.hbm2ddl.auto` to `update` in code: change it there too.
- Lower the log levels: `QUERY`, `PARAM` and `BasicBinder` write the queries and their parameters.

## Next

- [Driven adapters](../overview/).
- [How to generate entities, use cases and adapters](../../guides/generate-components/).
