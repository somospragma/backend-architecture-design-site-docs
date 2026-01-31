# Adding a New Adapter

Learn how to add support for a new technology adapter (e.g., Cassandra, Elasticsearch, RabbitMQ).

## Overview

Adding a new adapter involves:
1. Creating Freemarker templates
2. Adding adapter type to the plugin
3. Creating documentation
4. Adding tests

## Step-by-Step Guide

### Step 1: Decide Adapter Type

**Driven Adapter (Output)** - For external systems your app calls:
- Databases (Cassandra, Elasticsearch)
- Caches (Memcached, Hazelcast)
- Message queues (RabbitMQ, ActiveMQ)
- External APIs

**Entry Point (Input)** - For external systems that call your app:
- REST APIs
- GraphQL
- Message consumers (RabbitMQ, ActiveMQ)
- gRPC

### Step 2: Create Template Files

#### For Driven Adapters

Location: `templates/components/adapter/{technology}/`

**Required files:**
1. `{Technology}Adapter.java.ftl` - Main adapter implementation
2. `EntityMapper.java.ftl` - MapStruct mapper
3. `{Technology}Entity.java.ftl` - Technology-specific entity

**Example: Cassandra Adapter**

Create `templates/components/adapter/CassandraAdapter.java.ftl`:

```java
package ${packageName};

import org.springframework.data.cassandra.core.ReactiveCassandraTemplate;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import ${packageName}.entity.${entityName}Data;
import ${packageName}.mapper.${entityName}Mapper;

/**
 * Cassandra adapter for ${entityName}.
 * Implements the output port for ${entityName} persistence using Cassandra.
 */
@Component
public class ${adapterName}Adapter {

  private final ReactiveCassandraTemplate cassandraTemplate;
  private final ${entityName}Mapper mapper;

  public ${adapterName}Adapter(
      ReactiveCassandraTemplate cassandraTemplate,
      ${entityName}Mapper mapper) {
    this.cassandraTemplate = cassandraTemplate;
    this.mapper = mapper;
  }

  /**
   * Saves a ${entityName} to Cassandra.
   */
  public Mono<${entityName}> save(${entityName} entity) {
    ${entityName}Data data = mapper.toData(entity);
    
    return cassandraTemplate.insert(data)
        .map(mapper::toDomain);
  }

  /**
   * Finds a ${entityName} by ID.
   */
  public Mono<${entityName}> findById(String id) {
    return cassandraTemplate.selectOneById(id, ${entityName}Data.class)
        .map(mapper::toDomain);
  }

  /**
   * Finds all ${entityName} entities.
   */
  public Flux<${entityName}> findAll() {
    return cassandraTemplate.selectAll(${entityName}Data.class)
        .map(mapper::toDomain);
  }

  /**
   * Deletes a ${entityName} by ID.
   */
  public Mono<Boolean> deleteById(String id) {
    return cassandraTemplate.deleteById(id, ${entityName}Data.class)
        .map(result -> result.wasApplied());
  }

  /**
   * Checks if a ${entityName} exists by ID.
   */
  public Mono<Boolean> existsById(String id) {
    return cassandraTemplate.exists(id, ${entityName}Data.class);
  }

<#if methods?has_content>
<#list methods as method>
  /**
   * ${method.name}
   */
  public ${method.returnType} ${method.name}(<#if method.parameters?? && method.parameters?has_content><#list method.parameters as param>${param.type} ${param.name}<#sep>, </#sep></#list></#if>) {
    // TODO: Implement custom method
    throw new UnsupportedOperationException("Not implemented yet");
  }

</#list>
</#if>
}
```

Create `templates/components/adapter/CassandraEntity.java.ftl`:

```java
package ${packageName}.entity;

import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;
import org.springframework.data.cassandra.core.mapping.Column;

/**
 * Cassandra entity for ${entityName}.
 */
@Table("${entityName?lower_case}")
public class ${entityName}Data {
  
  @PrimaryKey
  private String id;
  
  // Add entity fields here based on domain entity
  
  // Constructors
  public ${entityName}Data() {}
  
  public ${entityName}Data(String id) {
    this.id = id;
  }
  
  // Getters and Setters
  public String getId() {
    return id;
  }
  
  public void setId(String id) {
    this.id = id;
  }
}
```

#### For Entry Points

Location: `templates/components/entry-point/{type}/`

**Example: GraphQL Resolver**

Create `templates/components/entry-point/GraphQLResolver.java.ftl`:

