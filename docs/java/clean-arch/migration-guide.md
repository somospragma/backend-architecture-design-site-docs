# Guía de Migración: Reactive ↔ Imperative

Esta guía te ayudará a migrar proyectos entre los paradigmas reactivo e imperativo en Spring Boot.

## Tabla de Contenidos

- [Diferencias Clave](#diferencias-clave)
- [Migración de Reactive a Imperative](#migración-de-reactive-a-imperative)
- [Migración de Imperative a Reactive](#migración-de-imperative-a-reactive)
- [Dependencias](#dependencias)
- [Configuración](#configuración)
- [Testing](#testing)
- [Errores Comunes](#errores-comunes)

## Diferencias Clave

### Tipos de Retorno

| Reactive | Imperative | Descripción |
|----------|------------|-------------|
| `Mono<T>` | `T` | Valor único |
| `Mono<Void>` | `void` | Sin retorno |
| `Flux<T>` | `List<T>` | Múltiples valores |
| `Mono<Optional<T>>` | `Optional<T>` | Valor opcional |

### Operadores

| Reactive | Imperative | Descripción |
|----------|------------|-------------|
| `flatMap()` | Llamada directa | Transformación |
| `map()` | `stream().map()` | Mapeo |
| `filter()` | `stream().filter()` | Filtrado |
| `collectList()` | `toList()` | Colección |
| `switchIfEmpty()` | `orElse()` | Valor por defecto |

### Frameworks y Librerías

| Componente | Reactive | Imperative |
|------------|----------|------------|
| **Web** | Spring WebFlux | Spring MVC |
| **Database** | R2DBC | JPA/JDBC |
| **HTTP Client** | WebClient | RestTemplate |
| **Redis** | ReactiveRedisTemplate | RedisTemplate |
| **MongoDB** | ReactiveMongoRepository | MongoRepository |
| **Testing** | StepVerifier | JUnit assertions |

## Migración de Reactive a Imperative

### Paso 1: Actualizar Dependencias

```kotlin
// build.gradle.kts

// ❌ Remover dependencias reactivas
dependencies {
    // implementation("org.springframework.boot:spring-boot-starter-webflux")
    // implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
    // implementation("org.springframework.boot:spring-boot-starter-data-redis-reactive")
    // implementation("io.projectreactor:reactor-test")
}

// ✅ Agregar dependencias imperativas
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-data-redis")
    implementation("org.postgresql:postgresql")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}
```

### Paso 2: Actualizar Casos de Uso

```java
// ❌ ANTES (Reactive)
@Component
public class CreateUserUseCase {
    private final UserRepository repository;
    
    public Mono<User> execute(UserData userData) {
        return Mono.just(userData)
            .map(this::createUser)
            .flatMap(repository::save)
            .flatMap(this::sendWelcomeEmail);
    }
    
    private Mono<User> sendWelcomeEmail(User user) {
        return emailService.send(user.email())
            .thenReturn(user);
    }
}

// ✅ DESPUÉS (Imperative)
@Component
public class CreateUserUseCase {
    private final UserRepository repository;
    
    public User execute(UserData userData) {
        User user = createUser(userData);
        User saved = repository.save(user);
        sendWelcomeEmail(saved);
        return saved;
    }
    
    private void sendWelcomeEmail(User user) {
        emailService.send(user.email());
    }
}
```

### Paso 3: Actualizar Controladores

```java
// ❌ ANTES (Reactive)
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final CreateUserUseCase createUserUseCase;
    
    @PostMapping
    public Mono<ResponseEntity<UserResponse>> create(@RequestBody UserRequest request) {
        return createUserUseCase.execute(request.toUserData())
            .map(user -> ResponseEntity.ok(UserResponse.from(user)));
    }
    
    @GetMapping
    public Flux<UserResponse> findAll() {
        return findAllUsersUseCase.execute()
            .map(UserResponse::from);
    }
}

// ✅ DESPUÉS (Imperative)
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final CreateUserUseCase createUserUseCase;
    
    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody UserRequest request) {
        User user = createUserUseCase.execute(request.toUserData());
        return ResponseEntity.ok(UserResponse.from(user));
    }
    
    @GetMapping
    public List<UserResponse> findAll() {
        return findAllUsersUseCase.execute()
            .stream()
            .map(UserResponse::from)
            .toList();
    }
}
```

### Paso 4: Actualizar Repositorios

```java
// ❌ ANTES (Reactive - R2DBC)
public interface UserRepository {
    Mono<User> save(User user);
    Mono<User> findById(String id);
    Flux<User> findAll();
    Mono<Void> deleteById(String id);
}

@Repository
public class R2dbcUserRepository implements UserRepository {
    private final UserR2dbcRepository r2dbcRepository;
    
    @Override
    public Mono<User> save(User user) {
        return Mono.just(user)
            .map(mapper::toEntity)
            .flatMap(r2dbcRepository::save)
            .map(mapper::toDomain);
    }
}

// ✅ DESPUÉS (Imperative - JPA)
public interface UserRepository {
    User save(User user);
    Optional<User> findById(String id);
    List<User> findAll();
    void deleteById(String id);
}

@Repository
public class JpaUserRepository implements UserRepository {
    private final UserJpaRepository jpaRepository;
    
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
}
```

### Paso 5: Actualizar Clientes HTTP

```java
// ❌ ANTES (Reactive - WebClient)
@Component
public class PaymentGatewayClient {
    private final WebClient webClient;
    
    public Mono<PaymentResult> processPayment(Payment payment) {
        return webClient.post()
            .uri("/payments")
            .bodyValue(payment)
            .retrieve()
            .bodyToMono(PaymentResult.class)
            .timeout(Duration.ofSeconds(30))
            .retry(3);
    }
}

// ✅ DESPUÉS (Imperative - RestTemplate)
@Component
public class PaymentGatewayClient {
    private final RestTemplate restTemplate;
    
    public PaymentResult processPayment(Payment payment) {
        try {
            return restTemplate.postForObject(
                "/payments",
                payment,
                PaymentResult.class
            );
        } catch (RestClientException e) {
            throw new PaymentGatewayException("Failed to process payment", e);
        }
    }
}
```

### Paso 6: Actualizar Tests

```java
// ❌ ANTES (Reactive)
@Test
void shouldCreateUser() {
    UserData userData = new UserData("John", "john@example.com");
    
    when(repository.save(any())).thenReturn(Mono.just(expectedUser));
    
    StepVerifier.create(useCase.execute(userData))
        .assertNext(user -> {
            assertThat(user.name()).isEqualTo("John");
            assertThat(user.email()).isEqualTo("john@example.com");
        })
        .verifyComplete();
}

// ✅ DESPUÉS (Imperative)
@Test
void shouldCreateUser() {
    UserData userData = new UserData("John", "john@example.com");
    
    when(repository.save(any())).thenReturn(expectedUser);
    
    User user = useCase.execute(userData);
    
    assertThat(user.name()).isEqualTo("John");
    assertThat(user.email()).isEqualTo("john@example.com");
}
```

## Migración de Imperative a Reactive

### Paso 1: Actualizar Dependencias

```kotlin
// build.gradle.kts

// ❌ Remover dependencias imperativas
dependencies {
    // implementation("org.springframework.boot:spring-boot-starter-web")
    // implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    // implementation("org.postgresql:postgresql")
}

// ✅ Agregar dependencias reactivas
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
    implementation("org.springframework.boot:spring-boot-starter-data-redis-reactive")
    implementation("io.r2dbc:r2dbc-postgresql")
    testImplementation("io.projectreactor:reactor-test")
}
```

### Paso 2: Actualizar Casos de Uso

```java
// ❌ ANTES (Imperative)
@Component
public class CreateUserUseCase {
    public User execute(UserData userData) {
        User user = createUser(userData);
        User saved = repository.save(user);
        sendWelcomeEmail(saved);
        return saved;
    }
}

// ✅ DESPUÉS (Reactive)
@Component
public class CreateUserUseCase {
    public Mono<User> execute(UserData userData) {
        return Mono.just(userData)
            .map(this::createUser)
            .flatMap(repository::save)
            .flatMap(user -> 
                emailService.send(user.email())
                    .thenReturn(user)
            );
    }
}
```

### Paso 3: Actualizar Controladores

```java
// ❌ ANTES (Imperative)
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @PostMapping
    public ResponseEntity<UserResponse> create(@RequestBody UserRequest request) {
        User user = createUserUseCase.execute(request.toUserData());
        return ResponseEntity.ok(UserResponse.from(user));
    }
    
    @GetMapping
    public List<UserResponse> findAll() {
        return findAllUsersUseCase.execute()
            .stream()
            .map(UserResponse::from)
            .toList();
    }
}

// ✅ DESPUÉS (Reactive)
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @PostMapping
    public Mono<ResponseEntity<UserResponse>> create(@RequestBody UserRequest request) {
        return createUserUseCase.execute(request.toUserData())
            .map(user -> ResponseEntity.ok(UserResponse.from(user)));
    }
    
    @GetMapping
    public Flux<UserResponse> findAll() {
        return findAllUsersUseCase.execute()
            .map(UserResponse::from);
    }
}
```

## Dependencias

### Reactive

```kotlin
dependencies {
    // Web
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    
    // Database
    implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
    implementation("io.r2dbc:r2dbc-postgresql")
    implementation("org.springframework.boot:spring-boot-starter-data-mongodb-reactive")
    
    // Cache
    implementation("org.springframework.boot:spring-boot-starter-data-redis-reactive")
    
    // HTTP Client
    // WebClient is included in webflux
    
    // AWS
    implementation("software.amazon.awssdk:dynamodb:2.20.0")
    implementation("software.amazon.awssdk:sqs:2.20.0")
    
    // Testing
    testImplementation("io.projectreactor:reactor-test")
    testImplementation("org.testcontainers:postgresql")
    testImplementation("org.testcontainers:mongodb")
}
```

### Imperative

```kotlin
dependencies {
    // Web
    implementation("org.springframework.boot:spring-boot-starter-web")
    
    // Database
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.postgresql:postgresql")
    implementation("org.springframework.boot:spring-boot-starter-data-mongodb")
    
    // Cache
    implementation("org.springframework.boot:spring-boot-starter-data-redis")
    
    // HTTP Client
    // RestTemplate is included in spring-web
    
    // AWS
    implementation("software.amazon.awssdk:dynamodb:2.20.0")
    implementation("software.amazon.awssdk:sqs:2.20.0")
    
    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.testcontainers:postgresql")
    testImplementation("org.testcontainers:mongodb")
}
```

## Configuración

### Reactive (application.yml)

```yaml
spring:
  webflux:
    base-path: /api
    
  r2dbc:
    url: r2dbc:postgresql://localhost:5432/mydb
    username: postgres
    password: postgres
    pool:
      initial-size: 10
      max-size: 20
      
  data:
    mongodb:
      uri: mongodb://localhost:27017/mydb
      
    redis:
      host: localhost
      port: 6379
```

### Imperative (application.yml)

```yaml
server:
  port: 8080
  
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: postgres
    password: postgres
    hikari:
      maximum-pool-size: 20
      minimum-idle: 10
      
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    
  data:
    mongodb:
      uri: mongodb://localhost:27017/mydb
      
    redis:
      host: localhost
      port: 6379
```

## Testing

### Reactive Testing

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserControllerTest {
    
    @Autowired
    private WebTestClient webTestClient;
    
    @Test
    void shouldCreateUser() {
        UserRequest request = new UserRequest("John", "john@example.com");
        
        webTestClient.post()
            .uri("/api/v1/users")
            .bodyValue(request)
            .exchange()
            .expectStatus().isOk()
            .expectBody(UserResponse.class)
            .value(response -> {
                assertThat(response.name()).isEqualTo("John");
            });
    }
    
    @Test
    void shouldFindAllUsers() {
        webTestClient.get()
            .uri("/api/v1/users")
            .exchange()
            .expectStatus().isOk()
            .expectBodyList(UserResponse.class)
            .hasSize(2);
    }
}
```

### Imperative Testing

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserControllerTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void shouldCreateUser() {
        UserRequest request = new UserRequest("John", "john@example.com");
        
        ResponseEntity<UserResponse> response = restTemplate.postForEntity(
            "/api/v1/users",
            request,
            UserResponse.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().name()).isEqualTo("John");
    }
    
    @Test
    void shouldFindAllUsers() {
        ResponseEntity<UserResponse[]> response = restTemplate.getForEntity(
            "/api/v1/users",
            UserResponse[].class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(2);
    }
}
```

## Errores Comunes

### 1. Bloquear en Código Reactivo

```java
// ❌ MAL - Bloquea el flujo reactivo
public Mono<User> createUser(UserData userData) {
    User user = repository.save(userData).block(); // ¡NO HACER ESTO!
    return Mono.just(user);
}

// ✅ BIEN - Mantiene el flujo reactivo
public Mono<User> createUser(UserData userData) {
    return repository.save(userData);
}
```

### 2. No Suscribirse a Mono/Flux

```java
// ❌ MAL - Nunca se ejecuta
public void processUser(String userId) {
    repository.findById(userId)
        .map(this::process); // No se ejecuta sin subscribe()
}

// ✅ BIEN - Se suscribe explícitamente
public Mono<Void> processUser(String userId) {
    return repository.findById(userId)
        .map(this::process)
        .then();
}
```

### 3. Mezclar Paradigmas

```java
// ❌ MAL - Mezcla reactive e imperative
@Component
public class UserService {
    public Mono<User> createUser(UserData userData) {
        User user = new User(userData);
        jpaRepository.save(user); // JPA en código reactivo!
        return Mono.just(user);
    }
}

// ✅ BIEN - Usa solo reactive
@Component
public class UserService {
    public Mono<User> createUser(UserData userData) {
        return Mono.just(new User(userData))
            .flatMap(r2dbcRepository::save);
    }
}
```

### 4. Manejo de Errores

```java
// ❌ MAL - No maneja errores reactivos
public Mono<User> findUser(String id) {
    return repository.findById(id); // Puede emitir error
}

// ✅ BIEN - Maneja errores apropiadamente
public Mono<User> findUser(String id) {
    return repository.findById(id)
        .switchIfEmpty(Mono.error(new UserNotFoundException(id)))
        .onErrorMap(DatabaseException.class, 
            e -> new RepositoryException("Failed to find user", e));
}
```

## Checklist de Migración

### De Reactive a Imperative

- [ ] Actualizar dependencias en build.gradle.kts
- [ ] Cambiar `Mono<T>` a `T`
- [ ] Cambiar `Flux<T>` a `List<T>`
- [ ] Cambiar `Mono<Void>` a `void`
- [ ] Reemplazar `flatMap()` con llamadas directas
- [ ] Cambiar R2DBC a JPA
- [ ] Cambiar WebClient a RestTemplate
- [ ] Cambiar ReactiveRedisTemplate a RedisTemplate
- [ ] Actualizar tests (StepVerifier → assertions)
- [ ] Actualizar configuración (application.yml)
- [ ] Verificar manejo de transacciones (@Transactional)
- [ ] Actualizar manejo de errores

### De Imperative a Reactive

- [ ] Actualizar dependencias en build.gradle.kts
- [ ] Cambiar `T` a `Mono<T>`
- [ ] Cambiar `List<T>` a `Flux<T>`
- [ ] Cambiar `void` a `Mono<Void>`
- [ ] Reemplazar llamadas directas con `flatMap()`
- [ ] Cambiar JPA a R2DBC
- [ ] Cambiar RestTemplate a WebClient
- [ ] Cambiar RedisTemplate a ReactiveRedisTemplate
- [ ] Actualizar tests (assertions → StepVerifier)
- [ ] Actualizar configuración (application.yml)
- [ ] Eliminar @Transactional (no soportado en reactive)
- [ ] Actualizar manejo de errores (onErrorMap, onErrorResume)

## Recursos Adicionales

- [Spring WebFlux Documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html)
- [Spring MVC Documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html)
- [R2DBC Documentation](https://r2dbc.io/)
- [Project Reactor Documentation](https://projectreactor.io/docs)
- [Spring Data JPA Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)

## Soporte

Si encuentras problemas durante la migración:

1. Revisa los [ejemplos en el repositorio](https://github.com/pragma/clean-arch-generator)
2. Consulta la [guía de troubleshooting](./troubleshooting)
3. Abre un issue en GitHub
