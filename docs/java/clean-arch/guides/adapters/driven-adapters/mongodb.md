# MongoDB Driven Adapter

Generate a MongoDB repository driven adapter for document-based storage.

## Overview

The MongoDB driven adapter provides reactive document storage using Spring Data MongoDB. It's ideal for:
- Document-oriented data
- Flexible schemas
- Nested data structures
- JSON-like documents

## Command

```bash
./gradlew generateOutputAdapter \
  --name=<AdapterName> \
  --entity=<EntityName> \
  --type=mongodb \
  --packageName=<package>
```

:::info Terminology
In clean architecture, output adapters are called **driven adapters** because they are driven by the application core. They are located in `infrastructure/driven-adapters/`.
:::

## Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `--name` | Yes | Adapter name | `ProductRepository`, `OrderRepository` |
| `--entity` | Yes | Domain entity name | `Product`, `Order` |
| `--type` | Yes | Must be `mongodb` | `mongodb` |
| `--packageName` | Yes | Full package path | `com.pragma.infrastructure.driven-adapters.mongodb` |
| `--methods` | No | Custom methods (coming soon) | - |

## Generated Files

### 1. Adapter Implementation
**File**: `{Name}Adapter.java`

Main adapter class with CRUD operations using reactive MongoDB.

### 2. Entity Mapper
**File**: `{Entity}Mapper.java`

MapStruct mapper for domain ↔ document conversion.

### 3. Document Entity
**File**: `{Entity}Data.java`

MongoDB document with `@Document` annotation.

## Example

### Generate MongoDB Driven Adapter

```bash
./gradlew generateOutputAdapter \
  --name=ProductRepository \
  --entity=Product \
  --type=mongodb \
  --packageName=com.pragma.ecommerce.infrastructure.driven-adapters.mongodb
```

### Generated Adapter

```java
package com.pragma.ecommerce.infrastructure.driven-adapters.mongodb;

import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class ProductRepositoryAdapter {

  private final ReactiveMongoTemplate mongoTemplate;
  private final ProductMapper mapper;

  public ProductRepositoryAdapter(
      ReactiveMongoTemplate mongoTemplate,
      ProductMapper mapper) {
    this.mongoTemplate = mongoTemplate;
    this.mapper = mapper;
  }

  public Mono<Product> save(Product entity) {
    ProductData data = mapper.toData(entity);
    
    return mongoTemplate.save(data)
        .map(mapper::toDomain);
  }

  public Mono<Product> findById(String id) {
    return mongoTemplate.findById(id, ProductData.class)
        .map(mapper::toDomain);
  }

  public Flux<Product> findAll() {
    return mongoTemplate.findAll(ProductData.class)
        .map(mapper::toDomain);
  }

  public Mono<Boolean> deleteById(String id) {
    Query query = Query.query(Criteria.where("_id").is(id));
    
    return mongoTemplate.remove(query, ProductData.class)
        .map(result -> result.getDeletedCount() > 0);
  }

  public Mono<Boolean> existsById(String id) {
    Query query = Query.query(Criteria.where("_id").is(id));
    
    return mongoTemplate.exists(query, ProductData.class);
  }
}
```

### Generated Document

```java
package com.pragma.ecommerce.infrastructure.driven-adapters.mongodb.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "products")
public class ProductData {
  
  @Id
  private String id;
  
  @Field("product_name")
  private String name;
  
  private BigDecimal price;
  private Integer stock;
  
  // Constructors, Getters, and Setters
}
```

## Configuration

### Dependencies

Add to `build.gradle.kts`:

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-mongodb-reactive")
    implementation("org.mapstruct:mapstruct:1.5.5.Final")
    annotationProcessor("org.mapstruct:mapstruct-processor:1.5.5.Final")
}
```

### Application Configuration

Add to `application.yml`:

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://${MONGO_HOST:localhost}:${MONGO_PORT:27017}/${MONGO_DB:mydb}
      database: ${MONGO_DB:mydb}
      # With authentication
      # uri: mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:27017/${MONGO_DB}?authSource=admin
```

## Custom Methods

### Query by Field

```java
public Flux<Product> findByCategory(String category) {
  Query query = Query.query(Criteria.where("category").is(category));
  
  return mongoTemplate.find(query, ProductData.class)
      .map(mapper::toDomain);
}
```

### Query with Multiple Criteria

```java
public Flux<Product> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
  Query query = Query.query(
      Criteria.where("price")
          .gte(minPrice)
          .lte(maxPrice)
  );
  
  return mongoTemplate.find(query, ProductData.class)
      .map(mapper::toDomain);
}
```

### Query with Sorting

```java
public Flux<Product> findAllSortedByPrice() {
  Query query = new Query()
      .with(Sort.by(Sort.Direction.ASC, "price"));
  
  return mongoTemplate.find(query, ProductData.class)
      .map(mapper::toDomain);
}
```

### Query with Pagination

```java
public Flux<Product> findWithPagination(int page, int size) {
  Query query = new Query()
      .skip((long) page * size)
      .limit(size);
  
  return mongoTemplate.find(query, ProductData.class)
      .map(mapper::toDomain);
}
```

### Text Search

