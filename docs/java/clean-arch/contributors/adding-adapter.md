# Adding a New Adapter

This guide explains how to add support for a new adapter type (e.g., MongoDB, Kafka, PostgreSQL) to the Clean Architecture Generator.

:::info Schema v2.0
This guide uses the **unified schema v2.0** for metadata.yml, which works for both input (entry-points) and output (driven-adapters) adapters.
:::

## Overview

Adding a new adapter involves:

1. **Create adapter template directory**
2. **Create adapter templates** (FreeMarker .ftl files)
3. **Create metadata.yml** (schema v2.0)
4. **Test the adapter**

## Step-by-Step Guide

### Step 1: Create Adapter Template Directory

Choose the correct path based on adapter type:

**For Output Adapters (driven-adapters):**
```bash
cd backend-architecture-design-archetype-generator-templates/templates
mkdir -p frameworks/spring/imperative/adapters/driven-adapters/mongodb
```

**For Input Adapters (entry-points):**
```bash
cd backend-architecture-design-archetype-generator-templates/templates
mkdir -p frameworks/spring/imperative/adapters/entry-points/kafka-consumer
```

The structure should be:

```
templates/
└── frameworks/
    └── spring/
        ├── imperative/
        │   └── adapters/
        │       ├── driven-adapters/
        │       │   └── mongodb/
        │       │       ├── Adapter.java.ftl
        │       │       ├── Config.java.ftl (optional)
        │       │       ├── Entity.java.ftl (optional)
        │       │       ├── Mapper.java.ftl (optional)
        │       │       ├── application-properties.yml.ftl (optional)
        │       │       └── metadata.yml
        │       └── entry-points/
        │           └── kafka-consumer/
        │               ├── Consumer.java.ftl
        │               ├── Config.java.ftl (optional)
        │               ├── application-properties.yml.ftl (optional)
        │               └── metadata.yml
        └── reactive/
            └── adapters/
                ├── driven-adapters/
                └── entry-points/
```

### Step 2: Create Adapter Template

**File:** `Adapter.java.ftl` (or `Consumer.java.ftl`, `Controller.java.ftl`, etc.)

```java
package ${packageName};

import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

/**
 * ${adapterName} adapter.
 * 
 * Note: This class is automatically registered as a Spring bean
 * through component scanning configured in BeanConfiguration.
 */
@Component
public class ${adapterName}${suffix} {

    /**
     * Example method.
     */
    public Mono<String> execute(String input) {
        // TODO: Implement adapter logic
        return Mono.just("Result: " + input);
    }
}
```

### Step 3: Create metadata.yml (Schema v2.0)

**File:** `metadata.yml`

```yaml
# ============================================================================
# METADATA.YML - SCHEMA v2.0
# ============================================================================

# Required fields
name: mongodb                   # Adapter identifier (lowercase, hyphen-separated)
type: output                    # "input" for entry-points, "output" for driven-adapters
description: MongoDB database adapter using Spring Data MongoDB Reactive

# Optional - File generation
suffix: "Adapter"              # Class name suffix

# Optional - Dependencies
dependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-data-mongodb-reactive
    version: 3.2.0

testDependencies:
  - group: de.flapdoodle.embed
    artifact: de.flapdoodle.embed.mongo
    version: 4.11.0

# Optional - Configuration
applicationPropertiesTemplate: application-properties.yml.ftl

configurationClasses:
  - name: MongoConfig
    packagePath: config
    templatePath: Config.java.ftl

# Optional - Additional resources (for GraphQL schemas, gRPC protos, etc.)
additionalResources:
  - name: schema.graphqls
    targetPath: graphql
    templatePath: schema.graphqls.ftl

# Optional - Build configuration (for gRPC, protobuf, etc.)
buildPlugins:
  - id: com.google.protobuf
    version: 0.9.4

buildConfiguration: |
  protobuf {
      protoc {
          artifact = "com.google.protobuf:protoc:3.24.0"
      }
  }
```

:::tip Complete Reference
See [metadata.yml Reference](../reference/metadata-yml) for complete schema documentation and all available fields.
:::

### Step 4: Create Configuration Template (Optional)

**File:** `Config.java.ftl`

```java
package ${packageName}.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;

/**
 * MongoDB configuration for ${adapterName}.
 */
@Configuration
public class ${adapterName}Config {

    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create("mongodb://localhost:27017");
    }

    @Bean
    public ReactiveMongoTemplate reactiveMongoTemplate(MongoClient mongoClient) {
        return new ReactiveMongoTemplate(mongoClient, "database-name");
    }
}
```

### Step 5: Create Application Properties Template (Optional)

**File:** `application-properties.yml.ftl`

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/${projectName}
      database: ${projectName}
      auto-index-creation: true

logging:
  level:
    org.springframework.data.mongodb: DEBUG