```java
package ${packageName};

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * GraphQL Resolver for ${controllerName}.
 */
@Controller
public class ${controllerName}Resolver {

  private final ${useCaseName} ${useCaseName?uncap_first};

  public ${controllerName}Resolver(${useCaseName} ${useCaseName?uncap_first}) {
    this.${useCaseName?uncap_first} = ${useCaseName?uncap_first};
  }

<#list endpoints as endpoint>
  /**
   * ${endpoint.method} ${endpoint.path}
   */
  @<#if endpoint.method == "GET">QueryMapping<#else>MutationMapping</#if>
  public Mono<${endpoint.returnType}> ${endpoint.useCaseMethod}(
<#if endpoint.parameters?has_content>
<#list endpoint.parameters as param>
      @Argument ${param.type} ${param.name}<#sep>,
</#sep>
</#list>
</#if>) {
    return ${useCaseName?uncap_first}.${endpoint.useCaseMethod}(<#if endpoint.parameters?has_content><#list endpoint.parameters as param>${param.name}<#sep>, </#sep></#list></#if>);
  }

</#list>
}
```

### Step 3: Add Adapter Type to Plugin

Edit `AdapterConfig.java` in the core plugin:

```java
public record AdapterConfig(
    String name,
    String packageName,
    AdapterType type,
    String entityName,
    List<AdapterMethod> methods
) {

  public enum AdapterType {
    REDIS,
    MONGODB,
    POSTGRESQL,
    REST_CLIENT,
    KAFKA,
    CASSANDRA,        // ← Add new type
    ELASTICSEARCH,    // ← Add new type
    RABBITMQ          // ← Add new type
  }
  
  // ... rest of the code
}
```

### Step 4: Update Adapter Generator

Edit `AdapterGenerator.java`:

```java
private String getAdapterTemplate(AdapterConfig.AdapterType type) {
  return switch (type) {
    case REDIS -> "components/adapter/RedisAdapter.java.ftl";
    case MONGODB -> "components/adapter/MongoDbAdapter.java.ftl";
    case POSTGRESQL -> "components/adapter/PostgreSqlAdapter.java.ftl";
    case REST_CLIENT -> "components/adapter/RestClientAdapter.java.ftl";
    case KAFKA -> "components/adapter/KafkaAdapter.java.ftl";
    case CASSANDRA -> "components/adapter/CassandraAdapter.java.ftl";  // ← Add
    case ELASTICSEARCH -> "components/adapter/ElasticsearchAdapter.java.ftl";  // ← Add
    case RABBITMQ -> "components/adapter/RabbitMqAdapter.java.ftl";  // ← Add
  };
}

private String getDataEntityTemplate(AdapterConfig.AdapterType type) {
  return switch (type) {
    case REDIS -> "components/adapter/RedisEntity.java.ftl";
    case MONGODB -> "components/adapter/MongoDbEntity.java.ftl";
    case POSTGRESQL -> "components/adapter/PostgreSqlEntity.java.ftl";
    case REST_CLIENT -> null; // No entity for REST client
    case KAFKA -> null; // No entity for Kafka
    case CASSANDRA -> "components/adapter/CassandraEntity.java.ftl";  // ← Add
    case ELASTICSEARCH -> "components/adapter/ElasticsearchEntity.java.ftl";  // ← Add
    case RABBITMQ -> null;  // ← Add
  };
}
```

### Step 5: Create Documentation

Create `docs/clean-arch/guides/adapters/driven-adapters/cassandra.md`:

```markdown
# Cassandra Adapter (Driven Adapter)

Generate a Cassandra repository adapter for NoSQL document storage.

## Overview

The Cassandra adapter provides reactive NoSQL database access. It's ideal for:
- High-volume write operations
- Time-series data
- Distributed data storage
- High availability requirements

## Command

\`\`\`bash
./gradlew generateOutputAdapter \\
  --name=<AdapterName> \\
  --entity=<EntityName> \\
  --type=cassandra \\
  --packageName=<package>
\`\`\`

## Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `--name` | Yes | Adapter name | `UserRepository` |
| `--entity` | Yes | Domain entity name | `User` |
| `--type` | Yes | Must be `cassandra` | `cassandra` |
| `--packageName` | Yes | Full package path | `com.pragma.infrastructure.driven-adapters.cassandra` |

## Example

\`\`\`bash
./gradlew generateOutputAdapter \\
  --name=UserRepository \\
  --entity=User \\
  --type=cassandra \\
  --packageName=com.pragma.user.infrastructure.driven-adapters.cassandra
\`\`\`

## Generated Files

1. **Adapter**: `UserRepositoryAdapter.java`
2. **Mapper**: `UserMapper.java`
3. **Entity**: `UserData.java` with `@Table` annotation

## Configuration

### Dependencies

\`\`\`kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-cassandra-reactive")
    implementation("org.mapstruct:mapstruct:1.5.5.Final")
    annotationProcessor("org.mapstruct:mapstruct-processor:1.5.5.Final")
}
\`\`\`

### Application Configuration

\`\`\`yaml
spring:
  data:
    cassandra:
      keyspace-name: ${CASSANDRA_KEYSPACE:mykeyspace}
      contact-points: ${CASSANDRA_HOST:localhost}
      port: ${CASSANDRA_PORT:9042}
      local-datacenter: ${CASSANDRA_DC:datacenter1}
\`\`\`

## Next Steps

- [Redis Adapter](redis)
- [MongoDB Adapter](mongodb)
- [Driven Adapters Overview](../../generators/output-adapters)
```

