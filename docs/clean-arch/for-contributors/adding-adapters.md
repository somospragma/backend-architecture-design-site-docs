# Adding Adapters - Technical Guide

Technical guide for contributors adding new adapter templates to the Clean Architecture Generator.

## Overview

This guide covers the technical details of creating adapter templates, including:
- Adapter metadata structure (`metadata.yml`)
- FreeMarker template development
- Path resolution across architectures
- Configuration merging
- Testing and validation

## Adapter Metadata Reference

### metadata.yml Structure

The `metadata.yml` file defines adapter properties, dependencies, and templates:

```yaml
# Basic Information
name: mongodb-adapter
type: driven  # or "driving"
description: MongoDB database adapter using Spring Data Reactive

# Runtime Dependencies
dependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-data-mongodb-reactive
    version: ${springBootVersion}
  - group: org.mapstruct
    artifact: mapstruct
    version: 1.5.5.Final

# Test-Only Dependencies
testDependencies:
  - group: de.flapdoodle.embed
    artifact: de.flapdoodle.embed.mongo
    version: 4.11.0
    scope: test
  - group: org.testcontainers
    artifact: mongodb
    version: 1.19.0
    scope: test

# Application Properties Template
applicationPropertiesTemplate: application-properties.yml.ftl

# Additional Configuration Classes
configurationClasses:
  - name: MongoConfig
    packagePath: config
    templatePath: Config.java.ftl
  - name: MongoHealthIndicator
    packagePath: health
    templatePath: HealthIndicator.java.ftl

# Template Files
templates:
  - path: Adapter.java.ftl
    output: "{name}Adapter.java"
  - path: Repository.java.ftl
    output: "{name}Repository.java"
  - path: Entity.java.ftl
    output: "{name}Data.java"
  - path: Mapper.java.ftl
    output: "mapper/{name}Mapper.java"
```

### Field Reference

#### Basic Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `name` | Yes | String | Unique adapter identifier (kebab-case) |
| `type` | Yes | Enum | `driven` (output) or `driving` (input) |
| `description` | Yes | String | Brief description of adapter purpose |

#### Dependencies

**dependencies** - Runtime dependencies added to `build.gradle`:

```yaml
dependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-data-mongodb-reactive
    version: ${springBootVersion}  # Use variable for Spring Boot version
```

**testDependencies** - Test-only dependencies with `test` scope:

```yaml
testDependencies:
  - group: org.testcontainers
    artifact: mongodb
    version: 1.19.0
    scope: test  # Always use test scope
```

#### Application Properties

**applicationPropertiesTemplate** - Path to YAML template for Spring Boot configuration:

```yaml
applicationPropertiesTemplate: application-properties.yml.ftl
```

The template is processed and merged into `application.yml`:

```yaml
# application-properties.yml.ftl
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/${projectName}
      # WARNING: Do not store credentials in source control
      # Use environment variables or secret management in production
      database: ${projectName}
```

**Merging Behavior:**
- Existing properties are preserved (no overwrites)
- New properties are added
- Conflicts are logged as warnings
- Security comments are added for sensitive properties

#### Configuration Classes

**configurationClasses** - Additional Spring configuration classes:

```yaml
configurationClasses:
  - name: MongoConfig              # Class name (without .java)
    packagePath: config             # Relative package path
    templatePath: Config.java.ftl   # Template file path
```

Generated path: `{basePackage}.infrastructure.adapter.out.{adapterName}.config.MongoConfig`

#### Templates

**templates** - Main adapter template files:

```yaml
templates:
  - path: Adapter.java.ftl          # Template file in templates/ directory
    output: "{name}Adapter.java"    # Output filename with placeholders
```

**Placeholders:**
- `{name}` - Adapter name (e.g., "UserRepository")
- `{type}` - Adapter type ("driven" or "driving")
- `{entity}` - Entity name (e.g., "User")

## Template Development

### Available Variables

All FreeMarker templates have access to these variables:

#### Core Variables

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `name` | String | Adapter name | `UserRepository` |
| `entityName` | String | Domain entity name | `User` |
| `packageName` | String | Full package path | `com.example.infrastructure.adapter.out.mongodb` |
| `basePackage` | String | Project base package | `com.example` |
| `projectName` | String | Project name | `user-service` |
| `adapterType` | String | Adapter type | `driven` or `driving` |

