# Template System

This guide explains how the template system works in the Clean Architecture Generator.

## Overview

The template system uses **FreeMarker** to generate code from templates. Templates are organized in a two-level hierarchy:

1. **Architecture Level**: Defines project structure and initialization
2. **Framework Level**: Provides framework-specific implementations

## Directory Structure

```
templates/
├── architectures/              # Architecture definitions
│   └── {architecture-type}/
│       ├── structure.yml       # Package structure definition
│       └── project/            # Project initialization templates
│           ├── build.gradle.kts.ftl
│           ├── settings.gradle.kts.ftl
│           ├── BeanConfiguration.java.ftl
│           ├── Application.java.ftl
│           ├── application.yml.ftl
│           ├── .gitignore.ftl
│           └── README.md.ftl
│
└── frameworks/                 # Framework implementations
    └── {framework}/
        └── {paradigm}/
            ├── metadata.yml
            ├── project/        # Framework project files
            │   ├── Application.java.ftl
            │   └── application.yml.ftl
            ├── domain/         # Domain layer
            │   ├── Entity.java.ftl
            │   └── metadata.yml
            ├── usecase/        # Use case layer
            │   ├── InputPort.java.ftl
            │   ├── UseCase.java.ftl
            │   ├── Test.java.ftl
            │   └── metadata.yml
            └── adapters/       # Adapter layer
                ├── driven-adapters/    # Output adapters
                │   ├── index.json
                │   └── {adapter-type}/
                │       ├── Adapter.java.ftl
                │       ├── Config.java.ftl
                │       ├── Entity.java.ftl
                │       ├── Test.java.ftl
                │       └── metadata.yml
                └── entry-points/       # Input adapters
                    ├── index.json
                    └── {adapter-type}/
                        ├── Controller.java.ftl
                        ├── RequestDTO.java.ftl
                        ├── ResponseDTO.java.ftl
                        ├── DTOMapper.java.ftl
                        ├── Test.java.ftl
                        └── metadata.yml
```

## Current Structure (Real)

### Architectures

```
templates/architectures/
└── hexagonal-single/
    ├── structure.yml
    └── project/
        ├── build.gradle.kts.ftl
        ├── settings.gradle.kts.ftl
        ├── BeanConfiguration.java.ftl
        ├── Application.java.ftl
        ├── application.yml.ftl
        ├── .gitignore.ftl
        └── README.md.ftl
```

### Frameworks

```
templates/frameworks/
└── spring/
    └── reactive/
        ├── metadata.yml
        ├── project/
        │   ├── Application.java.ftl
        │   └── application.yml.ftl
        ├── domain/
        │   ├── Entity.java.ftl
        │   └── metadata.yml
        ├── usecase/
        │   ├── InputPort.java.ftl
        │   ├── UseCase.java.ftl
        │   ├── Test.java.ftl
        │   └── metadata.yml
        └── adapters/
            ├── driven-adapters/
            │   ├── index.json
            │   ├── redis/
            │   │   ├── Adapter.java.ftl
            │   │   ├── Config.java.ftl
            │   │   ├── Entity.java.ftl
            │   │   ├── Test.java.ftl
            │   │   └── metadata.yml
            │   └── generic/
            │       ├── Entity.java.ftl
            │       └── Mapper.java.ftl
            └── entry-points/
                ├── index.json
                └── rest/
                    ├── Controller.java.ftl
                    ├── RequestDTO.java.ftl
                    ├── ResponseDTO.java.ftl
                    ├── DTOMapper.java.ftl
                    ├── Test.java.ftl
                    └── metadata.yml
```

## Template Resolution

### Project Initialization

When running `initCleanArch`:

1. **Architecture Templates** (from `architectures/{type}/project/`):
   - `build.gradle.kts.ftl` → `build.gradle.kts`
   - `settings.gradle.kts.ftl` → `settings.gradle.kts`
   - `.gitignore.ftl` → `.gitignore`
   - `README.md.ftl` → `README.md`
   - `BeanConfiguration.java.ftl` → `src/main/java/{package}/infrastructure/config/BeanConfiguration.java`

2. **Framework Templates** (from `frameworks/{framework}/{paradigm}/project/`):
   - `Application.java.ftl` → `src/main/java/{package}/{ProjectName}Application.java`
   - `application.yml.ftl` → `src/main/resources/application.yml`