### Step 6: Add Tests

Create `AdapterGeneratorTest.java` test case:

```java
@Test
void shouldGenerateCassandraAdapter() {
  // Given
  AdapterConfig config = AdapterConfig.builder()
      .name("UserRepository")
      .entityName("User")
      .type(AdapterConfig.AdapterType.CASSANDRA)
      .packageName("com.pragma.infrastructure.driven-adapters.cassandra")
      .build();

  // When
  List<GeneratedFile> files = generator.generate(projectPath, config);

  // Then
  assertThat(files).hasSize(3);
  assertThat(files).extracting(GeneratedFile::path)
      .containsExactlyInAnyOrder(
          projectPath.resolve("src/main/java/com/pragma/infrastructure/driven-adapters/cassandra/UserRepositoryAdapter.java"),
          projectPath.resolve("src/main/java/com/pragma/infrastructure/driven-adapters/cassandra/mapper/UserMapper.java"),
          projectPath.resolve("src/main/java/com/pragma/infrastructure/driven-adapters/cassandra/entity/UserData.java")
      );
}
```

### Step 7: Update Documentation Index

Add to `sidebars.js`:

```javascript
{
  type: 'category',
  label: 'Driven Adapters (Output)',
  items: [
    'clean-arch/guides/adapters/driven-adapters/redis',
    'clean-arch/guides/adapters/driven-adapters/mongodb',
    'clean-arch/guides/adapters/driven-adapters/postgresql',
    'clean-arch/guides/adapters/driven-adapters/cassandra',  // ← Add
  ],
},
```

## Testing Your Adapter

### 1. Build and Publish Plugin

```bash
cd backend-architecture-design-archetype-generator-core
./gradlew clean build publishToMavenLocal -x test
```

### 2. Test in Sample Project

```bash
cd ../test-project

# Generate adapter
./gradlew generateOutputAdapter \\
  --name=UserRepository \\
  --entity=User \\
  --type=cassandra \\
  --packageName=com.pragma.user.infrastructure.driven-adapters.cassandra

# Verify generated files
ls -la src/main/java/com/pragma/user/infrastructure/driven-adapters/cassandra/
```

### 3. Verify Generated Code

Check that:
- ✅ All files are generated
- ✅ Package names are correct
- ✅ Imports are correct
- ✅ Code compiles without errors
- ✅ Follows project conventions

## Checklist

Before submitting your PR:

- [ ] Created all required template files
- [ ] Added adapter type to `AdapterConfig.java`
- [ ] Updated `AdapterGenerator.java`
- [ ] Created comprehensive documentation
- [ ] Added unit tests
- [ ] Tested end-to-end in sample project
- [ ] Updated `sidebars.js`
- [ ] Followed naming conventions
- [ ] Added configuration examples
- [ ] Included Docker setup (if applicable)
- [ ] Added troubleshooting section

## Common Pitfalls

### 1. Incorrect Package Names

```java
// Bad
package com.pragma.adapter.cassandra;

// Good
package ${packageName};
```

### 2. Missing Freemarker Directives

```java
// Bad
public class UserRepositoryAdapter {

// Good
public class ${adapterName}Adapter {
```

### 3. Hardcoded Entity Names

```java
// Bad
private final UserMapper mapper;

// Good
private final ${entityName}Mapper mapper;
```

### 4. Missing Null Checks in Templates

```java
// Bad
<#list methods as method>

// Good
<#if methods?has_content>
<#list methods as method>
```

## Examples

### Complete Cassandra Adapter PR

See: [PR #123 - Add Cassandra Adapter](https://github.com/example/pr/123)

### Complete Elasticsearch Adapter PR

See: [PR #145 - Add Elasticsearch Adapter](https://github.com/example/pr/145)

## Getting Help

- Check existing adapters for reference
- Ask in GitHub Discussions
- Review Freemarker documentation
- Contact maintainers

## Next Steps

- [Adding a New Command](adding-commands)
- [Modifying Templates](modifying-templates)
- [Contributing Overview](overview)
