---
title: Gradle tasks
description: Every plugin task, its options, default values and validations.
sidebar:
  order: 6
---

All tasks are in the `clean architecture` group (`./gradlew tasks --group "clean architecture"`). None of them asks questions: you pass everything with `--option=value` options. Boolean options are *flags*: you turn them on with `--option` and off with `--no-option`.

## initCleanArch

Creates the project in the current folder and writes `.cleanarch.yml`.

| Option | Required | Default | Values |
|---|---|---|---|
| `--package` | Yes | | Base package, for example `com.example.orders`. Each segment in lowercase, starting with a letter. |
| `--architecture` | No | `hexagonal-single` | `hexagonal-single`, `hexagonal-multi`, `hexagonal-multi-granular`, `onion-single` |
| `--paradigm` | No | `reactive` | `reactive`, `imperative` |
| `--framework` | No | `spring` | `spring` |

- The project name is `rootProject.name` (or the folder name) and must match `[a-z][a-z0-9-]*`.
- The folder must be empty. Only `build.gradle(.kts)`, `settings.gradle(.kts)`, `gradlew`, `gradlew.bat`, `gradle/`, `.gradle/`, `build/`, `.git`, `.gitignore` and a `.cleanarch.yml` without a `project` section are allowed.
- It fails if `.cleanarch.yml` already has a project.

```bash
gradle initCleanArch --package=com.example.orders --architecture=hexagonal-multi --paradigm=imperative
```

## generateEntity

Creates a domain entity.

| Option | Required | Default | Values |
|---|---|---|---|
| `--name` | Yes | | PascalCase: `[A-Z][a-zA-Z0-9]*` |
| `--fields` | Yes | | `field:Type,field:Type`. A `?` at the end of the type makes it optional. Fields in camelCase. |
| `--idType` | No | `String` | `String`, `Long`, `UUID` |
| `--hasId` | No | on | `--no-hasId` creates the entity without an `id` field. |
| `--packageName` | No | the architecture's `model` package | Full package. |

```bash
./gradlew generateEntity --name=Order --fields="customerId:String,total:BigDecimal,notes:String?" --idType=UUID
```

## generateUseCase

Creates a use case and, in the hexagonal architectures, its input port. The `v1` templates generate a skeleton with `execute`, `findById`, `findAll`, `update` and `delete` on `Object` (`Mono`/`Flux` in reactive), with a `TODO` for your logic.

| Option | Required | Default | Values |
|---|---|---|---|
| `--name` | Yes | | Name without the `UseCase` suffix: `CreateOrder` creates `CreateOrderUseCase`. |
| `--methods` | Yes | | `method:ReturnType[:param:Type…]`. Parameters separated by `:`, methods by `\|`. It is validated, but the `v1` templates don't use it yet. |
| `--generatePort` | No | on | `--no-generatePort` doesn't create the interface. Only for onion: in hexagonal the class implements the port and doesn't compile without it. |
| `--generateImpl` | No | on | `--no-generateImpl` doesn't create the class. You can't turn off both. |
| `--packageName` | No | the ports or use cases package | Must start with the base package. |

```bash
./gradlew generateUseCase --name=CreateOrder --methods="execute:Order:order:Order"
```

## generateOutputAdapter

Creates an output adapter, its gateway if missing, its persistence entity and its mapper.

| Option | Required | Default | Values |
|---|---|---|---|
| `--name` | Yes | | Adapter name, for example `Order`. |
| `--entity` | Yes | | Domain entity it stores or queries. |
| `--type` | No | `redis` | One of the [output adapters](../driven-adapters/). |
| `--methods` | No | | Gateway methods, with the `generateUseCase` format. |
| `--packageName` | No | `<base package>.infrastructure.drivenadapters.<name><type>` | Full package. |

```bash
./gradlew generateOutputAdapter --name=Order --entity=Order --type=mongodb
```

## generateInputAdapter

Creates an input adapter that calls a use case.

| Option | Required | Default | Values |
|---|---|---|---|
| `--name` | Yes | | Adapter name, for example `Order`. |
| `--type` | No | `rest` | One of the [input adapters](../entry-points/). |
| `--useCase` | Yes, in practice | | Use case it calls, without the `UseCase` suffix. The templates use it even though the task doesn't validate it. |
| `--endpoints` | Only for `rest` | | `/path:METHOD:method:ReturnType[:param:SOURCE:Type…]`, separated by `\|`. `METHOD`: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`. `SOURCE`: `PATH`, `BODY`, `QUERY`. It is validated, but the `v1` templates always publish a CRUD at `/api/v1/<name>s`. |
| `--packageName` | No | `<base package>.infrastructure.entrypoints.<name><type>` | Full package. |

```bash
./gradlew generateInputAdapter --name=Order --type=rest --useCase=CreateOrder \
  --endpoints="/orders:POST:execute:Order:order:BODY:Order"
```

## listComponents

Lists the project's entities, use cases and adapters. It has no options.

In `hexagonal-multi-granular` and in `onion-single` the list can be incomplete, because it searches the `hexagonal-single` paths.

## validateStructure

Copies the architecture tests from the templates into the project and runs `./gradlew test --tests '*architecture*'`. Use it to bring in the rules of a new templates version. It has no options.

## validateTemplates

Checks that the templates are complete. It is for whoever maintains the templates.

| Option | Values |
|---|---|
| `--architecture` | Checks only that architecture. |
| `--adapter` | Checks only that adapter. |

Without options, it checks everything.

## updateTemplates

Deletes the templates cache and the memory of the latest tag, so the next generation queries GitHub again. In `developer` mode it does nothing. It has no options.

## clearTemplateCache

Deletes the templates cache in `~/.cleanarch/templates-cache/` and shows how much space it freed. It has no options.
