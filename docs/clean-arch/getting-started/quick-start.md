# Quick Start

Get started with Clean Architecture Generator in 5 minutes!

## Step 1: Create a New Project

```bash
mkdir my-service
cd my-service
```

## Step 2: Add the Plugin

Create a `build.gradle.kts` file:

```kotlin
plugins {
    id("com.pragma.archetype-generator") version "1.0.0"
}
```

## Step 3: Initialize Clean Architecture

```bash
./gradlew initCleanArch \
  --architecture=hexagonal-single \
  --paradigm=reactive \
  --framework=spring \
  --package=com.company.myservice
```

## Step 4: Build and Run

```bash
./gradlew build
./gradlew bootRun
```

That's it! You now have a clean architecture project running.

## Next Steps

- [Create Your First Project](first-project)
- [Learn About Architectures](../guides/architectures/hexagonal)
- [Explore Commands](../reference/commands)
