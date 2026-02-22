# Adding Architectures - Technical Guide

Technical guide for contributors adding new architecture patterns to the Clean Architecture Generator.

## Overview

This guide covers creating new architecture patterns, including:
- Architecture structure definition (`structure.yml`)
- Folder organization and conventions
- Adapter path resolution
- Naming conventions
- Layer dependencies
- README template creation

## Architecture Structure Reference

### structure.yml Format

The `structure.yml` file defines the complete architecture structure:

```yaml
# Basic Information
architecture: onion-single
description: Onion Architecture with single module

# Adapter Path Resolution
adapterPaths:
  driven: "infrastructure/adapter/out/{name}"
  driving: "infrastructure/adapter/in/{name}"

# Naming Conventions
namingConventions:
  suffixes:
    useCase: "UseCase"
    port: "Port"
    adapter: "Adapter"
    entity: ""
    valueObject: ""
  prefixes:
    interface: "I"
    abstract: "Abstract"

# Layer Dependencies
layerDependencies:
  domain:
    - []  # Domain depends on nothing
  application:
    - domain
  infrastructure:
    - domain
    - application

# Folder Structure
structure:
  - path: src/main/java/{basePackage}/core/domain/model
    description: Domain entities and value objects
    layer: domain
  
  - path: src/main/java/{basePackage}/core/application/service
    description: Use cases and application services
    layer: application
  
  - path: src/main/java/{basePackage}/core/application/port/in
    description: Input ports (use case interfaces)
    layer: application
  
  - path: src/main/java/{basePackage}/core/application/port/out
    description: Output ports (repository interfaces)
    layer: application
  
  - path: src/main/java/{basePackage}/infrastructure/adapter/in
    description: Driving adapters (REST, messaging)
    layer: infrastructure
  
  - path: src/main/java/{basePackage}/infrastructure/adapter/out
    description: Driven adapters (database, external APIs)
    layer: infrastructure
  
  - path: src/main/java/{basePackage}/infrastructure/config
    description: Spring configuration classes
    layer: infrastructure
  
  - path: src/test/java/{basePackage}
    description: Test files
    layer: test

# Module Configuration (for multi-module architectures)
modules:
  - name: domain
    type: library
    description: Core domain logic
  
  - name: application
    type: library
    description: Application services and use cases
    dependencies:
      - domain
  
  - name: infrastructure
    type: application
    description: Infrastructure adapters and configuration
    dependencies:
      - domain
      - application
```

### Field Reference

#### Basic Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `architecture` | Yes | String | Unique architecture identifier (kebab-case) |
| `description` | Yes | String | Brief description of architecture pattern |

#### Adapter Paths

**adapterPaths** - Defines where adapters are placed:

```yaml
adapterPaths:
  driven: "infrastructure/adapter/out/{name}"
  driving: "infrastructure/adapter/in/{name}"
```

**Placeholders:**
- `{name}` - Adapter name (e.g., "mongodb", "rest-controller")
- `{type}` - Adapter type ("driven" or "driving")
- `{basePackage}` - Project base package
- `{module}` - Module name (for multi-module architectures)

**Examples:**

Hexagonal Single:
```yaml
adapterPaths:
  driven: "infrastructure/driven-adapters/{name}"
  driving: "infrastructure/entry-points/{name}"
```

Hexagonal Multi-Granular:
```yaml
adapterPaths:
  driven: "infrastructure/adapters/{name}"
  driving: "infrastructure/entry-points/{name}"
```

Onion Single:
```yaml
adapterPaths:
  driven: "infrastructure/adapter/out/{name}"
  driving: "infrastructure/adapter/in/{name}"
```

#### Naming Conventions

**namingConventions** - Defines suffixes and prefixes for components:

```yaml
namingConventions:
  suffixes:
    useCase: "UseCase"      # CreateUserUseCase
    port: "Port"            # UserRepositoryPort
    adapter: "Adapter"      # UserRepositoryAdapter
    entity: ""              # User (no suffix)
    valueObject: ""         # Email (no suffix)
    service: "Service"      # UserService
    controller: "Controller" # UserController
  
  prefixes:
    interface: "I"          # IUserRepository
    abstract: "Abstract"    # AbstractUserService
```

**Usage:**
- Applied automatically when generating components
- Ensures consistency across the project
- Can be overridden by user if needed

#### Layer Dependencies

**layerDependencies** - Defines allowed dependencies between layers:

