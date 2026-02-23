# PostgreSQL Driven Adapter

Generate a PostgreSQL repository driven adapter with reactive R2DBC support.

## Overview

The PostgreSQL driven adapter provides reactive relational database access using R2DBC. It's ideal for:
- Relational data with ACID properties
- Complex queries and joins
- Transactions
- Data integrity constraints

## Command

```bash
./gradlew generateOutputAdapter \
  --name=<AdapterName> \
  --entity=<EntityName> \
  --type=postgresql \
  --packageName=<package>
```

:::info Terminology
In clean architecture, output adapters are called **driven adapters** because they are driven by the application core. They are located in `infrastructure/driven-adapters/`.
:::

## Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `--name` | Yes | Adapter name | `OrderRepository`, `UserRepository` |
| `--entity` | Yes | Domain entity name | `Order`, `User` |
| `--type` | Yes | Must be `postgresql` | `postgresql` |
| `--packageName` | Yes | Full package path | `com.pragma.infrastructure.driven-adapters.postgresql` |
| `--methods` | No | Custom methods (coming soon) | - |

## Generated Files

### 1. Adapter Implementation
**File**: `{Name}Adapter.java`

Main adapter class with CRUD operations using R2DBC.

### 2. Entity Mapper
**File**: `{Entity}Mapper.java`

MapStruct mapper for domain ↔ entity conversion.

### 3. Entity Class
**File**: `{Entity}Data.java`

JPA-style entity with `@Table` annotation for R2DBC.

## Example

### Generate PostgreSQL Driven Adapter

```bash
./gradlew generateOutputAdapter \
  --name=OrderRepository \
  --entity=Order \
  --type=postgresql \
  --packageName=com.pragma.order.infrastructure.driven-adapters.postgresql
```

### Generated Adapter

```java
package com.pragma.order.infrastructure.driven-adapters.postgresql;

import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class OrderRepositoryAdapter {

  private final DatabaseClient databaseClient;
  private final OrderMapper mapper;

  public OrderRepositoryAdapter(
      DatabaseClient databaseClient,
      OrderMapper mapper) {
    this.databaseClient = databaseClient;
    this.mapper = mapper;
  }

  public Mono<Order> save(Order entity) {
    OrderData data = mapper.toData(entity);
    
    String sql = """
        INSERT INTO orders (id, user_id, total_amount, status, created_at)
        VALUES (:id, :userId, :totalAmount, :status, :createdAt)
        ON CONFLICT (id) DO UPDATE SET
          user_id = :userId,
          total_amount = :totalAmount,
          status = :status
        RETURNING *
        """;
    
    return databaseClient.sql(sql)
        .bind("id", data.getId())
        .bind("userId", data.getUserId())
        .bind("totalAmount", data.getTotalAmount())
        .bind("status", data.getStatus())
        .bind("createdAt", data.getCreatedAt())
        .fetch()
        .one()
        .map(row -> mapper.toDomain(mapToEntity(row)));
  }

  public Mono<Order> findById(String id) {
    String sql = "SELECT * FROM orders WHERE id = :id";
    
    return databaseClient.sql(sql)
        .bind("id", id)
        .fetch()
        .one()
        .map(row -> mapper.toDomain(mapToEntity(row)));
  }

  public Flux<Order> findAll() {
    String sql = "SELECT * FROM orders";
    
    return databaseClient.sql(sql)
        .fetch()
        .all()
        .map(row -> mapper.toDomain(mapToEntity(row)));
  }

  public Mono<Boolean> deleteById(String id) {
    String sql = "DELETE FROM orders WHERE id = :id";
    
    return databaseClient.sql(sql)
        .bind("id", id)
        .fetch()
        .rowsUpdated()
        .map(count -> count > 0);
  }

  public Mono<Boolean> existsById(String id) {
    String sql = "SELECT EXISTS(SELECT 1 FROM orders WHERE id = :id)";
    
    return databaseClient.sql(sql)
        .bind("id", id)
        .fetch()
        .one()
        .map(row -> (Boolean) row.get("exists"));
  }

  private OrderData mapToEntity(Map<String, Object> row) {
    OrderData data = new OrderData();
    data.setId((String) row.get("id"));
    data.setUserId((String) row.get("user_id"));
    data.setTotalAmount((BigDecimal) row.get("total_amount"));
    data.setStatus((String) row.get("status"));
    data.setCreatedAt((Instant) row.get("created_at"));
    return data;
  }
}
```

