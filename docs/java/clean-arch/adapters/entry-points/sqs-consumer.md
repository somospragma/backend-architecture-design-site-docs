# SQS Consumer Entry Point

Consumidor de mensajes de AWS SQS con soporte reactivo e imperativo.

## Overview

- **Reactive**: SqsAsyncClient con `Mono&lt;T&gt;`, `Flux&lt;T&gt;`
- **Imperative**: SqsClient con tipos síncronos

## Generar Adaptador

```bash
./gradlew generateInputAdapter \
  --name=OrderEvent \
  --useCase=ProcessOrderUseCase \
  --type=sqs-consumer \
  --packageName=com.pragma.order.infrastructure.entry-points.sqs
```

## Paradigma Reactivo

### Dependencias

```kotlin
dependencies {
    implementation("software.amazon.awssdk:sqs:2.20.0")
    implementation("io.awspring.cloud:spring-cloud-aws-starter-sqs:3.0.0")
}
```

### Configuration

```yaml
spring:
  cloud:
    aws:
      region:
        static: us-east-1
      sqs:
        endpoint: http://localhost:4566  # LocalStack
        
aws:
  sqs:
    queue-url: https://sqs.us-east-1.amazonaws.com/123456789/order-events
```

### Consumer Implementation

```java
@Component
public class OrderEventConsumer {
    
    private final ProcessOrderUseCase processOrderUseCase;
    
    @SqsListener("${aws.sqs.queue-url}")
    public Mono<Void> consume(String message) {
        return Mono.just(message)
            .map(this::parseMessage)
            .flatMap(processOrderUseCase::execute)
            .then();
    }
}
```

## Paradigma Imperativo

### Consumer Implementation

```java
@Component
public class OrderEventConsumer {
    
    private final ProcessOrderUseCase processOrderUseCase;
    
    @SqsListener("${aws.sqs.queue-url}")
    public void consume(String message) {
        OrderEvent event = parseMessage(message);
        processOrderUseCase.execute(event);
    }
}
```

## Learn More

- [AWS SDK for Java](https://aws.amazon.com/sdk-for-java/)
- [Spring Cloud AWS](https://spring.io/projects/spring-cloud-aws)
