# Generating Driven Adapters

Learn how to generate driven adapters for databases, caches, and external services.

## Overview

Driven adapters implement the output ports defined in your domain layer. They handle communication with external systems like databases, caches, message queues, and external APIs.

:::info Terminology
In clean architecture, output adapters are called **driven adapters** because they are driven by the application core. They are located in `infrastructure/driven-adapters/`.
:::

## Basic Usage

```bash
./gradlew generateOutputAdapter \
  --name=UserRepository \
  --entity=User \
  --type=redis \
  --packageName=com.pragma.infrastructure.driven-adapters.redis
```

## Parameters

### Required Parameters

- **--name**: Adapter name (e.g., `UserRepository`, `ProductCache`)
- **--entity**: Entity name that the adapter manages
- **--type**: Type of adapter (see supported types below)
- **--packageName**: Full package name for the adapter

### Optional Parameters

- **--methods**: Custom methods beyond CRUD operations

## Supported Adapter Types

| Type | Description | Use Case |
|------|-------------|----------|
| `redis` | Redis cache adapter | Caching, session storage |
| `mongodb` | MongoDB repository | Document storage |
| `postgresql` | PostgreSQL with R2DBC | Relational database (reactive) |
| `rest_client` | HTTP REST client | External API calls |
| `kafka` | Kafka producer | Event publishing |

## Generated Files

Each adapter generation creates three files:

1. **Adapter Implementation**: Main adapter class with CRUD operations
2. **Entity Mapper**: MapStruct mapper between domain and data entities
3. **Data Entity**: Technology-specific entity (e.g., `@RedisHash`, `@Document`)

## Examples

### Redis Cache Driven Adapter

```bash
./gradlew generateOutputAdapter \
  --name=UserRepository \
  --entity=User \
  --type=redis \
  --packageName=com.pragma.user.infrastructure.driven-adapters.redis
```

**Generated Files:**

1. `UserRepositoryAdapter.java`:
```java
package com.pragma.user.infrastructure.driven-adapters.redis;

import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class UserRepositoryAdapter {

  private final ReactiveRedisTemplate<String, UserData> redisTemplate;
  private final UserMapper mapper;
  private static final String KEY_PREFIX = "user:";

  public UserRepositoryAdapter(
      ReactiveRedisTemplate<String, UserData> redisTemplate,
      UserMapper mapper) {
    this.redisTemplate = redisTemplate;
    this.mapper = mapper;
  }

  public Mono<User> save(User entity) {
    UserData data = mapper.toData(entity);
    String key = KEY_PREFIX + entity.getId();
    
    return redisTemplate.opsForValue()
        .set(key, data)
        .thenReturn(entity);
  }

  public Mono<User> findById(String id) {
    String key = KEY_PREFIX + id;
    
    return redisTemplate.opsForValue()
        .get(key)
        .map(mapper::toDomain);
  }

  public Flux<User> findAll() {
    String pattern = KEY_PREFIX + "*";
    
    return redisTemplate.keys(pattern)
        .flatMap(key -> redisTemplate.opsForValue().get(key))
        .map(mapper::toDomain);
  }

  public Mono<Boolean> deleteById(String id) {
    String key = KEY_PREFIX + id;
    
    return redisTemplate.delete(key)
        .map(count -> count > 0);
  }

  public Mono<Boolean> existsById(String id) {
    String key = KEY_PREFIX + id;
    
    return redisTemplate.hasKey(key);
  }
}
```

2. `UserMapper.java`:
```java
package com.pragma.user.infrastructure.driven-adapters.redis.mapper;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
  
  UserData toData(User domain);
  
  User toDomain(UserData data);
  
}
```

3. `UserData.java`:
```java
package com.pragma.user.infrastructure.driven-adapters.redis.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash("user")
public class UserData {
  
  @Id
  private String id;
  
  // Fields from User entity
  
  // Getters and Setters
}
```

### MongoDB Repository

