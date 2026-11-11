---
title: How to generate entities, use cases and adapters
description: The working order, the format of each option and how the plugin names what it generates.
sidebar:
  order: 4
---

With this guide you add to an existing project an entity, its use cases and the adapters that expose and persist them, in the order in which they depend on each other.

## Before you start

- `initCleanArch` created the project: the commands read the architecture, the paradigm and the package from `.cleanarch.yml`.
- Run the commands from the project root.

## The order

1. **Entity**: use cases and adapters use it.
2. **Use case**: input adapters call it.
3. **Output adapter**: creates the gateway the use case needs to persist or query.
4. **Input adapter**: exposes the use case.

## 1. Generate the entity

```bash
./gradlew generateEntity --name=Customer --fields="name:String,email:String,birthDate:LocalDate?" --idType=UUID
```

- `--fields` is a comma-separated list of `field:Type`. A `?` at the end of the type marks the field as optional.
- The plugin adds an `id` field of the `--idType` type (`String`, `Long` or `UUID`; `String` by default). If you declare an `id` field, it ignores it.
- The entity name goes in PascalCase and the fields in camelCase.
- `java.time` and `UUID` types are imported automatically.
- Quote the value: some shells interpret `?` as a wildcard.

You get `Customer.java` in the architecture's `model` package, with `@Data`, `@Builder` and the Lombok constructors.

## 2. Generate the use cases

```bash
./gradlew generateUseCase --name=RegisterCustomer --methods="execute:Customer:customer:Customer"
```

What it generates:

- In hexagonal, the `IRegisterCustomerUseCase` port in the ports package and the `RegisterCustomerUseCase` class that implements it. In onion, only the class.
- A skeleton with five methods: `execute`, `findById`, `findAll`, `update` and `delete`. They take and return `Object` (`Mono` or `Flux` in reactive) and have a `TODO`. Change the types to your entity and write the logic.
- You don't have to register it: `UseCasesConfig` registers as a bean every class in the use cases package whose name ends in `UseCase`, without putting Spring annotations in the domain.

`--methods` is required and its format is validated (`name:ReturnType[:param:Type…]`, methods separated by `|`), but the `v1` templates don't use it yet: the skeleton is the same for any value.

## 3. Generate the output adapter

```bash
./gradlew generateOutputAdapter --name=Customer --entity=Customer --type=postgresql
```

- `--type` is one of the [output adapters](../../driven-adapters/overview/). By default, `redis`.
- `--entity` is the entity it stores or queries.
- If it doesn't exist, it creates the `I<Entity>Gateway` gateway in the ports package, which the adapter implements and the use case uses.
- It creates a persistence entity and a MapStruct mapper between it and the domain entity, so the domain has no database annotations.

## 4. Generate the input adapter

```bash
./gradlew generateInputAdapter --name=Customer --type=rest --useCase=RegisterCustomer \
  --endpoints="/customers:POST:execute:Customer:customer:BODY:Customer"
```

The REST adapter publishes a CRUD at `/api/v1/<lowercase name>s` (here, `/api/v1/customers`): `GET`, `GET /{id}`, `POST`, `PUT /{id}` and `DELETE /{id}`, plus `PATCH /{id}` in imperative. In imperative it is a `@RestController` that receives the use case; in reactive, a functional `Router` and `Handler`, with the use case injection left as a `TODO`.

`--endpoints` is required for `rest` and its format is validated, but the `v1` templates always publish the CRUD above. Adjust the routes in the generated class. The format is:

```text
/path:METHOD:useCaseMethod:ReturnType[:param:SOURCE:Type…]
```

- `METHOD`: `GET`, `POST`, `PUT`, `DELETE` or `PATCH`.
- `SOURCE`: `PATH`, `BODY` or `QUERY`.
- The path starts with `/`. Separate endpoints with `|`.

The other types don't need `--endpoints`, but they do need `--useCase`, the use case they call:

```bash
./gradlew generateInputAdapter --name=CustomerEvents --type=sqs-consumer --useCase=RegisterCustomer
./gradlew generateInputAdapter --name=CustomerCleanup --type=scheduled --useCase=RegisterCustomer
```

## How the plugin names what it generates

| What | Name | Example with `--name=Customer` |
|---|---|---|
| Adapter package | `--name` in lowercase + `--type` without hyphens | `infrastructure.drivenadapters.customerpostgresql` |
| Main class | `--name` + adapter suffix | `CustomerAdapter`, `CustomerHandler`, `CustomerController` |
| Secondary classes | `--name` + template name | `CustomerRepository`, `CustomerR2dbcConfig` |
| Module (only `hexagonal-multi-granular`) | `--name` in lowercase | `:customer` |

The classes each adapter generates are on its page, linked from the [entry points](../../entry-points/overview/) and [driven adapters](../../driven-adapters/overview/) overviews.

## What each adapter touches outside its folder

- **`build.gradle.kts`** of the module that contains it: its dependencies, Gradle plugins and test dependencies.
- **`application.yml`**: its properties, merged with the existing ones.
- **`settings.gradle.kts`**: only in `hexagonal-multi-granular`, to register the new module.

Before writing, the plugin backs up `application.yml` and `build.gradle.kts` to `.cleanarch/backups/`. If generation fails, it restores them.

## If something fails

- **`Adapter metadata not found for: X`**: that adapter type doesn't exist. Use one from the [input adapters](../../entry-points/overview/) or [output adapters](../../driven-adapters/overview/) tables.
- **`The following has evaluated to null or missing: useCaseType`**: `--useCase` is missing. Input adapters need it to know which use case to call.
- **`Endpoints are required`**: a `rest` adapter needs `--endpoints`.
- **The build fails in the `architecture` tests**: some class breaks an architecture rule. The ArchUnit message says which class and which rule; read [what they check](../../reference/generated-project/#architecture-tests).