3. **Directory Structure** (from `architectures/{type}/structure.yml`):
   - Creates package directories
   - Adds `.gitkeep` files

### Component Generation

#### Entity Generation

**Template Path:** `frameworks/{framework}/{paradigm}/domain/Entity.java.ftl`

**Example:** `frameworks/spring/reactive/domain/Entity.java.ftl`

**Output:** `src/main/java/{package}/domain/model/{EntityName}.java`

#### Use Case Generation

**Template Paths:**
- `frameworks/{framework}/{paradigm}/usecase/InputPort.java.ftl`
- `frameworks/{framework}/{paradigm}/usecase/UseCase.java.ftl`

**Example:** `frameworks/spring/reactive/usecase/`

**Output:**
- `src/main/java/{package}/domain/port/in/{UseCaseName}UseCase.java`
- `src/main/java/{package}/application/usecase/{UseCaseName}UseCaseImpl.java`

#### Driven Adapter Generation

**Template Path:** `frameworks/{framework}/{paradigm}/adapters/driven-adapters/{type}/`

**Example:** `frameworks/spring/reactive/adapters/driven-adapters/redis/`

**Templates:**
- `Adapter.java.ftl` → Main adapter implementation
- `Config.java.ftl` → Configuration class
- `Entity.java.ftl` → Data entity
- `Test.java.ftl` → Unit tests

**Output:** `src/main/java/{package}/infrastructure/drivenadapters/{type}/`

#### Entry Point Generation

**Template Path:** `frameworks/{framework}/{paradigm}/adapters/entry-points/{type}/`

**Example:** `frameworks/spring/reactive/adapters/entry-points/rest/`

**Templates:**
- `Controller.java.ftl` → REST controller
- `RequestDTO.java.ftl` → Request DTO
- `ResponseDTO.java.ftl` → Response DTO
- `DTOMapper.java.ftl` → Mapper
- `Test.java.ftl` → Unit tests

**Output:** `src/main/java/{package}/infrastructure/entrypoints/{type}/`

## FreeMarker Syntax

### Variables

```java
${variableName}           // Simple variable
${object.property}        // Object property
${list[0]}               // List access
${map['key']}            // Map access
```

### Conditionals

```java
<#if condition>
  // content
</#if>

<#if condition>
  // content
<#else>
  // alternative
</#if>
```

### Loops

```java
<#list items as item>
  ${item.name}
  <#if item_has_next>,</#if>
</#list>
```

### Built-in Functions

```java
${string?cap_first}      // Capitalize first letter
${string?lower_case}     // Convert to lowercase
${string?upper_case}     // Convert to uppercase
${string?replace("a", "b")}  // Replace
```

## Available Variables

### Project Initialization

| Variable | Description | Example |
|----------|-------------|---------|
| `${projectName}` | Project name | "my-service" |
| `${projectNamePascalCase}` | Project name in PascalCase | "MyService" |
| `${basePackage}` | Base package | "com.example.myservice" |
| `${packagePath}` | Package as path | "com/example/myservice" |
| `${architecture}` | Architecture type | "hexagonal-single" |
| `${paradigm}` | Paradigm | "reactive" |
| `${framework}` | Framework | "spring" |
| `${isReactive}` | Boolean | `true` |
| `${isSpring}` | Boolean | `true` |
| `${pluginVersion}` | Plugin version | "0.1.15-SNAPSHOT" |
| `${javaVersion}` | Java version | "21" |
| `${springBootVersion}` | Spring Boot version | "3.2.1" |
| `${groupId}` | Maven group ID | "com.example" |
| `${version}` | Project version | "0.0.1-SNAPSHOT" |

### Entity Generation

| Variable | Description | Example |
|----------|-------------|---------|
| `${packageName}` | Full package name | "com.example.domain.model" |
| `${entityName}` | Entity name | "Order" |
| `${hasId}` | Has ID field | `true` |
| `${idType}` | ID type | "String" |
| `${fields}` | List of fields | `[{name, type}, ...]` |
| `${needsUUID}` | Needs UUID import | `true` |
| `${needsBigDecimal}` | Needs BigDecimal import | `true` |
| `${needsLocalDateTime}` | Needs LocalDateTime import | `true` |
| `${needsLocalDate}` | Needs LocalDate import | `true` |