```bash
./gradlew generateOutputAdapter \
  --name=ProductRepository \
  --entity=Product \
  --type=mongodb \
  --packageName=com.pragma.ecommerce.infrastructure.driven-adapters.mongodb
```

**Key Features:**
- Uses `@Document` annotation
- Reactive MongoDB operations
- Automatic index creation support

### PostgreSQL Repository

```bash
./gradlew generateOutputAdapter \
  --name=OrderRepository \
  --entity=Order \
  --type=postgresql \
  --packageName=com.pragma.order.infrastructure.driven-adapters.postgresql
```

**Key Features:**
- Uses R2DBC for reactive database access
- `@Table` annotation for table mapping
- Support for relationships

### REST Client Driven Adapter

```bash
./gradlew generateOutputAdapter \
  --name=PaymentGateway \
  --entity=Payment \
  --type=rest_client \
  --packageName=com.pragma.payment.infrastructure.driven-adapters.gateway
```

**Use Case:** Calling external payment APIs

### Kafka Producer Driven Adapter

```bash
./gradlew generateOutputAdapter \
  --name=OrderEventPublisher \
  --entity=OrderEvent \
  --type=kafka \
  --packageName=com.pragma.order.infrastructure.driven-adapters.kafka
```

**Use Case:** Publishing domain events

## CRUD Operations

All generated adapters include these standard operations:

### save()
Saves or updates an entity:
```java
Mono<User> savedUser = userRepository.save(user);
```

### findById()
Finds an entity by ID:
```java
Mono<User> user = userRepository.findById("user-123");
```

### findAll()
Retrieves all entities:
```java
Flux<User> users = userRepository.findAll();
```

### deleteById()
Deletes an entity by ID:
```java
Mono<Boolean> deleted = userRepository.deleteById("user-123");
```

### existsById()
Checks if an entity exists:
```java
Mono<Boolean> exists = userRepository.existsById("user-123");
```

## Custom Methods

You can add custom methods during generation (coming soon) or manually after generation:

```java
@Component
public class UserRepositoryAdapter {

  // Generated CRUD methods...

  // Custom method
  public Mono<User> findByEmail(String email) {
    String pattern = KEY_PREFIX + "*";
    
    return redisTemplate.keys(pattern)
        .flatMap(key -> redisTemplate.opsForValue().get(key))
        .map(mapper::toDomain)
        .filter(user -> user.getEmail().equals(email))
        .next();
  }

  // Custom method with query
  public Flux<User> findByAgeGreaterThan(int age) {
    String pattern = KEY_PREFIX + "*";
    
    return redisTemplate.keys(pattern)
        .flatMap(key -> redisTemplate.opsForValue().get(key))
        .map(mapper::toDomain)
        .filter(user -> user.getAge() > age);
  }
}
```

## Implementing Output Ports

After generating the adapter, implement the output port interface:

**1. Define the port in domain layer:**

```java
package com.pragma.user.domain.port.out;

import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

public interface UserRepository {
  Mono<User> save(User user);
  Mono<User> findById(String id);
  Flux<User> findAll();
  Mono<Boolean> deleteById(String id);
  Mono<Boolean> existsById(String id);
  Mono<User> findByEmail(String email);
}
```

**2. Make adapter implement the port:**

```java
@Component
public class UserRepositoryAdapter implements UserRepository {
  
  // Implementation...
  
}
```

## Configuration

### Redis Configuration

Add to `application.yml`:

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password: ${REDIS_PASSWORD:}
      database: 0
```

Add dependencies to `build.gradle.kts`:

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-redis-reactive")
    implementation("org.mapstruct:mapstruct:1.5.5.Final")
    annotationProcessor("org.mapstruct:mapstruct-processor:1.5.5.Final")
}
```

### MongoDB Configuration

Add to `application.yml`:

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/mydb
      database: mydb
