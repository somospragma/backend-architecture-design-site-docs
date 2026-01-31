# Clean Architecture Generator

Welcome to the **Clean Architecture Generator** documentation!

## What is Clean Architecture Generator?

Clean Architecture Generator is a Gradle plugin that helps you create well-structured microservices following clean architecture principles. It automates the creation of projects, entities, use cases, and adapters, allowing you to focus on business logic instead of boilerplate code.

## Key Features

- 🏗️ **Multiple Architectures**: Hexagonal (Ports & Adapters), Onion
- 🚀 **Multiple Frameworks**: Spring Boot (Reactive & Imperative)
- ⚡ **Reactive & Imperative**: Full support for both paradigms
- 📦 **Component Generators**: Generate entities, use cases, and adapters on demand
- 🎯 **Best Practices**: Follows clean architecture principles out of the box
- 🔄 **CRUD Operations**: Auto-generated CRUD operations for adapters
- 🗺️ **MapStruct Integration**: Automatic mapper generation
- 🧪 **Test-Ready**: Generated code ready for testing

## Supported Technologies

### Architectures
- **Hexagonal (Ports & Adapters)**: Single module, multi-module, and granular variants
- **Onion Architecture**: Single and multi-module variants

### Frameworks
- **Spring Boot 3.x**: With WebFlux (reactive) or Spring MVC (imperative)
- **Quarkus**: Coming soon

### Databases & Caches
- **Redis**: Reactive cache adapter
- **MongoDB**: Document database adapter
- **PostgreSQL**: R2DBC reactive adapter
- **More**: DynamoDB, MySQL (coming soon)

### Input Adapters
- **REST API**: Spring WebFlux controllers
- **GraphQL**: Coming soon
- **gRPC**: Coming soon
- **WebSocket**: Coming soon

## Quick Example

```bash
# 1. Initialize project
./gradlew initCleanArch \
  --architecture=hexagonal-single \
  --paradigm=reactive \
  --framework=spring \
  --package=com.pragma.payment

# 2. Generate entity
./gradlew generateEntity \
  --name=Payment \
  --fields=amount:BigDecimal,currency:String,status:PaymentStatus \
  --packageName=com.pragma.payment.domain.model

# 3. Generate use case
./gradlew generateUseCase \
  --name=ProcessPayment \
  --methods=execute:PaymentResult:payment:Payment \
  --packageName=com.pragma.payment.domain.port.in

# 4. Generate Redis adapter
./gradlew generateOutputAdapter \
  --name=PaymentRepository \
  --entity=Payment \
  --type=redis \
  --packageName=com.pragma.payment.infrastructure.driven-adapters.redis

# 5. Generate REST controller
./gradlew generateInputAdapter \
  --name=Payment \
  --useCase=ProcessPaymentUseCase \
  --endpoints="/payments:POST:execute:PaymentResult:payment:BODY:Payment" \
  --packageName=com.pragma.payment.infrastructure.entry-points.rest
```

## Why Clean Architecture?

Clean Architecture provides:

- **Independence**: Business logic independent of frameworks, UI, and databases
- **Testability**: Easy to test business rules without external dependencies
- **Flexibility**: Easy to change frameworks, databases, or UI
- **Maintainability**: Clear separation of concerns
- **Scalability**: Well-organized code that scales with your team

## Architecture Layers

### Domain Layer
- **Entities**: Core business objects
- **Ports**: Interfaces defining contracts (input and output)
- **Business Logic**: Pure business rules

### Application Layer
- **Use Cases**: Application-specific business rules
- **Orchestration**: Coordinates flow between domain and infrastructure

### Infrastructure Layer
- **Input Adapters**: REST controllers, GraphQL resolvers, message consumers
- **Output Adapters**: Database repositories, cache adapters, external API clients
- **Configuration**: Framework-specific configuration

## Current Version

**Version**: 0.1.15-SNAPSHOT

**Status**: Phase 2 Complete + Nomenclature Update
- ✅ Project initialization
- ✅ Entity generation
- ✅ Use case generation
- ✅ Output adapter generation (Redis, MongoDB, PostgreSQL)
- ✅ Input adapter generation (REST controllers)
- ✅ Correct nomenclature: `driven-adapters` and `entry-points`

## Getting Started

Choose your path:

### 🚀 Quick Start (10 minutes)
Jump right in and build a complete service:
- [Quick Start Guide](getting-started/quick-start)

### 📚 Detailed Tutorial (30 minutes)
Learn step-by-step with explanations:
- [First Project Tutorial](getting-started/first-project)

### 📖 Learn the Concepts
Understand the architecture:
- [Hexagonal Architecture](guides/architectures/hexagonal)
- [Spring Reactive Guide](guides/frameworks/spring-reactive)

### 🔧 Reference Documentation
Look up specific commands:
- [Commands Reference](reference/commands)
- [Component Generators](guides/generators/entities)

## Community & Support

- **GitHub**: [pragma/clean-arch-generator](https://github.com/pragma)
- **Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas

## License

MIT License - feel free to use in your projects!

---

Ready to build clean, maintainable microservices? Let's get started! 🚀
