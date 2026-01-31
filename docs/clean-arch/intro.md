# Clean Architecture Generator

Welcome to the **Clean Architecture Generator** documentation!

## What is Clean Architecture Generator?

Clean Architecture Generator is a Gradle plugin that helps you create well-structured microservices following clean architecture principles. It supports multiple architectures, frameworks, and paradigms.

## Key Features

- 🏗️ **Multiple Architectures**: Hexagonal, Onion
- 🚀 **Multiple Frameworks**: Spring Boot, Quarkus (coming soon)
- ⚡ **Reactive & Imperative**: Support for both paradigms
- 📦 **Component Generators**: Generate entities, use cases, and adapters on demand
- 🎯 **Best Practices**: Follows clean architecture principles out of the box

## Quick Example

```bash
# Create a new project
mkdir payment-service
cd payment-service

# Add the plugin
cat > build.gradle.kts << 'EOF'
plugins {
    id("com.pragma.archetype-generator") version "1.0.0"
}
EOF

# Initialize clean architecture
./gradlew initCleanArch \
  --architecture=hexagonal-single \
  --paradigm=reactive \
  --framework=spring \
  --package=com.company.payment

# Generate components
./gradlew generateEntity --name=Payment
./gradlew generateUseCase --name=ProcessPayment
./gradlew generateOutputAdapter --type=redis --name=PaymentCache
```

## Next Steps

- [Installation Guide](getting-started/installation)
- [Quick Start Tutorial](getting-started/quick-start)
- [Create Your First Project](getting-started/first-project)