#### Architecture Variables

| Variable | Type | Description |
|----------|------|-------------|
| `architecture` | String | Architecture type | `hexagonal-single`, `onion-single` |
| `framework` | String | Framework | `spring` |
| `paradigm` | String | Programming paradigm | `reactive`, `imperative` |

#### Optional Variables

| Variable | Type | Description |
|----------|------|-------------|
| `methods` | List | Custom methods to generate |
| `entityFields` | List | Entity field definitions |
| `customConfig` | Map | Additional configuration |

### Template Best Practices

#### 1. Always Check for Null

```java
<#if entityName??>
public class ${entityName}Adapter {
<#else>
// Entity name not provided
public class GenericAdapter {
</#if>
```

#### 2. Use Proper Indentation

```java
public class ${name}Adapter {

  private final ${entityName}Repository repository;
  private final ${entityName}Mapper mapper;

  public ${name}Adapter(
      ${entityName}Repository repository,
      ${entityName}Mapper mapper) {
    this.repository = repository;
    this.mapper = mapper;
  }
}
```

#### 3. Handle Optional Lists

```java
<#if methods?has_content>
<#list methods as method>
  /**
   * ${method.description}
   */
  public ${method.returnType} ${method.name}(<#if method.parameters?has_content><#list method.parameters as param>${param.type} ${param.name}<#sep>, </#sep></#list></#if>) {
    // Implementation
  }

</#list>
</#if>
```

#### 4. Add Documentation

```java
/**
 * ${name} adapter for ${entityName}.
 * Implements the output port for ${entityName} persistence using MongoDB.
 * 
 * <p>This adapter provides reactive database operations using Spring Data MongoDB Reactive.
 * All operations return Mono or Flux for non-blocking I/O.
 * 
 * @see ${entityName}
 * @see ${entityName}Repository
 */
@Component
public class ${name}Adapter {
```

#### 5. Use Conditional Imports

```java
package ${packageName};

import org.springframework.stereotype.Component;
<#if paradigm == "reactive">
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
</#if>
<#if paradigm == "imperative">
import java.util.List;
import java.util.Optional;
</#if>

import ${basePackage}.domain.model.${entityName};
```

### Example: Complete Adapter Template

```java
package ${packageName};

import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import ${basePackage}.domain.model.${entityName};
import ${packageName}.entity.${entityName}Data;
import ${packageName}.mapper.${entityName}Mapper;

/**
 * MongoDB adapter for ${entityName}.
 * Implements the output port for ${entityName} persistence using MongoDB.
 * 
 * <p>This adapter provides reactive database operations using Spring Data MongoDB Reactive.
 * All operations return Mono or Flux for non-blocking I/O.
 * 
 * @see ${entityName}
 * @see ${entityName}Repository
 */
@Component
public class ${name}Adapter {

  private final ReactiveMongoTemplate mongoTemplate;
  private final ${entityName}Mapper mapper;

  /**
   * Constructs a new ${name}Adapter.
   *
   * @param mongoTemplate the reactive MongoDB template
   * @param mapper the entity mapper
   */
  public ${name}Adapter(
      ReactiveMongoTemplate mongoTemplate,
      ${entityName}Mapper mapper) {
    this.mongoTemplate = mongoTemplate;
    this.mapper = mapper;
  }

  /**
   * Saves a ${entityName} to MongoDB.
   *
   * @param entity the entity to save
   * @return a Mono emitting the saved entity
   */
  public Mono<${entityName}> save(${entityName} entity) {
    ${entityName}Data data = mapper.toData(entity);
    
    return mongoTemplate.save(data)
        .map(mapper::toDomain);
  }

  /**
   * Finds a ${entityName} by ID.
   *
   * @param id the entity ID
   * @return a Mono emitting the found entity, or empty if not found
   */
  public Mono<${entityName}> findById(String id) {
    return mongoTemplate.findById(id, ${entityName}Data.class)
        .map(mapper::toDomain);
  }

  /**
   * Finds all ${entityName} entities.
   *
   * @return a Flux emitting all entities
   */
  public Flux<${entityName}> findAll() {
    return mongoTemplate.findAll(${entityName}Data.class)
        .map(mapper::toDomain);
  }

  /**
   * Deletes a ${entityName} by ID.
   *
   * @param id the entity ID
   * @return a Mono emitting true if deleted, false otherwise
   */
  public Mono<Boolean> deleteById(String id) {
    Query query = Query.query(Criteria.where("_id").is(id));
    
    return mongoTemplate.remove(query, ${entityName}Data.class)
        .map(result -> result.getDeletedCount() > 0);
  }

  /**
   * Checks if a ${entityName} exists by ID.
   *
   * @param id the entity ID
   * @return a Mono emitting true if exists, false otherwise
   */
  public Mono<Boolean> existsById(String id) {
    Query query = Query.query(Criteria.where("_id").is(id));
    
    return mongoTemplate.exists(query, ${entityName}Data.class);
  }

<#if methods?has_content>
<#list methods as method>
  /**
   * ${method.description!"Custom method"}
   <#if method.parameters?has_content>
   <#list method.parameters as param>
   * @param ${param.name} ${param.description!"parameter"}
   </#list>
   </#if>
   * @return ${method.returnDescription!"result"}
   */
  public ${method.returnType} ${method.name}(<#if method.parameters?has_content><#list method.parameters as param>${param.type} ${param.name}<#sep>, </#sep></#list></#if>) {
    // TODO: Implement custom method
    throw new UnsupportedOperationException("Not implemented yet");
  }

</#list>
</#if>
}
```

