---
title: Adaptadores de salida
description: Los driven adapters que genera generateOutputAdapter, su tecnología en cada paradigma, sus clases y sus propiedades.
sidebar:
  order: 9
---

Se generan con `./gradlew generateOutputAdapter --name=<Nombre> --entity=<Entidad> --type=<tipo>`. En las tablas, `<Nombre>` es el valor de `--name`. Todos quedan en `infrastructure/driven-adapters/` y en el paquete `infrastructure.drivenadapters.<nombre><tipo>`.

## Qué tienen todos

- **El gateway.** El adaptador implementa `I<Entidad>Gateway`, en el paquete de puertos (`domain/ports`, o `domain/gateway` en onion). Si no existe, se crea vacío: agrega ahí los métodos que tu caso de uso necesita.
- **La entidad de persistencia.** `entity/<Entidad>Entity.java`, con las anotaciones de la tecnología, separada de la entidad del dominio.
- **El mapper.** `mapper/<Entidad>EntityMapper.java`, con MapStruct, entre las dos entidades.
- **La configuración.** Una clase en `config/` y sus propiedades en `application.yml`.

## Resumen

| `--type` | Reactivo | Imperativo |
|---|---|---|
| `redis` | Spring Data Redis Reactive | Spring Data Redis con Lettuce |
| `mongodb` | Spring Data MongoDB Reactive | Spring Data MongoDB |
| `postgresql` | Spring Data R2DBC | Spring Data JPA con HikariCP |
| `http-client` | `WebClient` | `RestClient` |
| `dynamodb` | AWS SDK v2 `DynamoDbAsyncClient` | AWS SDK v2 `DynamoDbClient` |
| `sqs-producer` | AWS SDK v2 `SqsAsyncClient` | AWS SDK v2 `SqsClient` |

## redis

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>Adapter`, `config/<Nombre>RedisConfig` | las mismas |
| Dependencias | `spring-boot-starter-data-redis-reactive`, `spring-boot-starter-jackson` | `spring-boot-starter-data-redis`, `spring-boot-starter-jackson`, `lettuce-core` |

Propiedades bajo `spring.redis`: `host`, `port` y el pool de Lettuce.

## mongodb

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>Adapter`, `<Nombre>Repository`, `config/<Nombre>MongoConfig` | las mismas |
| Dependencias | `spring-boot-starter-data-mongodb-reactive` | `spring-boot-starter-data-mongodb` |

- El adaptador trae `save`, `findById`, `findAll`, `deleteById`, `existsById`, `count` y `deleteAll`.
- Propiedades: `spring.data.mongodb.uri` y `spring.data.mongodb.database`.

## postgresql

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>Adapter`, `<Nombre>Repository`, `config/<Nombre>R2dbcConfig` | `<Nombre>Adapter`, `<Nombre>Repository`, `config/<Nombre>JpaConfig` |
| Dependencias | `spring-boot-starter-data-r2dbc`, `r2dbc-postgresql` | `spring-boot-starter-data-jpa`, `postgresql` |

- Propiedades: `spring.r2dbc.*` en reactivo; `spring.datasource.*`, el pool de Hikari y `spring.jpa.hibernate.ddl-auto: update` en imperativo.
- Cambia `ddl-auto` a `validate` o `none` antes de producción y usa migraciones (Flyway o Liquibase).

## http-client

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>HttpClientAdapter`, `config/<Nombre>WebClientConfig` | `<Nombre>HttpClientAdapter`, `config/<Nombre>RestTemplateConfig` |
| Dependencias | `spring-boot-starter-webflux` | `spring-boot-starter-web`, `spring-boot-starter-restclient` |

Propiedades: `<nombre>.http.base-url` y `<nombre>.http.timeout`. El adaptador imperativo usa `RestClient`, aunque su clase de configuración se llame `RestTemplateConfig`.

## dynamodb

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>DynamoDbAdapter`, `config/<Nombre>DynamoDbConfig` | las mismas |
| Dependencias | AWS SDK v2 `dynamodb` | AWS SDK v2 `dynamodb` |

Propiedades bajo `aws.dynamodb`: `region`, `endpoint`, `access-key` y `secret-key`. Para desarrollo local, apunta `endpoint` a LocalStack o DynamoDB Local. En AWS, deja las llaves vacías y usa el rol de la aplicación.

## sqs-producer

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>SqsProducerAdapter`, `config/<Nombre>SqsConfig` | las mismas |
| Dependencias | AWS SDK v2 `sqs` | AWS SDK v2 `sqs` |

Propiedades bajo `aws.sqs`: `region`, `endpoint`, `queue-url`, `access-key` y `secret-key`.

## Pruebas

Las plantillas `v1` no generan clases de prueba para los adaptadores. Sí agregan las dependencias para escribirlas: Redis embebido, MongoDB embebido (Flapdoodle), H2 o `r2dbc-h2`, `mockwebserver` y Testcontainers con LocalStack para DynamoDB y SQS.
