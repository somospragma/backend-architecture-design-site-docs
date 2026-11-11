---
title: Adaptadores de salida
description: Los driven adapters que genera generateOutputAdapter, qué tienen en común y cuál usar.
sidebar:
  label: Resumen
  order: 1
---

Un adaptador de salida conecta el dominio con una base de datos, una caché, otro servicio o una cola. Lo generas con:

```bash
./gradlew generateOutputAdapter --name=<Nombre> --entity=<Entidad> --type=<tipo>
```

En estas páginas, `<Nombre>` es el valor de `--name`, tal cual lo escribes, y `<nombre>` es ese valor en minúsculas. `<Entidad>` es el valor de `--entity`.

## Resumen

| `--type` | Reactivo | Imperativo | Página |
|---|---|---|---|
| `redis` | Spring Data Redis Reactive | Spring Data Redis con Lettuce | [Redis](../redis/) |
| `mongodb` | Spring Data MongoDB Reactive | Spring Data MongoDB | [MongoDB](../mongodb/) |
| `postgresql` | Spring Data R2DBC | Spring Data JPA con HikariCP | [PostgreSQL](../postgresql/) |
| `http-client` | `WebClient` | `RestClient` | [Cliente HTTP](../http-client/) |
| `dynamodb` | AWS SDK v2 `DynamoDbAsyncClient` | AWS SDK v2 `DynamoDbClient` | [DynamoDB](../dynamodb/) |
| `sqs-producer` | AWS SDK v2 `SqsAsyncClient` | AWS SDK v2 `SqsClient` | [Productor de SQS](../sqs-producer/) |

Si no pasas `--type`, se genera `redis`.

## Qué tienen todos

- **El gateway.** El adaptador implementa `I<Entidad>Gateway`, en el paquete de puertos (`domain/ports`, o `domain/gateway` en onion). Si no existe, se crea vacío: agrega ahí los métodos que tu caso de uso necesita.
- **La entidad de persistencia.** `entity/<Entidad>Entity.java`, separada de la entidad del dominio. En MongoDB, PostgreSQL y Redis reactivo lleva las anotaciones de la tecnología (`@Document`, `@Table`, `@RedisHash`); en los demás es una clase simple con `id`.
- **El mapper.** `mapper/<Entidad>EntityMapper.java`, una interfaz de MapStruct (`@Mapper(componentModel = "spring")`) entre las dos entidades.
- **La configuración.** Una clase en `config/` y sus propiedades en `application.yml`. Si una clave ya existe, se conserva el valor del proyecto.
- **El paquete.** `infrastructure.drivenadapters.<nombre><tipo>`, con el tipo sin guiones. Con `--name=Order --type=http-client` queda `infrastructure.drivenadapters.orderhttpclient`.
- **La carpeta.** En `hexagonal-single`, `onion-single` y `hexagonal-multi`, el paquete va dentro del código de infraestructura. En `hexagonal-multi-granular`, cada adaptador es un módulo propio en `infrastructure/driven-adapters/<nombre>`.

## Pruebas

Las plantillas `v1` no generan clases de prueba para los adaptadores; escríbelas tú. Sí agregan las dependencias de prueba de cada tecnología. Cada página dice cuáles.

## Sigue con

- [Cómo generar entidades, casos de uso y adaptadores](../../guides/generate-components/), con el orden de trabajo.
- [Adaptadores de entrada](../../entry-points/overview/).
