# Hexagonal Architecture

Hexagonal Architecture (also known as Ports and Adapters) is a software design pattern that aims to create loosely coupled application components.

## Overview

The hexagonal architecture divides a system into several loosely-coupled interchangeable components, such as the application core, the database, the user interface, test scripts and interfaces with other systems.

## Structure

```
src/main/java/com/company/service/
├── domain/
│   ├── model/              # Domain entities
│   ├── port/
│   │   ├── in/             # Input ports (use cases)
│   │   └── out/            # Output ports (repositories, services)
│   └── usecase/            # Use case implementations
└── infrastructure/
    ├── entry-points/       # Entry points (REST, GraphQL, gRPC, etc.)
    ├── driven-adapters/    # Driven adapters (DB, Redis, Kafka, etc.)
    └── config/             # Configuration classes
```

## Variants

### Single Module

All code in one module with clear package separation.

```bash
./gradlew initCleanArch --architecture=hexagonal-single
```

### Multi Module (3 modules)

Separated into domain, application, and infrastructure modules.

```bash
./gradlew initCleanArch --architecture=hexagonal-multi
```

### Multi Module Granular

Each component is a separate module for maximum modularity.

```bash
./gradlew initCleanArch --architecture=hexagonal-multi-granular
```

## Benefits

- **Testability**: Easy to test business logic in isolation
- **Flexibility**: Easy to swap adapters without changing business logic
- **Maintainability**: Clear separation of concerns
- **Independence**: Business logic doesn't depend on frameworks

## When to Use

- ✅ Projects with complex business logic
- ✅ Projects that need to support multiple interfaces
- ✅ Projects that require high testability
- ✅ Long-term projects that need maintainability

## Learn More

- [Create a Hexagonal Project](../../getting-started/first-project)
- [Spring Reactive with Hexagonal](../frameworks/spring-reactive)
