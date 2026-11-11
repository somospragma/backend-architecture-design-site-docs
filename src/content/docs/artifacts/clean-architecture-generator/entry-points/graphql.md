---
title: GraphQL
description: El adaptador graphql de generateInputAdapter, con Spring for GraphQL sobre WebFlux o Spring MVC.
sidebar:
  order: 3
---

Publica una API GraphQL con Spring for GraphQL, sobre WebFlux en reactivo y sobre Spring MVC en imperativo. Úsalo cuando quien te llama necesita elegir qué campos pide o combinar consultas en una sola petición.

## Cómo generarlo

```bash
./gradlew generateInputAdapter --name=Order --type=graphql --useCase=CreateOrder
```

## Qué genera

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>GraphQLController` | `<Nombre>GraphQLController` |
| Recursos | `graphql/schema.graphqls` | `graphql/schema.graphqls` |
| Operaciones | Consultas, mutaciones y suscripciones | Consultas y mutaciones |
| Paquete | `infrastructure.entrypoints.<nombre>graphql` | `infrastructure.entrypoints.<nombre>graphql` |

- El esquema y el controlador traen un ejemplo sobre un tipo `<Nombre>Item`: las consultas `getItem`, `getAllItems` y `searchItems`, y las mutaciones `createItem`, `updateItem` y `deleteItem`. En reactivo, también las suscripciones `itemUpdates` e `itemUpdatesById`.
- `<Nombre>Item` y `<Nombre>ItemInput` son `record` dentro del controlador.
- El controlador no recibe el caso de uso: inyéctalo tú y reemplaza los `TODO`.

## Dependencias

| Reactivo | Imperativo |
|---|---|
| `spring-boot-starter-graphql`, `spring-boot-starter-webflux` | `spring-boot-starter-graphql`, `spring-boot-starter-web` |

De prueba agrega `spring-graphql-test` y, en reactivo, `reactor-test`.

## Configuración

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

`websocket.path` solo se agrega en reactivo, para las suscripciones. GraphiQL queda en `/graphiql`.

## Antes de producción

- Cierra el CORS: cambia `allowed-origins` por tus dominios.
- Apaga GraphiQL (`graphiql.enabled: false`) si no lo vas a exponer.

## Sigue con

- [Adaptadores de entrada](../overview/).
- [Cómo generar entidades, casos de uso y adaptadores](../../guides/generate-components/).