```yaml
layerDependencies:
  domain:
    - []  # Domain depends on nothing
  
  application:
    - domain  # Application can depend on domain
  
  infrastructure:
    - domain       # Infrastructure can depend on domain
    - application  # Infrastructure can depend on application
```

**Validation:**
- Plugin validates generated code respects these rules
- Prevents circular dependencies
- Enforces clean architecture principles

#### Folder Structure

**structure** - Defines the folder hierarchy:

```yaml
structure:
  - path: src/main/java/{basePackage}/domain/model
    description: Domain entities and value objects
    layer: domain
    
  - path: src/main/java/{basePackage}/domain/port/out
    description: Output ports (repository interfaces)
    layer: domain
```

**Fields:**
- `path` - Folder path with placeholders
- `description` - Purpose of this folder
- `layer` - Which layer this folder belongs to

#### Modules (Multi-Module Only)

**modules** - Defines Gradle modules:

```yaml
modules:
  - name: domain
    type: library
    description: Core domain logic
    
  - name: application
    type: library
    description: Application services
    dependencies:
      - domain
    
  - name: infrastructure
    type: application
    description: Infrastructure layer
    dependencies:
      - domain
      - application
```

**Module Types:**
- `library` - Java library (no main class)
- `application` - Spring Boot application (has main class)

## Creating a New Architecture

### Step 1: Plan the Architecture

Define:
1. **Layer organization** - How layers are structured
2. **Folder hierarchy** - Where components go
3. **Naming conventions** - How components are named
4. **Dependency rules** - What can depend on what
5. **Module structure** - Single or multi-module

### Step 2: Create Architecture Directory

```bash
cd backend-architecture-design-archetype-generator-templates/architectures
mkdir clean-architecture-single
cd clean-architecture-single
```

### Step 3: Create structure.yml

```yaml
architecture: clean-architecture-single
description: Clean Architecture with single module following Uncle Bob's pattern

adapterPaths:
  driven: "adapters/out/{name}"
  driving: "adapters/in/{name}"

namingConventions:
  suffixes:
    useCase: "UseCase"
    port: "Port"
    adapter: "Adapter"
    entity: ""
  prefixes:
    interface: ""

layerDependencies:
  entities:
    - []
  usecases:
    - entities
  adapters:
    - entities
    - usecases
  frameworks:
    - entities
    - usecases
    - adapters

structure:
  - path: src/main/java/{basePackage}/entities
    description: Enterprise business rules
    layer: entities
  
  - path: src/main/java/{basePackage}/usecases
    description: Application business rules
    layer: usecases
  
  - path: src/main/java/{basePackage}/adapters/in
    description: Input adapters (controllers, consumers)
    layer: adapters
  
  - path: src/main/java/{basePackage}/adapters/out
    description: Output adapters (repositories, clients)
    layer: adapters
  
  - path: src/main/java/{basePackage}/frameworks
    description: Frameworks and drivers (Spring configuration)
    layer: frameworks
  
  - path: src/test/java/{basePackage}
    description: Test files
    layer: test
```

### Step 4: Create README Template

Create `README.md.ftl`:

