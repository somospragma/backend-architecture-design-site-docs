# Adaptador Redis

El adaptador Redis proporciona acceso a caché y estructuras de datos Redis con soporte para operaciones reactivas e imperativas.

## Características

- ✅ Operaciones de caché (get, set, delete, exists, expire)
- ✅ Estructuras de datos (hash, list, set, sorted set)
- ✅ Soporte reactivo (Lettuce)
- ✅ Soporte imperativo (Jedis)
- ✅ Serialización automática JSON
- ✅ Tests con Testcontainers

## Generar el Adaptador

```bash
gradle generateOutputAdapter --name=redis --type=driven
```

## Paradigmas Disponibles

### Spring Reactive (WebFlux)

**Dependencias:**
```gradle
implementation 'org.springframework.boot:spring-boot-starter-data-redis-reactive'
```

**Ejemplo de Uso:**
```java
@Component
public class RedisAdapter implements CacheRepository {
    
    private final ReactiveRedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    
    public RedisAdapter(
        ReactiveRedisTemplate<String, String> redisTemplate,
        ObjectMapper objectMapper
    ) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }
    
    @Override
    public Mono<Void> set(String key, Object value, Duration ttl) {
        return Mono.fromCallable(() -> objectMapper.writeValueAsString(value))
            .flatMap(json -> redisTemplate.opsForValue()
                .set(key, json, ttl)
                .then()
            )
            .onErrorMap(JsonProcessingException.class, e -> 
                new CacheException("Failed to serialize value", e)
            );
    }
    
    @Override
    public <T> Mono<T> get(String key, Class<T> type) {
        return redisTemplate.opsForValue()
            .get(key)
            .flatMap(json -> Mono.fromCallable(() -> 
                objectMapper.readValue(json, type)
            ))
            .onErrorMap(JsonProcessingException.class, e -> 
                new CacheException("Failed to deserialize value", e)
            );
    }
    
    @Override
    public Mono<Boolean> delete(String key) {
        return redisTemplate.delete(key)
            .map(count -> count > 0);
    }
    
    @Override
    public Mono<Boolean> exists(String key) {
        return redisTemplate.hasKey(key);
    }
    
    @Override
    public Mono<Boolean> expire(String key, Duration ttl) {
        return redisTemplate.expire(key, ttl);
    }
}
```

### Spring Imperative (MVC)

**Dependencias:**
```gradle
implementation 'redis.clients:jedis:5.0.0'
implementation 'com.fasterxml.jackson.core:jackson-databind'
```

**Ejemplo de Uso:**
```java
@Component
public class RedisAdapter implements CacheRepository {
    
    private final JedisPool jedisPool;
    private final ObjectMapper objectMapper;
    
    public RedisAdapter(JedisPool jedisPool, ObjectMapper objectMapper) {
        this.jedisPool = jedisPool;
        this.objectMapper = objectMapper;
    }
    
    @Override
    public void set(String key, Object value, Duration ttl) {
        try (Jedis jedis = jedisPool.getResource()) {
            String json = objectMapper.writeValueAsString(value);
            jedis.setex(key, ttl.getSeconds(), json);
        } catch (JsonProcessingException e) {
            throw new CacheException("Failed to serialize value", e);
        }
    }
    
    @Override
    public <T> Optional<T> get(String key, Class<T> type) {
        try (Jedis jedis = jedisPool.getResource()) {
            String json = jedis.get(key);
            if (json == null) {
                return Optional.empty();
            }
            return Optional.of(objectMapper.readValue(json, type));
        } catch (JsonProcessingException e) {
            throw new CacheException("Failed to deserialize value", e);
        }
    }
    
    @Override
    public boolean delete(String key) {
        try (Jedis jedis = jedisPool.getResource()) {
            return jedis.del(key) > 0;
        }
    }
    
    @Override
    public boolean exists(String key) {
        try (Jedis jedis = jedisPool.getResource()) {
            return jedis.exists(key);
        }
    }
    
    @Override
    public boolean expire(String key, Duration ttl) {
        try (Jedis jedis = jedisPool.getResource()) {
            return jedis.expire(key, ttl.getSeconds()) == 1;
        }
    }
}
```

## Configuración

### application.yml

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      # ADVERTENCIA: No almacenes credenciales en control de versiones
      # Usa variables de entorno o gestión de secretos en producción
      password: ${REDIS_PASSWORD:}
      database: 0
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0
          max-wait: -1ms
```

### Configuración de Jedis (Imperativo)

```java
@Configuration
public class RedisConfig {
    
    @Value("${redis.host:localhost}")
    private String host;
    
    @Value("${redis.port:6379}")
    private int port;
    
    @Value("${redis.password:}")
    private String password;
    
    @Value("${redis.database:0}")
    private int database;
    
    @Bean
    public JedisPool jedisPool() {
        JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxTotal(8);
        poolConfig.setMaxIdle(8);
        poolConfig.setMinIdle(0);
        poolConfig.setTestOnBorrow(true);
        poolConfig.setTestOnReturn(true);
        poolConfig.setTestWhileIdle(true);
        
        if (password != null && !password.isEmpty()) {
            return new JedisPool(poolConfig, host, port, 2000, password, database);
        } else {
            return new JedisPool(poolConfig, host, port, 2000);
        }
    }
}
```

## Estructuras de Datos

### Hash Operations

```java
// Reactivo
public Mono<Void> setHash(String key, String field, Object value) {
    return Mono.fromCallable(() -> objectMapper.writeValueAsString(value))
        .flatMap(json -> redisTemplate.opsForHash()
            .put(key, field, json)
            .then()
        );
}

