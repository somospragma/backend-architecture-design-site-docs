# PostgreSQL Adapter

Adaptador para base de datos relacional PostgreSQL con soporte para paradigmas reactivo e imperativo.

## Overview

El adaptador PostgreSQL proporciona acceso a bases de datos PostgreSQL usando:
- **Reactive**: Spring Data R2DBC para operaciones no bloqueantes
- **Imperative**: Spring Data JPA con HikariCP para operaciones tradicionales

## Generar Adaptador

```bash
./gradlew generateOutputAdapter \
  --name=UserRepository \
  --entity=User \
  --type=postgresql \
  --packageName=com.pragma.user.infrastructure.driven-adapters.postgresql
```

## Paradigma Reactivo

### Dependencias

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
    implementation("io.r2dbc:r2dbc-postgresql")
    implementation("org.postgresql:postgresql") // Para migrations
}
```

### Configuración

```yaml
spring:
  r2dbc:
    url: r2dbc:postgresql://localhost:5432/mydb
    username: postgres
    password: postgres
    pool:
      initial-size: 10
      max-size: 20
      max-idle-time: 30m
```

### Código Generado

```java
// Entity
@Table("users")
public record UserEntity(
    @Id String id,
    String name,
    String email,
    LocalDateTime createdAt
) {}

// Repository
public interface UserR2dbcRepository extends ReactiveCrudRepository<UserEntity, String> {
    Flux<UserEntity> findByName(String name);
}

// Adapter
@Repository
public class PostgresUserRepository implements UserRepository {
    
    private final UserR2dbcRepository r2dbcRepository;
    private final UserMapper mapper;
    
    @Override
    public Mono<User> save(User user) {
        return Mono.just(user)
            .map(mapper::toEntity)
            .flatMap(r2dbcRepository::save)
            .map(mapper::toDomain);
    }
    
    @Override
    public Mono<User> findById(String id) {
        return r2dbcRepository.findById(id)
            .map(mapper::toDomain);
    }
    
    @Override
    public Flux<User> findAll() {
        return r2dbcRepository.findAll()
            .map(mapper::toDomain);
    }
    
    @Override
    public Mono<Void> deleteById(String id) {
        return r2dbcRepository.deleteById(id);
    }
}
```

## Paradigma Imperativo

### Dependencias

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.postgresql:postgresql")
    implementation("com.zaxxer:HikariCP")
}
```

### Configuración

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 10
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true
```

### Código Generado

```java
// Entity
@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Getters, setters, constructors
}

// Repository
public interface UserJpaRepository extends JpaRepository<UserEntity, String> {
    List<UserEntity> findByName(String name);
    Optional<UserEntity> findByEmail(String email);
}

// Adapter
@Repository
public class PostgresUserRepository implements UserRepository {
    
    private final UserJpaRepository jpaRepository;
    private final UserMapper mapper;
    
    @Override
    public User save(User user) {
        UserEntity entity = mapper.toEntity(user);
        UserEntity saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }
    
    @Override
    public Optional<User> findById(String id) {
        return jpaRepository.findById(id)
            .map(mapper::toDomain);
    }
    
    @Override
    public List<User> findAll() {
        return jpaRepository.findAll()
            .stream()
            .map(mapper::toDomain)
            .toList();
    }
    
    @Override
    public void deleteById(String id) {
        jpaRepository.deleteById(id);
    }
}
```

## Operaciones Avanzadas

### Queries Personalizadas (Reactive)

```java
public interface UserR2dbcRepository extends ReactiveCrudRepository<UserEntity, String> {
    
    @Query("SELECT * FROM users WHERE email = :email")
    Mono<UserEntity> findByEmail(String email);
    
    @Query("SELECT * FROM users WHERE created_at > :date")
    Flux<UserEntity> findRecentUsers(LocalDateTime date);
    
    @Query("SELECT * FROM users WHERE name ILIKE :pattern")
    Flux<UserEntity> searchByName(String pattern);
}
```

### Queries Personalizadas (Imperative)

```java
public interface UserJpaRepository extends JpaRepository<UserEntity, String> {
    
    @Query("SELECT u FROM UserEntity u WHERE u.email = :email")
    Optional<UserEntity> findByEmail(@Param("email") String email);
    
    @Query("SELECT u FROM UserEntity u WHERE u.createdAt > :date")
    List<UserEntity> findRecentUsers(@Param("date") LocalDateTime date);
    