## Path Resolution

### How Paths Are Resolved

The plugin resolves adapter paths using the architecture's `structure.yml`:

1. Load architecture's `structure.yml`
2. Get `adapterPaths` configuration
3. Select path template based on adapter type (driven/driving)
4. Substitute placeholders with actual values
5. Validate path against layer dependencies

### Example: Hexagonal Single

```yaml
# architectures/hexagonal-single/structure.yml
adapterPaths:
  driven: "infrastructure/driven-adapters/{name}"
  driving: "infrastructure/entry-points/{name}"
```

Generated path for MongoDB adapter:
```
src/main/java/com/example/infrastructure/driven-adapters/mongodb/
```

### Example: Onion Single

```yaml
# architectures/onion-single/structure.yml
adapterPaths:
  driven: "infrastructure/adapter/out/{name}"
  driving: "infrastructure/adapter/in/{name}"
```

Generated path for MongoDB adapter:
```
src/main/java/com/example/infrastructure/adapter/out/mongodb/
```

### Architecture-Independent Templates

Write templates that work across all architectures:

✅ **Good - Uses variables:**
```java
package ${packageName};  // Resolved by plugin

import ${basePackage}.domain.model.${entityName};
```

❌ **Bad - Hardcoded paths:**
```java
package com.example.infrastructure.driven-adapters.mongodb;

import com.example.domain.model.User;
```

## Configuration Merging

### Application Properties Merging

When `applicationPropertiesTemplate` is specified, the plugin:

1. Processes the template with project variables
2. Parses existing `application.yml`
3. Merges new properties into existing configuration
4. Preserves existing values (no overwrites)
5. Logs warnings for conflicts
6. Writes merged configuration

### Example Merge

**Existing application.yml:**
```yaml
spring:
  application:
    name: user-service
  data:
    mongodb:
      uri: mongodb://prod-server:27017/users
```

**Template (application-properties.yml.ftl):**
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/${projectName}
      database: ${projectName}
```

**Merged Result:**
```yaml
spring:
  application:
    name: user-service
  data:
    mongodb:
      uri: mongodb://prod-server:27017/users  # Existing value preserved
      database: user-service                   # New property added
```

**Console Output:**
```
[WARN] Property conflict: spring.data.mongodb.uri already exists with different value. Keeping existing value.
[INFO] Added 1 new property to application.yml
```

### Security Comments

The plugin automatically adds security warnings for sensitive properties:

```yaml
spring:
  data:
    mongodb:
      # WARNING: Do not store credentials in source control
      # Use environment variables or secret management in production
      uri: mongodb://localhost:27017/mydb
      username: ${MONGO_USERNAME}
      password: ${MONGO_PASSWORD}
