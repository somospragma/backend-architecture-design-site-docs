---
title: gRPC
description: El adaptador grpc de generateInputAdapter, con stubs de Reactor en reactivo y bloqueantes en imperativo.
sidebar:
  order: 4
---

Publica un servicio gRPC con `grpc-server-spring-boot-starter` (net.devh). En reactivo extiende los stubs de Reactor que genera `reactor-grpc`; en imperativo, los stubs bloqueantes de gRPC. Úsalo para llamadas entre servicios con contrato Protobuf o con streaming.

## Cómo generarlo

```bash
./gradlew generateInputAdapter --name=Order --type=grpc --useCase=CreateOrder
```

## Qué genera

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>GrpcService` | `<Nombre>GrpcService` |
| Extiende | `Reactor<Nombre>ServiceGrpc.<Nombre>ServiceImplBase` | `<Nombre>ServiceGrpc.<Nombre>ServiceImplBase` |
| Recursos | `proto/service.proto` | `proto/service.proto` |
| Paquete | `infrastructure.entrypoints.<nombre>grpc` | `infrastructure.entrypoints.<nombre>grpc` |

- `service.proto` declara el servicio `<Nombre>Service` con seis RPC de ejemplo: unarios (`GetItem`, `UpdateItem`, `DeleteItem`), de streaming del servidor (`GetAllItems`), del cliente (`CreateItems`) y bidireccional (`ProcessItems`).
- Las clases de Protobuf se generan en el subpaquete `proto` del adaptador en cada build.
- La clase lleva `@GrpcService`. No recibe el caso de uso: inyéctalo tú y reemplaza los `TODO`.

## Dependencias

| Reactivo | Imperativo |
|---|---|
| `grpc-server-spring-boot-starter`, `grpc-stub`, `grpc-protobuf`, `javax.annotation-api`, `reactor-grpc-stub` | `grpc-server-spring-boot-starter`, `grpc-stub`, `grpc-protobuf`, `javax.annotation-api` |

De prueba agrega `grpc-client-spring-boot-starter` y, en reactivo, `reactor-test`.

También toca el `build.gradle.kts`:

- Aplica el plugin `com.google.protobuf` y configura `protoc` y el plugin `grpc`. En reactivo, además, el plugin `reactor`.
- Agrega la carpeta `proto` de los recursos como fuente de Protobuf.
- Fuerza versiones más nuevas de gRPC, `protobuf-java` y Guava en todos los módulos, porque el starter trae versiones con vulnerabilidades conocidas.

## Configuración

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

El servidor gRPC escucha en el puerto `9090`, aparte del HTTP.

## Sigue con

- [Adaptadores de entrada](../overview/).
- [Cómo generar entidades, casos de uso y adaptadores](../../guides/generate-components/).
