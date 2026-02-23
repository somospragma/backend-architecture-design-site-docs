# Adding a New Architecture

This guide explains how to add support for a new architectural pattern to the Clean Architecture Generator.

## Overview

Adding a new architecture involves:

1. **Define the architecture type** in the domain model
2. **Create the architecture template structure** 
3. **Create project templates** (build files, configuration)
4. **Update the project generator** to handle the new architecture
5. **Test the implementation**

## Step-by-Step Guide

### Step 1: Define Architecture Type

Edit `ArchitectureType.java` to add your new architecture:

**File:** `src/main/java/com/pragma/archetype/domain/model/ArchitectureType.java`

```java
public enum ArchitectureType {
    HEXAGONAL_SINGLE("hexagonal-single", false),
    HEXAGONAL_MULTI("hexagonal-multi", true),
    HEXAGONAL_MULTI_GRANULAR("hexagonal-multi-granular", true),
    ONION_SINGLE("onion-single", false),
    ONION_MULTI("onion-multi", true),
    
    // Add your new architecture here
    VERTICAL_SLICE("vertical-slice", false),  // Example: Vertical Slice Architecture
    
    private final String value;
    private final boolean multiModule;
    
    // ... rest of the enum
}
```

**Parameters:**
- `value`: The string identifier used in commands (kebab-case)
- `multiModule`: `true` if architecture uses multiple Gradle modules, `false` for single module

### Step 2: Create Architecture Template Structure

Create the directory structure in the templates repository:

```bash
cd backend-architecture-design-archetype-generator-templates/templates
mkdir -p architectures/vertical-slice/project
```

The structure should be:

```
templates/
└── architectures/
    └── vertical-slice/
        ├── structure.yml          # Package structure definition
        └── project/               # Project initialization templates
            ├── build.gradle.kts.ftl
            ├── settings.gradle.kts.ftl
            ├── BeanConfiguration.java.ftl
            ├── Application.java.ftl
            ├── application.yml.ftl
            ├── .gitignore.ftl
            └── README.md.ftl
```

### Step 3: Create `structure.yml`

This file defines the package and directory structure for your architecture.

**File:** `templates/architectures/vertical-slice/structure.yml`

```yaml
name: "Vertical Slice Architecture"
description: "Organize code by feature/slice rather than technical layers"
type: "vertical-slice"
multiModule: false

# Directories to create
directories:
  - "src/main/java"
  - "src/main/resources"
  - "src/test/java"
  - "src/test/resources"

# Package structure (relative to basePackage)
packages:
  - "features"           # Each feature is a slice
  - "shared/domain"      # Shared domain models
  - "shared/infrastructure"  # Shared infrastructure
  - "config"             # Application configuration
```

**Key Fields:**

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Human-readable name | "Vertical Slice Architecture" |
| `description` | Brief description | "Organize by feature..." |
| `type` | Must match `ArchitectureType` value | "vertical-slice" |
| `multiModule` | Single or multi-module | `false` |
| `directories` | Source directories to create | `["src/main/java", ...]` |
| `packages` | Package structure | `["features", "shared/domain"]` |

### Step 4: Create Project Templates

Create FreeMarker templates for project files:

#### 4.1 Build Configuration

**File:** `templates/architectures/vertical-slice/project/build.gradle.kts.ftl`

```kotlin
plugins {
    id("org.springframework.boot") version "${springBootVersion}"
    id("io.spring.dependency-management") version "1.1.4"
    id("com.pragma.archetype-generator") version "${pluginVersion}"
    java
}

group = "${groupId}"
version = "${version}"

java {
    sourceCompatibility = JavaVersion.VERSION_${javaVersion}
}

repositories {
    mavenCentral()
    mavenLocal()
}

dependencies {
    // Spring Boot WebFlux
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    
    // Validation
    implementation("org.springframework.boot:spring-boot-starter-validation")
    
    // Lombok (optional)
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    
    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.projectreactor:reactor-test")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
```