```markdown
# ${projectName}

Clean Architecture project following Uncle Bob's pattern.

## Architecture Overview

This project follows Clean Architecture principles with four main layers:

\`\`\`
┌─────────────────────────────────────────┐
│           Frameworks & Drivers          │
│  (Spring Boot, Database, Web Server)    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Interface Adapters              │
│    (Controllers, Presenters, Gateways)  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│        Application Business Rules       │
│           (Use Cases)                   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Enterprise Business Rules          │
│            (Entities)                   │
└─────────────────────────────────────────┘
\`\`\`

## Project Structure

\`\`\`
src/main/java/${basePackage?replace(".", "/")}/
├── entities/              # Enterprise business rules
│   ├── User.java
│   └── Order.java
│
├── usecases/              # Application business rules
│   ├── CreateUser.java
│   └── ProcessOrder.java
│
├── adapters/
│   ├── in/                # Input adapters
│   │   ├── rest/
│   │   └── messaging/
│   │
│   └── out/               # Output adapters
│       ├── persistence/
│       └── external/
│
└── frameworks/            # Frameworks and drivers
    ├── config/
    └── Application.java
\`\`\`

## Layer Responsibilities

### Entities (Enterprise Business Rules)

Core business objects that encapsulate enterprise-wide business rules.

**Location:** \`src/main/java/${basePackage?replace(".", "/")}/entities/\`

**Examples:**
- Domain entities (User, Order, Product)
- Value objects (Email, Money, Address)
- Domain events

**Rules:**
- No dependencies on other layers
- Pure business logic
- Framework-independent

### Use Cases (Application Business Rules)

Application-specific business rules that orchestrate the flow of data.

**Location:** \`src/main/java/${basePackage?replace(".", "/")}/usecases/\`

**Examples:**
- CreateUserUseCase
- ProcessOrderUseCase
- SendNotificationUseCase

**Rules:**
- Can depend on Entities
- Define input/output ports
- Orchestrate business logic

### Adapters (Interface Adapters)

Convert data between use cases and external systems.

**Input Adapters (Driving):**
- REST controllers
- GraphQL resolvers
- Message consumers
- CLI commands

**Output Adapters (Driven):**
- Database repositories
- External API clients
- Message publishers
- File system access

**Rules:**
- Can depend on Entities and Use Cases
- Implement ports defined by Use Cases
- Handle data conversion

### Frameworks (Frameworks & Drivers)

External frameworks and tools.

**Location:** \`src/main/java/${basePackage?replace(".", "/")}/frameworks/\`

**Examples:**
- Spring Boot configuration
- Database configuration
- Security configuration
- Application entry point

## Dependency Rule

**The Dependency Rule:** Source code dependencies must point inward.

- Entities know nothing about outer layers
- Use Cases know about Entities
- Adapters know about Use Cases and Entities
- Frameworks know about everything

## Data Flow

### Inbound Request Flow

\`\`\`
HTTP Request
    ↓
REST Controller (Input Adapter)
    ↓
Use Case (Application Business Rules)
    ↓
Entity (Enterprise Business Rules)
    ↓
Repository Port (defined by Use Case)
    ↓
Repository Adapter (Output Adapter)
    ↓
Database
\`\`\`

### Outbound Response Flow

\`\`\`
Database
    ↓
Repository Adapter (Output Adapter)
    ↓
Entity (Enterprise Business Rules)
    ↓
Use Case (Application Business Rules)
    ↓
REST Controller (Input Adapter)
    ↓
HTTP Response
\`\`\`

## Adding Components

### Adding an Entity

\`\`\`bash
# Create entity in entities/ folder
src/main/java/${basePackage?replace(".", "/")}/entities/Product.java
\`\`\`

### Adding a Use Case

\`\`\`bash
# Create use case in usecases/ folder
src/main/java/${basePackage?replace(".", "/")}/usecases/CreateProduct.java
\`\`\`

### Adding an Input Adapter

\`\`\`bash
./gradlew generateInputAdapter \\
  --name=ProductController \\
  --type=rest-controller
\`\`\`

### Adding an Output Adapter

\`\`\`bash
./gradlew generateOutputAdapter \\
  --name=ProductRepository \\
  --entity=Product \\
  --type=mongodb
\`\`\`

## Building and Running

### Build

\`\`\`bash
./gradlew build
\`\`\`

### Run

\`\`\`bash
./gradlew bootRun
\`\`\`

### Test

\`\`\`bash
./gradlew test
\`\`\`

## Resources

- [Clean Architecture Book](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
- [Clean Architecture Blog](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Plugin Documentation](https://somospragma.github.io/backend-architecture-design-site-docs/)

## License

[Your License]
```

### Step 5: Create Build Templates

Create `templates/build.gradle.ftl`:

```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management' version '1.1.4'
}

group = '${basePackage}'
version = '0.0.1-SNAPSHOT'

java {
    sourceCompatibility = '21'
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot
    implementation 'org.springframework.boot:spring-boot-starter-web'
<#if paradigm == "reactive">
    implementation 'org.springframework.boot:spring-boot-starter-webflux'
</#if>
    
    // Validation
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    
    // Lombok
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    
    // MapStruct
    implementation 'org.mapstruct:mapstruct:1.5.5.Final'
    annotationProcessor 'org.mapstruct:mapstruct-processor:1.5.5.Final'
    
    // Testing
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
<#if paradigm == "reactive">
    testImplementation 'io.projectreactor:reactor-test'
</#if>
}

tasks.named('test') {
    useJUnitPlatform()
}
```

Create `templates/settings.gradle.ftl`:

```groovy
rootProject.name = '${projectName}'
```

### Step 6: Test the Architecture

