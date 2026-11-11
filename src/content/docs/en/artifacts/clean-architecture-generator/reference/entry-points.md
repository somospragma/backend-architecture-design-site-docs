---
title: Input adapters
description: The entry points generateInputAdapter generates, their technology in each paradigm, their classes and their properties.
sidebar:
  order: 8
---

You generate them with `./gradlew generateInputAdapter --name=<Name> --type=<type> --useCase=<UseCase>`. In the tables, `<Name>` is the value of `--name`. They all go in `infrastructure/entry-points/` and in the `infrastructure.entrypoints.<name><type>` package.

## Summary

| `--type` | Reactive | Imperative |
|---|---|---|
| `rest` | Functional Spring WebFlux: `Router` and `Handler` | Spring MVC: `@RestController` |
| `graphql` | Spring for GraphQL on WebFlux | Spring for GraphQL on Spring MVC |
| `grpc` | gRPC with Reactor stubs (`reactor-grpc`) | gRPC with blocking stubs |
| `sqs-consumer` | Spring Cloud AWS SQS (`@SqsListener`) | Spring Cloud AWS SQS (`@SqsListener`) |
| `scheduled` | `@Scheduled` with Reactor | `@Scheduled` |

## rest

Publishes a CRUD at `/api/v1/<lowercase name>s`: `GET`, `GET /{id}`, `POST`, `PUT /{id}`, `DELETE /{id}` and, in imperative, `PATCH /{id}`. It needs `--endpoints`, even though the `v1` templates don't use it for the routes.

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>Router`, `<Name>Handler`, `<Name>RequestDTO`, `<Name>ResponseDTO`, `<Name>DTOMapper`, `<Name>WebFluxConfig` | `<Name>Controller`, `<Name>ExceptionHandler` |
| Dependencies | `spring-boot-starter-webflux` | `spring-boot-starter-web`, `spring-boot-starter-validation`, `springdoc-openapi-starter-webmvc-ui` |
| Use case | The injection is left as a `TODO` in the `Handler` | Injected in the `Controller` constructor |

Properties in `application.yml`: `server.port: 8080`, the Actuator endpoints `health`, `info` and `metrics`, and the log level. In reactive, also `spring.reactor.context-propagation: auto`.

## graphql

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>GraphQLController` | `<Name>GraphQLController` |
| Resources | `graphql/schema.graphqls` | `graphql/schema.graphqls` |
| Dependencies | `spring-boot-starter-graphql`, `spring-boot-starter-webflux` | `spring-boot-starter-graphql`, `spring-boot-starter-web` |

Properties: `spring.graphql.path: /graphql`, GraphiQL at `/graphiql` and open CORS (`*`). In reactive, also the WebSocket path. Lock down CORS before production.

## grpc

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>GrpcService` | `<Name>GrpcService` |
| Resources | `proto/service.proto` | `proto/service.proto` |
| Dependencies | `grpc-server-spring-boot-starter` (net.devh), `grpc-stub`, `grpc-protobuf`, `reactor-grpc-stub` | `grpc-server-spring-boot-starter`, `grpc-stub`, `grpc-protobuf` |

- It applies the Protobuf Gradle plugin and generates the classes from `service.proto` on every build.
- Properties: `grpc.server.port: 9090` and the keep-alive parameters.

## sqs-consumer

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>SqsConsumer`, `<Name>SqsConsumerConfig` | `<Name>Consumer`, `<Name>SqsConsumerConfig` |
| Dependencies | `spring-cloud-aws-starter-sqs`, AWS SDK `sqs` | the same |

Properties under `aws.sqs.consumer`: `region`, `endpoint`, `queue-name`, credentials and concurrency; and `spring.cloud.aws.sqs.enabled`. The listener reads the queue from `aws.sqs.consumer.queue-name`.

## scheduled

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>ScheduledTask`, `<Name>SchedulingConfig` | the same |
| Dependencies | `spring-boot-starter`, `reactor-core` | `spring-boot-starter` |

Properties: `scheduled.<name>.cron` (`0 */5 * * * *` by default, every 5 minutes) and `scheduled.<name>.enabled`. It needs `--useCase`: the task receives it in its constructor.

## Tests

The `v1` templates don't generate test classes for the adapters; write them yourself. Each technology's test dependencies are added (for example, Testcontainers with LocalStack and Awaitility for `sqs-consumer`, `spring-graphql-test` for `graphql`).
