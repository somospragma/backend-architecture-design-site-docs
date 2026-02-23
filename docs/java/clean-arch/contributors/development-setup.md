# Development Setup

This guide will help you set up your development environment to contribute to the Clean Architecture Generator.

## Prerequisites

### Required

- **Java 21** or higher
- **Gradle 8.5+** (wrapper included)
- **Git**

### Recommended

- **IntelliJ IDEA** or **VS Code** with Java extensions
- **Postman** or similar tool for API testing

## Project Structure

The project consists of three main modules:

```
java-archetype-generator/
├── backend-architecture-design-archetype-generator-core/     # Gradle plugin
├── backend-architecture-design-archetype-generator-templates/ # Templates
└── backend-architecture-design-site-docs/                    # Documentation
```

## Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/somospragma/backend-architecture-design.git
cd backend-architecture-design
```

### 2. Verify Java Version

```bash
java -version
# Should show Java 21 or higher
```

### 3. Build the Plugin

```bash
cd backend-architecture-design-archetype-generator-core
./gradlew clean build -x test
```

### 4. Publish to Maven Local

This makes the plugin available for local testing:

```bash
./gradlew publishToMavenLocal
```

You should see:

```
BUILD SUCCESSFUL in Xs
```

## Development Workflow

### Working with Templates in Development Mode

When developing, you want to test template changes without rebuilding the plugin every time. Configure your test project to use local templates:

#### Option 1: Auto-Detection (Recommended for Plugin Development)

If your directory structure is:

```
java-archetype-generator/
├── backend-architecture-design-archetype-generator-core/
│   └── test-order-service/  ← Your test project
└── backend-architecture-design-archetype-generator-templates/
    └── templates/
```

The plugin will automatically detect and use local templates.

#### Option 2: Explicit Configuration

Create or edit `.cleanarch.yml` in your test project:

```yaml
project:
  name: test-order-service
  basePackage: com.pragma.test.order
  pluginVersion: 0.1.15-SNAPSHOT
  createdAt: 2026-01-31T10:00:00

architecture:
  type: hexagonal-single
  paradigm: reactive
  framework: spring

# Development mode: use local templates
templates:
  mode: developer
  localPath: /absolute/path/to/backend-architecture-design-archetype-generator-templates/templates
  cache: false
```

**Important:** Use absolute paths, not relative paths.

### Testing Your Changes

#### 1. Create a Test Project

```bash
cd backend-architecture-design-archetype-generator-core
mkdir test-my-feature
cd test-my-feature
```

#### 2. Create `build.gradle.kts`

```kotlin
plugins {
    id("com.pragma.archetype-generator") version "0.1.15-SNAPSHOT"
}
```

#### 3. Create `settings.gradle.kts`

```kotlin
rootProject.name = "test-my-feature"

pluginManagement {
    repositories {
        mavenLocal()  // Important: loads from local Maven
        gradlePluginPortal()
    }
}
```

#### 4. Initialize Project

```bash
../gradlew initCleanArch --packageName=com.example.test
```

#### 5. Generate Components

```bash
# Generate entity
../gradlew generateEntity --name=Product --fields="name:String,price:BigDecimal" --hasId

# Generate use case
../gradlew generateUseCase --name=CreateProduct --methods="create:Mono:product:Product"

# Generate adapter
../gradlew generateOutputAdapter --name=ProductCache --type=redis --entity=Product
```

#### 6. Verify Build

```bash
../gradlew build -x test
```

### Iterative Development Cycle

When making changes:

**For Plugin Code Changes:**

```bash
# 1. Make changes to Java code
# 2. Rebuild and publish
./gradlew clean build publishToMavenLocal -x test

# 3. Test in your test project
cd test-my-feature
../gradlew clean
../gradlew initCleanArch --packageName=com.example.test
```

**For Template Changes:**

```bash
# 1. Make changes to templates
# 2. No rebuild needed if using local templates!
# 3. Just regenerate in your test project
cd test-my-feature
rm -rf src/  # Clean previous generation
../gradlew initCleanArch --packageName=com.example.test
```

## IDE Setup

### IntelliJ IDEA

1. **Import Project**
   - File → Open → Select `backend-architecture-design-archetype-generator-core`
   - Choose "Import Gradle Project"

2. **Configure Java SDK**
   - File → Project Structure → Project
   - Set SDK to Java 21

3. **Enable Gradle Auto-Import**
   - Settings → Build, Execution, Deployment → Build Tools → Gradle
   - Check "Reload Gradle project on build file changes"

4. **Recommended Plugins**
   - Gradle
   - FreeMarker (for template editing)
   - YAML

### VS Code

1. **Install Extensions**
   - Extension Pack for Java
   - Gradle for Java
   - YAML

2. **Open Workspace**
   ```bash
   code backend-architecture-design-archetype-generator-core
   ```

## Troubleshooting

### Plugin Not Found

**Problem:** `Plugin [id: 'com.pragma.archetype-generator', version: '0.1.15-SNAPSHOT'] was not found`

**Solution:**
1. Verify you published to Maven Local: `./gradlew publishToMavenLocal`
2. Check `settings.gradle.kts` includes `mavenLocal()` in `pluginManagement.repositories`
3. Try: `./gradlew clean --refresh-dependencies`

### Templates Not Found

**Problem:** Plugin uses embedded templates instead of local ones

**Solution:**
1. Check your directory structure matches the expected layout
2. Verify `.cleanarch.yml` has correct absolute path
3. Look at Gradle output to see which template source is being used

### Build Failures

**Problem:** Compilation errors after changes

**Solution:**
1. Clean build: `./gradlew clean`
2. Refresh dependencies: `./gradlew --refresh-dependencies`
3. Reimport project in IDE
4. Check Java version: `java -version`

### Template Syntax Errors

**Problem:** FreeMarker template errors

**Solution:**
1. Check FreeMarker syntax: `${variable}`, `<#if>`, `<#list>`
2. Verify variable names match context in generator
3. Test with simple template first

## Useful Commands

```bash
# Build plugin
./gradlew build

# Build without tests
./gradlew build -x test

# Publish to Maven Local
./gradlew publishToMavenLocal

# Clean build
./gradlew clean build

# Run specific test
./gradlew test --tests "ClassName.methodName"

# Check dependencies
./gradlew dependencies

# Refresh dependencies
./gradlew --refresh-dependencies
```

## Next Steps

Now that your environment is set up, you can:

- [Add a New Architecture](./adding-architecture.md)
- [Add a New Command](./adding-command.md)
- [Add a New Adapter](./adding-adapter.md)
- [Understand the Template System](./template-system.md)
