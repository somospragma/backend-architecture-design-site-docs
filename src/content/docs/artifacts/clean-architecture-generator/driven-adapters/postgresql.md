---
title: PostgreSQL
description: El adaptador postgresql de generateOutputAdapter, con Spring Data R2DBC en reactivo y Spring Data JPA en imperativo.
sidebar:
  order: 4
---

Persiste una entidad en PostgreSQL. En reactivo usa Spring Data R2DBC; en imperativo, Spring Data JPA con Hibernate y un pool HikariCP. Úsalo para datos relacionales con transacciones.

## Cómo generarlo

```bash
./gradlew generateOutputAdapter --name=Order --entity=Order --type=postgresql
```

## Qué genera

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>Adapter`, `<Nombre>Repository`, `config/<Nombre>R2dbcConfig`, `entity/<Entidad>Entity`, `mapper/<Entidad>EntityMapper` | `<Nombre>Adapter`, `<Nombre>Repository`, `config/<Nombre>JpaConfig`, `entity/<Entidad>Entity`, `mapper/<Entidad>EntityMapper` |
| Repositorio | `ReactiveCrudRepository<<Entidad>Entity, Long>` | `JpaRepository<<Entidad>Entity, Long>` |
| Paquete | `infrastructure.drivenadapters.<nombre>postgresql` | `infrastructure.drivenadapters.<nombre>postgresql` |

- El adaptador trae `save`, `findById`, `findAll` y `deleteById`. El `id` de la entidad de persistencia es `Long`.
- La entidad lleva `@Table` (y `@Entity` en imperativo). Para `--entity=Product`, la tabla es `products`.
- En reactivo, `<Nombre>R2dbcConfig` declara un `ConnectionFactoryInitializer`, con las líneas para ejecutar un `schema.sql` comentadas.
- En imperativo, `<Nombre>JpaConfig` crea el `DataSource` de Hikari, el `EntityManagerFactory` y el `PlatformTransactionManager`, y activa los repositorios JPA del paquete base.

## Dependencias

| Reactivo | Imperativo |
|---|---|
| `spring-boot-starter-data-r2dbc`, `r2dbc-postgresql` | `spring-boot-starter-data-jpa`, `postgresql`, `HikariCP` |

De prueba agrega `r2dbc-h2` en reactivo y `h2` en imperativo.

En reactivo, el adaptador agrega al `build.gradle.kts` una regla que fuerza una versión más nueva del cliente SCRAM, porque `r2dbc-postgresql` trae una con una vulnerabilidad conocida.

## Configuración

En reactivo, en un proyecto llamado `order-service`:

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

En imperativo:

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

## Antes de producción

- Saca el usuario y la contraseña `postgres` del archivo: pásalos por variables de entorno.
- En imperativo, cambia `ddl-auto` a `validate` o `none` y usa migraciones (Flyway o Liquibase). `<Nombre>JpaConfig` también fija `hibernate.hbm2ddl.auto` en `update` en el código: cámbialo ahí.
- Baja los niveles de log: los de `QUERY`, `PARAM` y `BasicBinder` escriben las consultas y sus parámetros.

## Sigue con

- [Adaptadores de salida](../overview/).
- [Cómo generar entidades, casos de uso y adaptadores](../../guides/generate-components/).
