# Installation

## Prerequisites

Before you begin, ensure you have the following installed:

- **Java 21** or higher
- **Gradle 8.x** or higher

## Adding the Plugin

### Step 1: Configure Plugin Repository

Add `mavenLocal()` to your `settings.gradle.kts`:

```kotlin
pluginManagement {
    repositories {
        mavenLocal()
        gradlePluginPortal()
        mavenCentral()
    }
}
```

### Step 2: Add the Plugin

Add the Clean Architecture Generator plugin to your `build.gradle.kts`:

```kotlin
plugins {
    id("com.pragma.archetype-generator") version "0.1.15-SNAPSHOT"
    id("java")
}
```

### Step 3: Configure Java Version

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}
```

## Verify Installation

Run the following command to verify the plugin is installed:

```bash
./gradlew tasks --group="clean architecture"
```

You should see the available tasks:

```
Clean Architecture tasks
------------------------
initCleanArch - Initialize a clean architecture project
generateEntity - Generate a domain entity
generateUseCase - Generate a use case (port and implementation)
generateOutputAdapter - Generate an output adapter (Redis, MongoDB, etc.)
generateInputAdapter - Generate an input adapter (REST controller, GraphQL resolver, etc.)
```

## Next Steps

- [Quick Start Guide](quick-start)
- [Create Your First Project](first-project)
