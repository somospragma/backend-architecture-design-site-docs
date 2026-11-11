---
title: Adaptadores de entrada
description: Los entry points que genera generateInputAdapter, su tecnología en cada paradigma, sus clases y sus propiedades.
sidebar:
  order: 8
---

Se generan con `./gradlew generateInputAdapter --name=<Nombre> --type=<tipo> --useCase=<CasoDeUso>`. En las tablas, `<Nombre>` es el valor de `--name`. Todos quedan en `infrastructure/entry-points/` y en el paquete `infrastructure.entrypoints.<nombre><tipo>`.

## Resumen

| `--type` | Reactivo | Imperativo |
|---|---|---|
| `rest` | Spring WebFlux funcional: `Router` y `Handler` | Spring MVC: `@RestController` |
| `graphql` | Spring for GraphQL sobre WebFlux | Spring for GraphQL sobre Spring MVC |
| `grpc` | gRPC con stubs de Reactor (`reactor-grpc`) | gRPC con stubs bloqueantes |
| `sqs-consumer` | Spring Cloud AWS SQS (`@SqsListener`) | Spring Cloud AWS SQS (`@SqsListener`) |
| `scheduled` | `@Scheduled` con Reactor | `@Scheduled` |

## rest

Publica un CRUD en `/api/v1/<nombre en minúsculas>s`: `GET`, `GET /{id}`, `POST`, `PUT /{id}`, `DELETE /{id}` y, en imperativo, `PATCH /{id}`. Necesita `--endpoints`, aunque las plantillas `v1` no la usan para las rutas.

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>Router`, `<Nombre>Handler`, `<Nombre>RequestDTO`, `<Nombre>ResponseDTO`, `<Nombre>DTOMapper`, `<Nombre>WebFluxConfig` | `<Nombre>Controller`, `<Nombre>ExceptionHandler` |
| Dependencias | `spring-boot-starter-webflux` | `spring-boot-starter-web`, `spring-boot-starter-validation`, `springdoc-openapi-starter-webmvc-ui` |
| Caso de uso | La inyección queda como `TODO` en el `Handler` | Se inyecta en el constructor del `Controller` |

Propiedades en `application.yml`: `server.port: 8080`, los endpoints de Actuator `health`, `info` y `metrics`, y el nivel de logs. En reactivo, además, `spring.reactor.context-propagation: auto`.

## graphql

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>GraphQLController` | `<Nombre>GraphQLController` |
| Recursos | `graphql/schema.graphqls` | `graphql/schema.graphqls` |
| Dependencias | `spring-boot-starter-graphql`, `spring-boot-starter-webflux` | `spring-boot-starter-graphql`, `spring-boot-starter-web` |

Propiedades: `spring.graphql.path: /graphql`, GraphiQL en `/graphiql` y CORS abierto (`*`). En reactivo, además, la ruta de WebSocket. Cierra el CORS antes de producción.

## grpc

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>GrpcService` | `<Nombre>GrpcService` |
| Recursos | `proto/service.proto` | `proto/service.proto` |
| Dependencias | `grpc-server-spring-boot-starter` (net.devh), `grpc-stub`, `grpc-protobuf`, `reactor-grpc-stub` | `grpc-server-spring-boot-starter`, `grpc-stub`, `grpc-protobuf` |

- Aplica el plugin de Gradle de Protobuf y genera las clases desde `service.proto` en cada build.
- Propiedades: `grpc.server.port: 9090` y los parámetros de keep-alive.

## sqs-consumer

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>SqsConsumer`, `<Nombre>SqsConsumerConfig` | `<Nombre>Consumer`, `<Nombre>SqsConsumerConfig` |
| Dependencias | `spring-cloud-aws-starter-sqs`, AWS SDK `sqs` | las mismas |

Propiedades bajo `aws.sqs.consumer`: `region`, `endpoint`, `queue-name`, credenciales y concurrencia; y `spring.cloud.aws.sqs.enabled`. El listener lee la cola de `aws.sqs.consumer.queue-name`.

## scheduled

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>ScheduledTask`, `<Nombre>SchedulingConfig` | las mismas |
| Dependencias | `spring-boot-starter`, `reactor-core` | `spring-boot-starter` |

Propiedades: `scheduled.<nombre>.cron` (por defecto `0 */5 * * * *`, cada 5 minutos) y `scheduled.<nombre>.enabled`. Necesita `--useCase`: la tarea lo recibe en su constructor.

## Pruebas

Las plantillas `v1` no generan clases de prueba para los adaptadores; escríbelas tú. Las dependencias de prueba de cada tecnología sí se agregan (por ejemplo, Testcontainers con LocalStack y Awaitility para `sqs-consumer`, `spring-graphql-test` para `graphql`).
