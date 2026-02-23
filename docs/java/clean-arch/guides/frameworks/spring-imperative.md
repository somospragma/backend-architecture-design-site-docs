# Spring Boot Imperative

Traditional Spring Boot with Spring MVC for synchronous, blocking applications.

## Overview

Spring MVC is the traditional web framework in Spring Boot, using blocking I/O.

## Features

- **Synchronous**: Traditional request-response model
- **JPA**: Standard database access with Hibernate
- **RestTemplate**: Synchronous HTTP client
- **Familiar**: Traditional Spring development

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
- `spring-boot-starter-data-redis`: Redis
- `spring-boot-starter-validation`: Bean validation

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
    
    public Payment execute(PaymentRequest request) {
        // Business logic here
        return new Payment(...);
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
    public PaymentResponse process(@RequestBody PaymentRequest request) {
        Payment payment = useCase.execute(request);
        return toResponse(payment);
    }
}
```

## When to Use

- ✅ Traditional CRUD applications
- ✅ Simple request-response patterns
- ✅ Team familiar with Spring MVC
- ✅ Projects with blocking I/O requirements

## Reactive vs Imperative

| Aspect | Reactive | Imperative |
|--------|----------|------------|
| I/O | Non-blocking | Blocking |
| Types | Mono/Flux | Direct values |
| Concurrency | High | Medium |
| Complexity | Higher | Lower |
| Learning Curve | Steeper | Gentler |

## Learn More

- [Spring Reactive](spring-reactive)
- [Hexagonal Architecture](../architectures/hexagonal)