### Generated Entity

```java
package com.pragma.order.infrastructure.driven-adapters.postgresql.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.relational.core.mapping.Column;

@Table("orders")
public class OrderData {
  
  @Id
  private String id;
  
  @Column("user_id")
  private String userId;
  
  @Column("total_amount")
  private BigDecimal totalAmount;
  
  private String status;
  
  @Column("created_at")
  private Instant createdAt;
  
  // Constructors, Getters, and Setters
}
```

## Configuration

### Dependencies

Add to `build.gradle.kts`:

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
    implementation("org.postgresql:r2dbc-postgresql")
    implementation("org.mapstruct:mapstruct:1.5.5.Final")
    annotationProcessor("org.mapstruct:mapstruct-processor:1.5.5.Final")
    
    // For migrations (optional)
    implementation("org.flywaydb:flyway-core")
    runtimeOnly("org.postgresql:postgresql")  // For Flyway
}
```

### Application Configuration

Add to `application.yml`:

```yaml
spring:
  r2dbc:
    url: r2dbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:mydb}
    username: ${DB_USER:postgres}
    password: ${DB_PASSWORD:postgres}
    pool:
      initial-size: 10
      max-size: 20
      max-idle-time: 30m
  
  # For Flyway migrations
  flyway:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:mydb}
    user: ${DB_USER:postgres}
    password: ${DB_PASSWORD:postgres}
    locations: classpath:db/migration
```

## Database Schema

### Create Migration

Create `src/main/resources/db/migration/V1__create_orders_table.sql`:

```sql
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

## Custom Queries

### Query with WHERE Clause

```java
public Flux<Order> findByUserId(String userId) {
  String sql = "SELECT * FROM orders WHERE user_id = :userId";
  
  return databaseClient.sql(sql)
      .bind("userId", userId)
      .fetch()
      .all()
      .map(row -> mapper.toDomain(mapToEntity(row)));
}
```

### Query with Multiple Conditions

```java
public Flux<Order> findByUserIdAndStatus(String userId, String status) {
  String sql = """
      SELECT * FROM orders 
      WHERE user_id = :userId AND status = :status
      ORDER BY created_at DESC
      """;
  
  return databaseClient.sql(sql)
      .bind("userId", userId)
      .bind("status", status)
      .fetch()
      .all()
      .map(row -> mapper.toDomain(mapToEntity(row)));
}
```

### Query with Pagination

```java
public Flux<Order> findWithPagination(int page, int size) {
  String sql = """
      SELECT * FROM orders 
      ORDER BY created_at DESC 
      LIMIT :limit OFFSET :offset
      """;
  
  return databaseClient.sql(sql)
      .bind("limit", size)
      .bind("offset", page * size)
      .fetch()
      .all()
      .map(row -> mapper.toDomain(mapToEntity(row)));
}
```

### Query with JOIN

```java
public Flux<OrderWithUser> findOrdersWithUsers() {
  String sql = """
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      INNER JOIN users u ON o.user_id = u.id
      WHERE o.status = 'ACTIVE'
      """;
  
  return databaseClient.sql(sql)
      .fetch()
      .all()
      .map(this::mapToOrderWithUser);
}
```

### Aggregate Queries

```java
public Mono<BigDecimal> getTotalAmountByUser(String userId) {
  String sql = """
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM orders 
      WHERE user_id = :userId
      """;
  
  return databaseClient.sql(sql)
      .bind("userId", userId)
      .fetch()
      .one()
      .map(row -> (BigDecimal) row.get("total"));
}

public Mono<Long> countByStatus(String status) {
  String sql = "SELECT COUNT(*) as count FROM orders WHERE status = :status";
  
  return databaseClient.sql(sql)
      .bind("status", status)
      .fetch()
      .one()
      .map(row -> ((Number) row.get("count")).longValue());
}
```

### Update Operations

```java
public Mono<Order> updateStatus(String id, String newStatus) {
  String sql = """
      UPDATE orders 
      SET status = :status, updated_at = :updatedAt
      WHERE id = :id
      RETURNING *
      """;
  
  return databaseClient.sql(sql)
      .bind("id", id)
      .bind("status", newStatus)
      .bind("updatedAt", Instant.now())
      .fetch()
      .one()
      .map(row -> mapper.toDomain(mapToEntity(row)));
}
```