```

## Testing Adapters

### Unit Testing

Test template processing:

```java
@Test
void shouldGenerateMongoDBAdapter() {
  // Given
  Map<String, Object> context = Map.of(
      "name", "UserRepository",
      "entityName", "User",
      "packageName", "com.example.infrastructure.adapter.out.mongodb",
      "basePackage", "com.example",
      "projectName", "user-service"
  );

  // When
  String result = templateEngine.process("Adapter.java.ftl", context);

  // Then
  assertThat(result).contains("public class UserRepositoryAdapter");
  assertThat(result).contains("package com.example.infrastructure.adapter.out.mongodb");
  assertThat(result).contains("private final UserMapper mapper");
}
```

### Integration Testing

Test end-to-end generation:

```bash
# 1. Build plugin
cd backend-architecture-design-archetype-generator-core
./gradlew clean build publishToMavenLocal

# 2. Create test project
cd ../test-projects
mkdir test-mongodb
cd test-mongodb

# 3. Initialize project
./gradlew initCleanArch --architecture=hexagonal-single

# 4. Generate adapter
./gradlew generateOutputAdapter \\
  --name=UserRepository \\
  --entity=User \\
  --type=mongodb

# 5. Verify generated files
ls -la src/main/java/com/example/infrastructure/driven-adapters/mongodb/

# 6. Verify code compiles
./gradlew build
```

### Cross-Architecture Testing

Test adapter works in all architectures:

```bash
# Test in Hexagonal Single
cd test-hexagonal-single
./gradlew generateOutputAdapter --name=User --type=mongodb
./gradlew build

# Test in Hexagonal Multi
cd ../test-hexagonal-multi
./gradlew generateOutputAdapter --name=User --type=mongodb
./gradlew build

# Test in Onion Single
cd ../test-onion-single
./gradlew generateOutputAdapter --name=User --type=mongodb
./gradlew build
```

## Validation

### Template Validation

Validate templates before committing:

```bash
./gradlew validateTemplates
```

Checks:
- ✅ All template files exist
- ✅ FreeMarker syntax is valid
- ✅ No undefined variables
- ✅ Metadata references are correct

### Manual Validation Checklist

Before submitting PR:

- [ ] `metadata.yml` is valid YAML
- [ ] All template files referenced in `metadata.yml` exist
- [ ] Templates use variables, not hardcoded values
- [ ] Templates work in all supported architectures
- [ ] Generated code compiles without errors
- [ ] Dependencies are correct and minimal
- [ ] Test dependencies have `test` scope
- [ ] Application properties template is valid YAML
- [ ] Configuration classes are properly structured
- [ ] Documentation is complete
- [ ] Examples are provided

## Common Patterns

### Pattern 1: Reactive vs Imperative

Support both paradigms:

```java
<#if paradigm == "reactive">
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

public Mono<${entityName}> save(${entityName} entity) {
  return repository.save(mapper.toData(entity))
      .map(mapper::toDomain);
}
<#else>
import java.util.Optional;

public ${entityName} save(${entityName} entity) {
  return mapper.toDomain(
      repository.save(mapper.toData(entity))
  );
}
</#if>
```

### Pattern 2: Optional Configuration

```java
<#if configurationClasses?has_content>
/**
 * Configuration class for ${name}.
 */
@Configuration
public class ${name}Config {
  // Configuration
}
</#if>
```

### Pattern 3: Custom Methods

```java
<#if methods?has_content>
<#list methods as method>
  public ${method.returnType} ${method.name}(<#list method.parameters as param>${param.type} ${param.name}<#sep>, </#sep></#list>) {
    <#if method.implementation??>
    ${method.implementation}
    <#else>
    throw new UnsupportedOperationException("Not implemented yet");
    </#if>
  }
</#list>
</#if>
```

## Next Steps

- [Developer Mode](developer-mode) - Set up local development environment
- [Adding Architectures](adding-architectures) - Create new architecture patterns
- [Testing Templates](testing-templates) - Comprehensive testing guide

## Resources

- [FreeMarker Manual](https://freemarker.apache.org/docs/dgui.html)
- [Spring Data Documentation](https://spring.io/projects/spring-data)
- [MapStruct Documentation](https://mapstruct.org/)