public <T> Mono<T> getHash(String key, String field, Class<T> type) {
    return redisTemplate.opsForHash()
        .get(key, field)
        .cast(String.class)
        .flatMap(json -> Mono.fromCallable(() -> 
            objectMapper.readValue(json, type)
        ));
}

// Imperativo
public void setHash(String key, String field, Object value) {
    try (Jedis jedis = jedisPool.getResource()) {
        String json = objectMapper.writeValueAsString(value);
        jedis.hset(key, field, json);
    } catch (JsonProcessingException e) {
        throw new CacheException("Failed to serialize value", e);
    }
}

public <T> Optional<T> getHash(String key, String field, Class<T> type) {
    try (Jedis jedis = jedisPool.getResource()) {
        String json = jedis.hget(key, field);
        if (json == null) {
            return Optional.empty();
        }
        return Optional.of(objectMapper.readValue(json, type));
    } catch (JsonProcessingException e) {
        throw new CacheException("Failed to deserialize value", e);
    }
}
```

### List Operations

```java
// Reactivo
public Mono<Long> pushToList(String key, Object value) {
    return Mono.fromCallable(() -> objectMapper.writeValueAsString(value))
        .flatMap(json -> redisTemplate.opsForList().rightPush(key, json));
}

public <T> Flux<T> getList(String key, Class<T> type) {
    return redisTemplate.opsForList()
        .range(key, 0, -1)
        .flatMap(json -> Mono.fromCallable(() -> 
            objectMapper.readValue(json, type)
        ));
}

// Imperativo
public long pushToList(String key, Object value) {
    try (Jedis jedis = jedisPool.getResource()) {
        String json = objectMapper.writeValueAsString(value);
        return jedis.rpush(key, json);
    } catch (JsonProcessingException e) {
        throw new CacheException("Failed to serialize value", e);
    }
}

public <T> List<T> getList(String key, Class<T> type) {
    try (Jedis jedis = jedisPool.getResource()) {
        return jedis.lrange(key, 0, -1).stream()
            .map(json -> {
                try {
                    return objectMapper.readValue(json, type);
                } catch (JsonProcessingException e) {
                    throw new CacheException("Failed to deserialize value", e);
                }
            })
            .collect(Collectors.toList());
    }
}
```

## Tests de Integración

```java
@SpringBootTest
@Testcontainers
class RedisAdapterTest {
    
    @Container
    static GenericContainer<?> redis = new GenericContainer<>("redis:7-alpine")
        .withExposedPorts(6379);
    
    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.redis.host", redis::getHost);
        registry.add("spring.data.redis.port", redis::getFirstMappedPort);
    }
    
    @Autowired
    private RedisAdapter adapter;
    
    @Test
    void shouldSetAndGetValue() {
        // Given
        User user = new User("1", "John Doe", "john@example.com");
        String key = "user:1";
        
        // When
        adapter.set(key, user, Duration.ofMinutes(5)).block();
        User retrieved = adapter.get(key, User.class).block();
        
        // Then
        assertThat(retrieved).isEqualTo(user);
    }
    
    @Test
    void shouldExpireKey() {
        // Given
        String key = "temp:key";
        adapter.set(key, "value", Duration.ofSeconds(1)).block();
        
        // When
        Thread.sleep(1100);
        Boolean exists = adapter.exists(key).block();
        
        // Then
        assertThat(exists).isFalse();
    }
}
```

## Patrones de Uso

### Cache-Aside Pattern

```java
public Mono<User> getUserWithCache(String userId) {
    String cacheKey = "user:" + userId;
    
    return cacheRepository.get(cacheKey, User.class)
        .switchIfEmpty(
            userRepository.findById(userId)
                .flatMap(user -> cacheRepository
                    .set(cacheKey, user, Duration.ofMinutes(10))
                    .thenReturn(user)
                )
        );
}
```

### Write-Through Pattern

```java
public Mono<User> saveUserWithCache(User user) {
    String cacheKey = "user:" + user.getId();
    
    return userRepository.save(user)
        .flatMap(savedUser -> cacheRepository
            .set(cacheKey, savedUser, Duration.ofMinutes(10))
            .thenReturn(savedUser)
        );
}
```

### Cache Invalidation

```java
public Mono<Void> deleteUserWithCache(String userId) {
    String cacheKey = "user:" + userId;
    
    return userRepository.deleteById(userId)
        .then(cacheRepository.delete(cacheKey))
        .then();
}
```

## Mejores Prácticas

1. **Prefijos de Claves**: Usa prefijos consistentes para organizar claves
   ```java
   String key = String.format("%s:%s", prefix, id);
   ```

2. **TTL Apropiado**: Siempre establece un TTL para evitar memoria llena
   ```java
   adapter.set(key, value, Duration.ofHours(1));
   ```

3. **Manejo de Errores**: Implementa fallback cuando Redis no está disponible
   ```java
   return cacheRepository.get(key, User.class)
       .onErrorResume(e -> userRepository.findById(id));
   ```

4. **Serialización Eficiente**: Considera usar formatos binarios para objetos grandes
   ```java
   // Usa MessagePack o Protobuf en lugar de JSON
   ```

## Solución de Problemas

### Error de Conexión

**Problema**: `JedisConnectionException: Could not get a resource from the pool`

**Solución**: Verifica que Redis esté ejecutándose:
```bash
docker run -d -p 6379:6379 --name redis redis:7-alpine
```

### Memoria Llena

**Problema**: `OOM command not allowed when used memory > 'maxmemory'`

**Solución**: Configura política de evicción en Redis:
```bash
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

## Recursos Adicionales

- [Spring Data Redis Documentation](https://docs.spring.io/spring-data/redis/docs/current/reference/html/)
- [Jedis Documentation](https://github.com/redis/jedis)
- [Redis Commands Reference](https://redis.io/commands/)