**Available Variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `${projectName}` | Project name | "my-service" |
| `${basePackage}` | Base package | "com.example.myservice" |
| `${packagePath}` | Package as path | "com/example/myservice" |
| `${groupId}` | Maven group ID | "com.example" |
| `${version}` | Project version | "0.0.1-SNAPSHOT" |
| `${springBootVersion}` | Spring Boot version | "3.2.1" |
| `${pluginVersion}` | Plugin version | "0.1.15-SNAPSHOT" |
| `${javaVersion}` | Java version | "21" |
| `${isReactive}` | Boolean for reactive | `true` |
| `${isSpring}` | Boolean for Spring | `true` |

#### 4.2 Settings Configuration

**File:** `templates/architectures/vertical-slice/project/settings.gradle.kts.ftl`

```kotlin
rootProject.name = "${projectName}"

pluginManagement {
    repositories {
        mavenLocal()
        gradlePluginPortal()
    }
}
```

#### 4.3 Git Ignore

**File:** `templates/architectures/vertical-slice/project/.gitignore.ftl`

```
# Gradle
.gradle/
build/
!gradle/wrapper/gradle-wrapper.jar

# IDE
.idea/
*.iml
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Application
*.log
```

#### 4.4 Application Configuration

**Note:** The `application.yml` is typically shared across architectures and is located in:
`templates/architectures/vertical-slice/project/application.yml.ftl`

Or you can use the framework-specific one from:
`templates/frameworks/spring/reactive/project/application.yml.ftl`

**File:** `templates/architectures/vertical-slice/project/application.yml.ftl`

```yaml
spring:
  application:
    name: ${projectName}
  
  webflux:
    base-path: /api

server:
  port: 8080

logging:
  level:
    root: INFO
    ${basePackage}: DEBUG
```

#### 4.5 Main Application Class

**File:** `templates/architectures/vertical-slice/project/Application.java.ftl`

```java
package ${basePackage};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for ${projectName}.
 * Generated with Clean Architecture Generator - Vertical Slice Architecture.
 */
@SpringBootApplication
public class ${projectNamePascalCase}Application {

    public static void main(String[] args) {
        SpringApplication.run(${projectNamePascalCase}Application.class, args);
    }
}
```

#### 4.6 README

**File:** `templates/architectures/vertical-slice/project/README.md.ftl`

```markdown
# ${projectName}

Generated with Clean Architecture Generator - Vertical Slice Architecture

## Architecture

This project follows Vertical Slice Architecture principles:

- **Features**: Each feature is a self-contained slice
- **Shared**: Common domain models and infrastructure
- **Configuration**: Application-wide configuration

## Structure

\`\`\`
${basePackage}/
├── features/
│   └── [feature-name]/
│       ├── [FeatureName]Controller.java
│       ├── [FeatureName]Service.java
│       └── [FeatureName]Repository.java
├── shared/
│   ├── domain/
│   └── infrastructure/
└── config/
    └── BeanConfiguration.java
\`\`\`

## Available Commands

\`\`\`bash
# Generate a new feature slice
./gradlew generateFeature --name=CreateOrder

# Build the project
./gradlew build

# Run the application
./gradlew bootRun
\`\`\`

## Configuration

Edit \`src/main/resources/application.yml\` to configure the application.
```

### Step 5: Create Application Configuration Template

**File:** `templates/frameworks/spring/reactive/project/application.yml.ftl`

(This is shared across architectures, but you can create architecture-specific ones if needed)

```yaml
spring:
  application:
    name: ${projectName}
  
  webflux:
    base-path: /api

server:
  port: 8080

logging:
  level:
    root: INFO
    ${basePackage}: DEBUG
```

### Step 6: Create BeanConfiguration Template

**File:** `templates/architectures/vertical-slice/project/BeanConfiguration.java.ftl`

```java
package ${basePackage}.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * Spring configuration for dependency injection.
 * Scans all feature slices and shared components.
 */
@Configuration
@ComponentScan(
    basePackages = {
        "${basePackage}.features",
        "${basePackage}.shared"
    }
)
public class BeanConfiguration {
    // Spring will automatically detect and register all components
}
```

### Step 7: Update ProjectGenerator

Edit `ProjectGenerator.java` to handle the new architecture's directory structure:

**File:** `src/main/java/com/pragma/archetype/application/generator/ProjectGenerator.java`

