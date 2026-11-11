---
title: Introduction
description: What Clean Architecture Generator generates, when to use it and when not to.
sidebar:
  order: 1
---

Clean Architecture Generator is a Gradle plugin that creates Spring Boot microservices with hexagonal or onion architecture, and then adds entities, use cases and adapters to them without breaking the layers. The plugin is `co.com.pragma.archetype-generator` and these docs cover version `1.1.1`.

## What it generates

| Piece | Command | Result |
|---|---|---|
| Project | `initCleanArch` | The layers or modules of the chosen architecture, `Application`, `application.yml`, Dockerfile, Gradle wrapper, quality (JaCoCo, PIT, SonarQube, OWASP) and 8 ArchUnit test classes. |
| Entity | `generateEntity` | A domain class with Lombok, in the architecture's `model` package. |
| Use case | `generateUseCase` | The implementation and, in hexagonal, its input port. |
| Output adapter | `generateOutputAdapter` | Redis, MongoDB, PostgreSQL, HTTP client, DynamoDB or SQS producer, with its gateway, mapper, configuration and properties. |
| Input adapter | `generateInputAdapter` | REST, GraphQL, gRPC, SQS consumer or scheduled task. |

Each adapter comes in two versions: **reactive** (WebFlux, R2DBC, async clients) and **imperative** (Spring MVC, JPA, sync clients). You choose the paradigm when you create the project, and everything you generate afterwards follows it.

## Architectures

| Architecture | Gradle modules | What for |
|---|---|---|
| `hexagonal-single` | One | Small services or an MVP. It is the default architecture. |
| `hexagonal-multi` | `domain`, `application`, `infrastructure` | Medium services that want the domain isolated in its own module. |
| `hexagonal-multi-granular` | One per domain layer and one per adapter | Large services, where each adapter is compiled and tested separately. |
| `onion-single` | One | Teams that prefer onion: use cases live in `application` and there are no input ports. |

Read [how to choose the architecture](./guides/architectures/) to see the tree of each one.

## How the templates arrive

The plugin doesn't ship the code it generates. It reads it from the [templates repository](https://github.com/somospragma/backend-architecture-design-archetype-generator-templates), at the latest `v1.x.y` tag. When the team fixes a template or adds an adapter, it publishes a new tag and you get it on your next generation, without updating the plugin. If you need a project not to change, [pin the templates version](./guides/template-versions/).

## When to use it

- You are starting a Java microservice with Spring Boot and want the hexagonal or onion structure ready, with architecture tests from the first commit.
- You are adding adapters to a project created with the plugin and want them to follow the same package, naming and test conventions.
- You want the architecture rules checked in the build, not in code review.

## When not to

- The plugin didn't create your project. The generation commands read `.cleanarch.yml`, which only `initCleanArch` writes.
- You use Maven, Quarkus, Kotlin as the language of the generated classes, or Spring Boot 3. The templates generate Java 21 on Spring Boot `4.0.9` with Gradle.
- You need a traditional layered architecture or a modular monolith. The plugin only generates hexagonal and onion.

## Next step

Follow the [quick start](./quick-start/) to create a service with an entity, a use case and two adapters.