    @Query("SELECT u FROM UserEntity u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :pattern, '%'))")
    List<UserEntity> searchByName(@Param("pattern") String pattern);
}
```

### Paginación (Reactive)

```java
public Flux<User> findAllPaginated(int page, int size) {
    return r2dbcRepository.findAll()
        .skip((long) page * size)
        .take(size)
        .map(mapper::toDomain);
}
```

### Paginación (Imperative)

```java
public Page<User> findAllPaginated(int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    return jpaRepository.findAll(pageable)
        .map(mapper::toDomain);
}
```

## Testing

### Test Reactivo

```java
@DataR2dbcTest
@Import(PostgresUserRepository.class)
class PostgresUserRepositoryTest {
    
    @Autowired
    private PostgresUserRepository repository;
    
    @Test
    void shouldSaveUser() {
        User user = new User("1", "John", "john@example.com", LocalDateTime.now());
        
        StepVerifier.create(repository.save(user))
            .assertNext(saved -> {
                assertThat(saved.id()).isNotNull();
                assertThat(saved.name()).isEqualTo("John");
            })
            .verifyComplete();
    }
    
    @Test
    void shouldFindById() {
        StepVerifier.create(repository.findById("1"))
            .assertNext(user -> {
                assertThat(user.name()).isEqualTo("John");
            })
            .verifyComplete();
    }
}
```

### Test Imperativo

```java
@DataJpaTest
@Import(PostgresUserRepository.class)
class PostgresUserRepositoryTest {
    
    @Autowired
    private PostgresUserRepository repository;
    
    @Test
    void shouldSaveUser() {
        User user = new User("1", "John", "john@example.com", LocalDateTime.now());
        
        User saved = repository.save(user);
        
        assertThat(saved.id()).isNotNull();
        assertThat(saved.name()).isEqualTo("John");
    }
    
    @Test
    void shouldFindById() {
        Optional<User> found = repository.findById("1");
        
        assertThat(found).isPresent();
        assertThat(found.get().name()).isEqualTo("John");
    }
}
```

### Integration Test con Testcontainers

```java
@SpringBootTest
@Testcontainers
class PostgresUserRepositoryIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword());
    }
    
    @Autowired
    private PostgresUserRepository repository;
    
    @Test
    void shouldWorkWithRealDatabase() {
        User user = new User(null, "John", "john@example.com", LocalDateTime.now());
        
        User saved = repository.save(user);
        Optional<User> found = repository.findById(saved.id());
        
        assertThat(found).isPresent();
        assertThat(found.get().name()).isEqualTo("John");
    }
}
```

## Migrations

### Flyway (Recomendado)

```kotlin
dependencies {
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")
}
```

```yaml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
```

```sql
-- src/main/resources/db/migration/V1__create_users_table.sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

## Best Practices

### 1. Use Connection Pooling (Imperative)

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 10
      connection-timeout: 30000
```

### 2. Enable Batch Operations (Imperative)

```yaml
spring:
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true
```

### 3. Use Indexes

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_name ON users(name);
```

### 4. Handle Transactions (Imperative)

```java
@Service
public class UserService {
    
    @Transactional
    public User createUser(UserData userData) {
        User user = new User(userData);
        User saved = repository.save(user);
        eventPublisher.publish(new UserCreatedEvent(saved));
        return saved;
    }
}
```

### 5. Use DTOs for Projections

```java
public interface UserProjection {
    String getId();
    String getName();
}

public interface UserJpaRepository extends JpaRepository<UserEntity, String> {
    List<UserProjection> findAllProjectedBy();
}
```

## Troubleshooting

### Connection Pool Exhausted

```
HikariPool-1 - Connection is not available, request timed out after 30000ms
```

**Solución**: Aumentar el tamaño del pool o reducir el tiempo de espera

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 30
      connection-timeout: 60000
```

### N+1 Query Problem

```java
// ❌ BAD - N+1 queries
List<Order> orders = orderRepository.findAll();
orders.forEach(order -> {
    Customer customer = customerRepository.findById(order.customerId());
});

// ✅ GOOD - Use JOIN FETCH
@Query("SELECT o FROM Order o JOIN FETCH o.customer")
List<Order> findAllWithCustomer();
```

## Learn More

- [Spring Data R2DBC](https://spring.io/projects/spring-data-r2dbc)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [HikariCP](https://github.com/brettwooldridge/HikariCP)
- [Flyway](https://flywaydb.org/)
