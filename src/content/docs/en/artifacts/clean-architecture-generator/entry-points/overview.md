---
title: Entry points
description: The entry points generateInputAdapter generates, what they have in common and which one to use.
sidebar:
  label: Overview
  order: 1
---

An entry point receives a request, a message or a clock tick and calls a use case. You generate it with:

```bash
./gradlew generateInputAdapter --name=<Name> --type=<type> --useCase=<UseCase>
```

On these pages, `<Name>` is the value of `--name`, exactly as you type it, and `<name>` is that value in lowercase.

## Summary

| `--type` | Reactive | Imperative | Page |
|---|---|---|---|
| `rest` | Functional Spring WebFlux: `Router` and `Handler` | Spring MVC: `@RestController` | [REST](../rest/) |
| `graphql` | Spring for GraphQL on WebFlux | Spring for GraphQL on Spring MVC | [GraphQL](../graphql/) |
| `grpc` | gRPC with Reactor stubs (`reactor-grpc`) | gRPC with blocking stubs | [gRPC](../grpc/) |
| `sqs-consumer` | Spring Cloud AWS SQS (`@SqsListener`) | Spring Cloud AWS SQS (`@SqsListener`) | [SQS consumer](../sqs-consumer/) |
| `scheduled` | `@Scheduled` with Reactor | `@Scheduled` | [Scheduled task](../scheduled/) |

## What they all have

- **The package.** `infrastructure.entrypoints.<name><type>`, with the type without hyphens. With `--name=Order --type=sqs-consumer` you get `infrastructure.entrypoints.ordersqsconsumer`.
- **The folder.** In `hexagonal-single`, `onion-single` and `hexagonal-multi`, the package goes inside the infrastructure code. In `hexagonal-multi-granular`, each adapter is its own module in `infrastructure/entry-points/<name>`.
- **The classes.** They are named `<Name>` plus the template name: `<Name>Handler`, `<Name>GraphQLController`. Configuration classes go in `config/`.
- **`--useCase`.** Always pass it. Without it, generation fails with a null `useCaseType`. Only imperative `rest` and `scheduled` receive the use case in the constructor; in the others you inject it yourself.
- **The properties.** Each adapter adds its own to `application.yml`. If a key already exists, the project's value is kept.

## Tests

The `v1` templates don't generate test classes for the adapters; write them yourself. They do add each technology's test dependencies. Each page lists them.

## Next

- [How to generate entities, use cases and adapters](../../guides/generate-components/), with the order of work.
- [Driven adapters](../../driven-adapters/overview/).