```

Add dependencies:

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-mongodb-reactive")
    implementation("org.mapstruct:mapstruct:1.5.5.Final")
    annotationProcessor("org.mapstruct:mapstruct-processor:1.5.5.Final")
}
```

### PostgreSQL Configuration

Add to `application.yml`:

```yaml
spring:
  r2dbc:
    url: r2dbc:postgresql://localhost:5432/mydb
    username: ${DB_USER:postgres}
    password: ${DB_PASSWORD:postgres}
```

Add dependencies:

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
    implementation("org.postgresql:r2dbc-postgresql")
    implementation("org.mapstruct:mapstruct:1.5.5.Final")
    annotationProcessor("org.mapstruct:mapstruct-processor:1.5.5.Final")
}
```

## Best Practices

### 1. Adapter Naming

Use clear, descriptive names:

```bash
# Good
--name=UserRepository
--name=ProductCache
--name=PaymentGatewayClient

# Avoid
--name=UserAdapter
--name=Adapter1
```

### 2. Error Handling

Add proper error handling:

```java
public Mono<User> save(User entity) {
  return Mono.just(entity)
      .map(mapper::toData)
      .flatMap(data -> {
        String key = KEY_PREFIX + data.getId();
        return redisTemplate.opsForValue().set(key, data);
      })
      .thenReturn(entity)
      .onErrorMap(e -> new RepositoryException("Failed to save user", e));
}
```

### 3. Logging

Add logging for debugging:

```java
@Component
@Slf4j
public class UserRepositoryAdapter implements UserRepository {

  public Mono<User> save(User entity) {
    log.debug("Saving user: {}", entity.getId());
    
    return redisTemplate.opsForValue()
        .set(KEY_PREFIX + entity.getId(), mapper.toData(entity))
        .doOnSuccess(v -> log.info("User saved successfully: {}", entity.getId()))
        .doOnError(e -> log.error("Failed to save user: {}", entity.getId(), e))
        .thenReturn(entity);
  }
}
```

### 4. Testing

Create tests for your adapters:

```java
@SpringBootTest
class UserRepositoryAdapterTest {

  @Autowired
  private UserRepositoryAdapter repository;

  @Test
  void shouldSaveAndRetrieveUser() {
    // Given
    User user = new User("1", "John", "john@example.com");

    // When
    Mono<User> savedUser = repository.save(user);
    Mono<User> retrievedUser = savedUser.flatMap(u -> repository.findById(u.getId()));

    // Then
    StepVerifier.create(retrievedUser)
        .expectNextMatches(u -> u.getName().equals("John"))
        .verifyComplete();
  }
}
```

### 5. Mapper Configuration

Customize MapStruct mappers when needed:

```java
@Mapper(componentModel = "spring")
public interface UserMapper {
  
  @Mapping(target = "createdAt", expression = "java(java.time.Instant.now())")
  UserData toData(User domain);
  
  User toDomain(UserData data);
  
  // Custom mapping for complex types
  default String mapStatus(UserStatus status) {
    return status != null ? status.name() : null;
  }
}
```

## Complete Example

Here's a complete workflow for creating a user repository:

```bash
# 1. Generate entity
./gradlew generateEntity \
  --name=User \
  --fields=name:String,email:String,age:Integer \
  --packageName=com.pragma.user.domain.model

# 2. Generate output port (manually create interface)
# Create: com.pragma.user.domain.port.out.UserRepository

# 3. Generate Redis driven adapter
./gradlew generateOutputAdapter \
  --name=UserRepository \
  --entity=User \
  --type=redis \
  --packageName=com.pragma.user.infrastructure.driven-adapters.redis

# 4. Make adapter implement port
# Update UserRepositoryAdapter to implement UserRepository interface

# 5. Use in use case
# Inject UserRepository in your use case implementation
```

## Next Steps

- [Generating Entry Points](input-adapters)
- [Testing Adapters](../../testing/adapter-testing)
- [Infrastructure Layer Best Practices](../architectures/hexagonal#infrastructure-layer)
