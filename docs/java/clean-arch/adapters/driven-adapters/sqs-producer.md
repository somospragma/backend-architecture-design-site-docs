# SQS Producer Adapter

Productor de mensajes para AWS SQS con soporte reactivo e imperativo.

## Overview

- **Reactive**: SqsAsyncClient con `Mono&lt;T&gt;`
- **Imperative**: SqsClient con tipos síncronos

## Generar Adaptador

```bash
./gradlew generateOutputAdapter \
  --name=OrderEventPublisher \
  --entity=OrderEvent \
  --type=sqs-producer \
  --packageName=com.pragma.order.infrastructure.driven-adapters.sqs
```

## Paradigma Reactivo

### Dependencias

```kotlin
dependencies {
    implementation("software.amazon.awssdk:sqs:2.20.0")
}
```

### Configuration

```yaml
aws:
  sqs:
    queue-url: https://sqs.us-east-1.amazonaws.com/123456789/order-events
    region: us-east-1
```

### Adapter Implementation

```java
@Component
public class SqsOrderEventPublisher implements OrderEventPublisher {
    
    private final SqsAsyncClient sqsClient;
    private final String queueUrl;
    
    @Override
    public Mono<Void> publish(OrderEvent event) {
        SendMessageRequest request = SendMessageRequest.builder()
            .queueUrl(queueUrl)
            .messageBody(toJson(event))
            .build();
        
        return Mono.fromFuture(sqsClient.sendMessage(request))
            .then();
    }
}
```

## Paradigma Imperativo

### Adapter Implementation

```java
@Component
public class SqsOrderEventPublisher implements OrderEventPublisher {
    
    private final SqsClient sqsClient;
    private final String queueUrl;
    
    @Override
    public void publish(OrderEvent event) {
        SendMessageRequest request = SendMessageRequest.builder()
            .queueUrl(queueUrl)
            .messageBody(toJson(event))
            .build();
        
        sqsClient.sendMessage(request);
    }
}
```

## Testing

```java
@SpringBootTest
@Testcontainers
class SqsOrderEventPublisherTest {
    
    @Container
    static LocalStackContainer localstack = new LocalStackContainer(DockerImageName.parse("localstack/localstack:latest"))
        .withServices(LocalStackContainer.Service.SQS);
    
    @Test
    void shouldPublishEvent() {
        OrderEvent event = new OrderEvent("order-123", "CREATED");
        
        publisher.publish(event).block();
        
        // Verify message was sent
        ReceiveMessageRequest request = ReceiveMessageRequest.builder()
            .queueUrl(queueUrl)
            .build();
        
        List<Message> messages = sqsClient.receiveMessage(request).messages();
        assertThat(messages).hasSize(1);
    }
}
```

## Learn More

- [AWS SDK for Java](https://aws.amazon.com/sdk-for-java/)
- [LocalStack](https://localstack.cloud/)