## Transactions

### Using @Transactional

```java
@Component
public class OrderRepositoryAdapter {

  @Transactional
  public Mono<Order> saveWithItems(Order order, List<OrderItem> items) {
    return save(order)
        .flatMap(savedOrder -> 
            Flux.fromIterable(items)
                .flatMap(item -> saveOrderItem(savedOrder.getId(), item))
                .then(Mono.just(savedOrder))
        );
  }
}
```

### Programmatic Transactions

```java
@Component
public class OrderRepositoryAdapter {

  private final TransactionalOperator transactionalOperator;

  public Mono<Order> saveWithTransaction(Order order) {
    return save(order)
        .flatMap(this::performAdditionalOperations)
        .as(transactionalOperator::transactional);
  }
}
```

## Testing

### Integration Test with Testcontainers

```java
@SpringBootTest
@Testcontainers
class OrderRepositoryAdapterIntegrationTest {

  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
      .withDatabaseName("testdb")
      .withUsername("test")
      .withPassword("test");

  @DynamicPropertySource
  static void postgresProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.r2dbc.url", () -> 
        "r2dbc:postgresql://" + postgres.getHost() + ":" + 
        postgres.getFirstMappedPort() + "/" + postgres.getDatabaseName());
    registry.add("spring.r2dbc.username", postgres::getUsername);
    registry.add("spring.r2dbc.password", postgres::getPassword);
    
    // For Flyway
    registry.add("spring.flyway.url", postgres::getJdbcUrl);
    registry.add("spring.flyway.user", postgres::getUsername);
    registry.add("spring.flyway.password", postgres::getPassword);
  }

  @Autowired
  private OrderRepositoryAdapter adapter;

  @Test
  void shouldSaveAndRetrieveOrder() {
    // Given
    Order order = new Order("1", "user-1", new BigDecimal("99.99"), "PENDING");

    // When
    Mono<Order> savedOrder = adapter.save(order);
    Mono<Order> retrievedOrder = savedOrder
        .flatMap(o -> adapter.findById(o.getId()));

    // Then
    StepVerifier.create(retrievedOrder)
        .expectNextMatches(o -> 
            o.getUserId().equals("user-1") && 
            o.getTotalAmount().compareTo(new BigDecimal("99.99")) == 0)
        .verifyComplete();
  }
}
```

## Best Practices

### 1. Use Prepared Statements

Always use parameter binding to prevent SQL injection:

```java
// Good
databaseClient.sql("SELECT * FROM orders WHERE id = :id")
    .bind("id", id)

// Bad - SQL Injection risk!
databaseClient.sql("SELECT * FROM orders WHERE id = '" + id + "'")
```

### 2. Handle NULL Values

```java
public Mono<Order> save(Order entity) {
  return databaseClient.sql(sql)
      .bind("id", entity.getId())
      .bind("userId", entity.getUserId())
      .bind("notes", entity.getNotes() != null ? entity.getNotes() : Parameters.in(String.class))
      .fetch()
      .one();
}
```

### 3. Use Connection Pooling

Configure appropriate pool sizes in `application.yml`:

```yaml
spring:
  r2dbc:
    pool:
      initial-size: 10
      max-size: 20
      max-idle-time: 30m
      validation-query: SELECT 1
```

### 4. Implement Soft Delete

```java
public Mono<Boolean> softDelete(String id) {
  String sql = """
      UPDATE orders 
      SET deleted = true, deleted_at = :deletedAt
      WHERE id = :id
      """;
  
  return databaseClient.sql(sql)
      .bind("id", id)
      .bind("deletedAt", Instant.now())
      .fetch()
      .rowsUpdated()
      .map(count -> count > 0);
}
```

## Docker Setup

```bash
# Start PostgreSQL
docker run -d \
  --name postgres \
  -p 5432:5432 \
  -e POSTGRES_DB=mydb \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:16-alpine

# Connect to PostgreSQL
docker exec -it postgres psql -U postgres -d mydb
```

## Next Steps

- [Redis Driven Adapter](redis)
- [MongoDB Driven Adapter](mongodb)
- [R2DBC Guide](../../guides/r2dbc)
- [Driven Adapters Overview](../../generators/output-adapters)
