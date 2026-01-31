# Quick Start

Get started with Clean Architecture Generator in 10 minutes! Build a complete User service with REST API.

## Prerequisites

- Java 21 or higher
- Gradle 8.x or higher

## Step 1: Create a New Project

```bash
mkdir user-service
cd user-service
```

## Step 2: Configure Plugin

Create `settings.gradle.kts`:

```kotlin
pluginManagement {
    repositories {
        mavenLocal()
        gradlePluginPortal()
        mavenCentral()
    }
}

rootProject.name = "user-service"
```

Create `build.gradle.kts`:

```kotlin
plugins {
    id("com.pragma.archetype-generator") version "0.1.15-SNAPSHOT"
    id("java")
}

group = "com.pragma"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

repositories {
    mavenCentral()
}
```

## Step 3: Initialize Clean Architecture

```bash
./gradlew initCleanArch \
  --architecture=hexagonal-single \
  --paradigm=reactive \
  --framework=spring \
  --package=com.pragma.user
```

This creates:
- ✅ Project structure with clean architecture layers
- ✅ `build.gradle.kts` with Spring Boot dependencies
- ✅ `.cleanarch.yml` configuration file
- ✅ Base package structure

## Step 4: Generate Domain Entity

```bash
./gradlew generateEntity \
  --name=User \
  --fields=name:String,email:String,age:Integer \
  --packageName=com.pragma.user.domain.model
```

Generated: `User.java` with id, name, email, and age fields.

## Step 5: Generate Use Case

```bash
./gradlew generateUseCase \
  --name=CreateUser \
  --methods=execute:User:userData:UserData \
  --packageName=com.pragma.user.domain.port.in
```

Generated:
- ✅ `CreateUserUseCase.java` (port interface)
- ✅ `CreateUserUseCaseImpl.java` (implementation)

## Step 6: Generate Output Adapter (Redis)

```bash
./gradlew generateOutputAdapter \
  --name=UserRepository \
  --entity=User \
  --type=redis \
  --packageName=com.pragma.user.infrastructure.driven-adapters.redis
```

Generated:
- ✅ `UserRepositoryAdapter.java` (Redis adapter)
- ✅ `UserMapper.java` (MapStruct mapper)
- ✅ `UserData.java` (Redis entity)

## Step 7: Generate Input Adapter (REST Controller)

```bash
./gradlew generateInputAdapter \
  --name=User \
  --useCase=CreateUserUseCase \
  --endpoints="/users:POST:execute:User:userData:BODY:UserData|/users/{id}:GET:findById:User:id:PATH:String" \
  --packageName=com.pragma.user.infrastructure.entry-points.rest
```

Generated: `UserController.java` with POST and GET endpoints.

## Step 8: Configure Application

Add to `src/main/resources/application.yml`:

```yaml
spring:
  application:
    name: user-service
  data:
    redis:
      host: localhost
      port: 6379

server:
  port: 8080
```

## Step 9: Build and Run

```bash
# Build the project
./gradlew build

# Run the application
./gradlew bootRun
```

## Step 10: Test Your API

```bash
# Create a user
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }'

# Get user by ID
curl http://localhost:8080/api/users/{id}
```

## What You've Built

In just 10 minutes, you've created:

- ✅ Clean architecture project structure
- ✅ Domain entity (User)
- ✅ Use case with port and implementation
- ✅ Redis repository adapter with CRUD operations
- ✅ REST API controller with reactive endpoints
- ✅ Complete separation of concerns

## Project Structure

```
user-service/
├── src/main/java/com/pragma/user/
│   ├── domain/
│   │   ├── model/
│   │   │   └── User.java
│   │   └── port/
│   │       └── in/
│   │           └── CreateUserUseCase.java
│   ├── application/
│   │   └── usecase/
│   │       └── CreateUserUseCaseImpl.java
│   └── infrastructure/
│       ├── entry-points/
│       │   └── rest/
│       │       └── UserController.java
│       └── driven-adapters/
│           └── redis/
│               ├── UserRepositoryAdapter.java
│               ├── mapper/
│               │   └── UserMapper.java
│               └── entity/
│                   └── UserData.java
├── build.gradle.kts
├── settings.gradle.kts
└── .cleanarch.yml
```

## Next Steps

### Add More Features

```bash
# Add more entities
./gradlew generateEntity --name=Profile --fields=bio:String,avatar:String ...

# Add more use cases
./gradlew generateUseCase --name=UpdateUser ...

# Add more adapters
./gradlew generateOutputAdapter --type=mongodb ...
```

### Learn More

- [Detailed Tutorial](first-project) - Step-by-step guide with explanations
- [Commands Reference](../reference/commands) - All available commands
- [Component Generators](../guides/generators/entities) - Deep dive into generators
- [Architecture Guide](../guides/architectures/hexagonal) - Understanding hexagonal architecture
- [Spring Reactive Guide](../guides/frameworks/spring-reactive) - Reactive programming patterns

## Common Issues

### Redis Connection Error

If you get a Redis connection error, make sure Redis is running:

```bash
# Using Docker
docker run -d -p 6379:6379 redis:latest

# Or install locally
brew install redis  # macOS
redis-server
```

### Build Errors

If you encounter build errors:

```bash
# Clean and rebuild
./gradlew clean build

# Check Java version
java -version  # Should be 21 or higher
```

### Plugin Not Found

Make sure `mavenLocal()` is in your `settings.gradle.kts`:

```kotlin
pluginManagement {
    repositories {
        mavenLocal()  // Important!
        gradlePluginPortal()
        mavenCentral()
    }
}
```

## Tips

1. **Start Simple**: Begin with `hexagonal-single` architecture
2. **Use Reactive**: Choose `reactive` paradigm for better scalability
3. **Test Each Step**: Generate and test components incrementally
4. **Follow Conventions**: Use PascalCase for names, proper package structure
5. **Read the Docs**: Check the detailed guides for best practices
