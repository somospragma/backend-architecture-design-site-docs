# Adding a New Adapter

This guide explains how to add support for a new adapter type (e.g., MongoDB, Kafka, PostgreSQL) to the Clean Architecture Generator.

## Overview

Adding a new adapter involves:

1. **Add adapter type** to the domain model
2. **Create adapter templates** (FreeMarker)
3. **Update adapter metadata** (index.json)
4. **Test the adapter**

## Step-by-Step Guide

### Step 1: Add Adapter Type

Edit `AdapterConfig.java` to add your new adapter type:

**File:** `src/main/java/com/pragma/archetype/domain/model/AdapterConfig.java`

```java
public enum AdapterType {
    REDIS,
    MONGODB,      // Add new type here
    POSTGRESQL,
    REST_CLIENT,
    KAFKA
}
```

### Step 2: Create Adapter Template Directory

```bash
cd backend-architecture-design-archetype-generator-templates/templates
mkdir -p frameworks/spring/reactive/adapters/driven-adapters/mongodb
```

The structure should be:

```
templates/
└── frameworks/
    └── spring/
        └── reactive/
            └── adapters/
                └── driven-adapters/
                    └── mongodb/
                        ├── Adapter.java.ftl
                        ├── Config.java.ftl
                        ├── Entity.java.ftl
                        ├── Test.java.ftl
                        └── metadata.yml
```

### Step 3: Create Adapter Template

**File:** `templates/frameworks/spring/reactive/adapters/driven-adapters/mongodb/Adapter.java.ftl`

```java
package ${packageName};

import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * MongoDB adapter for ${entityName}.
 * Implements persistence using MongoDB.
 * 
 * Note: This class is automatically registered as a Spring bean
 * through component scanning configured in BeanConfiguration.
 */
public class ${adapterName}Adapter {

    private final ReactiveMongoTemplate mongoTemplate;
    private static final String COLLECTION_NAME = "${entityName?lower_case}s";

    public ${adapterName}Adapter(ReactiveMongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    /**
     * Saves an entity to MongoDB.
     */
    public Mono<Object> save(Object entity) {
        return mongoTemplate.save(entity, COLLECTION_NAME);
    }

    /**
     * Finds an entity by ID.
     */
    public Mono<Object> findById(String id) {
        Query query = new Query(Criteria.where("id").is(id));
        return mongoTemplate.findOne(query, Object.class, COLLECTION_NAME);
    }

    /**
     * Finds all entities.
     */
    public Flux<Object> findAll() {
        return mongoTemplate.findAll(Object.class, COLLECTION_NAME);
    }

    /**
     * Deletes an entity by ID.
     */
    public Mono<Boolean> deleteById(String id) {
        Query query = new Query(Criteria.where("id").is(id));
        return mongoTemplate.remove(query, COLLECTION_NAME)
                .map(result -> result.getDeletedCount() > 0);
    }

    /**
     * Checks if an entity exists.
     */
    public Mono<Boolean> existsById(String id) {
        Query query = new Query(Criteria.where("id").is(id));
        return mongoTemplate.exists(query, COLLECTION_NAME);
    }
}
```

### Step 4: Create Configuration Template (Optional)

**File:** `templates/frameworks/spring/reactive/adapters/driven-adapters/mongodb/Config.java.ftl`

```java
package ${packageName};

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;

/**
 * MongoDB configuration.
 */
@Configuration
public class MongoDBConfig {

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

### Step 5: Create Entity Template (Optional)

**File:** `templates/frameworks/spring/reactive/adapters/driven-adapters/mongodb/Entity.java.ftl`

```java
package ${packageName}.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * MongoDB document for ${entityName}.
 */
@Document(collection = "${entityName?lower_case}s")
public class ${entityName}Data {

    @Id
    private String id;

    // TODO: Add fields

    public ${entityName}Data() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
```

### Step 6: Create Metadata File

**File:** `templates/frameworks/spring/reactive/adapters/driven-adapters/mongodb/metadata.yml`

```yaml
name: "MongoDB Adapter"
description: "Reactive MongoDB adapter for data persistence"
type: "mongodb"
framework: "spring"
paradigm: "reactive"

dependencies:
  - "org.springframework.boot:spring-boot-starter-data-mongodb-reactive"

configuration:
  properties:
    - key: "spring.data.mongodb.uri"
      value: "mongodb://localhost:27017/database-name"
      description: "MongoDB connection URI"

files:
  - name: "Adapter.java"
    description: "Main adapter implementation"
    required: true
  - name: "Config.java"
    description: "MongoDB configuration"
    required: false
  - name: "Entity.java"
    description: "MongoDB document entity"
    required: false
```

### Step 7: Update Index

**File:** `templates/frameworks/spring/reactive/adapters/driven-adapters/index.json`

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
      "description": "Reactive MongoDB adapter for data persistence"
    }
  ]
}
```

### Step 8: Update AdapterGenerator (if needed)

If your adapter needs special handling, update `AdapterGenerator.java`:

```java
private String determineTemplatePath(AdapterConfig config) {
    String framework = "spring";  // TODO: get from project config
    String paradigm = "reactive";  // TODO: get from project config
    
    return String.format(
        "frameworks/%s/%s/adapters/driven-adapters/%s/",
        framework,
        paradigm,
        config.type().name().toLowerCase()
    );
}
```

### Step 9: Test Your Adapter

```bash
# Publish plugin
cd backend-architecture-design-archetype-generator-core
./gradlew clean build publishToMavenLocal -x test

# Test in project
cd test-project
../gradlew generateOutputAdapter --name=ProductRepository --type=mongodb --entity=Product
```

Verify generated files:

```
src/main/java/com/example/test/infrastructure/drivenadapters/mongodb/
├── ProductRepositoryAdapter.java
├── MongoDBConfig.java
└── entity/
    └── ProductData.java
```

## Template Variables

Available variables in adapter templates:

| Variable | Description | Example |
|----------|-------------|---------|
| `${packageName}` | Full package name | `com.example.infrastructure.drivenadapters.mongodb` |
| `${adapterName}` | Adapter name | `ProductRepository` |
| `${entityName}` | Entity name | `Product` |
| `${basePackage}` | Base package | `com.example` |

## Checklist

- [ ] Adapter type added to `AdapterConfig.AdapterType`
- [ ] Adapter template created (`Adapter.java.ftl`)
- [ ] Configuration template created (if needed)
- [ ] Entity template created (if needed)
- [ ] Metadata file created (`metadata.yml`)
- [ ] Index updated (`index.json`)
- [ ] Tested with `generateOutputAdapter` command
- [ ] Generated code compiles
- [ ] Documentation updated

## Examples

See existing adapters:

- **Redis**: `templates/frameworks/spring/reactive/adapters/driven-adapters/redis/`
- **Generic**: `templates/frameworks/spring/reactive/adapters/driven-adapters/generic/`

## Tips

1. **Follow Spring conventions**: Use standard Spring Data patterns
2. **Keep it reactive**: Use `Mono` and `Flux` for reactive paradigm
3. **No framework annotations**: Let `BeanConfiguration` handle registration
4. **Include configuration**: Provide example configuration in metadata
5. **Add dependencies**: List required dependencies in metadata

## Need Help?

- Review existing adapters for patterns
- Check [Template System](./template-system.md) documentation
- Ask in [GitHub Discussions](https://github.com/somospragma/backend-architecture-design/discussions)
