# Redis Driven Adapter

Generate a Redis cache driven adapter for storing and retrieving domain entities.

## Overview

The Redis driven adapter provides reactive caching capabilities using Spring Data Redis. It's ideal for:
- Session storage
- Temporary data caching
- Fast key-value lookups
- Distributed caching

## Command

```bash
./gradlew generateOutputAdapter \
  --name=<AdapterName> \
  --entity=<EntityName> \
  --type=redis \
  --packageName=<package>
```

:::info Terminology
In clean architecture, output adapters are called **driven adapters** because they are driven by the application core. They are located in `infrastructure/driven-adapters/`.
:::

## Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `--name` | Yes | Adapter name | `UserRepository`, `ProductCache` |
| `--entity` | Yes | Domain entity name | `User`, `Product` |
| `--type` | Yes | Must be `redis` | `redis` |
| `--packageName` | Yes | Full package path | `com.pragma.infrastructure.driven-adapters.redis` |
| `--methods` | No | Custom methods (coming soon) | - |

## Generated Files

### 1. Adapter Implementation
**File**: `{Name}Adapter.java`

Main adapter class with CRUD operations using `ReactiveRedisTemplate`.

### 2. Entity Mapper
**File**: `{Entity}Mapper.java`

MapStruct mapper for converting between domain and data entities.

### 3. Data Entity
**File**: `{Entity}Data.java`

Redis-specific entity with `@RedisHash` annotation.

## Example

### Generate Redis Driven Adapter

```bash
./gradlew generateOutputAdapter \
  --name=UserRepository \
  --entity=User \
  --type=redis \
  --packageName=com.pragma.user.infrastructure.driven-adapters.redis
```

### Generated Adapter

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

### Generated Mapper

```java
package com.pragma.user.infrastructure.driven-adapters.redis.mapper;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
  
  UserData toData(User domain);
  
  User toDomain(UserData data);
  
}
```

### Generated Data Entity

```java
package com.pragma.user.infrastructure.driven-adapters.redis.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash("user")
public class UserData {
  
  @Id
  private String id;
  private String name;
  private String email;
  private Integer age;
  
  // Constructors, Getters, and Setters
}
```

## Configuration

### Dependencies

Add to `build.gradle.kts`:

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-redis-reactive")
    implementation("org.mapstruct:mapstruct:1.5.5.Final")
    annotationProcessor("org.mapstruct:mapstruct-processor:1.5.5.Final")
}
```

### Application Configuration

Add to `application.yml`:

```yaml
spring:
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
      database: 0
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0
```

### Redis Configuration Bean (Optional)

```java
package com.pragma.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

  @Bean
  public ReactiveRedisTemplate<String, UserData> userRedisTemplate(
      ReactiveRedisConnectionFactory connectionFactory) {
    
    Jackson2JsonRedisSerializer<UserData> serializer = 
        new Jackson2JsonRedisSerializer<>(UserData.class);
    
    RedisSerializationContext<String, UserData> context = 
        RedisSerializationContext.<String, UserData>newSerializationContext()
            .key(new StringRedisSerializer())
            .value(serializer)
            .hashKey(new StringRedisSerializer())
            .hashValue(serializer)
            .build();
    
    return new ReactiveRedisTemplate<>(connectionFactory, context);
  }
}
```

## Operations

### Save Entity

```java
Mono<User> savedUser = userRepository.save(user);
```

### Find by ID

```java
Mono<User> user = userRepository.findById("user-123");
```

### Find All

```java
Flux<User> users = userRepository.findAll();
```

### Delete by ID

```java
Mono<Boolean> deleted = userRepository.deleteById("user-123");
```

### Check Existence

```java
Mono<Boolean> exists = userRepository.existsById("user-123");
```

## Custom Methods

Add custom methods after generation:

```java
@Component
public class UserRepositoryAdapter {

  // Generated methods...

  /**
   * Find user by email
   */
  public Mono<User> findByEmail(String email) {
    String pattern = KEY_PREFIX + "*";
    
    return redisTemplate.keys(pattern)
        .flatMap(key -> redisTemplate.opsForValue().get(key))
        .map(mapper::toDomain)
        .filter(user -> user.getEmail().equals(email))
        .next();
  }

  /**
   * Find users by age range
   */
  public Flux<User> findByAgeRange(int minAge, int maxAge) {
    String pattern = KEY_PREFIX + "*";
    
    return redisTemplate.keys(pattern)
        .flatMap(key -> redisTemplate.opsForValue().get(key))
        .map(mapper::toDomain)
        .filter(user -> user.getAge() >= minAge && user.getAge() <= maxAge);
  }

  /**
   * Save with TTL (Time To Live)
   */
  public Mono<User> saveWithTTL(User entity, Duration ttl) {
    UserData data = mapper.toData(entity);
    String key = KEY_PREFIX + entity.getId();
    
    return redisTemplate.opsForValue()
        .set(key, data, ttl)
        .thenReturn(entity);
  }
}
```

## Testing

### Unit Test

```java
@ExtendWith(MockitoExtension.class)
class UserRepositoryAdapterTest {