### Use Case Generation

| Variable | Description | Example |
|----------|-------------|---------|
| `${packageName}` | Full package name | "com.example.domain.port.in" |
| `${implPackage}` | Implementation package | "com.example.application.usecase" |
| `${useCaseName}` | Use case name | "CreateOrder" |
| `${methods}` | List of methods | `[{name, returnType, parameters}, ...]` |

### Adapter Generation

| Variable | Description | Example |
|----------|-------------|---------|
| `${packageName}` | Full package name | "com.example.infrastructure.drivenadapters.redis" |
| `${adapterName}` | Adapter name | "OrderCache" |
| `${entityName}` | Entity name | "Order" |
| `${basePackage}` | Base package | "com.example" |

## Metadata Files

### structure.yml

Defines the package structure for an architecture:

```yaml
name: "Hexagonal Single Module"
description: "Single module hexagonal architecture"
type: "hexagonal-single"
multiModule: false

directories:
  - "src/main/java"
  - "src/main/resources"
  - "src/test/java"

packages:
  - "domain/model"
  - "domain/port/in"
  - "domain/port/out"
  - "application/usecase"
  - "infrastructure/entry-points/rest"
  - "infrastructure/driven-adapters"
  - "infrastructure/config"
```

### metadata.yml (Adapter)

Defines adapter metadata and dependencies:

```yaml
name: "Redis Adapter"
description: "Reactive Redis adapter for caching"
type: "redis"
framework: "spring"
paradigm: "reactive"

dependencies:
  - "org.springframework.boot:spring-boot-starter-data-redis-reactive"

configuration:
  properties:
    - key: "spring.data.redis.host"
      value: "localhost"
    - key: "spring.data.redis.port"
      value: "6379"

files:
  - name: "Adapter.java"
    description: "Main adapter implementation"
    required: true
  - name: "Config.java"
    description: "Redis configuration"
    required: false
```

### index.json

Lists available adapters:

```json
{
  "adapters": [
    {
      "type": "redis",
      "name": "Redis Cache",
      "description": "Reactive Redis adapter for caching"
    },
    {
      "type": "mongodb",
      "name": "MongoDB",
      "description": "Reactive MongoDB adapter"
    }
  ]
}
```

## Best Practices

1. **Use Consistent Naming**: Follow Java naming conventions
2. **Add Comments**: Explain template logic with FreeMarker comments `<#-- comment -->`
3. **Validate Variables**: Check if variables exist before using them
4. **Keep Templates Simple**: Complex logic belongs in generators, not templates
5. **Test Templates**: Always test generated code compiles and runs
6. **Document Variables**: List all variables used in template comments
7. **Use Metadata**: Provide metadata.yml for adapters with dependencies and configuration

## Testing Templates

### 1. Configure Local Templates

Create `.cleanarch.yml`:

```yaml
templates:
  mode: developer
  localPath: /absolute/path/to/templates
  cache: false
```

### 2. Generate Code

```bash
./gradlew initCleanArch --packageName=com.example.test
./gradlew generateEntity --name=Product --fields="name:String,price:BigDecimal" --hasId
```

### 3. Verify Output

```bash
# Check generated files
find src -name "*.java"

# Verify compilation
./gradlew build -x test
```

### 4. Iterate

1. Modify template
2. Delete generated files
3. Regenerate
4. Verify

No need to rebuild the plugin when only changing templates!

## Common Issues

### Template Not Found

**Error:** `Template not found: frameworks/spring/reactive/domain/Entity.java.ftl`

**Solution:**
- Verify file exists in templates directory
- Check file name is exact (case-sensitive)
- Ensure `localPath` points to `templates/` directory

### Variable Not Found

**Error:** `Expression variableName is undefined`

**Solution:**
- Check variable is provided in generator context
- Use `<#if variableName??>` to check if variable exists
- Review generator code to ensure variable is added to context

### Syntax Error

**Error:** `Parsing error in template`

**Solution:**
- Check FreeMarker syntax is correct
- Ensure all tags are closed (`<#if>` needs `</#if>`)
- Verify string literals use correct quotes

## Next Steps

- [Adding a New Architecture](./adding-architecture.md)
- [Adding a New Command](./adding-command.md)
- [Adding a New Adapter](./adding-adapter.md)
