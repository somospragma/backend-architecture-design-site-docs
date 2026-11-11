---
title: SQS consumer
description: The sqs-consumer adapter of generateInputAdapter, with Spring Cloud AWS SQS in both paradigms.
sidebar:
  order: 5
---

Reads messages from an Amazon SQS queue with Spring Cloud AWS `@SqsListener`. In reactive it processes each message with a `Mono`; in imperative, synchronously. Use it when another service notifies you of something asynchronously.

## How to generate it

```bash
./gradlew generateInputAdapter --name=OrderEvents --type=sqs-consumer --useCase=CreateOrder
```

## What it generates

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>SqsConsumer`, `config/<Name>SqsConsumerConfig` | `<Name>Consumer`, `config/<Name>SqsConsumerConfig` |
| Package | `infrastructure.entrypoints.<name>sqsconsumer` | `infrastructure.entrypoints.<name>sqsconsumer` |

- The consumer reads the queue from `aws.sqs.consumer.queue-name`. Your logic goes in `processMessage`.
- It doesn't receive the use case: inject it yourself and call it from `processMessage`.
- `<Name>SqsConsumerConfig` creates the `SqsAsyncClient`, the listener factory with the configured concurrency and poll timeout, and an `SqsTemplate`.

## Dependencies

| Reactive | Imperative |
|---|---|
| `spring-cloud-aws-starter-sqs`, AWS SDK v2 `sqs` | The same |

For tests it adds Testcontainers (`localstack` and `junit-jupiter`) and Awaitility.

## Configuration

With `--name=OrderEvents`:

```yaml
aws:
  sqs:
    consumer:
      region: us-east-1
      endpoint: null
      queue-name: orderevents-queue
      access-key: null
      secret-key: null
      max-concurrent-messages: 10
      poll-timeout: 10
spring:
  cloud:
    aws:
      sqs:
        enabled: true
logging:
  level:
    io.awspring.cloud.sqs: DEBUG
    software.amazon.awssdk.services.sqs: DEBUG
```

- `queue-name` is `<name>-queue`. Change it to your queue's name.
- For local development, point `endpoint` to LocalStack (for example, `http://localhost:4566`).
- The keys are only used if you set both. On AWS, leave them empty and use the application's role.

## Before production

The class comes with two listeners on the same queue: `receiveMessage`, with automatic acknowledgement, and `receiveMessageWithManualAck`, with manual acknowledgement. Keep only the one you'll use.

## Next

- [Entry points](../overview/).
- [How to generate entities, use cases and adapters](../../guides/generate-components/).