```bash
# 1. Build plugin with new architecture
cd backend-architecture-design-archetype-generator-core
./gradlew clean build publishToMavenLocal

# 2. Create test project
cd ../test-projects
mkdir test-clean-arch
cd test-clean-arch

# 3. Initialize with new architecture
./gradlew initCleanArch --architecture=clean-architecture-single

# 4. Verify structure
tree src/

# 5. Generate adapters
./gradlew generateOutputAdapter --name=User --entity=User --type=mongodb
./gradlew generateInputAdapter --name=UserController --type=rest-controller

# 6. Verify adapters are in correct locations
ls -la src/main/java/.../adapters/out/mongodb/
ls -la src/main/java/.../adapters/in/rest-controller/

# 7. Build project
./gradlew build
```

## Multi-Module Architectures

### Module Configuration

For multi-module architectures, define modules in `structure.yml`:

```yaml
modules:
  - name: domain
    type: library
    description: Core domain logic
    path: domain
    
  - name: application
    type: library
    description: Application services
    path: application
    dependencies:
      - domain
    
  - name: infrastructure
    type: application
    description: Infrastructure layer
    path: infrastructure
    dependencies:
      - domain
      - application
```

### Multi-Module Adapter Paths

Use `{module}` placeholder:

```yaml
adapterPaths:
  driven: "{module}/src/main/java/{basePackage}/adapter/{name}"
  driving: "{module}/src/main/java/{basePackage}/entrypoint/{name}"
```

### Multi-Module Build Files

Create `templates/settings.gradle.ftl`:

```groovy
rootProject.name = '${projectName}'

include 'domain'
include 'application'
include 'infrastructure'
```

Create `templates/build.gradle.ftl` (root):

```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.0' apply false
    id 'io.spring.dependency-management' version '1.1.4' apply false
}

subprojects {
    apply plugin: 'java'
    
    group = '${basePackage}'
    version = '0.0.1-SNAPSHOT'
    
    java {
        sourceCompatibility = '21'
    }
    
    repositories {
        mavenCentral()
    }
}
```

Create `templates/domain/build.gradle.ftl`:

```groovy
dependencies {
    // Lombok
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    
    // Testing
    testImplementation 'org.junit.jupiter:junit-jupiter'
}
```

## Validation

### Architecture Validation Checklist

Before submitting PR:

- [ ] `structure.yml` is valid YAML
- [ ] All required fields are present
- [ ] `adapterPaths` defined for driven and driving
- [ ] `namingConventions` are consistent
- [ ] `layerDependencies` enforce clean architecture
- [ ] `structure` defines all necessary folders
- [ ] README template is comprehensive
- [ ] Build templates are correct
- [ ] Architecture works with all adapter types
- [ ] Generated projects compile successfully
- [ ] Documentation is complete

### Testing Checklist

- [ ] Initialize project with new architecture
- [ ] Verify folder structure is created correctly
- [ ] Generate driven adapter (e.g., MongoDB)
- [ ] Verify adapter is in correct location
- [ ] Generate driving adapter (e.g., REST controller)
- [ ] Verify adapter is in correct location
- [ ] Build project successfully
- [ ] Run tests successfully
- [ ] Test with reactive paradigm
- [ ] Test with imperative paradigm

## Common Patterns

### Pattern 1: Port-Adapter Separation

```yaml
structure:
  - path: src/main/java/{basePackage}/domain/port/in
    description: Input ports (use case interfaces)
    layer: domain
  
  - path: src/main/java/{basePackage}/domain/port/out
    description: Output ports (repository interfaces)
    layer: domain
  
  - path: src/main/java/{basePackage}/infrastructure/adapter/in
    description: Input adapters (controllers)
    layer: infrastructure
  
  - path: src/main/java/{basePackage}/infrastructure/adapter/out
    description: Output adapters (repositories)
    layer: infrastructure
```

### Pattern 2: Feature-Based Organization

```yaml
structure:
  - path: src/main/java/{basePackage}/user/domain
    description: User domain
    layer: domain
  
  - path: src/main/java/{basePackage}/user/application
    description: User application services
    layer: application
  
  - path: src/main/java/{basePackage}/user/infrastructure
    description: User infrastructure
    layer: infrastructure
```

### Pattern 3: Layered Modules

```yaml
modules:
  - name: domain
    type: library
    
  - name: application
    type: library
    dependencies: [domain]
    
  - name: infrastructure
    type: application
    dependencies: [domain, application]
```

## Next Steps

- [Developer Mode](developer-mode) - Set up local development
- [Adding Adapters](adding-adapters) - Create adapter templates
- [Testing Templates](testing-templates) - Validate your architecture

## Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Onion Architecture](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/)
