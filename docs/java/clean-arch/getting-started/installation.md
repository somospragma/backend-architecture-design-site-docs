# Instalación

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- **Java 21** o superior
- **Gradle 8.x** o superior

## Agregar el Plugin

### Paso 1: Configurar el Repositorio del Plugin

Agrega `mavenLocal()` a tu archivo `settings.gradle.kts`:

```kotlin
pluginManagement {
    repositories {
        mavenLocal()
        gradlePluginPortal()
        mavenCentral()
    }
}
```

### Paso 2: Agregar el Plugin

Agrega el plugin Clean Architecture Generator a tu archivo `build.gradle.kts`:

```kotlin
plugins {
    id("com.pragma.archetype-generator") version "0.1.15-SNAPSHOT"
    id("java")
}
```

### Paso 3: Configurar la Versión de Java

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}
```

## Verificar la Instalación

Ejecuta el siguiente comando para verificar que el plugin está instalado correctamente:

```bash
./gradlew tasks --group="clean architecture"
```

Deberías ver las tareas disponibles:

```
Clean Architecture tasks
------------------------
initCleanArch - Inicializar un proyecto con arquitectura limpia
generateEntity - Generar una entidad de dominio
generateUseCase - Generar un caso de uso (puerto e implementación)
generateOutputAdapter - Generar un adaptador de salida (Redis, MongoDB, etc.)
generateInputAdapter - Generar un adaptador de entrada (controlador REST, resolver GraphQL, etc.)
```

## Próximos Pasos

- [Guía de Inicio Rápido](quick-start)
- [Crear tu Primer Proyecto](first-project)
- [Agregar Adaptadores](adding-adapters)
