---
title: GraphQL
description: The graphql adapter of generateInputAdapter, with Spring for GraphQL on WebFlux or Spring MVC.
sidebar:
  order: 3
---

Exposes a GraphQL API with Spring for GraphQL, on WebFlux in reactive and on Spring MVC in imperative. Use it when your callers need to choose which fields they ask for or combine queries in a single request.

## How to generate it

```bash
./gradlew generateInputAdapter --name=Order --type=graphql --useCase=CreateOrder
```

## What it generates

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>GraphQLController` | `<Name>GraphQLController` |
| Resources | `graphql/schema.graphqls` | `graphql/schema.graphqls` |
| Operations | Queries, mutations and subscriptions | Queries and mutations |
| Package | `infrastructure.entrypoints.<name>graphql` | `infrastructure.entrypoints.<name>graphql` |

- The schema and the controller come with an example on a `<Name>Item` type: the queries `getItem`, `getAllItems` and `searchItems`, and the mutations `createItem`, `updateItem` and `deleteItem`. In reactive, also the subscriptions `itemUpdates` and `itemUpdatesById`.
- `<Name>Item` and `<Name>ItemInput` are `record`s inside the controller.
- The controller doesn't receive the use case: inject it yourself and replace the `TODO`s.

## Dependencies

| Reactive | Imperative |
|---|---|
| `spring-boot-starter-graphql`, `spring-boot-starter-webflux` | `spring-boot-starter-graphql`, `spring-boot-starter-web` |

For tests it adds `spring-graphql-test` and, in reactive, `reactor-test`.

## Configuration

```yaml
spring:
  graphql:
    path: /graphql
    graphiql:
      enabled: true
      path: /graphiql
    schema:
      printer:
        enabled: true
    websocket:
      path: /graphql
    cors:
      allowed-origins: '*'
      allowed-methods: '*'
logging:
  level:
    org.springframework.graphql: DEBUG
    graphql: DEBUG
```

`websocket.path` is only added in reactive, for subscriptions. GraphiQL is at `/graphiql`.

## Before production

- Lock down CORS: replace `allowed-origins` with your domains.
- Turn off GraphiQL (`graphiql.enabled: false`) if you won't expose it.

## Next

- [Entry points](../overview/).
- [How to generate entities, use cases and adapters](../../guides/generate-components/).