  @Mock
  private ReactiveRedisTemplate<String, UserData> redisTemplate;

  @Mock
  private ReactiveValueOperations<String, UserData> valueOperations;

  @Mock
  private UserMapper mapper;

  @InjectMocks
  private UserRepositoryAdapter adapter;

  @BeforeEach
  void setUp() {
    when(redisTemplate.opsForValue()).thenReturn(valueOperations);
  }

  @Test
  void shouldSaveUser() {
    // Given
    User user = new User("1", "John", "john@example.com", 25);
    UserData userData = new UserData("1", "John", "john@example.com", 25);
    
    when(mapper.toData(user)).thenReturn(userData);
    when(valueOperations.set(anyString(), any())).thenReturn(Mono.just(true));

    // When
    Mono<User> result = adapter.save(user);

    // Then
    StepVerifier.create(result)
        .expectNext(user)
        .verifyComplete();
  }
}
```

### Integration Test

```java
@SpringBootTest
@Testcontainers
class UserRepositoryAdapterIntegrationTest {

  @Container
  static GenericContainer<?> redis = new GenericContainer<>("redis:7-alpine")
      .withExposedPorts(6379);

  @DynamicPropertySource
  static void redisProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.data.redis.host", redis::getHost);
    registry.add("spring.data.redis.port", redis::getFirstMappedPort);
  }

  @Autowired
  private UserRepositoryAdapter adapter;

  @Test
  void shouldSaveAndRetrieveUser() {
    // Given
    User user = new User("1", "John", "john@example.com", 25);

    // When
    Mono<User> savedUser = adapter.save(user);
    Mono<User> retrievedUser = savedUser.flatMap(u -> adapter.findById(u.getId()));

    // Then
    StepVerifier.create(retrievedUser)
        .expectNextMatches(u -> 
            u.getName().equals("John") && 
            u.getEmail().equals("john@example.com"))
        .verifyComplete();
  }
}
```

## Best Practices

### 1. Use Meaningful Key Prefixes

```java
private static final String KEY_PREFIX = "user:";  // Good
private static final String KEY_PREFIX = "u:";     // Avoid
```

### 2. Handle Errors Gracefully

```java
public Mono<User> save(User entity) {
  return Mono.just(entity)
      .map(mapper::toData)
      .flatMap(data -> {
        String key = KEY_PREFIX + data.getId();
        return redisTemplate.opsForValue().set(key, data);
      })
      .thenReturn(entity)
      .onErrorMap(e -> new CacheException("Failed to save user", e));
}
```

### 3. Add Logging

```java
@Component
@Slf4j
public class UserRepositoryAdapter {

  public Mono<User> save(User entity) {
    log.debug("Saving user to Redis: {}", entity.getId());
    
    return redisTemplate.opsForValue()
        .set(KEY_PREFIX + entity.getId(), mapper.toData(entity))
        .doOnSuccess(v -> log.info("User saved successfully: {}", entity.getId()))
        .doOnError(e -> log.error("Failed to save user: {}", entity.getId(), e))
        .thenReturn(entity);
  }
}
```

### 4. Use TTL for Temporary Data

```java
// Cache for 1 hour
Duration ttl = Duration.ofHours(1);
redisTemplate.opsForValue().set(key, data, ttl);
```

### 5. Implement Proper Serialization

Use Jackson for complex objects:

```java
@RedisHash("user")
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserData {
  
  @Id
  private String id;
  
  @JsonProperty("user_name")
  private String name;
  
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
  private Instant createdAt;
}
```

## Common Issues

### Issue: Connection Timeout

**Solution**: Increase timeout in configuration:

```yaml
spring:
  data:
    redis:
      timeout: 5000ms
```

### Issue: Serialization Errors

**Solution**: Configure proper serializer:

```java
Jackson2JsonRedisSerializer<UserData> serializer = 
    new Jackson2JsonRedisSerializer<>(UserData.class);
ObjectMapper mapper = new ObjectMapper();
mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
serializer.setObjectMapper(mapper);
```

### Issue: Keys Not Found

**Solution**: Check key prefix and pattern matching:

```java
// Debug keys
redisTemplate.keys("*").subscribe(key -> log.info("Key: {}", key));
```

## Docker Setup

For local development:

```bash
# Start Redis
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7-alpine

# With persistence
docker run -d \
  --name redis \
  -p 6379:6379 \
  -v redis-data:/data \
  redis:7-alpine redis-server --appendonly yes
```

## Next Steps

- [MongoDB Driven Adapter](mongodb)
- [PostgreSQL Driven Adapter](postgresql)
- [Testing Adapters](../../testing/adapter-testing)
- [Driven Adapters Overview](../../generators/output-adapters)
