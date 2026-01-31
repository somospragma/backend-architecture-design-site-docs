# Installation

## Prerequisites

Before you begin, ensure you have the following installed:

- **Java 21** or higher
- **Gradle 8.x** or higher

## Adding the Plugin

Add the Clean Architecture Generator plugin to your `build.gradle.kts`:

```kotlin
plugins {
    id("com.pragma.archetype-generator") version "1.0.0"
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
generateUseCase - Generate a use case
generateOutputAdapter - Generate an output adapter
generateInputAdapter - Generate an input adapter
listComponents - List all generated components
```

## Next Steps

- [Quick Start Guide](quick-start)
- [Create Your First Project](first-project)
