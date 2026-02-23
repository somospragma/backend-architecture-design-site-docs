# Spring Boot Reactive

Spring Boot with WebFlux for reactive, non-blocking applications.

## Overview

Spring WebFlux is Spring's reactive web framework, built on Project Reactor.

## Features

- **Non-blocking I/O**: Handle more requests with fewer threads
- **Backpressure**: Control data flow between producer and consumer
- **Reactive Streams**: Mono and Flux for async operations
- **R2DBC**: Reactive database access

## Initialize Project

```bash
./gradlew initCleanArch \
  --architecture=hexagonal-single \
  --paradigm=reactive \
  --framework=spring \
  --package=com.company.service
```

## Dependencies

The generated project includes:

- `spring-boot-starter-webflux`: Reactive web framework
- `spring-boot-starter-data-r2dbc`: Reactive database
- `spring-boot-starter-data-redis-reactive`: Reactive Redis
- `reactor-core`: Reactor library

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
    
    public Mono<Payment> execute(PaymentRequest request) {
        // Business logic here
        return Mono.just(new Payment(...));
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
    public Mono<PaymentResponse> process(@RequestBody PaymentRequest request) {
        return useCase.execute(request)
            .map(this::toResponse);
    }
}
```

## When to Use

- ✅ High-concurrency applications
- ✅ Streaming data
- ✅ Microservices with many I/O operations
- ✅ Real-time applications

## Learn More

- [Spring Imperative](spring-imperative)
- [Hexagonal Architecture](../architectures/hexagonal)
