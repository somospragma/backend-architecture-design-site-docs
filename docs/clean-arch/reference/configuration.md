# Configuration Reference

## .cleanarch.yml

The `.cleanarch.yml` file is automatically generated when you run `initCleanArch`. It contains the project configuration and tracks generated components.

### Example

```yaml
project:
  name: payment-service
  basePackage: com.company.payment
  createdAt: 2026-01-31T10:30:00Z
  pluginVersion: 1.0.0

architecture:
  type: hexagonal-single
  paradigm: reactive
  framework: spring

dependencies:
  springBoot: 3.2.0
  java: 21
  mapstruct: 1.5.5.Final

components:
  adapters:
    input:
      - name: PaymentController
        type: rest
        createdAt: 2026-01-31T10:35:00Z
    output:
      - name: PaymentCacheRedisAdapter
        type: redis
        createdAt: 2026-01-31T10:36:00Z
  usecases:
    - name: ProcessPaymentUseCase
      createdAt: 2026-01-31T10:34:00Z
  entities:
    - name: Payment
      createdAt: 2026-01-31T10:33:00Z
```

## Configuration Fields

### project

- `name`: Project name
- `basePackage`: Base Java package
- `createdAt`: Project creation timestamp
- `pluginVersion`: Plugin version used

### architecture

- `type`: Architecture type (hexagonal-single, hexagonal-multi, etc.)
- `paradigm`: Programming paradigm (reactive, imperative)
- `framework`: Framework (spring, quarkus)

### dependencies

- `springBoot`: Spring Boot version
- `java`: Java version
- `mapstruct`: MapStruct version

### components

Tracks all generated components:
- `adapters.input`: Input adapters (controllers, consumers)
- `adapters.output`: Output adapters (repositories, clients)
- `usecases`: Use cases
- `entities`: Domain entities
- `mappers`: MapStruct mappers

## Modifying Configuration

:::warning
Do not manually edit `.cleanarch.yml` unless you know what you're doing. The plugin uses this file to track components and avoid duplicates.
:::

If you need to regenerate a component, delete its entry from `.cleanarch.yml` first.

## Next Steps

- [Commands Reference](commands)
- [Quick Start Guide](../getting-started/quick-start)
