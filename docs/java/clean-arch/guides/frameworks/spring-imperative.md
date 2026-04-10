# Spring Boot Imperative

Traditional Spring Boot with Spring MVC for synchronous, blocking applications.

## Overview

Spring MVC is the traditional web framework in Spring Boot, using blocking I/O. Este paradigma es ideal para aplicaciones CRUD tradicionales, sistemas con operaciones síncronas, y equipos familiarizados con el desarrollo Spring clásico.

## Features

- **Synchronous**: Traditional request-response model
- **JPA**: Standard database access with Hibernate
- **RestTemplate**: Synchronous HTTP client
- **Familiar**: Traditional Spring development
- **Blocking I/O**: Simple thread-per-request model
- **Mature Ecosystem**: Extensive library support

## Initialize Project

```bash
./gradlew initCleanArch \
  --architecture=hexagonal-single \
  --paradigm=imperative \
  --framework=spring \
  --package=com.company.service
```

## Dependencies

The generated project includes:

- `spring-boot-starter-web`: Spring MVC
- `spring-boot-starter-data-jpa`: JPA/Hibernate
- `spring-boot-starter-data-mongodb`: MongoDB (non-reactive)
- `spring-boot-starter-data-redis`: Redis with RedisTemplate
- `spring-boot-starter-validation`: Bean validation
- `postgresql`: PostgreSQL JDBC driver
- `HikariCP`: Connection pooling

## Example Code

### Domain Entity

```java
public record Payment(
    String id,
    BigDecimal amount,
    PaymentStatus status
) {}
```

### Use Case

```java
@Component
public class ProcessPaymentUseCase {
    
    private final PaymentRepository repository;
    private final PaymentGateway gateway;
    
    public Payment execute(PaymentRequest request) {
        // Business logic here
        Payment payment = new Payment(
            UUID.randomUUID().toString(),
            request.amount(),
            PaymentStatus.PENDING
        );
        
        Payment saved = repository.save(payment);
        return gateway.process(saved);
    }
}
```

### REST Controller

```java
@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {
    
    private final ProcessPaymentUseCase useCase;
    
    @PostMapping
    public ResponseEntity<PaymentResponse> process(@Valid @RequestBody PaymentRequest request) {
        Payment payment = useCase.execute(request);
        return ResponseEntity.ok(PaymentResponse.from(payment));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getById(@PathVariable String id) {
        Payment payment = findPaymentUseCase.execute(id);
        return ResponseEntity.ok(PaymentResponse.from(payment));
    }
}
```

### JPA Repository

```java
@Repository
public interface PaymentJpaRepository extends JpaRepository<PaymentEntity, String> {
    List<PaymentEntity> findByStatus(PaymentStatus status);
}

@Component
public class PaymentRepositoryAdapter implements PaymentRepository {
    
    private final PaymentJpaRepository jpaRepository;
    private final PaymentMapper mapper;
    
    @Override
    public Payment save(Payment payment) {
        PaymentEntity entity = mapper.toEntity(payment);
        PaymentEntity saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }
    
    @Override
    public List<Payment> findByStatus(PaymentStatus status) {
        return jpaRepository.findByStatus(status)
            .stream()
            .map(mapper::toDomain)
            .toList();
    }
}
```

## Available Adapters (Imperative)

### Entry Points (Driving Adapters)

| Adapter | Status | Description |
|---------|--------|-------------|
| **REST** | ✅ | Spring MVC controllers with `ResponseEntity&lt;T&gt;` |
| **GraphQL** | ✅ | Spring GraphQL with synchronous resolvers |
| **gRPC** | ✅ | gRPC server with BlockingStub |
| **SQS Consumer** | ✅ | AWS SQS consumer with @SqsListener |

### Driven Adapters (Output Adapters)

| Adapter | Status | Technology | Description |
|---------|--------|------------|-------------|
| **PostgreSQL** | ✅ | Spring Data JPA + HikariCP | Relational database with JPA |
| **MongoDB** | ✅ | Spring Data MongoDB | Document database (non-reactive) |
| **Redis** | ✅ | RedisTemplate | Cache and data structures |
| **HTTP Client** | ✅ | RestTemplate | Synchronous HTTP client |
| **DynamoDB** | ✅ | AWS SDK v2 DynamoDbClient | AWS NoSQL database |
| **SQS Producer** | ✅ | AWS SDK v2 SqsClient | AWS message queue producer |

## Configuration Examples

### application.yml

```yaml
server:
  port: 8080

spring:
  application:
    name: payment-service
    
  datasource:
    url: jdbc:postgresql://localhost:5432/payments
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
      
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect
        
  data:
    mongodb:
      uri: mongodb://localhost:27017/payments
      database: payments
      
    redis:
      host: localhost
      port: 6379
      timeout: 2000ms
      
  mvc:
    throw-exception-if-no-handler-found: true
```

## When to Use

- ✅ Traditional CRUD applications
- ✅ Simple request-response patterns
- ✅ Team familiar with Spring MVC
- ✅ Projects with blocking I/O requirements
- ✅ Integration with legacy systems
- ✅ Simpler debugging and troubleshooting
- ✅ Lower learning curve for new developers

