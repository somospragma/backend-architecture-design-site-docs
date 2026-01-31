# Welcome to Pragma Libs

**Pragma Libs** is a collection of open-source libraries and tools designed to accelerate software development with best practices, clean architecture, and developer experience in mind.

Our libraries support multiple platforms, languages, and frameworks, helping development teams deliver better software faster.

## Available Libraries

### Clean Architecture Generator

A Gradle plugin that helps you create well-structured projects following clean architecture principles. It supports multiple architectures, frameworks, and paradigms.

**Key Features:**
- 🏗️ **Multiple Architectures**: Hexagonal, Onion
- 🚀 **Multiple Frameworks**: Spring Boot, Quarkus (coming soon)
- ⚡ **Reactive & Imperative**: Support for both paradigms
- 📦 **Component Generators**: Generate entities, use cases, and adapters on demand
- 🎯 **Best Practices**: Follows clean architecture principles out of the box

**Quick Example:**

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

[Get Started with Clean Architecture Generator →](getting-started/installation)

---

## More Libraries Coming Soon

Stay tuned for more open-source libraries supporting different platforms and languages!

## About Pragma

Pragma is committed to building high-quality open-source tools and libraries that help development teams deliver better software faster, regardless of the technology stack they use.
