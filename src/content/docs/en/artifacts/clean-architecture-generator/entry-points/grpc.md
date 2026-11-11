---
title: gRPC
description: The grpc adapter of generateInputAdapter, with Reactor stubs in reactive and blocking stubs in imperative.
sidebar:
  order: 4
---

Exposes a gRPC service with `grpc-server-spring-boot-starter` (net.devh). In reactive it extends the Reactor stubs that `reactor-grpc` generates; in imperative, gRPC's blocking stubs. Use it for service-to-service calls with a Protobuf contract or with streaming.

## How to generate it

```bash
./gradlew generateInputAdapter --name=Order --type=grpc --useCase=CreateOrder
```

## What it generates

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>GrpcService` | `<Name>GrpcService` |
| Extends | `Reactor<Name>ServiceGrpc.<Name>ServiceImplBase` | `<Name>ServiceGrpc.<Name>ServiceImplBase` |
| Resources | `proto/service.proto` | `proto/service.proto` |
| Package | `infrastructure.entrypoints.<name>grpc` | `infrastructure.entrypoints.<name>grpc` |

- `service.proto` declares the `<Name>Service` service with six sample RPCs: unary (`GetItem`, `UpdateItem`, `DeleteItem`), server streaming (`GetAllItems`), client streaming (`CreateItems`) and bidirectional (`ProcessItems`).
- The Protobuf classes are generated in the adapter's `proto` subpackage on every build.
- The class has `@GrpcService`. It doesn't receive the use case: inject it yourself and replace the `TODO`s.

## Dependencies

| Reactive | Imperative |
|---|---|
| `grpc-server-spring-boot-starter`, `grpc-stub`, `grpc-protobuf`, `javax.annotation-api`, `reactor-grpc-stub` | `grpc-server-spring-boot-starter`, `grpc-stub`, `grpc-protobuf`, `javax.annotation-api` |

For tests it adds `grpc-client-spring-boot-starter` and, in reactive, `reactor-test`.

It also changes `build.gradle.kts`:

- It applies the `com.google.protobuf` plugin and configures `protoc` and the `grpc` plugin. In reactive, also the `reactor` plugin.
- It adds the resources' `proto` folder as a Protobuf source.
- It forces newer versions of gRPC, `protobuf-java` and Guava in every module, because the starter brings versions with known vulnerabilities.

## Configuration

```yaml
grpc:
  server:
    port: 9090
    address: 0.0.0.0
    max-inbound-message-size: 4MB
    enable-keep-alive: true
    keep-alive-time: 30s
    keep-alive-timeout: 5s
    permit-keep-alive-without-calls: true
logging:
  level:
    net.devh.boot.grpc: DEBUG
    io.grpc: DEBUG
```

The gRPC server listens on port `9090`, separate from HTTP.

## Next

- [Entry points](../overview/).
- [How to generate entities, use cases and adapters](../../guides/generate-components/).