```

:::warning Security
Always include warnings about not storing credentials in source code. Use environment variables or secret management in production.
:::

### Step 6: Test Your Adapter

```bash
# Publish plugin locally
cd backend-architecture-design-archetype-generator-core
./gradlew clean build publishToMavenLocal -x test

# Create test project
cd ..
mkdir test-project
cd test-project

# Initialize project
../backend-architecture-design-archetype-generator-core/gradlew initCleanArch \
  --name=test-unified \
  --package=com.test

# Test output adapter
./gradlew generateOutputAdapter \
  --type=mongodb \
  --name=ProductRepository \
  --entityName=Product

# Test input adapter
./gradlew generateInputAdapter \
  --type=kafka-consumer \
  --name=OrderConsumer \
  --useCaseName=ProcessOrderUseCase

# Verify compilation
./gradlew clean build
```

Verify generated files:

**Output Adapter:**
```
src/main/java/com/test/infrastructure/drivenadapters/mongodb/
├── ProductRepositoryAdapter.java
└── config/
    └── ProductRepositoryConfig.java
```

**Input Adapter:**
```
src/main/java/com/test/infrastructure/entrypoints/kafkaconsumer/
├── OrderConsumerConsumer.java
└── config/
    └── OrderConsumerConfig.java
```

## Template Variables

Available variables in adapter templates:

| Variable | Description | Example |
|----------|-------------|---------|
| `${packageName}` | Full package name | `com.example.infrastructure.drivenadapters.mongodb` |
| `${adapterName}` | Adapter name | `ProductRepository` |
| `${suffix}` | Suffix from metadata.yml | `Adapter`, `Controller`, `Repository` |
| `${entityName}` | Entity name (output adapters) | `Product` |
| `${useCaseName}` | Use case name (input adapters) | `CreateProductUseCase` |
| `${basePackage}` | Base package | `com.example` |
| `${projectName}` | Project name | `my-app` |
| `${adapterType}` | Adapter type | `mongodb`, `rest`, `grpc` |
| `${resourcesPath}` | Resources path from structure.yml | `src/main/resources` |

## Validation Checklist

Before publishing your adapter, ensure it passes all 28 validations:

### Required Fields
- [ ] `name` is present and not blank
- [ ] `type` is `input` or `output`
- [ ] `description` is present

### Optional Fields (if specified)
- [ ] `suffix` is not empty
- [ ] `applicationPropertiesTemplate` file exists
- [ ] `buildConfiguration` is valid Kotlin DSL
- [ ] All `dependencies` have: group, artifact, version
- [ ] All `testDependencies` have: group, artifact, version
- [ ] All `configurationClasses` have: name, packagePath, templatePath
- [ ] All `additionalResources` have: name, targetPath, templatePath
- [ ] All `buildPlugins` have: id, version

### Validation Rules
- [ ] No duplicate dependencies (group:artifact)
- [ ] No duplicate testDependencies (group:artifact)
- [ ] configurationClasses.name are valid Java class names
- [ ] configurationClasses.packagePath are valid Java package names
- [ ] All referenced templates exist

### Testing
- [ ] Adapter generates successfully
- [ ] Generated code compiles
- [ ] Dependencies are added to build.gradle.kts
- [ ] Application properties are merged correctly
- [ ] Configuration classes are generated
- [ ] Tests pass

## Examples

See existing adapters for reference:

**Output Adapters:**
- **MongoDB**: `templates/frameworks/spring/reactive/adapters/driven-adapters/mongodb/`
- **Redis**: `templates/frameworks/spring/imperative/adapters/driven-adapters/redis/`
- **PostgreSQL**: `templates/frameworks/spring/imperative/adapters/driven-adapters/postgresql/`

**Input Adapters:**
- **REST**: `templates/frameworks/spring/imperative/adapters/entry-points/rest/`
- **GraphQL**: `templates/frameworks/spring/imperative/adapters/entry-points/graphql/`
- **gRPC**: `templates/frameworks/spring/imperative/adapters/entry-points/grpc/`

## Tips

1. **Follow Spring conventions**: Use standard Spring patterns
2. **Keep it simple**: Start with minimal implementation
3. **No framework annotations in adapters**: Let `BeanConfiguration` handle registration
4. **Include configuration**: Provide example configuration in metadata.yml
5. **Add dependencies**: List all required dependencies
6. **Test thoroughly**: Verify generation, compilation, and runtime
7. **Use schema v2.0**: Follow the unified schema for consistency
8. **Validate early**: Run `./gradlew validateTemplates` before testing

## Need Help?

- Review [metadata.yml Reference](../reference/metadata-yml) for complete schema
- Check [Template System](./template-system.md) documentation
- See existing adapters for patterns
- Ask in [GitHub Discussions](https://github.com/somospragma/backend-architecture-design/discussions)