## When NOT to Use

- ❌ High-concurrency applications (>10k concurrent requests)
- ❌ Streaming data requirements
- ❌ Real-time applications with WebSocket
- ❌ Microservices with many I/O operations
- ❌ Applications requiring backpressure

## Reactive vs Imperative

| Aspect | Reactive | Imperative |
|--------|----------|------------|
| **I/O Model** | Non-blocking | Blocking |
| **Return Types** | Mono/Flux | Direct values (T, List&lt;T&gt;) |
| **Concurrency** | High (event loop) | Medium (thread pool) |
| **Complexity** | Higher | Lower |
| **Learning Curve** | Steeper | Gentler |
| **Debugging** | More difficult | Easier |
| **Thread Model** | Few threads, event-driven | Thread-per-request |
| **Database** | R2DBC | JPA/JDBC |
| **HTTP Client** | WebClient | RestTemplate |
| **Best For** | High I/O, streaming | CRUD, traditional apps |

## Migration Guide

### From Reactive to Imperative

If you have a reactive project and want to migrate to imperative:

```java
// Reactive (Before)
@Component
public class ProcessPaymentUseCase {
    public Mono<Payment> execute(PaymentRequest request) {
        return Mono.just(request)
            .map(this::createPayment)
            .flatMap(repository::save)
            .flatMap(gateway::process);
    }
}

// Imperative (After)
@Component
public class ProcessPaymentUseCase {
    public Payment execute(PaymentRequest request) {
        Payment payment = createPayment(request);
        Payment saved = repository.save(payment);
        return gateway.process(saved);
    }
}
```

**Key Changes:**
1. Remove `Mono&lt;T&gt;` and `Flux&lt;T&gt;` return types
2. Replace `flatMap` with direct method calls
3. Use `List&lt;T&gt;` instead of `Flux&lt;T&gt;`
4. Use `Optional&lt;T&gt;` instead of `Mono&lt;T&gt;` for nullable values
5. Change database dependencies from R2DBC to JPA
6. Replace WebClient with RestTemplate
7. Update configuration from reactive to blocking

### Testing Differences

```java
// Reactive Test
@Test
void shouldProcessPayment() {
    PaymentRequest request = new PaymentRequest(...);
    
    StepVerifier.create(useCase.execute(request))
        .assertNext(payment -> {
            assertThat(payment.status()).isEqualTo(PaymentStatus.PROCESSED);
        })
        .verifyComplete();
}

// Imperative Test
@Test
void shouldProcessPayment() {
    PaymentRequest request = new PaymentRequest(...);
    
    Payment payment = useCase.execute(request);
    
    assertThat(payment.status()).isEqualTo(PaymentStatus.PROCESSED);
}
```

## Performance Considerations

### Thread Pool Configuration

```yaml
server:
  tomcat:
    threads:
      max: 200        # Maximum threads
      min-spare: 10   # Minimum idle threads
    max-connections: 10000
    accept-count: 100
```

### Connection Pool Configuration

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 10
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
```

## Common Pitfalls

### 1. Blocking in Controllers

```java
// ❌ BAD - Blocking operation in controller
@GetMapping("/users")
public List<User> getUsers() {
    Thread.sleep(5000); // Blocks thread!
    return userService.findAll();
}

// ✅ GOOD - Use async processing if needed
@GetMapping("/users")
public CompletableFuture<List<User>> getUsers() {
    return CompletableFuture.supplyAsync(() -> 
        userService.findAll()
    );
}
```

### 2. N+1 Query Problem

```java
// ❌ BAD - N+1 queries
@GetMapping("/orders")
public List<OrderResponse> getOrders() {
    List<Order> orders = orderRepository.findAll();
    return orders.stream()
        .map(order -> {
            Customer customer = customerRepository.findById(order.customerId()); // N queries!
            return new OrderResponse(order, customer);
        })
        .toList();
}

// ✅ GOOD - Use JOIN FETCH
@Query("SELECT o FROM Order o JOIN FETCH o.customer")
List<Order> findAllWithCustomer();
```

### 3. Transaction Management

```java
// ✅ GOOD - Proper transaction boundaries
@Service
public class PaymentService {
    
    @Transactional
    public Payment processPayment(PaymentRequest request) {
        Payment payment = createPayment(request);
        Payment saved = repository.save(payment);
        eventPublisher.publish(new PaymentCreatedEvent(saved));
        return saved;
    }
}
```

## Learn More

- [Spring Reactive](spring-reactive) - Compare with reactive paradigm
- [Migration Guide](../../migration-guide) - Detailed migration instructions
- [Hexagonal Architecture](../architectures/hexagonal) - Architecture patterns
- [Adapters](../../adapters/index) - Available adapters

## Next Steps

1. [Initialize your first imperative project](../../getting-started/quick-start)
2. [Generate entities and use cases](../../guides/generators/entities)
3. [Add adapters](../../getting-started/adding-adapters)
4. [Configure your application](../../reference/configuration)
