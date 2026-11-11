---
title: REST
description: The rest adapter of generateInputAdapter, with Spring WebFlux in reactive and Spring MVC in imperative.
sidebar:
  order: 2
---

Exposes a use case as an HTTP API. In reactive it uses Spring WebFlux functional endpoints (`Router` and `Handler`); in imperative, a Spring MVC `@RestController` with OpenAPI annotations. Use it when another service or a frontend calls you over HTTP.

## How to generate it

```bash
./gradlew generateInputAdapter --name=Order --type=rest --useCase=CreateOrder \
  --endpoints="/orders:POST:execute:Order:order:BODY:Order"
```

`--endpoints` is required and its format is validated, but the `v1` templates ignore it: they always publish a CRUD at `/api/v1/<name>s` (here, `/api/v1/orders`). Adjust the routes in the generated class. The format is in [the guide](../../guides/generate-components/#4-generate-the-input-adapter).

## What it generates

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>Router`, `<Name>Handler`, `<Name>RequestDTO`, `<Name>ResponseDTO`, `<Name>DTOMapper`, `<Name>WebFluxConfig` | `<Name>Controller`, `<Name>ExceptionHandler` |
| Routes | `GET`, `GET /{id}`, `POST`, `PUT /{id}`, `DELETE /{id}` | The same, plus `PATCH /{id}` |
| Use case | The injection is left as a `TODO` in the `Handler` | Injected in the `Controller` constructor |
| Package | `infrastructure.entrypoints.<name>rest` | `infrastructure.entrypoints.<name>rest` |

- In reactive, `<Name>Router` is a `@Configuration` that declares the routes with `RouterFunctions`, and `<Name>Handler` is a `@Component` with one method per route.
- In imperative, `<Name>ExceptionHandler` is a `@RestControllerAdvice` that turns exceptions into error responses.
- The methods return sample responses and have a `TODO` where the use case call goes.

## Dependencies

| Reactive | Imperative |
|---|---|
| `spring-boot-starter-webflux` | `spring-boot-starter-web`, `spring-boot-starter-validation`, `springdoc-openapi-starter-webmvc-ui` |

For tests it adds `spring-boot-starter-test`, which the project already has.

## Configuration

In reactive, the adapter adds to `application.yml`:

```yaml
spring:
  reactor:
    context-propagation: auto
logging:
  level:
    com.example.orders.infrastructure.entrypoints.orderrest: DEBUG
    reactor.netty: INFO
```

In imperative:

```yaml
spring:
  web:
    resources:
      add-mappings: true
logging:
  level:
    com.example.orders.infrastructure.entrypoints.orderrest: DEBUG
    org.springframework.web.servlet: INFO
```

The template also brings `server.port`, the Actuator exposure and the `org.springframework.web` log level. The project already defines them, so they keep their values: port `8080` and Actuator with `health,info,prometheus`.

## Before production

- In reactive, `<Name>WebFluxConfig` opens CORS to any origin (`*`) on every route. Restrict the origins.
- Replace the sample routes with your API's and wire the use case into each method.

## Next

- [Entry points](../overview/).
- [How to generate entities, use cases and adapters](../../guides/generate-components/).