```java
public Flux<Product> searchByName(String searchTerm) {
  Query query = Query.query(
      Criteria.where("name").regex(searchTerm, "i")  // case-insensitive
  );
  
  return mongoTemplate.find(query, ProductData.class)
      .map(mapper::toDomain);
}
```

### Update Operations

```java
public Mono<Product> updateStock(String id, Integer newStock) {
  Query query = Query.query(Criteria.where("_id").is(id));
  Update update = Update.update("stock", newStock);
  
  return mongoTemplate.findAndModify(
      query, 
      update, 
      FindAndModifyOptions.options().returnNew(true),
      ProductData.class
  ).map(mapper::toDomain);
}
```

## Indexes

### Create Indexes

```java
@Configuration
public class MongoConfig {

  @Bean
  public MongoCustomConversions customConversions() {
    return new MongoCustomConversions(Collections.emptyList());
  }

  @EventListener(ApplicationReadyEvent.class)
  public void initIndicesAfterStartup(ApplicationReadyEvent event) {
    ReactiveMongoTemplate mongoTemplate = event.getApplicationContext()
        .getBean(ReactiveMongoTemplate.class);
    
    // Create index on name field
    mongoTemplate.indexOps(ProductData.class)
        .ensureIndex(new Index().on("name", Sort.Direction.ASC))
        .subscribe();
    
    // Create compound index
    mongoTemplate.indexOps(ProductData.class)
        .ensureIndex(new Index()
            .on("category", Sort.Direction.ASC)
            .on("price", Sort.Direction.DESC))
        .subscribe();
    
    // Create text index for search
    mongoTemplate.indexOps(ProductData.class)
        .ensureIndex(new TextIndexDefinition.TextIndexDefinitionBuilder()
            .onField("name")
            .onField("description")
            .build())
        .subscribe();
  }
}
```

### Using Annotations

```java
@Document(collection = "products")
@CompoundIndex(name = "category_price_idx", def = "{'category': 1, 'price': -1}")
public class ProductData {
  
  @Id
  private String id;
  
  @Indexed
  private String name;
  
  @Indexed
  private String category;
  
  private BigDecimal price;
}
```

## Testing

### Integration Test with Testcontainers

```java
@SpringBootTest
@Testcontainers
class ProductRepositoryAdapterIntegrationTest {

  @Container
  static MongoDBContainer mongodb = new MongoDBContainer("mongo:7.0")
      .withExposedPorts(27017);

  @DynamicPropertySource
  static void mongoProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.data.mongodb.uri", mongodb::getReplicaSetUrl);
  }

  @Autowired
  private ProductRepositoryAdapter adapter;

  @Test
  void shouldSaveAndRetrieveProduct() {
    // Given
    Product product = new Product("1", "Laptop", new BigDecimal("999.99"), 10);

    // When
    Mono<Product> savedProduct = adapter.save(product);
    Mono<Product> retrievedProduct = savedProduct
        .flatMap(p -> adapter.findById(p.getId()));

    // Then
    StepVerifier.create(retrievedProduct)
        .expectNextMatches(p -> 
            p.getName().equals("Laptop") && 
            p.getPrice().compareTo(new BigDecimal("999.99")) == 0)
        .verifyComplete();
  }
}
```

## Best Practices

### 1. Use Proper Field Mapping

```java
@Document(collection = "products")
public class ProductData {
  
  @Id
  private String id;
  
  @Field("product_name")  // Map to different field name in MongoDB
  private String name;
  
  @Field("created_date")
  private Instant createdAt;
}
```

### 2. Handle Nested Documents

```java
@Document(collection = "orders")
public class OrderData {
  
  @Id
  private String id;
  
  private List<OrderItemData> items;  // Embedded documents
  
  @DBRef  // Reference to another collection
  private CustomerData customer;
}
```

### 3. Use Projections

```java
public Flux<String> findAllProductNames() {
  Query query = new Query();
  query.fields().include("name");
  
  return mongoTemplate.find(query, ProductData.class)
      .map(ProductData::getName);
}
```

### 4. Implement Soft Delete

```java
@Document(collection = "products")
public class ProductData {
  
  @Id
  private String id;
  private String name;
  private Boolean deleted = false;
  private Instant deletedAt;
}

// Soft delete method
public Mono<Boolean> softDelete(String id) {
  Query query = Query.query(Criteria.where("_id").is(id));
  Update update = Update.update("deleted", true)
      .set("deletedAt", Instant.now());
  
  return mongoTemplate.updateFirst(query, update, ProductData.class)
      .map(result -> result.getModifiedCount() > 0);
}

// Find only non-deleted
public Flux<Product> findAllActive() {
  Query query = Query.query(Criteria.where("deleted").is(false));
  
  return mongoTemplate.find(query, ProductData.class)
      .map(mapper::toDomain);
}
```

## Docker Setup

```bash
# Start MongoDB
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -v mongo-data:/data/db \
  mongo:7.0

# Connect to MongoDB shell
docker exec -it mongodb mongosh -u admin -p password
```

## Next Steps

- [Redis Driven Adapter](redis)
- [PostgreSQL Driven Adapter](postgresql)
- [MongoDB Queries Guide](../../guides/mongodb-queries)
- [Driven Adapters Overview](../../generators/output-adapters)
