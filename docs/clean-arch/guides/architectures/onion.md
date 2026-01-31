# Onion Architecture

Onion Architecture is a software design pattern that emphasizes the separation of concerns through concentric layers.

## Overview

The Onion Architecture places the domain model at the center and builds layers around it, with dependencies pointing inward.

## Structure

```
src/main/java/com/company/service/
├── core/
│   ├── domain/         # Domain entities (innermost layer)
│   └── application/    # Application services
│       ├── service/
│       └── port/
└── infrastructure/     # Infrastructure (outermost layer)
    ├── adapter/
    └── config/
```

## Layers

1. **Domain Layer** (Core): Pure business logic, no dependencies
2. **Application Layer**: Use cases and application services
3. **Infrastructure Layer**: Technical details (DB, REST, etc.)

## Variants

### Single Module

```bash
./gradlew initCleanArch --architecture=onion-single
```

### Multi Module

```bash
./gradlew initCleanArch --architecture=onion-multi
```

## Benefits

- **Dependency Rule**: Dependencies point inward
- **Testability**: Core is independent of infrastructure
- **Flexibility**: Easy to change infrastructure
- **Focus**: Business logic is at the center

## When to Use

- ✅ Domain-driven design projects
- ✅ Projects with complex business rules
- ✅ Projects that prioritize domain model
- ✅ Long-term enterprise applications

## Hexagonal vs Onion

| Aspect | Hexagonal | Onion |
|--------|-----------|-------|
| Focus | Ports and Adapters | Concentric Layers |
| Structure | domain/ + infrastructure/ | core/ + infrastructure/ |
| Emphasis | Interfaces (ports) | Layers of abstraction |

## Learn More

- [Create an Onion Project](../../getting-started/first-project)
- [Hexagonal Architecture](hexagonal)