Find the `generateArchitectureStructure` method and add your case:

```java
private List<GeneratedFile> generateArchitectureStructure(
        Path projectPath,
        ProjectConfig config,
        Map<String, Object> context) {

    List<GeneratedFile> files = new ArrayList<>();

    Path basePath = projectPath
            .resolve("src/main/java")
            .resolve(config.basePackage().replace('.', '/'));

    switch (config.architecture()) {
        case HEXAGONAL_SINGLE, HEXAGONAL_MULTI, HEXAGONAL_MULTI_GRANULAR -> {
            // ... existing hexagonal code
        }
        case ONION_SINGLE, ONION_MULTI -> {
            // ... existing onion code
        }
        case VERTICAL_SLICE -> {
            // Create vertical slice structure
            fileSystemPort.createDirectory(basePath.resolve("features"));
            fileSystemPort.createDirectory(basePath.resolve("shared/domain"));
            fileSystemPort.createDirectory(basePath.resolve("shared/infrastructure"));
            fileSystemPort.createDirectory(basePath.resolve("config"));

            // Add .gitkeep files
            files.add(GeneratedFile.create(
                    basePath.resolve("features/.gitkeep"),
                    ""));
            files.add(GeneratedFile.create(
                    basePath.resolve("shared/domain/.gitkeep"),
                    ""));
            files.add(GeneratedFile.create(
                    basePath.resolve("shared/infrastructure/.gitkeep"),
                    ""));
            files.add(GeneratedFile.create(
                    basePath.resolve("config/.gitkeep"),
                    ""));
        }
    }

    return files;
}
```

### Step 8: Test Your Architecture

#### 8.1 Publish Plugin

```bash
cd backend-architecture-design-archetype-generator-core
./gradlew clean build publishToMavenLocal -x test
```

#### 8.2 Create Test Project

```bash
mkdir test-vertical-slice
cd test-vertical-slice
```

Create `build.gradle.kts`:

```kotlin
plugins {
    id("com.pragma.archetype-generator") version "0.1.15-SNAPSHOT"
}
```

Create `settings.gradle.kts`:

```kotlin
rootProject.name = "test-vertical-slice"

pluginManagement {
    repositories {
        mavenLocal()
        gradlePluginPortal()
    }
}
```

#### 8.3 Initialize Project

```bash
../gradlew initCleanArch --architecture=vertical-slice --packageName=com.example.test
```

#### 8.4 Verify Structure

```bash
tree src/
```

Expected output:

```
src/
└── main/
    ├── java/
    │   └── com/
    │       └── example/
    │           └── test/
    │               ├── features/
    │               ├── shared/
    │               │   ├── domain/
    │               │   └── infrastructure/
    │               └── config/
    │                   └── BeanConfiguration.java
    └── resources/
        └── application.yml
```

#### 8.5 Verify Build

```bash
../gradlew build -x test
```

Should complete successfully.

## Architecture-Specific Generators (Optional)

If your architecture needs custom generators (e.g., `generateFeature` for vertical slices), you'll need to:

1. Create a new Gradle task in `infrastructure/adapter/in/gradle/`
2. Create a new use case in `application/usecase/`
3. Create a new generator in `application/generator/`
4. Register the task in `CleanArchPlugin.java`

See [Adding a New Command](./adding-command.md) for details.

## Checklist

Before submitting your contribution:

- [ ] Architecture type added to `ArchitectureType.java`
- [ ] `structure.yml` created with correct package structure
- [ ] All project templates created (build.gradle.kts, settings.gradle.kts, etc.)
- [ ] `BeanConfiguration.java.ftl` created
- [ ] `ProjectGenerator.java` updated to handle new architecture
- [ ] Tested with `initCleanArch` command
- [ ] Project builds successfully
- [ ] Documentation updated
- [ ] Examples added to README

## Examples

See existing architectures for reference:

- **Hexagonal Single**: `templates/architectures/hexagonal-single/`
- **Onion Single**: `templates/architectures/onion-single/` (if implemented)

## Need Help?

- Check existing architecture implementations
- Ask in [GitHub Discussions](https://github.com/somospragma/backend-architecture-design/discussions)
- Review [Template System](./template-system.md) documentation
